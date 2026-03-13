//post.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from '@shared/types/social/create-post.dto';
import { UpdatePostDto } from 'src/social/application/dtos/update-post.dto';
import { PostService } from 'src/social/application/services/post.service';
import { ClerkAuthGuard } from 'src/shared/guards/clerk-auth-guard';
import { AuthenticatedUser } from '@shared/types/user-management/user.types';
import { Request } from 'express';

// Type augmentation for Express Request
// declare module 'express-serve-static-core' {
//   interface Request {
//     user?: AuthenticatedUser;
//   }
// } //
@Controller('social/posts')
export class PostController {
  private readonly logger = new Logger(PostController.name);
  constructor(private readonly postService: PostService) {}

  @UseGuards(ClerkAuthGuard)
  @Post()
  async create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    if (!req.user?._id) {
      throw new UnauthorizedException('User not authenticated');
    }
    const dto: CreatePostDto = {
      ...createPostDto,
      user: req.user._id,
    };
    this.logger.log(`POST /posts request`, {
      userId: dto.user,
      contentLength: dto.content?.length || 0,
    });
    return await this.postService.create(dto);
  }

  @UseGuards(ClerkAuthGuard)
  @Get()
  async getAllPosts(@Req() req: Request) {
    if (!req.user?._id) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user._id;
    this.logger.log(`GET /posts request`, { userId });
    return await this.postService.getAllWithUserInfo(userId);
  }

  //Getting posts by user ID NOT IMPLEMENTED
  @Get('user/:userId')
  async getPostsByUserId(@Param('userId') userId: string) {
    this.logger.warn(`GET /posts/user/:userId not implemented`, { userId });
    // return await this.postService.getByUserId(userId);
  }

  //Getting posts by post ID NOT IMPLEMENTED
  @Get(':id')
  async getPostById(@Param('id') id: string) {
    this.logger.warn(`GET /posts/:id not implemented`, { postId: id });
    // return await this.postService.getById(id);
  }

  @UseGuards(ClerkAuthGuard)
  @Delete(':postId')
  async delete(@Param('postId') postId: string, @Req() req: Request) {
    if (!req.user?._id) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user._id;
    this.logger.log(`DELETE /posts/:postId request`, {
      userId,
      postId,
    });
    await this.postService.delete(postId, userId);
    return { success: true, message: 'Post deleted successfully' };
  }

  @UseGuards(ClerkAuthGuard)
  @Patch(':postId')
  async update(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: Request,
  ) {
    if (!req.user?._id) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user._id;
    this.logger.log(`PATCH /posts/:postId request`, {
      userId,
      postId,
      hasContent: !!updatePostDto.content,
      mediaToAdd: updatePostDto.mediaFilesToAdd?.length || 0,
      mediaToRemove: updatePostDto.mediaFilesToRemove?.length || 0,
    });
    return await this.postService.update(postId, updatePostDto, userId);
  }
}

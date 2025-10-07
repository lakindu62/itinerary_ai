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
  UseGuards,
  Req, // for accessing request object
  UnauthorizedException, // for authentication errors
} from '@nestjs/common';
import { Request } from 'express'; // for typing request object
import { CreatePostDto } from '@shared/types/social/create-post.dto';
import { ClerkAuthGuard } from 'src/shared/guards/clerk-auth-guard';
import { UpdatePostDto } from 'src/social/application/dtos/update-post.dto';
import { PostService } from 'src/social/application/services/post.service';

@Controller('social/posts')
export class PostController {
  private readonly logger = new Logger(PostController.name);
  constructor(private readonly postService: PostService) {}

  @UseGuards(ClerkAuthGuard)
  @Post()
  async create(@Req() req: Request, @Body() createPostDto: CreatePostDto) {
    if (!req.user?._id) {
      throw new UnauthorizedException('User not authenticated');
    }

    this.logger.log(`POST /posts request`, {
      userId: req.user._id, //  Use req.user._id instead of createPostDto.user
      contentLength: createPostDto.content?.length || 0,
    });

    // CHANGE: Pass user ID from request to service
    return await this.postService.create({
      ...createPostDto,
      user: req.user._id, // Override user field with authenticated user ID
    });
  }

  @Get()
  async getAllPosts(@Req() req: Request) {
    // CHANGE: Added @Req() req parameter, removed @Query('userId')
    // CHANGE: Get user ID from authenticated request if available (optional authentication)
    const userId = req.user?._id; // CHANGE: Use authenticated user's ID for like status

    this.logger.log(`GET /posts request`, { userId: userId || 'anonymous' });

    // Use new service method that returns PostWithLikeStatus entities
    return await this.postService.getAllWithLikeStatus(userId);
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

  @UseGuards(ClerkAuthGuard) // CHANGE: Added authentication guard
  @Delete(':postId')
  async delete(
    @Req() req: Request, // CHANGE: Added @Req() req parameter
    @Param('postId') postId: string,
    // CHANGE: Removed @Body() body parameter - no longer needed
  ) {
    // CHANGE: Get user ID from authenticated request instead of body
    if (!req.user?._id) {
      throw new UnauthorizedException('User not authenticated');
    }

    const userId = req.user._id; // CHANGE: Use authenticated user's ID
    this.logger.log(`DELETE /posts/:postId request`, {
      userId,
      postId,
    });
    await this.postService.delete(postId, userId);
    return { success: true, message: 'Post deleted successfully' };
  }

  @UseGuards(ClerkAuthGuard) // CHANGE: Added authentication guard
  @Patch(':postId')
  async update(
    @Req() req: Request, // CHANGE: Added @Req() req parameter
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto, // CHANGE: Removed & { user: string } from type
  ) {
    // CHANGE: Get user ID from authenticated request instead of DTO
    if (!req.user?._id) {
      throw new UnauthorizedException('User not authenticated');
    }

    const userId = req.user._id; // CHANGE: Use authenticated user's ID

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

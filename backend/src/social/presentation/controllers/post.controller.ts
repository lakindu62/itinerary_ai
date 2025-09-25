//post.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { CreatePostDto } from '@shared/types/social/create-post.dto';
import { PostService } from 'src/social/application/services/post.service';

@Controller('posts')
export class PostController {
  private readonly logger = new Logger(PostController.name);
  constructor(private readonly postService: PostService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    this.logger.log(`POST /posts request`, {
      userId: createPostDto.user,
      contentLength: createPostDto.content?.length || 0,
    });
    return await this.postService.create(createPostDto);
  }

  @Get()
  async getAllPosts() {
    this.logger.log(`GET /posts request`);
    return await this.postService.getAll();
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

  @Delete(':postId')
  async delete(
    @Param('postId') postId: string,
    @Body() body: { user?: string },
  ) {
    const userId = body?.user as string;
    this.logger.log(`DELETE /posts/:postId request`, {
      userId,
      postId,
    });
    await this.postService.delete(postId, userId);
    return { success: true, message: 'Post deleted successfully' };
  }
}

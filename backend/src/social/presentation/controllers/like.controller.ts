//like.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { LikePostDto } from '@shared/types/social/like-post.dto';
import { LikeService } from 'src/social/application/services/like.service';

@Controller('posts/:postId/likes')
export class LikeController {
  private readonly logger = new Logger(LikeController.name);

  constructor(private readonly likeService: LikeService) {}

  @Post()
  async likePost(
    @Param('postId') postId: string,
    @Body() body: { user?: string },
  ) {
    const likePostDto: LikePostDto = {
      user: body?.user as string,
      post: postId,
    };

    this.logger.log(`POST /posts/:postId/likes request`, {
      userId: likePostDto.user,
      postId: likePostDto.post,
    });
    return await this.likeService.likePost(likePostDto);
  }

  @Delete()
  async unlikePost(
    @Param('postId') postId: string,
    @Body() body: { user?: string },
  ) {
    const likePostDto: LikePostDto = {
      user: body?.user as string,
      post: postId,
    };

    this.logger.log(`DELETE /posts/:postId/likes request`, {
      userId: likePostDto.user,
      postId: likePostDto.post,
    });
    await this.likeService.unlikePost(likePostDto);
    return { success: true, message: 'Post unliked successfully' };
  }
}

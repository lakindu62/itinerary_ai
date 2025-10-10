//like.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LikePostDto } from '@shared/types/social/like-post.dto';
import { ClerkAuthGuard } from 'src/shared/guards/clerk-auth-guard';
import { AuthenticatedUser } from '@shared/types/user-management/user.types';

import { LikeService } from 'src/social/application/services/like.service';

import { Request } from 'express';

// // Type augmentation for Express Request
// declare module 'express-serve-static-core' {
//   interface Request {
//     user?: AuthenticatedUser;
//   }
// }

@Controller('social/posts/:postId/likes')
export class LikeController {
  private readonly logger = new Logger(LikeController.name);

  constructor(private readonly likeService: LikeService) {}

  @UseGuards(ClerkAuthGuard)
  @Post()
  async likePost(@Param('postId') postId: string, @Req() req: Request) {
    if (!req.user?._id) {
      throw new UnauthorizedException('User not authenticated');
    }

    const likePostDto: LikePostDto = {
      user: req.user._id,
      post: postId,
    };

    this.logger.log(`POST /posts/:postId/likes request`, {
      userId: likePostDto.user,
      postId: likePostDto.post,
    });
    return await this.likeService.likePost(likePostDto);
  }

  @UseGuards(ClerkAuthGuard)
  @Delete()
  async unlikePost(@Param('postId') postId: string, @Req() req: Request) {
    if (!req.user?._id) {
      throw new UnauthorizedException('User not authenticated');
    }

    const likePostDto: LikePostDto = {
      user: req.user._id,
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

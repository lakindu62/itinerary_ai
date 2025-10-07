//like.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  UseGuards, // CHANGE: Added for authentication
  Req, // CHANGE: Added for accessing request object
  UnauthorizedException, // CHANGE: Added for authentication errors
} from '@nestjs/common';
import { Request } from 'express'; // CHANGE: Added for typing request object
import { LikePostDto } from '@shared/types/social/like-post.dto';
import { ClerkAuthGuard } from 'src/shared/guards/clerk-auth-guard'; // CHANGE: Added auth guard
import { LikeService } from 'src/social/application/services/like.service';

@Controller('social/posts/:postId/likes')
export class LikeController {
  private readonly logger = new Logger(LikeController.name);

  constructor(private readonly likeService: LikeService) {}

  @UseGuards(ClerkAuthGuard) // CHANGE: Added authentication guard
  @Post()
  async likePost(
    @Req() req: Request, // CHANGE: Added @Req() req parameter
    @Param('postId') postId: string,
    // CHANGE: Removed @Body() body parameter - no longer needed
  ) {
    // CHANGE: Get user ID from authenticated request instead of body
    if (!req.user?._id) {
      throw new UnauthorizedException('User not authenticated');
    }

    const likePostDto: LikePostDto = {
      user: req.user._id, // CHANGE: Use authenticated user's ID
      post: postId,
    };

    this.logger.log(`POST /posts/:postId/likes request`, {
      userId: likePostDto.user,
      postId: likePostDto.post,
    });
    return await this.likeService.likePost(likePostDto);
  }

  @UseGuards(ClerkAuthGuard) // CHANGE: Added authentication guard
  @Delete()
  async unlikePost(
    @Req() req: Request, // CHANGE: Added @Req() req parameter
    @Param('postId') postId: string,
    // CHANGE: Removed @Body() body parameter - no longer needed
  ) {
    // CHANGE: Get user ID from authenticated request instead of body
    if (!req.user?._id) {
      throw new UnauthorizedException('User not authenticated');
    }

    const likePostDto: LikePostDto = {
      user: req.user._id, // CHANGE: Use authenticated user's ID
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

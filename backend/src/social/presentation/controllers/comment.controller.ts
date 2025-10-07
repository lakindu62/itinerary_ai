//comment.controller.ts

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
import { CreateCommentDto } from '@shared/types/social/create-comment.dto';
import { ClerkAuthGuard } from 'src/shared/guards/clerk-auth-guard'; // CHANGE: Added auth guard
import { CommentService } from 'src/social/application/services/comment.service';

@Controller('social/posts/:postId/comments')
export class CommentController {
  private readonly logger = new Logger(CommentController.name);

  constructor(private readonly commentService: CommentService) {}

  @Get()
  async getCommentsForPost(@Param('postId') postId: string) {
    this.logger.log(
      `[CommentController.getCommentsForPost] GET /posts/:postId/comments request`,
      { postId },
    );
    return await this.commentService.getCommentsForPost(postId);
  }

  @UseGuards(ClerkAuthGuard) // CHANGE: Added authentication guard
  @Post()
  async addComment(
    @Req() req: Request, // CHANGE: Added @Req() req parameter
    @Param('postId') postId: string,
    @Body() body: { content?: string }, // CHANGE: Removed user from body type
  ) {
    // CHANGE: Get user ID from authenticated request instead of body
    if (!req.user?._id) {
      throw new UnauthorizedException('User not authenticated');
    }

    const dto: CreateCommentDto = {
      user: req.user._id, // CHANGE: Use authenticated user's ID
      post: postId,
      content: body?.content as string,
    };

    this.logger.log(`POST /posts/:postId/comments request`, {
      userId: dto.user,
      postId: dto.post,
    });
    return await this.commentService.addComment(dto);
  }

  @UseGuards(ClerkAuthGuard) // CHANGE: Added authentication guard
  @Delete(':commentId')
  async deleteComment(
    @Req() req: Request, // CHANGE: Added @Req() req parameter
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    // CHANGE: Removed @Body() body parameter - no longer needed
  ) {
    // CHANGE: Get user ID from authenticated request instead of body
    if (!req.user?._id) {
      throw new UnauthorizedException('User not authenticated');
    }

    const userId = req.user._id; // CHANGE: Use authenticated user's ID
    this.logger.log(`DELETE /posts/:postId/comments/:commentId request`, {
      userId,
      postId,
      commentId,
    });
    await this.commentService.deleteComment(commentId, userId, postId);
    return { success: true, message: 'Comment deleted successfully' };
  }
}

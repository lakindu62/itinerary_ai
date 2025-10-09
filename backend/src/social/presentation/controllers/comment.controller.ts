//comment.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateCommentDto } from '@shared/types/social/create-comment.dto';
import { ClerkAuthGuard } from 'src/shared/guards/clerk-auth-guard';

import { CommentService } from 'src/social/application/services/comment.service';

import { Request } from 'express';

@UseGuards(ClerkAuthGuard) //Note that the ClerkAuthGuard is applied to all endpoints in the file. Change if needed - Amzal
@Controller('social/posts/:postId/comments')
export class CommentController {
  private readonly logger = new Logger(CommentController.name);

  constructor(private readonly commentService: CommentService) {}

  @Get()
  async getCommentsForPost(
    @Param('postId') postId: string,
    @Req() req: Request,
  ) {
    if (!req.user?._id) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user._id;
    this.logger.log(
      `[CommentController.getCommentsForPost] GET /posts/:postId/comments request`,
      { postId, userId },
    );
    return await this.commentService.getCommentsWithUserInfo(postId, userId);
  }

  @Post()
  async addComment(
    @Param('postId') postId: string,
    @Body() body: { content?: string },
    @Req() req: Request,
  ) {
    if (!req.user?._id) {
      throw new UnauthorizedException('User not authenticated');
    }

    const dto: CreateCommentDto = {
      user: req.user._id,
      post: postId,
      content: body?.content as string,
    };

    this.logger.log(`POST /posts/:postId/comments request`, {
      userId: dto.user,
      postId: dto.post,
    });
    return await this.commentService.addComment(dto);
  }

  @Delete(':commentId')
  async deleteComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Req() req: Request,
  ) {
    if (!req.user?._id) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user._id;
    this.logger.log(`DELETE /posts/:postId/comments/:commentId request`, {
      userId,
      postId,
      commentId,
    });
    await this.commentService.deleteComment(commentId, userId, postId);
    return { success: true, message: 'Comment deleted successfully' };
  }

  @Patch(':commentId')
  async updateComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Body() body: { content: string },
    @Req() req: Request,
  ) {
    if (!req.user?._id) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user._id;
    this.logger.log(`PATCH /posts/:postId/comments/:commentId request`, {
      userId,
      postId,
      commentId,
    });

    const updated = await this.commentService.updateComment(
      commentId,
      userId,
      body.content,
    );

    return updated;
  }
}

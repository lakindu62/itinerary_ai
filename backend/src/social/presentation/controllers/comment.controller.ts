//comment.controller.ts

import { Body, Controller, Delete, Logger, Param, Post } from '@nestjs/common';
import { CreateCommentDto } from '@shared/types/social/create-comment.dto';

import { CommentService } from 'src/social/application/services/comment.service';

@Controller('posts/:postId/comments')
export class CommentController {
  private readonly logger = new Logger(CommentController.name);

  constructor(private readonly commentService: CommentService) {}

  @Post()
  async addComment(
    @Param('postId') postId: string,
    @Body() body: { user?: string; content?: string },
  ) {
    const dto: CreateCommentDto = {
      user: body?.user as string,
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
    @Body() body: { user?: string },
  ) {
    const userId = body?.user as string;
    this.logger.log(`DELETE /posts/:postId/comments/:commentId request`, {
      userId,
      postId,
      commentId,
    });
    await this.commentService.deleteComment(commentId, userId, postId);
    return { success: true, message: 'Comment deleted successfully' };
  }
}

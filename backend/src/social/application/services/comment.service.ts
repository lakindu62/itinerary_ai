import { Injectable, Logger } from '@nestjs/common';
import { CreateCommentDto } from '@shared/types/social/create-comment.dto';
import { Comment } from 'src/social/domain/entities/comment.entity';
import { CommentRepository } from 'src/social/domain/repositories/comment.repository';
import { PostRepository } from 'src/social/domain/repositories/post.repository';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);

  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository,
  ) {}

  /**
   * Creates a comment and increments the post's comment count within a transaction.
   */
  async addComment(dto: CreateCommentDto): Promise<Comment> {
    this.logger.log(
      `Attempting to add comment to post ${dto.post} by user ${dto.user}`,
    );

    if (!dto.user || !dto.post || !dto.content) {
      this.logger.error(
        'Invalid CreateCommentDto: missing user, post or content',
        { dto },
      );
      throw new Error('User ID, Post ID and content are required');
    }

    const comment = new Comment('null', dto.user, dto.post, dto.content);

    try {
      const result = await this.commentRepository.createWithTransaction(
        comment,
        async (session) => {
          const saved = await this.commentRepository.create(comment, session);
          await this.postRepository.addComment(dto.post, saved.id, session);
          return saved;
        },
      );

      this.logger.log(
        `Successfully added comment ${result.id} to post ${dto.post} by user ${dto.user}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `[CommentService.addComment] Failed to add comment - PostID: ${dto.post}, UserID: ${dto.user}`,
        { error: error.message, code: error.code },
      );
      throw error;
    }
  }

  /**
   * Deletes a comment and decrements the post's comment count within a transaction.
   */
  async deleteComment(
    commentId: string,
    userId: string,
    postId: string,
  ): Promise<void> {
    this.logger.log(
      `Attempting to delete comment ${commentId} from post ${postId} by user ${userId}`,
    );

    if (!commentId || !userId || !postId) {
      this.logger.error('Invalid deleteComment inputs: missing ids', {
        commentId,
        userId,
        postId,
      });
      throw new Error('Comment ID, User ID and Post ID are required');
    }

    try {
      await this.commentRepository.deleteWithTransaction(
        { id: commentId, user: userId, post: postId },
        async (session) => {
          await this.commentRepository.delete(
            { id: commentId, user: userId, post: postId },
            session,
          );
          await this.postRepository.removeComment(postId, commentId, session);
        },
      );

      this.logger.log(
        `Successfully deleted comment ${commentId} from post ${postId} by user ${userId}`,
      );
    } catch (error) {
      this.logger.error(
        `[CommentService.deleteComment] Failed to delete comment - CommentID: ${commentId}, PostID: ${postId}, UserID: ${userId}`,
        { error: error.message, code: error.code },
      );
      throw error;
    }
  }
}

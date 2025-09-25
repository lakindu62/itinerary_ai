//like.repository.ts

import { Comment } from '../entities/comment.entity';
import { ClientSession } from 'mongoose';

/**
 * Abstract repository interface for managing Comment entities.
 * Provides methods for CRUD operations and transaction management.
 */
export abstract class CommentRepository {
  /**
   * Creates a new comment record in the database.
   */
  abstract create(comment: Comment, session?: ClientSession): Promise<Comment>;

  /**
   * Deletes an existing comment by its id, user and post for safety.
   */
  abstract delete(
    comment: Pick<Comment, 'id' | 'user' | 'post'>,
    session?: ClientSession,
  ): Promise<void>;

  /**
   * Executes a create operation within a database transaction.
   */
  abstract createWithTransaction<T>(
    comment: Comment,
    operation: (session: ClientSession) => Promise<T>,
  ): Promise<T>;

  /**
   * Executes a delete operation within a database transaction.
   */
  abstract deleteWithTransaction<T>(
    comment: Pick<Comment, 'id' | 'user' | 'post'>,
    operation: (session: ClientSession) => Promise<T>,
  ): Promise<T>;

  /**
   * Deletes all comments associated with a given post.
   */
  abstract deleteManyByPost(
    postId: string,
    session?: ClientSession,
  ): Promise<void>;
}

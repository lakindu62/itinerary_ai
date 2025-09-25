//like.repository.ts

import { Like } from '../entities/like.entity';

/**
 * Abstract repository interface for managing Like entities.
 * Provides methods for CRUD operations and transaction management.
 */
export abstract class LikeRepository {
  /**
   * Creates a new like record in the database.
   * @param like - The like entity to create
   * @param session - Optional database session for transaction support
   * @returns Promise resolving to the created like entity
   */
  abstract likePost(like: Like, session?: any): Promise<Like>;

  /**
   * Removes a like record from the database.
   * @param like - The like entity to remove
   * @param session - Optional database session for transaction support
   * @returns Promise resolving when the operation completes
   */
  abstract unlikePost(like: Like, session?: any): Promise<void>;

  /**
   * Finds a like record by user ID and post ID.
   * @param userId - The ID of the user who liked the post
   * @param postId - The ID of the post that was liked
   * @param session - Optional database session for transaction support
   * @returns Promise resolving to the like entity if found, null otherwise
   */
  abstract findByUserAndPost(
    userId: string,
    postId: string,
    session?: any,
  ): Promise<Like | null>;

  /**
   * Deletes all likes associated with a given post.
   */
  abstract deleteManyByPost(postId: string, session?: any): Promise<void>;

  /**
   * Executes a like operation within a database transaction.
   * @template T - The return type of the operation
   * @param like - The like entity involved in the transaction
   * @param operation - The callback function to execute within the transaction
   * @returns Promise resolving to the result of the operation
   */
  abstract likePostWithTransaction<T>(
    like: Like,
    operation: (session: any) => Promise<T>,
  ): Promise<T>;

  /**
   * Executes an unlike operation within a database transaction.
   * @template T - The return type of the operation
   * @param like - The like entity involved in the transaction
   * @param operation - The callback function to execute within the transaction
   * @returns Promise resolving to the result of the operation
   */
  abstract unlikePostWithTransaction<T>(
    like: Like,
    operation: (session: any) => Promise<T>,
  ): Promise<T>;
}

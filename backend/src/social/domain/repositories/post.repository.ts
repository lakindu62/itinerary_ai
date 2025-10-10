import { ClientSession } from 'mongoose';
import { Post, PostWithLikeStatus } from '../entities/post.entity';

import type { PostWithUserInfo } from '../entities/post.entity';

export abstract class PostRepository {
  /**
   * Creates a new post record in the MongoDB collection.
   *
   * @param post - The post entity to create
   * @returns Promise resolving to the created post entity
   * @throws Error if the save operation fails
   */
  abstract create(post: Post): Promise<Post>;

  /**
   * Retrieves all posts from the MongoDB collection, sorted by creation date.
   *
   * @returns Promise resolving to an array of post entities
   * @throws Error if the query operation fails
   */
  abstract getAll(): Promise<Post[]>;

  /**
   * Finds a single post by its ID.
   */
  abstract findById(
    postId: string,
    session?: ClientSession,
  ): Promise<Post | null>;

  /**
   * Retrieves all posts with like status for a specific user.
   * @param userId - Optional user ID to check like status
   * @returns Promise resolving to an array of PostWithLikeStatus entities
   */
  abstract getAllWithLikeStatus(userId?: string): Promise<PostWithLikeStatus[]>;

  /**
   * Retrieves all posts with user info, like status, and ownership for a specific user.
   * @param userId - The current user's MongoDB ID
   * @returns Promise resolving to an array of PostWithUserInfo entities
   */
  abstract getAllWithUserInfo(userId: string): Promise<PostWithUserInfo[]>;

  /**
   * Adds a like to a post by incrementing the like count and adding the like ID to the likes array.
   *
   * @param postId - The ID of the post to add the like to
   * @param likeId - The ID of the like to add
   * @param session - Optional MongoDB session for transaction support
   * @returns Promise resolving when the operation completes
   * @throws Error if the update operation fails
   */
  abstract addLike(
    postId: string,
    likeId: string,
    session?: ClientSession,
  ): Promise<void>;

  /**
   * Removes a like from a post by decrementing the like count and removing the like ID from the likes array.
   *
   * @param postId - The ID of the post to remove the like from
   * @param likeId - The ID of the like to remove
   * @param session - Optional MongoDB session for transaction support
   * @returns Promise resolving when the operation completes
   * @throws Error if the update operation fails
   */
  abstract removeLike(
    postId: string,
    likeId: string,
    session?: ClientSession,
  ): Promise<void>;

  /**
   * Increments the comment count for a post when a new comment is added.
   *
   * @param postId - The ID of the post to add the comment to
   * @param commentId - The ID of the new comment
   * @param session - Optional MongoDB session for transaction support
   */
  abstract addComment(
    postId: string,
    commentId: string,
    session?: ClientSession,
  ): Promise<void>;

  /**
   * Decrements the comment count for a post when a comment is removed.
   *
   * @param postId - The ID of the post to remove the comment from
   * @param commentId - The ID of the comment being removed
   * @param session - Optional MongoDB session for transaction support
   */
  abstract removeComment(
    postId: string,
    commentId: string,
    session?: ClientSession,
  ): Promise<void>;

  /**
   * Deletes a post by its ID.
   * @param postId - The ID of the post to delete
   * @param session - Optional MongoDB session for transaction support
   * @returns Promise resolving to the deleted post entity
   * @throws Error if the post is not found or deletion fails
   */
  abstract delete(postId: string, session?: ClientSession): Promise<void>;

  /**
   * Updates an existing post with partial data.
   * Supports updating content, media files, and other post properties.
   * @param postId - The ID of the post to update
   * @param updateData - Partial post data containing fields to update
   * @param session - Optional MongoDB session for transaction support
   * @returns Promise resolving to the updated post entity
   * @throws Error if the post is not found or update fails
   */
  abstract update(
    postId: string,
    updateData: Partial<Post>,
    session?: ClientSession,
  ): Promise<Post>;
}

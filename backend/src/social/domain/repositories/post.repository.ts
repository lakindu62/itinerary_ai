import { ClientSession } from 'mongoose';
import { Post } from '../entities/post.entity';

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
   */
  abstract delete(postId: string, session?: ClientSession): Promise<void>;
}

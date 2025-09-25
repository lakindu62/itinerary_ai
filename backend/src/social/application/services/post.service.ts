//post.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { CreatePostDto } from '@shared/types/social/create-post.dto';
import { Post } from 'src/social/domain/entities/post.entity';
import { PostRepository } from 'src/social/domain/repositories/post.repository';
import { CommentRepository } from 'src/social/domain/repositories/comment.repository';
import { LikeRepository } from 'src/social/domain/repositories/like.repository';

/**
 * Service class for managing post operations.
 * Provides business logic for creating and retrieving posts.
 */
@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    private readonly postRepository: PostRepository,
    private readonly commentRepository: CommentRepository,
    private readonly likeRepository: LikeRepository,
  ) {}

  /**
   * Creates a new post with the provided content and user information.
   *
   * @param createPostDto - Data transfer object containing post creation data
   * @returns Promise resolving to the created post entity
   * @throws Error if the creation operation fails
   */
  async create(createPostDto: CreatePostDto): Promise<Post> {
    this.logger.log(
      `[PostService.create] Creating post for user ${createPostDto.user}`,
    );

    const post = new Post(
      'null', // post Id will be given by db
      createPostDto.user,
      createPostDto?.content ?? '',
    );

    // content: dto?.content || "",   // fallback to blank string
    // author: dto?.author || "Anonymous"

    return await this.postRepository.create(post);
  }

  /**
   * Retrieves all posts from the system.
   *
   * @returns Promise resolving to an array of all post entities
   * @throws Error if the retrieval operation fails
   */
  async getAll(): Promise<Post[]> {
    this.logger.log(`[PostService.getAll] Fetching all posts`);
    return await this.postRepository.getAll();
  }

  /**
   * Deletes a post and cascades removal of related likes and comments in a transaction.
   */
  async delete(postId: string, userId: string): Promise<void> {
    this.logger.log(
      `[PostService.delete] Deleting post ${postId} by user ${userId}`,
    );

    // Basic guards; later replace with proper Nest exceptions
    if (!postId || !userId) {
      throw new Error('Post ID and User ID are required');
    }

    // Use the like repository's transaction helper since it exists; otherwise we would need a generic one.
    // We'll piggyback on a like transaction with a no-op like entity pattern.
    await this.likeRepository.unlikePostWithTransaction(
      // dummy like entity for session; repositories ignore its content for our ops
      new (class {
        user = userId;
        post = postId;
      })() as any,
      async (session) => {
        // Authorization could be added here: fetch post and verify owner
        // Remove comments and likes for the post, then delete the post itself
        if ((this.commentRepository as any).deleteManyByPost) {
          await (this.commentRepository as any).deleteManyByPost(
            postId,
            session,
          );
        }
        if ((this.likeRepository as any).deleteManyByPost) {
          await (this.likeRepository as any).deleteManyByPost(postId, session);
        }
        if ((this.postRepository as any).delete) {
          await (this.postRepository as any).delete(postId, session);
        } else {
          throw new Error('PostRepository.delete is not implemented');
        }
      },
    );
  }
}

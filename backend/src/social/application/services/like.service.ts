//like.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { LikePostDto } from '@shared/types/social/like-post.dto';
import { Like } from 'src/social/domain/entities/like.entity';
import { LikeRepository } from 'src/social/domain/repositories/like.repository';
import { PostRepository } from 'src/social/domain/repositories/post.repository';

/**
 * Service class for managing like operations on posts.
 * Coordinates between Like and Post repositories to maintain data consistency.
 */
@Injectable()
export class LikeService {
  private readonly logger = new Logger(LikeService.name);

  constructor(
    private readonly likeRepository: LikeRepository,

    private readonly postRepository: PostRepository,
  ) {}

  /**
   * Creates a like on a post for the specified user.
   * Uses database transactions to ensure both the like record and post like count are updated atomically.
   *
   * @param likePostDto - Data transfer object containing user ID and post ID and other relevavnt details
   * @returns Promise resolving to the created like entity
   * @throws Error if the user has already liked the post or if the operation fails
   */
  async likePost(likePostDto: LikePostDto): Promise<Like> {
    this.logger
      .log(`Attempting to like post ${likePostDto.post} by user ${likePostDto.user}
                     Currently in like.service.ts`);

    if (!likePostDto.user || !likePostDto.post) {
      this.logger.error('Invalid likePostDto: missing user or post ID', {
        likePostDto,
      });
      throw new Error('User ID and Post ID are required');
    }

    const like = new Like('null', likePostDto.user, likePostDto.post);

    try {
      this.logger.debug('Starting like post transaction', {
        userId: likePostDto.user,
        postId: likePostDto.post,
      });
      // Use new transaction method and coordinate both operations
      const result = await this.likeRepository.likePostWithTransaction(
        like,
        async (session) => {
          // These callbacks get executed within the transaction
          this.logger.debug('Executing transaction operations');

          // Create the like record
          const savedLike = await this.likeRepository.likePost(like, session);

          //update post like count
          await this.postRepository.addLike(
            likePostDto.post,
            savedLike.id,
            session,
          );
          return savedLike;
        },
      );

      this.logger.log(
        `Successfully liked post ${likePostDto.post} by user ${likePostDto.user}. Created like ID  ${result.id}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `[LikeService.likePost] Failed to like post - PostID: ${likePostDto.post}, UserID: ${likePostDto.user}`,
        {
          error: error.message,
          code: error.code,
        },
      );

      // Handle the duplicate key error specifically
      if (error.code === 11000) {
        throw new Error(
          `User ${likePostDto.user} has already liked post ${likePostDto.post}`,
        );
      }

      throw error;
    }
  }

  /**
   * Removes a like from a post for the specified user.
   * Uses database transactions to ensure both the like record removal and post like count update are atomic.
   *
   * @param likePostDto - Data transfer object containing user ID and post ID
   * @returns Promise resolving when the operation completes
   * @throws Error if the operation fails
   */
  async unlikePost(likePostDto: LikePostDto): Promise<void> {
    this.logger
      .log(`Attempting to un-like post ${likePostDto.post} by user ${likePostDto.user}
                     Currently in like.service.ts`);

    if (!likePostDto.user || !likePostDto.post) {
      this.logger.error('Invalid likePostDto: missing user or post ID', {
        likePostDto,
      });
      throw new Error('User ID and Post ID are required');
    }

    const like = new Like('null', likePostDto.user, likePostDto.post);

    try {
      this.logger.debug('Starting unlike post transaction', {
        userId: likePostDto.user,
        postId: likePostDto.post,
      });

      //Use transaction method and coordinate both operations
      await this.likeRepository.unlikePostWithTransaction(
        like,
        async (session) => {
          this.logger.debug('Executing unlike transaction operations');

          //Check if like exists
          const existingLike = await this.likeRepository.findByUserAndPost(
            likePostDto.user,
            likePostDto.post,
            session,
          );

          if (existingLike) {
            this.logger.debug('Like found, proceeding with removal');

            // Remove the like record
            await this.likeRepository.unlikePost(like, session);
            // Update post like count
            await this.postRepository.removeLike(
              likePostDto.post,
              existingLike.id,
              session,
            );
          } else {
            this.logger.warn(
              `No existing like found for user ${likePostDto.user} on post ${likePostDto.post}`,
            );
          }
        },
      );

      this.logger.log(
        `Successfully un-liked post ${likePostDto.post} by user ${likePostDto.user}`,
      );
    } catch (error) {
      this.logger.error(
        `[LikeService.unlikePost] Failed to unlike post - PostID: ${likePostDto.post}, UserID: ${likePostDto.user}`,
        {
          error: error.message,
          code: error.code,
        },
      );
      throw error;
    }
  }
}

//post.service.ts

import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from '@shared/types/social/create-post.dto';
import {
  Post,
  PostWithLikeStatus,
  PostWithUserInfo,
} from 'src/social/domain/entities/post.entity';
import { PostRepository } from 'src/social/domain/repositories/post.repository';
import { CommentRepository } from 'src/social/domain/repositories/comment.repository';
import { LikeRepository } from 'src/social/domain/repositories/like.repository';
import { UserRepository } from 'src/user-management/domain/repositories/user.repository';
import { User } from 'src/user-management/domain/user/user.entity';
import { StorageApplicationService } from 'src/shared/kernel/storage/application/services/storage.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { UpdatePostDto } from '../dtos/update-post.dto';

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
    private readonly userRepository: UserRepository,
    private readonly storageService: StorageApplicationService,
    @InjectConnection() private readonly connection: Connection,
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
      `[PostService.create] Creating post for user ${createPostDto.user}${createPostDto.isArchived ? ' (archived)' : ''}`,
    );

    const post = new Post(
      'null', // post Id will be given by db
      createPostDto.user,
      createPostDto?.content ?? '',
      undefined, // likeCount
      undefined, // commentCount
      undefined, // createdAt
      undefined, // updatedAt
      createPostDto.image ?? undefined, //kept for backwards compatibility
      createPostDto.mediaFiles ?? [],
      createPostDto.isArchived ?? false, // Privacy: archived posts only visible to owner
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
   * Retrieves all posts with user info, like status, ownership, and privacy filtering.
   * Now delegates to repository's aggregation pipeline which handles:
   * - User information lookup
   * - Friendship checking
   * - Privacy filtering (archived, public/private accounts)
   * - Like status and ownership flags
   *
   * Privacy Rules Applied:
   * 1. Owner sees all their posts (including archived)
   * 2. Archived posts only visible to owner
   * 3. Public accounts: everyone sees non-archived posts
   * 4. Private accounts: only friends see non-archived posts
   *
   * @param userId - The current user's MongoDB ID
   * @returns Promise resolving to an array of PostWithUserInfo entities with privacy filtering applied
   * @throws Error if the retrieval operation fails
   */
  async getAllWithUserInfo(userId: string): Promise<PostWithUserInfo[]> {
    this.logger.log(
      `[PostService.getAllWithUserInfo] Fetching posts with user info and privacy filtering for user: ${userId}`,
    );

    try {
      // Delegate to repository's aggregation pipeline (single query with privacy filtering)
      const result =
        await this.postRepository.getAllWithUserInfoAndPrivacy(userId);

      this.logger.log(
        `[PostService.getAllWithUserInfo] Successfully retrieved ${result.length} posts with privacy filtering`,
      );

      // Debug final result
      this.logger.debug(
        `[PostService.getAllWithUserInfo] Final result summary:`,
        result.slice(0, 3).map((p) => ({
          id: p.id,
          user: p.user,
          isOwner: p.isOwner,
          isArchived: p.isArchived,
          userInfo: p.userInfo
            ? `${p.userInfo.firstName} ${p.userInfo.lastName}`
            : 'No user info',
        })),
      );

      return result;
    } catch (error) {
      this.logger.error(
        '[PostService.getAllWithUserInfo] Failed to fetch posts with user info',
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Deletes a post and cascades removal of related likes, comments, and media files.
   * Uses proper MongoDB transactions for data consistency.
   */
  async delete(postId: string, userId: string): Promise<void> {
    this.logger.log(
      `[PostService.delete] Deleting post ${postId} by user ${userId}`,
    );

    if (!postId || !userId) {
      throw new Error('Post ID and User ID are required');
    }

    // Start a MongoDB session for transaction
    const session = await this.connection.startSession();
    let mediaToDelete: string[] = [];

    try {
      await session.withTransaction(async () => {
        // 1. First, get the post to verify ownership and get media info
        const post = await this.postRepository.findById(postId, session);
        if (!post) {
          throw new NotFoundException(`Post with ID ${postId} not found`);
        }

        // 2. Verify ownership (basic authorization)
        if (post.user !== userId) {
          throw new ForbiddenException('You can only delete your own posts');
        }

        // 3. Store media files to delete after transaction succeeds
        if (post.image) {
          mediaToDelete.push(post.image);
        }

        // 3a. same as above, but if multiple media files exist
        if (post.mediaFiles && post.mediaFiles.length > 0) {
          mediaToDelete.push(...post.mediaFiles);
        }

        // 4. Delete related comments
        await this.deletePostComments(postId, session);

        // 5. Delete related likes
        await this.deletePostLikes(postId, session);

        // 6. Delete the post itself
        await this.postRepository.delete(postId, session);
      });

      // Transaction committed successfully, now delete media files
      if (mediaToDelete.length > 0) {
        await this.deleteMediaFiles(mediaToDelete);
      }
    } catch (error) {
      this.logger.error(`[PostService.delete] Transaction failed`, error.stack);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  /**
   * Deletes all comments associated with a post.
   */
  private async deletePostComments(
    postId: string,
    session: any,
  ): Promise<void> {
    try {
      // Use the proper repository method instead of casting
      if (typeof this.commentRepository['deleteManyByPost'] === 'function') {
        await (this.commentRepository as any).deleteManyByPost(postId, session);
        this.logger.debug(
          `[PostService.deletePostComments] Deleted comments for post ${postId}`,
        );
      } else {
        this.logger.warn(
          `[PostService.deletePostComments] deleteManyByPost method not available on CommentRepository`,
        );
        // Fallback: could implement a manual deletion here if needed
      }
    } catch (error) {
      this.logger.error(
        `[PostService.deletePostComments] Failed to delete comments for post ${postId}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Deletes all likes associated with a post.
   */
  private async deletePostLikes(postId: string, session: any): Promise<void> {
    try {
      // Use the proper repository method instead of casting
      if (typeof this.likeRepository['deleteManyByPost'] === 'function') {
        await (this.likeRepository as any).deleteManyByPost(postId, session);
        this.logger.debug(
          `[PostService.deletePostLikes] Deleted likes for post ${postId}`,
        );
      } else {
        this.logger.warn(
          `[PostService.deletePostLikes] deleteManyByPost method not available on LikeRepository`,
        );
        // Fallback: could implement a manual deletion here if needed
      }
    } catch (error) {
      this.logger.error(
        `[PostService.deletePostLikes] Failed to delete likes for post ${postId}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Helper method to delete media files from storage.
   * Called after successful database transactions to clean up orphaned files.
   * @param mediaFiles - Array of media file paths/keys to delete
   */
  private async deleteMediaFiles(mediaUrls: string[]): Promise<void> {
    this.logger.log(
      `[PostService.deleteMediaFiles] Deleting ${mediaUrls.length} media files`,
    );

    // Use Promise.allSettled to handle all deletions in parallel
    const deletePromises = mediaUrls.map(async (mediaUrl) => {
      try {
        if (mediaUrl && mediaUrl.trim()) {
          await this.storageService.deleteFile(mediaUrl);
          this.logger.debug(
            `[PostService.deleteMediaFiles] Successfully deleted: ${mediaUrl}`,
          );
        }
      } catch (error) {
        // Log error but don't throw - we don't want media deletion to fail the main operation
        this.logger.warn(
          `[PostService.deleteMediaFiles] Failed to delete media file: ${mediaUrl}`,
          error.message,
        );
      }
    });

    await Promise.allSettled(deletePromises);
    this.logger.debug(
      `[PostService.deleteMediaFiles] Completed cleanup of ${mediaUrls.length} media files`,
    );
    // for (const mediaUrl of mediaUrls) {
    //   try {
    //     if (mediaUrl && mediaUrl.trim()) {
    //       await this.storageService.deleteFile(mediaUrl);
    //       this.logger.debug(
    //         `[PostService.deleteMediaFiles] Deleted media file: ${mediaUrl}`,
    //       );
    //     }
    //   } catch (error) {
    //     // Log error but don't fail the entire operation
    //     // Media cleanup is less critical than data consistency
    //     this.logger.warn(
    //       `[PostService.deleteMediaFiles] Failed to delete media file: ${mediaUrl}`,
    //       error.stack,
    //     );
    //   }
    // }
  }

  // /**
  //  * Enhanced method for handling multiple media files per post
  //  */
  // private async deleteMultipleMediaFiles(mediaKeys: string[]): Promise<void> {
  //   this.logger.log(
  //     `[PostService.deleteMultipleMediaFiles] Deleting ${mediaKeys.length} media files`,
  //   );

  //   const deletePromises = mediaKeys.map(async (mediaKey) => {
  //     try {
  //       if (mediaKey && mediaKey.trim()) {
  //         await this.storageService.deleteFile(mediaKey);
  //         this.logger.debug(
  //           `[PostService.deleteMultipleMediaFiles] Deleted media file: ${mediaKey}`,
  //         );
  //       }
  //     } catch (error) {
  //       this.logger.error(
  //         `[PostService.deleteMultipleMediaFiles] Failed to delete media file: ${mediaKey}`,
  //         error.stack,
  //       );
  //     }
  //   });

  //   // Execute all deletions in parallel but don't fail if some fail
  //   await Promise.allSettled(deletePromises);
  // }

  /**
   * Updates an existing post with ownership verification and media management.
   * Handles content updates, media file additions, and media file removals.
   * Uses database transactions to ensure data consistency.
   * @param postId - The ID of the post to update
   * @param updateData - The update data including content and media changes
   * @param userId - The ID of the user attempting the update (for ownership verification)
   * @returns Promise resolving to the updated post entity
   * @throws NotFoundException if the post doesn't exist
   * @throws ForbiddenException if the user doesn't own the post
   * @throws Error for other update failures
   */
  async update(
    postId: string,
    updateData: UpdatePostDto,
    userId: string,
  ): Promise<Post> {
    this.logger.log(
      `[PostService.update] Updating post ${postId} by user ${userId}`,
      {
        hasContent: !!updateData.content,
        mediaToAdd: updateData.mediaFilesToAdd?.length || 0,
        mediaToRemove: updateData.mediaFilesToRemove?.length || 0,
      },
    );

    // Validate input parameters
    if (!postId || !userId) {
      throw new Error('Post ID and User ID are required');
    }

    const session = await this.connection.startSession();
    let mediaToDelete: string[] = [];

    try {
      return await session.withTransaction(async () => {
        // 1. Get existing post to verify ownership and current state
        const existingPost = await this.postRepository.findById(
          postId,
          session,
        );

        if (!existingPost) {
          throw new NotFoundException(`Post with ID ${postId} not found`);
        }

        // 2. Verify ownership - users can only edit their own posts
        if (existingPost.user !== userId) {
          throw new ForbiddenException('You can only edit your own posts');
        }

        // 3. Handle media files management
        let updatedMediaFiles = [...(existingPost.mediaFiles || [])];

        // FIXED: Remove files that should be deleted with proper null checking
        if (
          updateData.mediaFilesToRemove &&
          updateData.mediaFilesToRemove.length > 0
        ) {
          // Store files to be deleted for cleanup after successful transaction
          mediaToDelete = [...updateData.mediaFilesToRemove];
          // Filter out the files marked for removal
          updatedMediaFiles = updatedMediaFiles.filter(
            (file) => !updateData.mediaFilesToRemove!.includes(file),
            //  (non-null assertion) because we already checked above
            // Alternatively, could use: updateData.mediaFilesToRemove?.includes(file) !== true
          );
          this.logger.debug(
            `[PostService.update] Removing ${mediaToDelete.length} media files from post ${postId}`,
          );
        }

        // Add new files to the end of the array (preserves order)
        if (
          updateData.mediaFilesToAdd &&
          updateData.mediaFilesToAdd.length > 0
        ) {
          updatedMediaFiles = [
            ...updatedMediaFiles,
            ...updateData.mediaFilesToAdd,
          ];
          this.logger.debug(
            `[PostService.update] Adding ${updateData.mediaFilesToAdd.length} media files to post ${postId}`,
          );
        }

        // 4. Prepare update data for repository
        const postUpdateData: Partial<Post> = {};

        // Update content if provided (even if empty string - allows clearing content)
        if (updateData.content !== undefined) {
          postUpdateData.content = updateData.content;
        }

        // Update archive status if provided (Privacy: toggle post visibility)
        if (updateData.isArchived !== undefined) {
          postUpdateData.isArchived = updateData.isArchived;
          this.logger.debug(
            `[PostService.update] ${updateData.isArchived ? 'Archiving' : 'Unarchiving'} post ${postId}`,
          );
        }

        // Always update media files array (even if no changes to ensure consistency)
        postUpdateData.mediaFiles = updatedMediaFiles;

        // 5. Perform the database update within the transaction
        const updatedPost = await this.postRepository.update(
          postId,
          postUpdateData,
          session,
        );

        this.logger.log(
          `[PostService.update] Successfully updated post ${postId}`,
          {
            finalMediaCount: updatedPost.mediaFiles?.length || 0,
            contentLength: updatedPost.content?.length || 0,
          },
        );

        return updatedPost;
      });
    } catch (error) {
      this.logger.error(
        `[PostService.update] Transaction failed for post ${postId}`,
        error.stack,
      );
      throw error;
    } finally {
      await session.endSession();

      // Clean up media files after successful transaction
      // This is done outside the transaction to avoid blocking the DB operation
      if (mediaToDelete.length > 0) {
        this.logger.debug(
          `[PostService.update] Starting cleanup of ${mediaToDelete.length} media files`,
        );
        await this.deleteMediaFiles(mediaToDelete);
      }
    }
  }

  /**
   * Deletes a post and cascades removal of related likes and comments in a transaction.
   */
  // async delete(postId: string, userId: string): Promise<void> {
  //   this.logger.log(
  //     `[PostService.delete] Deleting post ${postId} by user ${userId}`,
  //   );

  //   // Basic guards; later replace with proper Nest exceptions
  //   if (!postId || !userId) {
  //     throw new Error('Post ID and User ID are required');
  //   }

  //   // Use the like repository's transaction helper since it exists; otherwise we would need a generic one.
  //   // We'll piggyback on a like transaction with a no-op like entity pattern.
  //   await this.likeRepository.unlikePostWithTransaction(
  //     // dummy like entity for session; repositories ignore its content for our ops
  //     new (class {
  //       user = userId;
  //       post = postId;
  //     })() as any,
  //     async (session) => {
  //       // Authorization could be added here: fetch post and verify owner
  //       // Remove comments and likes for the post, then delete the post itself
  //       if ((this.commentRepository as any).deleteManyByPost) {
  //         await (this.commentRepository as any).deleteManyByPost(
  //           postId,
  //           session,
  //         );
  //       }
  //       if ((this.likeRepository as any).deleteManyByPost) {
  //         await (this.likeRepository as any).deleteManyByPost(postId, session);
  //       }
  //       if ((this.postRepository as any).delete) {
  //         await (this.postRepository as any).delete(postId, session);
  //       } else {
  //         throw new Error('PostRepository.delete is not implemented');
  //       }
  //     },
  //   );
  // }
}

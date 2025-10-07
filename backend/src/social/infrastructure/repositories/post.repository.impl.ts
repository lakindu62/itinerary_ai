//post.repository.impl.ts

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import {
  Post,
  PostWithLikeStatus,
} from 'src/social/domain/entities/post.entity';
import { PostRepository } from 'src/social/domain/repositories/post.repository';
import { PostDocument } from '../schemas/post.schema';

/**
 * MongoDB implementation of the PostRepository interface.
 * Handles database operations for Post entities using Mongoose.
 */
@Injectable()
export class PostRepositoryImpl extends PostRepository {
  private readonly logger = new Logger(PostRepositoryImpl.name);

  constructor(
    @InjectModel(Post.name) // Inject the Mongoose model for Post collection
    private readonly postModel: Model<PostDocument>,
  ) {
    super();
  }

  /**
   * Creates a new post record in the MongoDB collection.
   *
   * @param post - The post entity to create
   * @returns Promise resolving to the created post entity
   * @throws Error if the save operation fails
   */
  async create(post: Post): Promise<Post> {
    this.logger.debug(`[PostRepositoryImpl.create] Creating new post`);

    if (!post.user) {
      this.logger.error('Cannot create post: missing user ID', { post });
      throw new Error('User ID is required to create a post');
    }

    try {
      // Create new MongoDB document with post content
      const doc = new this.postModel({
        user: post.user,
        content: post.content,
        image: post.image, //kept for backwards compatibiility
        mediaFiles: post.mediaFiles,
      });

      //pre-save logging (debug only)
      this.logger.debug('MongoDB document prepared for save');

      // Save document to database
      const saved = await doc.save();

      //success log removed to reduce noise

      // Convert MongoDB document back to domain entity
      return this.toDomainEntity(saved);
    } catch (error) {
      // error logging with minimal context
      this.logger.error('Failed to create post', error.stack);
      throw error;
    }
  }

  /**
   * Retrieves all posts from the MongoDB collection, sorted by creation date.
   *
   * @returns Promise resolving to an array of post entities
   * @throws Error if the query operation fails
   */
  async getAll(): Promise<Post[]> {
    this.logger.debug(`[PostRepositoryImpl.getAll] Fetching posts from DB`);

    try {
      // Query all posts from database, sorted by creation date (newest first)
      const docs = await this.postModel
        .find()
        .sort({ createdAt: -1 }) // Most recent first
        .exec();

      // Convert each MongoDB document to domain entity
      return docs.map((doc) => this.toDomainEntity(doc));
    } catch (error) {
      this.logger.error('Failed to fetch posts from database', error.stack);
      throw error;
    }
  }

  /**
   * Finds a single post by its ID.
   *
   * @param postId - The ID of the post to find
   * @param session - Optional MongoDB session for transaction support
   * @returns Promise resolving to the post entity or null if not found
   */
  async findById(
    postId: string,
    session?: ClientSession,
  ): Promise<Post | null> {
    this.logger.debug(
      `[PostRepositoryImpl.findById] Finding post by ID: ${postId}`,
    );

    try {
      const queryOptions = session ? { session } : {};
      const doc = await this.postModel
        .findById(postId, null, queryOptions)
        .exec();

      if (!doc) {
        this.logger.debug(
          `[PostRepositoryImpl.findById] Post not found: ${postId}`,
        );
        return null;
      }

      return this.toDomainEntity(doc);
    } catch (error) {
      this.logger.error(`Failed to find post by ID: ${postId}`, error.stack);
      throw error;
    }
  }

  /**
   * Retrieves all posts with like status for a specific user.
   * Uses MongoDB aggregation to efficiently join posts with likes in a single query.
   *
   * @param userId - Optional user ID to check like status
   * @returns Promise resolving to an array of PostWithLikeStatus entities
   * @throws Error if the query operation fails
   */
  async getAllWithLikeStatus(userId?: string): Promise<PostWithLikeStatus[]> {
    this.logger.debug(
      `[PostRepositoryImpl.getAllWithLikeStatus] Fetching posts with like status for user: ${userId || 'anonymous'}`,
    );

    try {
      // Always use MongoDB aggregation to join posts with user information
      // If userId is provided, also check if the user has liked each post
      const pipeline: any[] = [
        // Match all posts
        { $match: {} },

        // Sort by creation date (newest first)
        { $sort: { createdAt: -1 } },

        // Convert user field to ObjectId if it's a string (for $lookup to work)
        {
          $addFields: {
            userObjectId: {
              $cond: {
                if: { $eq: [{ $type: '$user' }, 'string'] },
                then: { $toObjectId: '$user' },
                else: '$user',
              },
            },
          },
        },

        // Lookup user information (ALWAYS do this to populate userInfo)
        {
          $lookup: {
            from: 'users', // Collection name for users
            localField: 'userObjectId',
            foreignField: '_id',
            as: 'userInfo',
          },
        },

        // Unwind userInfo array to object (should only be one user)
        {
          $unwind: {
            path: '$userInfo',
            preserveNullAndEmptyArrays: true, // Keep posts even if user not found
          },
        },

        // Project only the fields we need from userInfo
        {
          $addFields: {
            'userInfo.profilePicture': '$userInfo.travelProfile.profilePicture',
          },
        },
      ];

      // Only add like lookup if userId is provided
      if (userId) {
        pipeline.push(
          // Lookup likes for the specific user
          {
            $lookup: {
              from: 'likes', // Collection name for likes
              let: { postId: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ['$post', '$$postId'] },
                        { $eq: ['$user', { $toObjectId: userId }] },
                      ],
                    },
                  },
                },
              ],
              as: 'userLikes',
            },
          },
          // Add userLiked field based on whether userLikes array has any items
          {
            $addFields: {
              userLiked: { $gt: [{ $size: '$userLikes' }, 0] },
            },
          },
        );
      } else {
        // If no userId, set userLiked to false for all posts
        pipeline.push({
          $addFields: {
            userLiked: false,
          },
        });
      }

      // Remove temporary fields
      pipeline.push({
        $project: {
          userLikes: 0,
          userObjectId: 0, // Remove temporary userObjectId field
          'userInfo.travelProfile': 0, // Remove the full travelProfile, keep only profilePicture
        },
      });

      // Use MongoDB aggregation to join posts with likes in a single query
      const docs = await this.postModel.aggregate(pipeline).exec();

      // Debug: log first post to see structure
      if (docs.length > 0) {
        this.logger.debug(
          '[PostRepositoryImpl.getAllWithLikeStatus] Sample post structure:',
          {
            postId: docs[0]._id,
            userIdValue: docs[0].user,
            userIdType: typeof docs[0].user,
            userInfo: docs[0].userInfo,
            userInfoKeys: docs[0].userInfo ? Object.keys(docs[0].userInfo) : [],
            hasUserInfoData:
              docs[0].userInfo && Object.keys(docs[0].userInfo).length > 0,
          },
        );
      }

      this.logger.debug(
        `[PostRepositoryImpl.getAllWithLikeStatus] Found ${docs.length} posts with like status`,
      );

      // Convert MongoDB documents to PostWithLikeStatus entities
      return docs.map((doc) => this.toPostWithLikeStatusFromDoc(doc));
    } catch (error) {
      this.logger.error(
        'Failed to fetch posts with like status from database',
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Adds a like to a post by incrementing the like count and adding the like ID to the likes array.
   *
   * @param postId - The ID of the post to add the like to
   * @param likeId - The ID of the like to add
   * @param session - Optional MongoDB session for transaction support
   * @returns Promise resolving when the operation completes
   * @throws Error if the update operation fails
   */
  async addLike(
    postId: string,
    likeId: string,
    session?: ClientSession,
  ): Promise<void> {
    // method entry logging (debug only)
    this.logger.debug(`Adding like to post`);

    try {
      // session options handling
      const updateOptions = session ? { session, new: true } : { new: true };

      const result = await this.postModel
        .findByIdAndUpdate(
          postId,
          {
            $inc: { likeCount: 1 },
            // $addToSet: { likes: likeId },
          },
          updateOptions,
        )
        .exec();

      if (!result) {
        // warning for non-existent post
        this.logger.warn(`Post not found when adding like`);
        throw new Error(`Post with ID ${postId} not found`);
      }
    } catch (error) {
      // error logging
      this.logger.error('Failed to add like to post', error.stack);
      throw error;
    }
  }

  /**
   * Removes a like from a post by decrementing the like count and removing the like ID from the likes array.
   *
   * @param postId - The ID of the post to remove the like from
   * @param likeId - The ID of the like to remove
   * @param session - Optional MongoDB session for transaction support
   * @returns Promise resolving when the operation completes
   * @throws Error if the update operation fails
   */
  async removeLike(
    postId: string,
    likeId: string,
    session?: ClientSession,
  ): Promise<void> {
    //  method entry logging (debug only)
    this.logger.debug(`Removing like from post`);

    try {
      //session options handling
      const updateOptions = session ? { session, new: true } : { new: true };

      const result = await this.postModel
        .findByIdAndUpdate(
          postId,
          {
            $inc: { likeCount: -1 },
            // $pull: { likes: likeId },
          },
          updateOptions,
        )
        .exec();

      if (!result) {
        // warning for non-existent post
        this.logger.warn(`Post not found when removing like`);
        throw new Error(`Post with ID ${postId} not found`);
      }
    } catch (error) {
      // error logging
      this.logger.error('Failed to remove like from post', error.stack);
      throw error;
    }
  }

  /**
   * Increments the comment count for a post when a new comment is added.
   *
   * @param postId - The ID of the post to add the comment to
   * @param commentId - The ID of the new comment
   * @param session - Optional MongoDB session for transaction support
   */
  async addComment(
    postId: string,
    commentId: string,
    session?: ClientSession,
  ): Promise<void> {
    this.logger.debug(`Adding comment to post`);

    try {
      const updateOptions = session ? { session, new: true } : { new: true };

      const result = await this.postModel
        .findByIdAndUpdate(
          postId,
          {
            $inc: { commentCount: 1 },
          },
          updateOptions,
        )
        .exec();

      if (!result) {
        this.logger.warn(`Post not found when adding comment`, {
          postId,
          commentId,
        });
        throw new Error(`Post with ID ${postId} not found`);
      }
    } catch (error) {
      this.logger.error('Failed to add comment to post', error.stack);
      throw error;
    }
  }

  /**
   * Decrements the comment count for a post when a comment is removed.
   *
   * @param postId - The ID of the post to remove the comment from
   * @param commentId - The ID of the comment being removed
   * @param session - Optional MongoDB session for transaction support
   */
  async removeComment(
    postId: string,
    commentId: string,
    session?: ClientSession,
  ): Promise<void> {
    this.logger.debug(`Removing comment from post`);

    try {
      const updateOptions = session ? { session, new: true } : { new: true };

      const result = await this.postModel
        .findByIdAndUpdate(
          postId,
          {
            $inc: { commentCount: -1 },
          },
          updateOptions,
        )
        .exec();

      if (!result) {
        this.logger.warn(`Post not found when removing comment`, {
          postId,
          commentId,
        });
        throw new Error(`Post with ID ${postId} not found`);
      }
    } catch (error) {
      this.logger.error('Failed to remove comment from post', error.stack);
      throw error;
    }
  }

  /**
   * Deletes a post document by its ID.
   * Not part of the abstract interface; used by service for cascading deletes.
   */
  async delete(postId: string, session?: ClientSession): Promise<void> {
    this.logger.debug(`[PostRepositoryImpl.delete] Deleting post`);

    const result = await this.postModel.findByIdAndDelete(
      postId,
      session ? { session } : {},
    );

    if (!result) {
      this.logger.warn(`Post not found when deleting`, { postId });
    }
  }

  /**
   * Updates an existing post with partial data.
   * Supports updating content, media files, and other post properties.
   * @param postId - The ID of the post to update
   * @param updateData - Partial post data containing fields to update
   * @param session - Optional MongoDB session for transaction support
   * @returns Promise resolving to the updated post entity
   * @throws Error if the post is not found or update fails
   */
  async update(
    postId: string,
    updateData: Partial<Post>,
    session?: ClientSession,
  ): Promise<Post> {
    this.logger.debug(
      `[PostRepositoryImpl.update] Updating post ${postId} with data:`,
      { updateData },
    );

    try {
      const queryOptions = session ? { session, new: true } : { new: true };

      const doc = await this.postModel
        .findByIdAndUpdate(postId, updateData, queryOptions)
        .exec();

      if (!doc) {
        throw new Error(`Post with ID ${postId} not found`);
      }

      const result = this.toDomainEntity(doc);
      this.logger.debug(
        `[PostRepositoryImpl.update] Successfully updated post: ${postId}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `[PostRepositoryImpl.update] Failed to update post ${postId}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Converts a MongoDB document to a domain entity.
   *
   * @private
   * @param doc - The MongoDB document to convert
   * @returns The corresponding domain entity
   */
  private toDomainEntity(doc: PostDocument): Post {
    return new Post(
      doc._id.toString(),
      doc.user.toString(),
      doc.content ?? '', //If undefined, it will return empty string
      doc.likeCount ?? 0,
      doc.commentCount ?? 0,
      doc.createdAt,
      doc.updatedAt,
      doc.image,
      doc.mediaFiles ?? [],
    );
  }

  /**
   * Converts a Post entity to PostWithLikeStatus entity.
   *
   * @private
   * @param post - The Post entity to convert
   * @param userLiked - Whether the user has liked this post
   * @returns The corresponding PostWithLikeStatus entity
   */
  private toPostWithLikeStatus(
    post: Post,
    userLiked: boolean,
  ): PostWithLikeStatus {
    return new PostWithLikeStatus(
      post.id,
      post.user,
      post.content,
      post.likeCount,
      post.commentCount,
      userLiked,
      post.createdAt,
      post.updatedAt,
      post.image,
      post.mediaFiles,
      undefined, // userInfo not available when not using aggregation
    );
  }

  /**
   * Converts a MongoDB aggregation result to PostWithLikeStatus entity.
   *
   * @private
   * @param doc - The MongoDB aggregation result document
   * @returns The corresponding PostWithLikeStatus entity
   */
  private toPostWithLikeStatusFromDoc(doc: any): PostWithLikeStatus {
    // Check if userInfo has actual data (not just an empty object)
    const hasUserInfoData = doc.userInfo && doc.userInfo._id;

    // Debug logging to see what userInfo looks like
    if (doc.userInfo && !hasUserInfoData) {
      this.logger.warn(
        '[toPostWithLikeStatusFromDoc] userInfo exists but is empty for post:',
        {
          postId: doc._id,
          userId: doc.user,
          userInfo: doc.userInfo,
        },
      );
    } else if (!doc.userInfo) {
      this.logger.warn(
        '[toPostWithLikeStatusFromDoc] userInfo is completely missing for post:',
        doc._id,
      );
    }

    return new PostWithLikeStatus(
      doc._id.toString(),
      doc.user.toString(),
      doc.content ?? '',
      doc.likeCount ?? 0,
      doc.commentCount ?? 0,
      doc.userLiked ?? false,
      doc.createdAt,
      doc.updatedAt,
      doc.image,
      doc.mediaFiles ?? [],
      hasUserInfoData
        ? {
            _id: doc.userInfo._id.toString(),
            clerkUserId: doc.userInfo.clerkUserId,
            firstName: doc.userInfo.firstName,
            lastName: doc.userInfo.lastName,
            email: doc.userInfo.email,
            profilePicture: doc.userInfo.profilePicture,
          }
        : undefined,
    );
  }
}

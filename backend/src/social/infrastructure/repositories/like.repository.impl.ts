//like.repository.impl.ts

import { Injectable, Logger } from '@nestjs/common';
import { LikeRepository } from 'src/social/domain/repositories/like.repository';
import { LikeDocument } from '../schemas/like.schema';
import { Like } from 'src/social/domain/entities/like.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, ClientSession } from 'mongoose';

/**
 * MongoDB implementation of the LikeRepository interface.
 * Handles database operations for Like entities using Mongoose.
 */
@Injectable()
export class LikeRepositoryImpl extends LikeRepository {
  private readonly logger = new Logger(LikeRepositoryImpl.name);

  constructor(
    @InjectModel(Like.name)
    private readonly likeModel: Model<LikeDocument>,
  ) {
    super();
  }

  /**
   * Executes a like operation within a MongoDB transaction.
   * Handles session management, transaction lifecycle, and error handling.
   *
   * @template T - The return type of the operation
   * @param like - The like entity involved in the transaction
   * @param operation - The callback function to execute within the transaction
   * @returns Promise resolving to the result of the operation
   * @throws Error if transaction fails or duplicate key error occurs
   */
  async likePostWithTransaction<T>(
    like: Like,
    operation: (session: any) => Promise<T>,
  ): Promise<T> {
    this.logger.debug(
      `[LikeRepositoryImpl.likePostWithTransaction] Starting like transaction`,
    );

    const session = await this.likeModel.db.startSession();

    try {
      session.startTransaction();
      this.logger.debug(
        `[LikeRepositoryImpl.likePostWithTransaction] Transaction started`,
      );

      const result = await operation(session);

      await session.commitTransaction();
      // success log removed to reduce noise

      return result;
    } catch (error) {
      this.logger.error(
        `[LikeRepositoryImpl.likePostWithTransaction] Transaction failed, rolling back`,
        error.stack,
      );

      await session.abortTransaction();

      // Handle duplicate key error at repository level
      if (error.code === 11000) {
        throw new Error(
          `User ${like.user} has already liked post ${like.post}`,
        );
      }
      throw error;
    } finally {
      session.endSession();
      this.logger.debug(
        `[LikeRepositoryImpl.likePostWithTransaction] Session ended`,
      );
    }
  }

  /**
   * Executes an unlike operation within a MongoDB transaction.
   * Handles session management, transaction lifecycle, and error handling.
   *
   * @template T - The return type of the operation
   * @param like - The like entity involved in the transaction
   * @param operation - The callback function to execute within the transaction
   * @returns Promise resolving to the result of the operation
   * @throws Error if transaction fails
   */
  async unlikePostWithTransaction<T>(
    like: Like,
    operation: (session: any) => Promise<T>,
  ): Promise<T> {
    this.logger.debug(
      `[LikeRepositoryImpl.unlikePostWithTransaction] Starting unlike transaction`,
    );

    const session = await this.likeModel.db.startSession();

    try {
      session.startTransaction();
      this.logger.debug(
        `[LikeRepositoryImpl.unlikePostWithTransaction] Transaction started`,
      );

      const result = await operation(session);

      await session.commitTransaction();
      // success log removed to reduce noise

      return result;
    } catch (error) {
      this.logger.error(
        `[LikeRepositoryImpl.unlikePostWithTransaction] Transaction failed, rolling back`,
        error.stack,
      );

      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
      this.logger.debug(
        `[LikeRepositoryImpl.unlikePostWithTransaction] Session ended`,
      );
    }
  }

  /**
   * Creates a new like record in the MongoDB collection.
   *
   * @param like - The like entity to create
   * @param session - Optional MongoDB session for transaction support
   * @returns Promise resolving to the created like entity
   * @throws Error if the save operation fails
   */
  async likePost(like: Like, session?: ClientSession): Promise<Like> {
    this.logger.debug(`[LikeRepositoryImpl.likePost] Creating like record`);

    // Create new MongoDB document
    const doc = new this.likeModel({
      user: new Types.ObjectId(like.user),
      post: new Types.ObjectId(like.post),
    });

    this.logger.debug(
      `[LikeRepositoryImpl.likePost] MongoDB document prepared`,
    );

    // Save with optional session
    const saved = await doc.save(session ? { session } : {});

    // success log removed to reduce noise

    // Convert MongoDB document back to domain entity
    return this.toDomainEntity(saved);
  }

  /**
   * Removes a like record from the MongoDB collection.
   *
   * @param like - The like entity to remove
   * @param session - Optional MongoDB session for transaction support
   * @returns Promise resolving when the operation completes
   */
  async unlikePost(like: Like, session?: ClientSession): Promise<void> {
    this.logger.debug(`[LikeRepositoryImpl.unlikePost] Removing like record`);

    // Convert string IDs to ObjectId for the query
    const query = {
      user: new Types.ObjectId(like.user),
      post: new Types.ObjectId(like.post),
    };

    this.logger.debug(`[LikeRepositoryImpl.unlikePost] Query prepared`);

    // Remove with optional session
    const result = await this.likeModel.findOneAndDelete(
      query,
      session ? { session } : {},
    );

    if (result) {
      // success log removed to reduce noise
    } else {
      this.logger.warn(
        `[LikeRepositoryImpl.unlikePost] No like document found to remove`,
      );
    }
  }

  /**
   * Finds a like record by user ID and post ID.
   *
   * @param userId - The ID of the user who liked the post
   * @param postId - The ID of the post that was liked
   * @param session - Optional MongoDB session for transaction support
   * @returns Promise resolving to the like entity if found, null otherwise
   */
  async findByUserAndPost(
    userId: string,
    postId: string,
    session?: ClientSession,
  ): Promise<Like | null> {
    this.logger.debug(
      `[LikeRepositoryImpl.findByUserAndPost] Searching for like`,
    );

    const query = {
      user: new Types.ObjectId(userId),
      post: new Types.ObjectId(postId),
    };

    const doc = await this.likeModel.findOne(
      query,
      null,
      session ? { session } : {},
    );

    if (doc) {
      this.logger.debug(`[LikeRepositoryImpl.findByUserAndPost] Like found`);
      return this.toDomainEntity(doc);
    } else {
      this.logger.debug(
        `[LikeRepositoryImpl.findByUserAndPost] No like found for UserID: ${userId}, PostID: ${postId}`,
      );
      return null;
    }
  }

  /**
   * Converts a MongoDB document to a domain entity.
   *
   * @private
   * @param doc - The MongoDB document to convert
   * @returns The corresponding domain entity
   */
  private toDomainEntity(doc: LikeDocument): Like {
    return new Like(
      doc._id.toString(),
      doc.user.toString(),
      doc.post.toString(),
      doc.createdAt,
      doc.updatedAt,
    );
  }

  /**
   * Deletes all likes for a given post. Implements interface contract for cascading deletes.
   */
  async deleteManyByPost(
    postId: string,
    session?: ClientSession,
  ): Promise<void> {
    this.logger.debug(
      `[LikeRepositoryImpl.deleteManyByPost] Deleting likes for post`,
    );
    await this.likeModel.deleteMany(
      { post: new Types.ObjectId(postId) },
      session ? { session } : {},
    );
  }
}

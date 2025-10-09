import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import {
  Comment,
  CommentWithUserInfo,
} from 'src/social/domain/entities/comment.entity';
import { CommentRepository } from 'src/social/domain/repositories/comment.repository';
import { CommentDocument } from '../schemas/comment.schema';

@Injectable()
export class CommentRepositoryImpl extends CommentRepository {
  private readonly logger = new Logger(CommentRepositoryImpl.name);

  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
  ) {
    super();
  }

  async findCommentsByPostId(postId: string): Promise<Comment[]> {
    this.logger.debug(
      `[CommentRepositoryImpl.findCommentsByPostId] Finding comments for post ${postId}`,
    );

    const docs = await this.commentModel
      .find({ post: new Types.ObjectId(postId) })
      .sort({ createdAt: -1 })
      .exec();

    this.logger.debug(
      `[CommentRepositoryImpl.findCommentsByPostId] Found ${docs.length} comments for post ${postId}`,
    );

    return docs.map((doc) => this.toDomainEntity(doc));
  }

  /**
   * Aggregation: fetch comments for a post, join user info, add isOwner
   * @param postId - The post to fetch comments for
   * @param currentUserId - The current user's MongoDB ID
   */

  async findCommentsWithUserInfo(
    postId: string,
    currentUserId: string,
  ): Promise<CommentWithUserInfo[]> {
    this.logger.debug(
      `[CommentRepositoryImpl.findCommentsWithUserInfo] Aggregating comments for post ${postId} with user info for user ${currentUserId}`,
    );
    this.logger.debug(
      `[CommentRepositoryImpl.findCommentsWithUserInfo] userId type: ${typeof currentUserId}, length: ${currentUserId?.length}`,
    );
    const postObjectId = new Types.ObjectId(postId);
    const userObjectId = new Types.ObjectId(currentUserId);
    this.logger.debug(
      `[CommentRepositoryImpl.findCommentsWithUserInfo] Converted to ObjectId: ${userObjectId}`,
    );
    const pipeline: any[] = [
      { $match: { post: postObjectId } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfoArr',
        },
      },
      { $unwind: { path: '$userInfoArr', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          isOwner: { $eq: [{ $toString: '$user' }, currentUserId] }, // Use pre-converted ObjectId, exactly as in posts
        },
      },
    ];
    const results = await this.commentModel.aggregate(pipeline).exec();
    // ===== FINAL COMMENT DEBUG =====
    console.debug(
      '[CommentRepositoryImpl.findCommentsWithUserInfo] Final comments with user info:',
      results,
    );
    return results;
  }

  /**
   * Converts aggregation result to CommentWithUserInfo DTO
   */
  toCommentWithUserInfoDomainEntity(doc: any) {
    const userInfo = doc.userInfoArr
      ? new (require('../../domain/entities/comment.entity').CommentUserInfo)(
          doc.userInfoArr._id?.toString() ?? '',
          `${doc.userInfoArr.firstName ?? ''} ${doc.userInfoArr.lastName ?? ''}`.trim(),
          doc.userInfoArr.travelProfile?.profilePicture ?? undefined,
        )
      : new (require('../../domain/entities/comment.entity').CommentUserInfo)(
          '',
          '',
          undefined,
        );
    return new (require('../../domain/entities/comment.entity').CommentWithUserInfo)(
      doc._id?.toString() ?? '',
      doc.user?.toString() ?? '',
      doc.post?.toString() ?? '',
      doc.content ?? '',
      doc.createdAt?.toString?.() ?? doc.createdAt,
      doc.updatedAt?.toString?.() ?? doc.updatedAt,
      userInfo,
      !!doc.isOwner,
    );
  }

  async createWithTransaction<T>(
    comment: Comment,
    operation: (session: ClientSession) => Promise<T>,
  ): Promise<T> {
    this.logger.debug(
      `[CommentRepositoryImpl.createWithTransaction] Starting create comment transaction`,
    );
    const session = await this.commentModel.db.startSession();
    try {
      session.startTransaction();
      const result = await operation(session);
      await session.commitTransaction();
      // success log removed to reduce noise
      return result;
    } catch (error) {
      this.logger.error(
        `[CommentRepositoryImpl.createWithTransaction] Transaction failed, rolling back`,
        error.stack,
      );
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
      this.logger.debug(
        `[CommentRepositoryImpl.createWithTransaction] Session ended`,
      );
    }
  }

  async deleteWithTransaction<T>(
    comment: Pick<Comment, 'id' | 'user' | 'post'>,
    operation: (session: ClientSession) => Promise<T>,
  ): Promise<T> {
    this.logger.debug(
      `[CommentRepositoryImpl.deleteWithTransaction] Starting delete comment transaction`,
    );
    const session = await this.commentModel.db.startSession();
    try {
      session.startTransaction();
      const result = await operation(session);
      await session.commitTransaction();
      // success log removed to reduce noise
      return result;
    } catch (error) {
      this.logger.error(
        `[CommentRepositoryImpl.deleteWithTransaction] Transaction failed, rolling back`,
        error.stack,
      );
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
      this.logger.debug(
        `[CommentRepositoryImpl.deleteWithTransaction] Session ended`,
      );
    }
  }

  async create(comment: Comment, session?: ClientSession): Promise<Comment> {
    this.logger.debug(`[CommentRepositoryImpl.create] Creating comment`);

    const doc = new this.commentModel({
      user: new Types.ObjectId(comment.user),
      post: new Types.ObjectId(comment.post),
      content: comment.content,
    });

    const saved = await doc.save(session ? { session } : {});
    // success log removed to reduce noise
    return this.toDomainEntity(saved);
  }

  async delete(
    comment: Pick<Comment, 'id' | 'user' | 'post'>,
    session?: ClientSession,
  ): Promise<void> {
    this.logger.debug(`[CommentRepositoryImpl.delete] Deleting comment`);

    const result = await this.commentModel.findOneAndDelete(
      {
        _id: new Types.ObjectId(comment.id),
        user: new Types.ObjectId(comment.user),
        post: new Types.ObjectId(comment.post),
      },
      session ? { session } : {},
    );

    if (!result) {
      this.logger.warn(
        `[CommentRepositoryImpl.delete] No comment document found to remove`,
      );
    }
  }

  /**
   * Deletes all comments for a given post. Not part of the abstract repository interface; used for cascading deletes.
   */
  async deleteManyByPost(
    postId: string,
    session?: ClientSession,
  ): Promise<void> {
    this.logger.debug(
      `[CommentRepositoryImpl.deleteManyByPost] Deleting comments for post`,
    );
    await this.commentModel.deleteMany(
      { post: new Types.ObjectId(postId) },
      session ? { session } : {},
    );
  }

  private toDomainEntity(doc: CommentDocument): Comment {
    return new Comment(
      doc._id.toString(),
      doc.user.toString(),
      doc.post.toString(),
      doc.content,
      doc.createdAt?.toString?.() ?? (doc as any).createdAt,
      doc.updatedAt?.toString?.() ?? (doc as any).updatedAt,
    );
  }
}

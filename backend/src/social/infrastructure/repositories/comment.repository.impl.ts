import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import { Comment } from 'src/social/domain/entities/comment.entity';
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

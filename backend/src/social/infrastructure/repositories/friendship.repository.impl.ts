// friendship.repository.impl.ts

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import {
  Friendship,
  FriendshipWithUserInfo,
} from 'src/social/domain/entities/friendship.entity';
import { FriendshipRepository } from 'src/social/domain/repositories/friendship.repository';
import { FriendshipStatus } from 'src/social/domain/value-objects/friendship-status.vo';
import {
  HasFriendship,
  HasFriendshipDocument,
} from '../schemas/friendships.schema';

/**
 * MongoDB implementation of the FriendshipRepository interface.
 * Handles database operations for Friendship entities using Mongoose.
 * Follows DDD infrastructure layer pattern - implements repository contract.
 */
@Injectable()
export class FriendshipRepositoryImpl extends FriendshipRepository {
  private readonly logger = new Logger(FriendshipRepositoryImpl.name);

  constructor(
    @InjectModel(HasFriendship.name)
    private readonly friendshipModel: Model<HasFriendshipDocument>,
  ) {
    super();
  }

  /**
   * Creates a new friendship record in the database.
   */
  async create(
    friendship: Friendship,
    session?: ClientSession,
  ): Promise<Friendship> {
    this.logger.debug(
      `[FriendshipRepositoryImpl.create] Creating new friendship request from ${friendship.requesterId} to ${friendship.receiverId}`,
    );

    try {
      const doc = new this.friendshipModel({
        requester_id: new Types.ObjectId(friendship.requesterId),
        receiver_id: new Types.ObjectId(friendship.receiverId),
        status: friendship.status,
      });

      const saveOptions = session ? { session } : {};
      const saved = await doc.save(saveOptions);

      this.logger.debug(
        `[FriendshipRepositoryImpl.create] Successfully created friendship: ${saved._id}`,
      );

      return this.toDomainEntity(saved);
    } catch (error) {
      this.logger.error(
        `[FriendshipRepositoryImpl.create] Failed to create friendship`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Finds a friendship by its unique ID.
   */
  async findById(
    friendshipId: string,
    session?: ClientSession,
  ): Promise<Friendship | null> {
    this.logger.debug(
      `[FriendshipRepositoryImpl.findById] Finding friendship by ID: ${friendshipId}`,
    );

    try {
      const queryOptions = session ? { session } : {};
      const doc = await this.friendshipModel
        .findById(friendshipId, null, queryOptions)
        .exec();

      if (!doc) {
        this.logger.debug(
          `[FriendshipRepositoryImpl.findById] Friendship not found: ${friendshipId}`,
        );
        return null;
      }

      return this.toDomainEntity(doc);
    } catch (error) {
      this.logger.error(
        `[FriendshipRepositoryImpl.findById] Failed to find friendship by ID: ${friendshipId}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Finds a friendship relationship between two specific users.
   * Checks both directions (A->B and B->A).
   */
  async findByUsers(
    userId1: string,
    userId2: string,
  ): Promise<Friendship | null> {
    this.logger.debug(
      `[FriendshipRepositoryImpl.findByUsers] Finding friendship between ${userId1} and ${userId2}`,
    );

    try {
      const user1ObjectId = new Types.ObjectId(userId1);
      const user2ObjectId = new Types.ObjectId(userId2);

      const doc = await this.friendshipModel
        .findOne({
          $or: [
            {
              requester_id: user1ObjectId,
              receiver_id: user2ObjectId,
            },
            {
              requester_id: user2ObjectId,
              receiver_id: user1ObjectId,
            },
          ],
        })
        .exec();

      if (!doc) {
        this.logger.debug(
          `[FriendshipRepositoryImpl.findByUsers] No friendship found between users`,
        );
        return null;
      }

      return this.toDomainEntity(doc);
    } catch (error) {
      this.logger.error(
        `[FriendshipRepositoryImpl.findByUsers] Failed to find friendship`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Finds a pending friendship request where the specified user is the receiver.
   */
  async findPendingRequest(
    requesterId: string,
    receiverId: string,
  ): Promise<Friendship | null> {
    this.logger.debug(
      `[FriendshipRepositoryImpl.findPendingRequest] Finding pending request from ${requesterId} to ${receiverId}`,
    );

    try {
      const doc = await this.friendshipModel
        .findOne({
          requester_id: new Types.ObjectId(requesterId),
          receiver_id: new Types.ObjectId(receiverId),
          status: FriendshipStatus.PENDING,
        })
        .exec();

      return doc ? this.toDomainEntity(doc) : null;
    } catch (error) {
      this.logger.error(
        `[FriendshipRepositoryImpl.findPendingRequest] Failed to find pending request`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Updates the status of an existing friendship.
   */
  async updateStatus(
    friendshipId: string,
    status: FriendshipStatus,
    session?: ClientSession,
  ): Promise<Friendship> {
    this.logger.debug(
      `[FriendshipRepositoryImpl.updateStatus] Updating friendship ${friendshipId} to status ${status}`,
    );

    try {
      const queryOptions = session ? { session, new: true } : { new: true };

      const doc = await this.friendshipModel
        .findByIdAndUpdate(friendshipId, { status }, queryOptions)
        .exec();

      if (!doc) {
        throw new Error(`Friendship with ID ${friendshipId} not found`);
      }

      this.logger.debug(
        `[FriendshipRepositoryImpl.updateStatus] Successfully updated friendship status`,
      );

      return this.toDomainEntity(doc);
    } catch (error) {
      this.logger.error(
        `[FriendshipRepositoryImpl.updateStatus] Failed to update friendship status`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Deletes a friendship record.
   */
  async delete(friendshipId: string, session?: ClientSession): Promise<void> {
    this.logger.debug(
      `[FriendshipRepositoryImpl.delete] Deleting friendship ${friendshipId}`,
    );

    try {
      const result = await this.friendshipModel.findByIdAndDelete(
        friendshipId,
        session ? { session } : {},
      );

      if (!result) {
        this.logger.warn(
          `[FriendshipRepositoryImpl.delete] Friendship not found when deleting`,
          { friendshipId },
        );
      }
    } catch (error) {
      this.logger.error(
        `[FriendshipRepositoryImpl.delete] Failed to delete friendship`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Retrieves all accepted friendships for a specific user.
   * Returns friendships where the user is either requester or receiver.
   */
  async getFriends(userId: string): Promise<Friendship[]> {
    this.logger.debug(
      `[FriendshipRepositoryImpl.getFriends] Fetching friends for user ${userId}`,
    );

    try {
      const userObjectId = new Types.ObjectId(userId);

      const docs = await this.friendshipModel
        .find({
          $or: [{ requester_id: userObjectId }, { receiver_id: userObjectId }],
          status: FriendshipStatus.ACCEPTED,
        })
        .sort({ updatedAt: -1 })
        .exec();

      this.logger.debug(
        `[FriendshipRepositoryImpl.getFriends] Found ${docs.length} friends`,
      );

      return docs.map((doc) => this.toDomainEntity(doc));
    } catch (error) {
      this.logger.error(
        `[FriendshipRepositoryImpl.getFriends] Failed to fetch friends`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Retrieves all accepted friendships with user information.
   * Includes profile details of the friend (the other user in the relationship).
   */
  async getFriendsWithUserInfo(
    userId: string,
  ): Promise<FriendshipWithUserInfo[]> {
    this.logger.debug(
      `[FriendshipRepositoryImpl.getFriendsWithUserInfo] Fetching friends with user info for user ${userId}`,
    );

    try {
      const userObjectId = new Types.ObjectId(userId);

      const docs = await this.friendshipModel
        .aggregate([
          // 1. Match friendships where user is involved and status is accepted
          {
            $match: {
              $or: [
                { requester_id: userObjectId },
                { receiver_id: userObjectId },
              ],
              status: FriendshipStatus.ACCEPTED,
            },
          },

          // 2. Sort by most recent
          { $sort: { updatedAt: -1 } },

          // 3. Lookup requester user info
          {
            $lookup: {
              from: 'users',
              localField: 'requester_id',
              foreignField: '_id',
              as: 'requesterInfo',
            },
          },

          // 4. Lookup receiver user info
          {
            $lookup: {
              from: 'users',
              localField: 'receiver_id',
              foreignField: '_id',
              as: 'receiverInfo',
            },
          },

          // 5. Unwind user info arrays
          {
            $unwind: {
              path: '$requesterInfo',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $unwind: {
              path: '$receiverInfo',
              preserveNullAndEmptyArrays: true,
            },
          },

          // 6. Project needed fields
          {
            $project: {
              _id: 1,
              requester_id: 1,
              receiver_id: 1,
              status: 1,
              createdAt: 1,
              updatedAt: 1,
              'requesterInfo._id': 1,
              'requesterInfo.clerkUserId': 1,
              'requesterInfo.firstName': 1,
              'requesterInfo.lastName': 1,
              'requesterInfo.email': 1,
              'requesterInfo.travelProfile': 1,
              'receiverInfo._id': 1,
              'receiverInfo.clerkUserId': 1,
              'receiverInfo.firstName': 1,
              'receiverInfo.lastName': 1,
              'receiverInfo.email': 1,
              'receiverInfo.travelProfile': 1,
            },
          },
        ])
        .exec();

      this.logger.debug(
        `[FriendshipRepositoryImpl.getFriendsWithUserInfo] Found ${docs.length} friends with user info`,
      );

      return docs.map((doc) => this.toFriendshipWithUserInfo(doc));
    } catch (error) {
      this.logger.error(
        `[FriendshipRepositoryImpl.getFriendsWithUserInfo] Failed to fetch friends with user info`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Retrieves all pending friend requests received by a specific user.
   */
  async getPendingReceivedRequests(userId: string): Promise<Friendship[]> {
    this.logger.debug(
      `[FriendshipRepositoryImpl.getPendingReceivedRequests] Fetching pending requests for user ${userId}`,
    );

    try {
      const docs = await this.friendshipModel
        .find({
          receiver_id: new Types.ObjectId(userId),
          status: FriendshipStatus.PENDING,
        })
        .sort({ createdAt: -1 })
        .exec();

      this.logger.debug(
        `[FriendshipRepositoryImpl.getPendingReceivedRequests] Found ${docs.length} pending requests`,
      );

      return docs.map((doc) => this.toDomainEntity(doc));
    } catch (error) {
      this.logger.error(
        `[FriendshipRepositoryImpl.getPendingReceivedRequests] Failed to fetch pending requests`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Retrieves all pending friend requests received by a user with sender's info.
   */
  async getPendingReceivedRequestsWithUserInfo(
    userId: string,
  ): Promise<FriendshipWithUserInfo[]> {
    this.logger.debug(
      `[FriendshipRepositoryImpl.getPendingReceivedRequestsWithUserInfo] Fetching pending requests with user info for user ${userId}`,
    );

    try {
      const userObjectId = new Types.ObjectId(userId);

      const docs = await this.friendshipModel
        .aggregate([
          // 1. Match pending requests where user is receiver
          {
            $match: {
              receiver_id: userObjectId,
              status: FriendshipStatus.PENDING,
            },
          },

          // 2. Sort by most recent
          { $sort: { createdAt: -1 } },

          // 3. Lookup requester (sender) user info
          {
            $lookup: {
              from: 'users',
              localField: 'requester_id',
              foreignField: '_id',
              as: 'requesterInfo',
            },
          },

          // 4. Lookup receiver user info (current user)
          {
            $lookup: {
              from: 'users',
              localField: 'receiver_id',
              foreignField: '_id',
              as: 'receiverInfo',
            },
          },

          // 5. Unwind user info arrays
          {
            $unwind: {
              path: '$requesterInfo',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $unwind: {
              path: '$receiverInfo',
              preserveNullAndEmptyArrays: true,
            },
          },

          // 6. Project needed fields
          {
            $project: {
              _id: 1,
              requester_id: 1,
              receiver_id: 1,
              status: 1,
              createdAt: 1,
              updatedAt: 1,
              'requesterInfo._id': 1,
              'requesterInfo.clerkUserId': 1,
              'requesterInfo.firstName': 1,
              'requesterInfo.lastName': 1,
              'requesterInfo.email': 1,
              'requesterInfo.travelProfile': 1,
              'receiverInfo._id': 1,
              'receiverInfo.clerkUserId': 1,
              'receiverInfo.firstName': 1,
              'receiverInfo.lastName': 1,
              'receiverInfo.email': 1,
              'receiverInfo.travelProfile': 1,
            },
          },
        ])
        .exec();

      this.logger.debug(
        `[FriendshipRepositoryImpl.getPendingReceivedRequestsWithUserInfo] Found ${docs.length} pending requests with user info`,
      );

      return docs.map((doc) => this.toFriendshipWithUserInfo(doc));
    } catch (error) {
      this.logger.error(
        `[FriendshipRepositoryImpl.getPendingReceivedRequestsWithUserInfo] Failed to fetch pending requests with user info`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Retrieves all pending friend requests sent by a specific user.
   */
  async getPendingSentRequests(userId: string): Promise<Friendship[]> {
    this.logger.debug(
      `[FriendshipRepositoryImpl.getPendingSentRequests] Fetching sent pending requests for user ${userId}`,
    );

    try {
      const docs = await this.friendshipModel
        .find({
          requester_id: new Types.ObjectId(userId),
          status: FriendshipStatus.PENDING,
        })
        .sort({ createdAt: -1 })
        .exec();

      this.logger.debug(
        `[FriendshipRepositoryImpl.getPendingSentRequests] Found ${docs.length} sent pending requests`,
      );

      return docs.map((doc) => this.toDomainEntity(doc));
    } catch (error) {
      this.logger.error(
        `[FriendshipRepositoryImpl.getPendingSentRequests] Failed to fetch sent pending requests`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Retrieves all pending friend requests sent by a user with receiver's info.
   */
  async getPendingSentRequestsWithUserInfo(
    userId: string,
  ): Promise<FriendshipWithUserInfo[]> {
    this.logger.debug(
      `[FriendshipRepositoryImpl.getPendingSentRequestsWithUserInfo] Fetching sent pending requests with user info for user ${userId}`,
    );

    try {
      const userObjectId = new Types.ObjectId(userId);

      const docs = await this.friendshipModel
        .aggregate([
          // 1. Match pending requests where user is requester
          {
            $match: {
              requester_id: userObjectId,
              status: FriendshipStatus.PENDING,
            },
          },

          // 2. Sort by most recent
          { $sort: { createdAt: -1 } },

          // 3. Lookup requester user info (current user)
          {
            $lookup: {
              from: 'users',
              localField: 'requester_id',
              foreignField: '_id',
              as: 'requesterInfo',
            },
          },

          // 4. Lookup receiver user info
          {
            $lookup: {
              from: 'users',
              localField: 'receiver_id',
              foreignField: '_id',
              as: 'receiverInfo',
            },
          },

          // 5. Unwind user info arrays
          {
            $unwind: {
              path: '$requesterInfo',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $unwind: {
              path: '$receiverInfo',
              preserveNullAndEmptyArrays: true,
            },
          },

          // 6. Project needed fields
          {
            $project: {
              _id: 1,
              requester_id: 1,
              receiver_id: 1,
              status: 1,
              createdAt: 1,
              updatedAt: 1,
              'requesterInfo._id': 1,
              'requesterInfo.clerkUserId': 1,
              'requesterInfo.firstName': 1,
              'requesterInfo.lastName': 1,
              'requesterInfo.email': 1,
              'requesterInfo.travelProfile': 1,
              'receiverInfo._id': 1,
              'receiverInfo.clerkUserId': 1,
              'receiverInfo.firstName': 1,
              'receiverInfo.lastName': 1,
              'receiverInfo.email': 1,
              'receiverInfo.travelProfile': 1,
            },
          },
        ])
        .exec();

      this.logger.debug(
        `[FriendshipRepositoryImpl.getPendingSentRequestsWithUserInfo] Found ${docs.length} sent pending requests with user info`,
      );

      return docs.map((doc) => this.toFriendshipWithUserInfo(doc));
    } catch (error) {
      this.logger.error(
        `[FriendshipRepositoryImpl.getPendingSentRequestsWithUserInfo] Failed to fetch sent pending requests with user info`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Checks the friendship status between two users.
   */
  async checkFriendshipStatus(
    userId1: string,
    userId2: string,
  ): Promise<FriendshipStatus | null> {
    this.logger.debug(
      `[FriendshipRepositoryImpl.checkFriendshipStatus] Checking friendship status between ${userId1} and ${userId2}`,
    );

    try {
      const friendship = await this.findByUsers(userId1, userId2);
      return friendship ? friendship.status : null;
    } catch (error) {
      this.logger.error(
        `[FriendshipRepositoryImpl.checkFriendshipStatus] Failed to check friendship status`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Checks if two users are friends (have an accepted friendship).
   */
  async areFriends(userId1: string, userId2: string): Promise<boolean> {
    this.logger.debug(
      `[FriendshipRepositoryImpl.areFriends] Checking if users are friends: ${userId1} and ${userId2}`,
    );

    try {
      const status = await this.checkFriendshipStatus(userId1, userId2);
      return status === FriendshipStatus.ACCEPTED;
    } catch (error) {
      this.logger.error(
        `[FriendshipRepositoryImpl.areFriends] Failed to check friend status`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Gets the count of accepted friends for a user.
   */
  async getFriendsCount(userId: string): Promise<number> {
    this.logger.debug(
      `[FriendshipRepositoryImpl.getFriendsCount] Counting friends for user ${userId}`,
    );

    try {
      const userObjectId = new Types.ObjectId(userId);

      const count = await this.friendshipModel.countDocuments({
        $or: [{ requester_id: userObjectId }, { receiver_id: userObjectId }],
        status: FriendshipStatus.ACCEPTED,
      });

      this.logger.debug(
        `[FriendshipRepositoryImpl.getFriendsCount] User has ${count} friends`,
      );

      return count;
    } catch (error) {
      this.logger.error(
        `[FriendshipRepositoryImpl.getFriendsCount] Failed to count friends`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Gets the count of pending received requests for a user.
   */
  async getPendingReceivedRequestsCount(userId: string): Promise<number> {
    this.logger.debug(
      `[FriendshipRepositoryImpl.getPendingReceivedRequestsCount] Counting pending requests for user ${userId}`,
    );

    try {
      const count = await this.friendshipModel.countDocuments({
        receiver_id: new Types.ObjectId(userId),
        status: FriendshipStatus.PENDING,
      });

      this.logger.debug(
        `[FriendshipRepositoryImpl.getPendingReceivedRequestsCount] User has ${count} pending requests`,
      );

      return count;
    } catch (error) {
      this.logger.error(
        `[FriendshipRepositoryImpl.getPendingReceivedRequestsCount] Failed to count pending requests`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Converts a MongoDB document to a Friendship domain entity.
   */
  private toDomainEntity(doc: HasFriendshipDocument): Friendship {
    return new Friendship(
      doc._id.toString(),
      doc.requester_id.toString(),
      doc.receiver_id.toString(),
      doc.status as FriendshipStatus,
      doc.createdAt,
      doc.updatedAt,
    );
  }

  /**
   * Converts a MongoDB aggregation document to FriendshipWithUserInfo entity.
   */
  private toFriendshipWithUserInfo(doc: any): FriendshipWithUserInfo {
    const requesterInfo = doc.requesterInfo
      ? {
          _id: doc.requesterInfo._id.toString(),
          clerkUserId: doc.requesterInfo.clerkUserId,
          firstName: doc.requesterInfo.firstName,
          lastName: doc.requesterInfo.lastName,
          email: doc.requesterInfo.email,
          profilePicture: doc.requesterInfo.travelProfile?.profilePicture,
        }
      : undefined;

    const receiverInfo = doc.receiverInfo
      ? {
          _id: doc.receiverInfo._id.toString(),
          clerkUserId: doc.receiverInfo.clerkUserId,
          firstName: doc.receiverInfo.firstName,
          lastName: doc.receiverInfo.lastName,
          email: doc.receiverInfo.email,
          profilePicture: doc.receiverInfo.travelProfile?.profilePicture,
        }
      : undefined;

    return new FriendshipWithUserInfo(
      doc._id.toString(),
      doc.requester_id.toString(),
      doc.receiver_id.toString(),
      doc.status as FriendshipStatus,
      requesterInfo,
      receiverInfo,
      doc.createdAt,
      doc.updatedAt,
    );
  }
}

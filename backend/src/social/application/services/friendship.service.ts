// friendship.service.ts

import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Friendship, FriendshipWithUserInfo } from 'src/social/domain/entities/friendship.entity';
import { FriendshipRepository } from 'src/social/domain/repositories/friendship.repository';
import { FriendshipStatus } from 'src/social/domain/value-objects/friendship-status.vo';
import { FriendshipStatusResponseDto } from '../dtos/friendship-status.dto';

/**
 * Service class for managing friendship operations.
 * Provides business logic for friend requests, friendships, and related operations.
 * Follows DDD principles with domain logic in entities and coordination in service.
 */
@Injectable()
export class FriendshipService {
  private readonly logger = new Logger(FriendshipService.name);

  constructor(
    private readonly friendshipRepository: FriendshipRepository,
  ) {}

  /**
   * Sends a friend request from one user to another.
   * Business rules:
   * - Users cannot send friend requests to themselves
   * - Cannot send duplicate requests
   * - Cannot send request if friendship already exists
   *
   * @param requesterId - The ID of the user sending the request
   * @param receiverId - The ID of the user receiving the request
   * @returns Promise resolving to the created friendship entity
   * @throws BadRequestException if trying to friend yourself
   * @throws ConflictException if friendship already exists
   */
  async sendFriendRequest(
    requesterId: string,
    receiverId: string,
  ): Promise<Friendship> {
    this.logger.log(
      `[FriendshipService.sendFriendRequest] User ${requesterId} sending friend request to ${receiverId}`,
    );

    // Business Rule: Cannot send friend request to yourself
    if (requesterId === receiverId) {
      this.logger.warn(
        `[FriendshipService.sendFriendRequest] User attempted to friend themselves`,
      );
      throw new BadRequestException('Cannot send friend request to yourself');
    }

    // Check if friendship already exists (any status)
    const existingFriendship = await this.friendshipRepository.findByUsers(
      requesterId,
      receiverId,
    );

    if (existingFriendship) {
      const status = existingFriendship.status;
      
      if (status === FriendshipStatus.PENDING) {
        // Check who sent the pending request
        if (existingFriendship.isRequester(requesterId)) {
          throw new ConflictException(
            'You have already sent a friend request to this user',
          );
        } else {
          throw new ConflictException(
            'This user has already sent you a friend request. Please accept or reject it.',
          );
        }
      } else if (status === FriendshipStatus.ACCEPTED) {
        throw new ConflictException('You are already friends with this user');
      } else if (status === FriendshipStatus.REJECTED) {
        this.logger.warn(
          `[FriendshipService.sendFriendRequest] Attempting to send request after rejection`,
        );
        throw new ConflictException(
          'Cannot send friend request. Previous request was rejected.',
        );
      }
    }

    // Create new friendship with pending status
    const friendship = new Friendship(
      '', // ID will be assigned by database
      requesterId,
      receiverId,
      FriendshipStatus.PENDING,
    );

    const created = await this.friendshipRepository.create(friendship);

    this.logger.log(
      `[FriendshipService.sendFriendRequest] Friend request sent successfully: ${created.id}`,
    );

    return created;
  }

  /**
   * Accepts a pending friend request.
   * Business rules:
   * - Only the receiver can accept a request
   * - Request must be in pending status
   *
   * @param friendshipId - The ID of the friendship to accept
   * @param userId - The ID of the user accepting the request
   * @returns Promise resolving to the updated friendship entity
   * @throws NotFoundException if friendship doesn't exist
   * @throws ForbiddenException if user is not the receiver
   * @throws BadRequestException if request is not pending
   */
  async acceptFriendRequest(
    friendshipId: string,
    userId: string,
  ): Promise<Friendship> {
    this.logger.log(
      `[FriendshipService.acceptFriendRequest] User ${userId} accepting friendship ${friendshipId}`,
    );

    const friendship = await this.friendshipRepository.findById(friendshipId);

    if (!friendship) {
      throw new NotFoundException('Friend request not found');
    }

    // Business Rule: Only receiver can accept the request
    if (!friendship.canAccept(userId)) {
      if (!friendship.isReceiver(userId)) {
        throw new ForbiddenException(
          'You can only accept friend requests sent to you',
        );
      } else {
        throw new BadRequestException(
          'This friend request is not in pending status',
        );
      }
    }

    const updated = await this.friendshipRepository.updateStatus(
      friendshipId,
      FriendshipStatus.ACCEPTED,
    );

    this.logger.log(
      `[FriendshipService.acceptFriendRequest] Friend request accepted successfully`,
    );

    return updated;
  }

  /**
   * Rejects a pending friend request.
   * Business rules:
   * - Only the receiver can reject a request
   * - Request must be in pending status
   *
   * @param friendshipId - The ID of the friendship to reject
   * @param userId - The ID of the user rejecting the request
   * @returns Promise resolving to the updated friendship entity
   * @throws NotFoundException if friendship doesn't exist
   * @throws ForbiddenException if user is not the receiver
   * @throws BadRequestException if request is not pending
   */
  async rejectFriendRequest(
    friendshipId: string,
    userId: string,
  ): Promise<Friendship> {
    this.logger.log(
      `[FriendshipService.rejectFriendRequest] User ${userId} rejecting friendship ${friendshipId}`,
    );

    const friendship = await this.friendshipRepository.findById(friendshipId);

    if (!friendship) {
      throw new NotFoundException('Friend request not found');
    }

    // Business Rule: Only receiver can reject the request
    if (!friendship.canReject(userId)) {
      if (!friendship.isReceiver(userId)) {
        throw new ForbiddenException(
          'You can only reject friend requests sent to you',
        );
      } else {
        throw new BadRequestException(
          'This friend request is not in pending status',
        );
      }
    }

    const updated = await this.friendshipRepository.updateStatus(
      friendshipId,
      FriendshipStatus.REJECTED,
    );

    this.logger.log(
      `[FriendshipService.rejectFriendRequest] Friend request rejected successfully`,
    );

    return updated;
  }

  /**
   * Removes a friendship or cancels a pending request.
   * Business rules:
   * - Either party can remove an accepted friendship
   * - Requester can cancel a pending request
   * - Receiver can remove a rejected request
   *
   * @param friendshipId - The ID of the friendship to remove
   * @param userId - The ID of the user removing the friendship
   * @returns Promise resolving when the deletion completes
   * @throws NotFoundException if friendship doesn't exist
   * @throws ForbiddenException if user is not authorized to remove
   */
  async removeFriendship(
    friendshipId: string,
    userId: string,
  ): Promise<void> {
    this.logger.log(
      `[FriendshipService.removeFriendship] User ${userId} removing friendship ${friendshipId}`,
    );

    const friendship = await this.friendshipRepository.findById(friendshipId);

    if (!friendship) {
      throw new NotFoundException('Friendship not found');
    }

    // Business Rule: Only users involved in the friendship can remove it
    if (!friendship.canRemove(userId)) {
      throw new ForbiddenException(
        'You are not authorized to remove this friendship',
      );
    }

    await this.friendshipRepository.delete(friendshipId);

    this.logger.log(
      `[FriendshipService.removeFriendship] Friendship removed successfully`,
    );
  }

  /**
   * Retrieves all friends for a user (accepted friendships).
   *
   * @param userId - The ID of the user
   * @returns Promise resolving to an array of friendship entities
   */
  async getFriends(userId: string): Promise<Friendship[]> {
    this.logger.log(
      `[FriendshipService.getFriends] Fetching friends for user ${userId}`,
    );

    const friends = await this.friendshipRepository.getFriends(userId);

    this.logger.log(
      `[FriendshipService.getFriends] Found ${friends.length} friends`,
    );

    return friends;
  }

  /**
   * Retrieves all friends with user information.
   *
   * @param userId - The ID of the user
   * @returns Promise resolving to an array of friendships with user info
   */
  async getFriendsWithUserInfo(
    userId: string,
  ): Promise<FriendshipWithUserInfo[]> {
    this.logger.log(
      `[FriendshipService.getFriendsWithUserInfo] Fetching friends with user info for user ${userId}`,
    );

    const friendships =
      await this.friendshipRepository.getFriendsWithUserInfo(userId);

    this.logger.log(
      `[FriendshipService.getFriendsWithUserInfo] Found ${friendships.length} friends with user info`,
    );

    return friendships;
  }

  /**
   * Retrieves all pending friend requests received by a user.
   *
   * @param userId - The ID of the user
   * @returns Promise resolving to an array of pending friendship entities
   */
  async getPendingReceivedRequests(userId: string): Promise<Friendship[]> {
    this.logger.log(
      `[FriendshipService.getPendingReceivedRequests] Fetching pending requests for user ${userId}`,
    );

    const requests =
      await this.friendshipRepository.getPendingReceivedRequests(userId);

    this.logger.log(
      `[FriendshipService.getPendingReceivedRequests] Found ${requests.length} pending requests`,
    );

    return requests;
  }

  /**
   * Retrieves all pending friend requests received by a user with sender's info.
   *
   * @param userId - The ID of the user
   * @returns Promise resolving to an array of friendships with user info
   */
  async getPendingReceivedRequestsWithUserInfo(
    userId: string,
  ): Promise<FriendshipWithUserInfo[]> {
    this.logger.log(
      `[FriendshipService.getPendingReceivedRequestsWithUserInfo] Fetching pending requests with user info for user ${userId}`,
    );

    const requests =
      await this.friendshipRepository.getPendingReceivedRequestsWithUserInfo(
        userId,
      );

    this.logger.log(
      `[FriendshipService.getPendingReceivedRequestsWithUserInfo] Found ${requests.length} pending requests with user info`,
    );

    return requests;
  }

  /**
   * Retrieves all pending friend requests sent by a user.
   *
   * @param userId - The ID of the user
   * @returns Promise resolving to an array of pending friendship entities
   */
  async getPendingSentRequests(userId: string): Promise<Friendship[]> {
    this.logger.log(
      `[FriendshipService.getPendingSentRequests] Fetching sent pending requests for user ${userId}`,
    );

    const requests =
      await this.friendshipRepository.getPendingSentRequests(userId);

    this.logger.log(
      `[FriendshipService.getPendingSentRequests] Found ${requests.length} sent pending requests`,
    );

    return requests;
  }

  /**
   * Retrieves all pending friend requests sent by a user with receiver's info.
   *
   * @param userId - The ID of the user
   * @returns Promise resolving to an array of friendships with user info
   */
  async getPendingSentRequestsWithUserInfo(
    userId: string,
  ): Promise<FriendshipWithUserInfo[]> {
    this.logger.log(
      `[FriendshipService.getPendingSentRequestsWithUserInfo] Fetching sent pending requests with user info for user ${userId}`,
    );

    const requests =
      await this.friendshipRepository.getPendingSentRequestsWithUserInfo(
        userId,
      );

    this.logger.log(
      `[FriendshipService.getPendingSentRequestsWithUserInfo] Found ${requests.length} sent pending requests with user info`,
    );

    return requests;
  }

  /**
   * Checks the friendship status between the current user and another user.
   * Provides rich information for UI state management.
   *
   * @param currentUserId - The ID of the current user
   * @param otherUserId - The ID of the other user
   * @returns Promise resolving to friendship status response DTO
   */
  async getFriendshipStatus(
    currentUserId: string,
    otherUserId: string,
  ): Promise<FriendshipStatusResponseDto> {
    this.logger.log(
      `[FriendshipService.getFriendshipStatus] Checking friendship status between ${currentUserId} and ${otherUserId}`,
    );

    // Cannot check status with yourself
    if (currentUserId === otherUserId) {
      return {
        status: null,
        isSender: false,
        isReceiver: false,
      };
    }

    const friendship = await this.friendshipRepository.findByUsers(
      currentUserId,
      otherUserId,
    );

    if (!friendship) {
      this.logger.debug(
        `[FriendshipService.getFriendshipStatus] No friendship found`,
      );
      return {
        status: null,
      };
    }

    const response: FriendshipStatusResponseDto = {
      status: friendship.status as 'pending' | 'accepted' | 'rejected',
      friendshipId: friendship.id,
    };

    // Add sender/receiver info for pending requests
    if (friendship.status === FriendshipStatus.PENDING) {
      response.isSender = friendship.isRequester(currentUserId);
      response.isReceiver = friendship.isReceiver(currentUserId);
    }

    this.logger.debug(
      `[FriendshipService.getFriendshipStatus] Friendship status: ${response.status}`,
    );

    return response;
  }

  /**
   * Checks if two users are friends (simple boolean check).
   *
   * @param userId1 - First user's ID
   * @param userId2 - Second user's ID
   * @returns Promise resolving to boolean indicating friendship status
   */
  async areFriends(userId1: string, userId2: string): Promise<boolean> {
    this.logger.debug(
      `[FriendshipService.areFriends] Checking if users are friends: ${userId1} and ${userId2}`,
    );

    return await this.friendshipRepository.areFriends(userId1, userId2);
  }

  /**
   * Gets the count of friends for a user.
   *
   * @param userId - The ID of the user
   * @returns Promise resolving to the count of friends
   */
  async getFriendsCount(userId: string): Promise<number> {
    this.logger.debug(
      `[FriendshipService.getFriendsCount] Counting friends for user ${userId}`,
    );

    return await this.friendshipRepository.getFriendsCount(userId);
  }

  /**
   * Gets the count of pending received requests for a user.
   * Useful for notification badges.
   *
   * @param userId - The ID of the user
   * @returns Promise resolving to the count of pending requests
   */
  async getPendingReceivedRequestsCount(userId: string): Promise<number> {
    this.logger.debug(
      `[FriendshipService.getPendingReceivedRequestsCount] Counting pending requests for user ${userId}`,
    );

    return await this.friendshipRepository.getPendingReceivedRequestsCount(
      userId,
    );
  }
}

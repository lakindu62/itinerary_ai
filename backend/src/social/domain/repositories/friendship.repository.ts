// friendship.repository.ts

import { ClientSession } from 'mongoose';
import {
  Friendship,
  FriendshipWithUserInfo,
} from '../entities/friendship.entity';
import { FriendshipStatus } from '../value-objects/friendship-status.vo';

/**
 * Abstract repository interface for managing Friendship entities.
 * Provides methods for CRUD operations, queries, and transaction management.
 * Follows DDD repository pattern - defines contract for infrastructure layer.
 */
export abstract class FriendshipRepository {
  /**
   * Creates a new friendship record in the database.
   * Used when a user sends a friend request.
   *
   * @param friendship - The friendship entity to create
   * @param session - Optional MongoDB session for transaction support
   * @returns Promise resolving to the created friendship entity
   * @throws Error if the creation operation fails
   */
  abstract create(
    friendship: Friendship,
    session?: ClientSession,
  ): Promise<Friendship>;

  /**
   * Finds a friendship by its unique ID.
   *
   * @param friendshipId - The unique identifier of the friendship
   * @param session - Optional MongoDB session for transaction support
   * @returns Promise resolving to the friendship entity or null if not found
   */
  abstract findById(
    friendshipId: string,
    session?: ClientSession,
  ): Promise<Friendship | null>;

  /**
   * Finds a friendship relationship between two specific users.
   * Checks both directions (A->B and B->A) since friendship can be initiated by either user.
   *
   * @param userId1 - First user's ID
   * @param userId2 - Second user's ID
   * @returns Promise resolving to the friendship entity or null if not found
   */
  abstract findByUsers(
    userId1: string,
    userId2: string,
  ): Promise<Friendship | null>;

  /**
   * Finds a pending friendship request where the specified user is the receiver.
   * Used to verify if the user can accept/reject a specific request.
   *
   * @param requesterId - ID of the user who sent the request
   * @param receiverId - ID of the user who received the request
   * @returns Promise resolving to the friendship entity or null if not found
   */
  abstract findPendingRequest(
    requesterId: string,
    receiverId: string,
  ): Promise<Friendship | null>;

  /**
   * Updates the status of an existing friendship.
   * Used when accepting or rejecting a friend request.
   *
   * @param friendshipId - The unique identifier of the friendship
   * @param status - The new status to set
   * @param session - Optional MongoDB session for transaction support
   * @returns Promise resolving to the updated friendship entity
   * @throws Error if the friendship is not found or update fails
   */
  abstract updateStatus(
    friendshipId: string,
    status: FriendshipStatus,
    session?: ClientSession,
  ): Promise<Friendship>;

  /**
   * Deletes a friendship record.
   * Used when removing a friend or cancelling a pending request.
   *
   * @param friendshipId - The unique identifier of the friendship
   * @param session - Optional MongoDB session for transaction support
   * @returns Promise resolving when the deletion completes
   * @throws Error if the friendship is not found or deletion fails
   */
  abstract delete(friendshipId: string, session?: ClientSession): Promise<void>;

  /**
   * Retrieves all accepted friendships for a specific user.
   * Returns friendships where the user is either requester or receiver.
   *
   * @param userId - The user's ID
   * @returns Promise resolving to an array of friendship entities
   */
  abstract getFriends(userId: string): Promise<Friendship[]>;

  /**
   * Retrieves all accepted friendships with user information.
   * Includes profile details of the friend (the other user in the relationship).
   *
   * @param userId - The current user's ID
   * @returns Promise resolving to an array of friendships with user info
   */
  abstract getFriendsWithUserInfo(
    userId: string,
  ): Promise<FriendshipWithUserInfo[]>;

  /**
   * Retrieves all pending friend requests received by a specific user.
   * Only returns requests where the user is the receiver and status is pending.
   *
   * @param userId - The user's ID (as receiver)
   * @returns Promise resolving to an array of friendship entities
   */
  abstract getPendingReceivedRequests(userId: string): Promise<Friendship[]>;

  /**
   * Retrieves all pending friend requests received by a user with sender's info.
   * Includes profile details of users who sent friend requests.
   *
   * @param userId - The user's ID (as receiver)
   * @returns Promise resolving to an array of friendships with user info
   */
  abstract getPendingReceivedRequestsWithUserInfo(
    userId: string,
  ): Promise<FriendshipWithUserInfo[]>;

  /**
   * Retrieves all pending friend requests sent by a specific user.
   * Only returns requests where the user is the requester and status is pending.
   *
   * @param userId - The user's ID (as requester)
   * @returns Promise resolving to an array of friendship entities
   */
  abstract getPendingSentRequests(userId: string): Promise<Friendship[]>;

  /**
   * Retrieves all pending friend requests sent by a user with receiver's info.
   * Includes profile details of users who received friend requests.
   *
   * @param userId - The user's ID (as requester)
   * @returns Promise resolving to an array of friendships with user info
   */
  abstract getPendingSentRequestsWithUserInfo(
    userId: string,
  ): Promise<FriendshipWithUserInfo[]>;

  /**
   * Checks the friendship status between two users.
   * Returns the relationship status or null if no relationship exists.
   *
   * @param userId1 - First user's ID
   * @param userId2 - Second user's ID
   * @returns Promise resolving to friendship status or null
   */
  abstract checkFriendshipStatus(
    userId1: string,
    userId2: string,
  ): Promise<FriendshipStatus | null>;

  /**
   * Checks if two users are friends (have an accepted friendship).
   *
   * @param userId1 - First user's ID
   * @param userId2 - Second user's ID
   * @returns Promise resolving to boolean indicating friendship status
   */
  abstract areFriends(userId1: string, userId2: string): Promise<boolean>;

  /**
   * Gets the count of accepted friends for a user.
   * Used for displaying friend counts in UI.
   *
   * @param userId - The user's ID
   * @returns Promise resolving to the count of friends
   */
  abstract getFriendsCount(userId: string): Promise<number>;

  /**
   * Gets the count of pending received requests for a user.
   * Used for notification badges.
   *
   * @param userId - The user's ID
   * @returns Promise resolving to the count of pending requests
   */
  abstract getPendingReceivedRequestsCount(userId: string): Promise<number>;

  // TODO: IMPLEMENT_LATER - Friend Suggestions Feature
  // This feature will suggest friends based on mutual friends and other criteria
  /**
   * Finds suggested friends for a user.
   * Returns users who are not already friends and have mutual friends.
   *
   * @param userId - The user's ID
   * @param limit - Maximum number of suggestions to return (default: 10)
   * @returns Promise resolving to an array of user IDs
   */
  // abstract findSuggestedFriends(
  //   userId: string,
  //   limit?: number,
  // ): Promise<string[]>;
}

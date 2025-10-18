// backend/src/social/application/dtos/friendship-response.dto.ts

import {
  FriendshipWithUserInfo,
  FriendshipUserInfo,
} from '../../domain/entities/friendship.entity';
import { FriendshipStatus } from '../../domain/value-objects/friendship-status.vo';

/**
 * Response DTO for friendship endpoints that includes the "other user" information.
 * This DTO transforms FriendshipWithUserInfo (which has requesterInfo and receiverInfo)
 * into a format where the frontend gets the "otherUser" directly.
 */
export class FriendshipWithOtherUserDto {
  id: string;
  requesterId: string;
  receiverId: string;
  status: FriendshipStatus;
  otherUser?: FriendshipUserInfo;
  createdAt?: Date;
  updatedAt?: Date;

  /**
   * Factory method to create DTO from domain entity.
   * Automatically determines which user is the "other user" based on current user ID.
   *
   * @param friendship - The friendship entity with user info
   * @param currentUserId - The ID of the current authenticated user
   * @returns Transformed DTO with otherUser field
   */
  static fromEntity(
    friendship: FriendshipWithUserInfo,
    currentUserId: string,
  ): FriendshipWithOtherUserDto {
    return {
      id: friendship.id,
      requesterId: friendship.requesterId,
      receiverId: friendship.receiverId,
      status: friendship.status,
      otherUser: friendship.getOtherUserInfo(currentUserId),
      createdAt: friendship.createdAt,
      updatedAt: friendship.updatedAt,
    };
  }

  /**
   * Factory method to transform multiple friendship entities.
   *
   * @param friendships - Array of friendship entities
   * @param currentUserId - The ID of the current authenticated user
   * @returns Array of transformed DTOs
   */
  static fromEntities(
    friendships: FriendshipWithUserInfo[],
    currentUserId: string,
  ): FriendshipWithOtherUserDto[] {
    return friendships.map((friendship) =>
      FriendshipWithOtherUserDto.fromEntity(friendship, currentUserId),
    );
  }
}

// friendship-status.dto.ts

/**
 * DTO for checking friendship status between users
 * Used to query the relationship status between two users
 */
export class FriendshipStatusDto {
  /**
   * The ID of the other user to check friendship status with
   */
  userId: string;
}

/**
 * Response DTO for friendship status queries
 * Contains the friendship status and additional metadata
 */
export class FriendshipStatusResponseDto {
  /**
   * The status of the friendship
   * null - No friendship exists
   * 'pending' - Friend request sent (need to check who sent it)
   * 'accepted' - Users are friends
   * 'rejected' - Friend request was rejected
   */
  status: 'pending' | 'accepted' | 'rejected' | null;

  /**
   * If status is 'pending', indicates whether the current user sent the request
   */
  isSender?: boolean;

  /**
   * If status is 'pending', indicates whether the current user received the request
   */
  isReceiver?: boolean;

  /**
   * The ID of the friendship record (if exists)
   */
  friendshipId?: string;
}

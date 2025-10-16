// respond-friend-request.dto.ts

/**
 * DTO for responding to a friend request (accept or reject)
 * Used when a user wants to accept or reject a pending friend request
 */
export class RespondFriendRequestDto {
  /**
   * The action to take on the friend request
   * 'accept' - Accept the friend request
   * 'reject' - Reject the friend request
   */
  action: 'accept' | 'reject';
}

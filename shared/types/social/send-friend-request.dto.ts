// send-friend-request.dto.ts

/**
 * DTO for sending a friend request
 * Used when a user wants to send a friend request to another user
 */
export class SendFriendRequestDto {
  /**
   * The ID of the user receiving the friend request
   * This will be extracted from the request body
   */
  receiverId: string;
}

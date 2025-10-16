// frontend/src/features/social/types/friendship.types.ts

/**
 * Friendship status enum
 */
export type FriendshipStatus = 'pending' | 'accepted' | 'rejected';

/**
 * User info that comes with friendship data
 */
export type FriendshipUserInfo = {
  _id: string;
  clerkUserId: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
};

/**
 * Basic friendship entity
 */
export type Friendship = {
  id: string;
  requesterId: string;
  receiverId: string;
  status: FriendshipStatus;
  createdAt?: string;
  updatedAt?: string;
};

/**
 * Friendship with populated user information
 * Used for displaying friend lists and requests
 */
export type FriendshipWithUserInfo = Friendship & {
  otherUser: FriendshipUserInfo;
};

/**
 * Response from friendship status check endpoint
 */
export type FriendshipStatusResponse = {
  status: FriendshipStatus | null;
  friendshipId?: string;
  isSender?: boolean;
  isReceiver?: boolean;
};

/**
 * API response wrapper for friendship operations
 */
export type FriendshipApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

/**
 * Response for list endpoints (friends, pending requests)
 */
export type FriendshipListResponse = {
  success: boolean;
  data: FriendshipWithUserInfo[];
  count: number;
};

/**
 * Response for count endpoints
 */
export type FriendshipCountResponse = {
  success: boolean;
  data: {
    count: number;
  };
};

/**
 * Request body for sending friend request
 */
export type SendFriendRequestBody = {
  receiverId: string;
};

/**
 * Request body for responding to friend request
 */
export type RespondFriendRequestBody = {
  action: 'accept' | 'reject';
};

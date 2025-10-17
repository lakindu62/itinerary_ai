// friendship.entity.ts

import { FriendshipStatus } from '../value-objects/friendship-status.vo';

/**
 * Friendship Domain Entity
 * Represents a friendship relationship between two users.
 * Follows DDD principles with clear business logic encapsulation.
 */
export class Friendship {
  constructor(
    public readonly id: string,
    public readonly requesterId: string,
    public readonly receiverId: string,
    public readonly status: FriendshipStatus,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  /**
   * Checks if the friendship is in pending status
   */
  isPending(): boolean {
    return this.status === FriendshipStatus.PENDING;
  }

  /**
   * Checks if the friendship is accepted (active friendship)
   */
  isAccepted(): boolean {
    return this.status === FriendshipStatus.ACCEPTED;
  }

  /**
   * Checks if the friendship request was rejected
   */
  isRejected(): boolean {
    return this.status === FriendshipStatus.REJECTED;
  }

  /**
   * Checks if the given user ID is the requester
   */
  isRequester(userId: string): boolean {
    return this.requesterId === userId;
  }

  /**
   * Checks if the given user ID is the receiver
   */
  isReceiver(userId: string): boolean {
    return this.receiverId === userId;
  }

  /**
   * Checks if the given user ID is part of this friendship
   */
  involves(userId: string): boolean {
    return this.isRequester(userId) || this.isReceiver(userId);
  }

  /**
   * Gets the other user's ID in the friendship
   */
  getOtherUserId(userId: string): string | null {
    if (this.isRequester(userId)) {
      return this.receiverId;
    }
    if (this.isReceiver(userId)) {
      return this.requesterId;
    }
    return null;
  }

  /**
   * Domain logic: Can this user accept the friendship?
   * Only the receiver can accept a pending request
   */
  canAccept(userId: string): boolean {
    return this.isPending() && this.isReceiver(userId);
  }

  /**
   * Domain logic: Can this user reject the friendship?
   * Only the receiver can reject a pending request
   */
  canReject(userId: string): boolean {
    return this.isPending() && this.isReceiver(userId);
  }

  /**
   * Domain logic: Can this user cancel/remove the friendship?
   * Either party can remove an accepted friendship or cancel a pending request
   */
  canRemove(userId: string): boolean {
    return this.involves(userId);
  }
}

/**
 * Extended Friendship entity with user information
 * Used for display purposes in the application layer
 */
export interface FriendshipUserInfo {
  _id: string;
  clerkUserId: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
}

export class FriendshipWithUserInfo extends Friendship {
  constructor(
    id: string,
    requesterId: string,
    receiverId: string,
    status: FriendshipStatus,
    public readonly requesterInfo?: FriendshipUserInfo,
    public readonly receiverInfo?: FriendshipUserInfo,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, requesterId, receiverId, status, createdAt, updatedAt);
  }

  /**
   * Gets the user info for the other user in the friendship
   */
  getOtherUserInfo(userId: string): FriendshipUserInfo | undefined {
    if (this.isRequester(userId)) {
      return this.receiverInfo;
    }
    if (this.isReceiver(userId)) {
      return this.requesterInfo;
    }
    return undefined;
  }
}

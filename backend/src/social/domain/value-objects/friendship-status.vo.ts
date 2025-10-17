// friendship-status.vo.ts

/**
 * Value Object representing the status of a friendship request/relationship.
 * Follows DDD principles - immutable and self-validating.
 */
export enum FriendshipStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

/**
 * Type guard to check if a string is a valid FriendshipStatus
 */
export function isValidFriendshipStatus(
  status: string,
): status is FriendshipStatus {
  return Object.values(FriendshipStatus).includes(status as FriendshipStatus);
}

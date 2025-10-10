// src/components/skeletons/PostListSkeleton.tsx
import PostCardSkeleton from "./PostCardSkeleton";

interface PostListSkeletonProps {
  /**
   * Number of skeleton post cards to render
   * @default 3
   */
  count?: number;
}

/**
 * Skeleton component for the entire post list
 * Renders multiple PostCardSkeleton components to simulate loading feed
 * Used when the main posts list is loading
 */
const PostListSkeleton = ({ count = 3 }: PostListSkeletonProps) => (
  <div>
    {/* Render specified number of skeleton post cards */}
    {[...Array(count)].map((_, index) => (
      <PostCardSkeleton key={`post-skeleton-${index}`} />
    ))}
  </div>
);

export default PostListSkeleton;

// src/components/skeletons/PostCardSkeleton.tsx
import { Skeleton } from "@frontend/components/ui/skeleton";
import { Card, CardContent } from "@frontend/components/ui/card";

/**
 * Skeleton component for a single post card
 * Matches the exact structure and dimensions of the actual PostCard component
 * Used when individual posts are loading
 */
const PostCardSkeleton = () => (
  <Card className="mb-4">
    <CardContent className="p-4">
      {/* Header section with avatar, user info, and delete button */}
      <div className="flex space-x-3 mb-2">
        {/* Avatar skeleton - circular to match real avatar */}
        <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-1">
          {/* User name skeleton - realistic width */}
          <Skeleton className="h-4 w-32" />
          {/* Timestamp skeleton - smaller for timestamp */}
          <Skeleton className="h-3 w-24" />
        </div>
        {/* Delete button skeleton - square for icon button */}
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>

      {/* Post content skeleton - multiple lines with varying widths for natural look */}
      <div className="mb-3 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>

      {/* Media skeleton - rectangular placeholder for images/videos */}
      <div className="mb-3">
        <Skeleton className="w-full h-64 rounded-lg" />
        {/* Optional: Add skeleton indicators for carousel if multiple media items */}
        <div className="flex justify-center mt-2 space-x-2">
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-2 w-2 rounded-full" />
        </div>
      </div>

      {/* Action buttons skeleton (like and comment) */}
      <div className="flex items-center gap-3 mb-2">
        {/* Like button skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-6" />
        </div>
        {/* Comment button skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-6" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default PostCardSkeleton;

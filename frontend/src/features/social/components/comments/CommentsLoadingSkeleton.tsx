// src/components/skeletons/CommentsLoadingSkeleton.tsx
import { Skeleton } from "@frontend/components/ui/skeleton";

/**
 * Skeleton component for loading comments
 * Renders 3 comment placeholders that match the actual comment structure
 * Used when fetching comments for a specific post
 */
const CommentsLoadingSkeleton = () => (
  <div className="space-y-3">
    {/* Create 3 comment skeletons to match typical comment layout */}
    {[...Array(3)].map((_, index) => (
      <div key={index} className="flex items-start gap-2">
        {/* Avatar skeleton - circular to match actual avatar */}
        <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-1">
          {/* User name skeleton - shorter width for realistic appearance */}
          <Skeleton className="h-3 w-20" />
          {/* Timestamp skeleton - even shorter to match actual timestamps */}
          <Skeleton className="h-3 w-16" />
          {/* Comment content - multiple lines with varying widths for realism */}
          <div className="space-y-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default CommentsLoadingSkeleton;

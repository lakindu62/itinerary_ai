"use client";

import * as React from "react";
import { Card, CardContent } from "@frontend/components/ui/card";
import { Skeleton } from "@frontend/components/ui/skeleton";

interface BrowseUsersListSkeletonProps {
  layout?: "grid" | "row";
}

const BrowseUsersListSkeleton: React.FC<BrowseUsersListSkeletonProps> = ({
  layout = "grid",
}) => {
  // Row layout - compact list skeleton
  if (layout === "row") {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                {/* Avatar Skeleton */}
                <Skeleton className="w-10 h-10 rounded-full shrink-0" />

                {/* User Info Skeleton */}
                <div className="flex-1 min-w-0 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>

                {/* Button Skeleton */}
                <Skeleton className="h-8 w-8 shrink-0" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Grid layout - original card skeleton
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="h-full">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center space-y-3">
              {/* Avatar Skeleton */}
              <Skeleton className="w-20 h-20 rounded-full" />

              {/* Name Skeleton */}
              <Skeleton className="h-4 w-32" />

              {/* Bio Skeleton */}
              <div className="space-y-2 w-full">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-24 mx-auto" />
              </div>

              {/* Button Skeleton */}
              <Skeleton className="h-9 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BrowseUsersListSkeleton;

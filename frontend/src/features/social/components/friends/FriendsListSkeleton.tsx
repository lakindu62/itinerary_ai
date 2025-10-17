"use client";

import * as React from "react";
import { Card, CardContent } from "@frontend/components/ui/card";
import { Skeleton } from "@frontend/components/ui/skeleton";
import SpotlightWrapper from "@frontend/components/SpotLightWrapper";

interface FriendsListSkeletonProps {
  count?: number;
}

const FriendsListSkeleton: React.FC<FriendsListSkeletonProps> = ({
  count = 5,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <SpotlightWrapper
          key={index}
          enableVerticalFade={false}
          className="mb-2 rounded-lg"
        >
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                {/* Avatar Skeleton */}
                <Skeleton className="w-12 h-12 rounded-full shrink-0" />

                {/* User Info Skeleton */}
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>

                {/* Button Skeleton */}
                <Skeleton className="w-9 h-8 shrink-0" />
              </div>
            </CardContent>
          </Card>
        </SpotlightWrapper>
      ))}
    </>
  );
};

export default FriendsListSkeleton;

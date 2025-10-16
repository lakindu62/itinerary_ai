"use client";

import * as React from "react";
import { Card, CardContent } from "@frontend/components/ui/card";
import { Badge } from "@frontend/components/ui/badge";
import { ScrollArea } from "@frontend/components/ui/scroll-area";
import { UserPlus, Inbox } from "lucide-react";
import SpotlightWrapper from "@frontend/components/SpotLightWrapper";
import FriendRequestCard from "./FriendRequestCard";
import FriendRequestsListSkeleton from "./FriendRequestsListSkeleton";
import {
  useGetPendingReceivedRequestsQuery,
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
  useGetPendingRequestsCountQuery,
} from "../../lib/friendship.api";
import { FriendshipWithUserInfo } from "../../types/friendship.types";

interface FriendRequestsListProps {
  maxHeight?: string;
  showCount?: boolean;
}

const FriendRequestsList: React.FC<FriendRequestsListProps> = ({
  maxHeight = "400px",
  showCount = true,
}) => {
  // Track which request is being processed
  const [processingId, setProcessingId] = React.useState<string | null>(null);

  // Fetch pending received requests
  const {
    data: requests = [],
    isLoading,
    error,
  } = useGetPendingReceivedRequestsQuery();

  // Fetch pending requests count
  const { data: pendingCount = 0 } = useGetPendingRequestsCountQuery();

  // Accept and reject mutations
  const [acceptRequest, { isLoading: isAccepting }] =
    useAcceptFriendRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] =
    useRejectFriendRequestMutation();

  const handleAccept = async (friendshipId: string) => {
    setProcessingId(friendshipId);
    try {
      await acceptRequest(friendshipId).unwrap();
    } catch (error) {
      console.error("Failed to accept friend request:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (friendshipId: string) => {
    setProcessingId(friendshipId);
    try {
      await rejectRequest(friendshipId).unwrap();
    } catch (error) {
      console.error("Failed to reject friend request:", error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <SpotlightWrapper enableVerticalFade={false} className="rounded-xl">
      <Card>
        <CardContent className="p-4">
          {/* Header: Title + Count */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Friend Requests
            </h3>
            {showCount && (
              <Badge variant="secondary">
                {pendingCount}
              </Badge>
            )}
          </div>

          {/* Scrollable Requests List */}
          <ScrollArea style={{ height: maxHeight }}>
            {isLoading ? (
              <FriendRequestsListSkeleton count={3} />
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  Failed to load friend requests
                </p>
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-8">
                <Inbox className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  No pending friend requests
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  When someone sends you a friend request, it will appear here
                </p>
              </div>
            ) : (
              requests.map((request: FriendshipWithUserInfo) => (
                <FriendRequestCard
                  key={request.id}
                  request={request}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  isAccepting={processingId === request.id && isAccepting}
                  isRejecting={processingId === request.id && isRejecting}
                />
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </SpotlightWrapper>
  );
};

export default FriendRequestsList;

"use client";

import * as React from "react";
import { Card, CardContent } from "@frontend/components/ui/card";
import { Avatar, AvatarImage } from "@frontend/components/ui/avatar";
import { Button } from "@frontend/components/ui/button";
import { Badge } from "@frontend/components/ui/badge";
import { ScrollArea } from "@frontend/components/ui/scroll-area";
import { User as UserIcon, X, Send, Inbox } from "lucide-react";
import SpotlightWrapper from "@frontend/components/SpotLightWrapper";
import {
  useGetPendingSentRequestsQuery,
  useRemoveFriendshipMutation,
} from "../../lib/friendship.api";
import { FriendshipWithUserInfo } from "../../types/friendship.types";

interface SentRequestsListProps {
  maxHeight?: string;
  showCount?: boolean;
}

const SentRequestsList: React.FC<SentRequestsListProps> = ({
  maxHeight = "400px",
  showCount = true,
}) => {
  const [cancelingId, setCancelingId] = React.useState<string | null>(null);

  // Fetch pending sent requests
  const {
    data: requests = [],
    isLoading,
    error,
  } = useGetPendingSentRequestsQuery();

  // Remove friendship mutation (for canceling request)
  const [removeFriendship, { isLoading: isRemoving }] =
    useRemoveFriendshipMutation();

  const handleCancelRequest = async (friendshipId: string) => {
    setCancelingId(friendshipId);
    try {
      await removeFriendship(friendshipId).unwrap();
    } catch (error) {
      console.error("Failed to cancel friend request:", error);
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <SpotlightWrapper enableVerticalFade={false} className="rounded-xl">
      <Card>
        <CardContent className="p-4">
          {/* Header: Title + Count */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Send className="w-5 h-5" />
              Sent Requests
            </h3>
            {showCount && <Badge variant="secondary">{requests.length}</Badge>}
          </div>

          {/* Scrollable Requests List */}
          <ScrollArea style={{ height: maxHeight }}>
            {isLoading ? (
              // Loading skeleton
              <>
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="mb-2">
                    <Card>
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                            <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                          </div>
                          <div className="w-8 h-8 bg-muted animate-pulse rounded" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  Failed to load sent requests
                </p>
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-8">
                <Inbox className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  No pending sent requests
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Friend requests you send will appear here
                </p>
              </div>
            ) : (
              requests.map((request: FriendshipWithUserInfo) => {
                const userInfo = request.otherUser;
                const profilePic = userInfo?.profilePicture;
                const name = userInfo
                  ? `${userInfo.firstName} ${userInfo.lastName}`
                  : "Unknown User";
                const bio = "Travel enthusiast";

                return (
                  <SpotlightWrapper
                    key={request.id}
                    enableVerticalFade={false}
                    className="mb-2 rounded-lg"
                  >
                    <Card>
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <Avatar className="w-12 h-12 border-2">
                            {profilePic ? (
                              <AvatarImage src={profilePic} alt={name} />
                            ) : (
                              <UserIcon className="w-12 h-12 text-muted-foreground" />
                            )}
                          </Avatar>

                          {/* User Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold truncate">{name}</h4>
                            <p className="text-sm text-muted-foreground truncate">
                              {bio}
                            </p>
                          </div>

                          {/* Cancel Button */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancelRequest(request.id)}
                            disabled={cancelingId === request.id && isRemoving}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </SpotlightWrapper>
                );
              })
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </SpotlightWrapper>
  );
};

export default SentRequestsList;

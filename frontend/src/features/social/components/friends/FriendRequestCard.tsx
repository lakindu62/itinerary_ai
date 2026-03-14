"use client";

import * as React from "react";
import { Card, CardContent } from "@frontend/components/ui/card";
import { Avatar, AvatarImage } from "@frontend/components/ui/avatar";
import { Button } from "@frontend/components/ui/button";
import { User as UserIcon, Check, X } from "lucide-react";
import SpotlightWrapper from "@frontend/components/SpotLightWrapper";
import { FriendshipWithUserInfo } from "../../types/friendship.types";

interface FriendRequestCardProps {
  request: FriendshipWithUserInfo;
  onAccept: (friendshipId: string) => void;
  onReject: (friendshipId: string) => void;
  isAccepting?: boolean;
  isRejecting?: boolean;
  compact?: boolean;
}

const FriendRequestCard: React.FC<FriendRequestCardProps> = ({
  request,
  onAccept,
  onReject,
  isAccepting = false,
  isRejecting = false,
  compact = false,
}) => {
  const userInfo = request.otherUser;
  const profilePic = userInfo?.profilePicture;
  const name = userInfo
    ? `${userInfo.firstName} ${userInfo.lastName}`
    : "Unknown User";
  const bio = "Travel enthusiast"; // Placeholder until we have bio in FriendshipUserInfo

  const isProcessing = isAccepting || isRejecting;

  return (
    <SpotlightWrapper enableVerticalFade={false} className="mb-2 rounded-lg">
      <Card>
        <CardContent className={compact ? "p-2" : "p-3"}>
          <div className="flex items-center gap-3">
            {/* Avatar - smaller in compact mode */}
            <Avatar
              className={compact ? "w-10 h-10 border-2" : "w-12 h-12 border-2"}
            >
              {profilePic ? (
                <AvatarImage src={profilePic} alt={name} />
              ) : (
                <UserIcon
                  className={
                    compact
                      ? "w-10 h-10 text-muted-foreground"
                      : "w-12 h-12 text-muted-foreground"
                  }
                />
              )}
            </Avatar>

            {/* User Info - max-w to force truncation in compact mode */}
            <div
              className={
                compact ? "flex-1 min-w-0 max-w-[120px]" : "flex-1 min-w-0"
              }
            >
              <h4 className="font-medium text-sm truncate">{name}</h4>
              <p className="text-xs text-muted-foreground truncate">{bio}</p>
            </div>

            {/* Action Buttons - Compact for narrow space */}
            <div className="flex gap-1 shrink-0">
              <Button
                size="sm"
                onClick={() => onAccept(request.id)}
                disabled={isProcessing}
                className="h-7 w-7 p-0"
                aria-label="Accept friend request"
              >
                <Check className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onReject(request.id)}
                disabled={isProcessing}
                className="h-7 w-7 p-0"
                aria-label="Reject friend request"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </SpotlightWrapper>
  );
};

export default FriendRequestCard;

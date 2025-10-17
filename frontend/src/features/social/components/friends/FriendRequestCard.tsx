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
}

const FriendRequestCard: React.FC<FriendRequestCardProps> = ({
  request,
  onAccept,
  onReject,
  isAccepting = false,
  isRejecting = false,
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
              <p className="text-sm text-muted-foreground truncate">{bio}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 shrink-0">
              <Button
                size="sm"
                onClick={() => onAccept(request.id)}
                disabled={isProcessing}
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onReject(request.id)}
                disabled={isProcessing}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </SpotlightWrapper>
  );
};

export default FriendRequestCard;

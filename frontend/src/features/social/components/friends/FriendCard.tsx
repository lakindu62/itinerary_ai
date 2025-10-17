"use client";

import * as React from "react";
import { Card, CardContent } from "@frontend/components/ui/card";
import { Avatar, AvatarImage } from "@frontend/components/ui/avatar";
import { Button } from "@frontend/components/ui/button";
import { User as UserIcon, UserMinus } from "lucide-react";
import SpotlightWrapper from "@frontend/components/SpotLightWrapper";
import { FriendshipWithUserInfo } from "../../types/friendship.types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@frontend/components/ui/alert-dialog";

interface FriendCardProps {
  friend: FriendshipWithUserInfo;
  onRemove?: (friendshipId: string) => void;
  showRemoveButton?: boolean;
  isRemoving?: boolean;
}

const FriendCard: React.FC<FriendCardProps> = ({
  friend,
  onRemove,
  showRemoveButton = true,
  isRemoving = false,
}) => {
  const userInfo = friend.otherUser;
  const profilePic = userInfo?.profilePicture;
  const name = userInfo
    ? `${userInfo.firstName} ${userInfo.lastName}`
    : "Unknown User";
  const bio = "Travel enthusiast"; // Placeholder until we have bio in FriendshipUserInfo

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

            {/* Remove Button */}
            {showRemoveButton && onRemove && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={isRemoving}
                    className="shrink-0"
                  >
                    <UserMinus className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Friend</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove {name} from your friends
                      list? You can send them a friend request again later.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onRemove(friend.id)}
                      className="bg-destructive text-white hover:bg-destructive/90"
                    >
                      Remove Friend
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>
    </SpotlightWrapper>
  );
};

export default FriendCard;

"use client";

import * as React from "react";
import { Card, CardContent } from "@frontend/components/ui/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@frontend/components/ui/avatar";
import { User as UserIcon } from "lucide-react";
import SpotlightWrapper from "@frontend/components/SpotLightWrapper";
import { UserProfile } from "../../types/social.types";
import { FriendRequestButton } from "../friends";

interface UserCardProps {
  user: UserProfile;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const profilePic = user.travelProfile?.profilePicture;
  const name = `${user.firstName || "Unknown"} ${user.lastName || "User"}`;
  const initials = `${user.firstName?.[0] || "U"}${
    user.lastName?.[0] || "U"
  }`.toUpperCase();
  const bio = user.travelProfile?.bio || "No bio available";

  return (
    <SpotlightWrapper enableVerticalFade={false} className="h-full rounded-lg">
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="flex flex-col items-center text-center space-y-3">
            {/* Avatar */}
            <Avatar className="w-20 h-20 border-2">
              {profilePic ? (
                <AvatarImage src={profilePic} alt={name} />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {initials}
                </AvatarFallback>
              )}
            </Avatar>

            {/* User Info */}
            <div className="space-y-1 w-full">
              <h3 className="font-semibold text-base line-clamp-1">{name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">
                {bio}
              </p>
            </div>

            {/* Friend Request Button */}
            <div className="w-full pt-1">
              <FriendRequestButton
                userId={user.id || user._id}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </SpotlightWrapper>
  );
};

export default UserCard;

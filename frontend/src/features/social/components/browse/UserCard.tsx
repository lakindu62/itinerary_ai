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
  layout?: "grid" | "row";
}

const UserCard: React.FC<UserCardProps> = ({ user, layout = "grid" }) => {
  const profilePic = user.travelProfile?.profilePicture;
  const name = `${user.firstName || "Unknown"} ${user.lastName || "User"}`;
  const initials = `${user.firstName?.[0] || "U"}${
    user.lastName?.[0] || "U"
  }`.toUpperCase();
  const bio = user.travelProfile?.bio || "No bio available";

  // Row layout - compact horizontal display
  if (layout === "row") {
    return (
      <Card className="hover:bg-accent/50 transition-colors">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <Avatar className="w-10 h-10 border shrink-0">
              {profilePic ? (
                <AvatarImage src={profilePic} alt={name} />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {initials}
                </AvatarFallback>
              )}
            </Avatar>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{name}</h3>
              <p className="text-xs text-muted-foreground truncate">{bio}</p>
            </div>

            {/* Friend Request Button */}
            <div className="shrink-0">
              <FriendRequestButton
                userId={user.id || user._id}
                className="h-8 px-3 text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid layout - original card display
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

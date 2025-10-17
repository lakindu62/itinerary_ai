"use client";

import * as React from "react";
import { Card, CardContent } from "@frontend/components/ui/card";
import { Input } from "@frontend/components/ui/input";
import { Badge } from "@frontend/components/ui/badge";
import { ScrollArea } from "@frontend/components/ui/scroll-area";
import { Search, Users } from "lucide-react";
import SpotlightWrapper from "@frontend/components/SpotLightWrapper";
import FriendCard from "./FriendCard";
import FriendsListSkeleton from "./FriendsListSkeleton";
import {
  useGetFriendsQuery,
  useRemoveFriendshipMutation,
  useGetFriendsCountQuery,
} from "../../lib/friendship.api";
import { FriendshipWithUserInfo } from "../../types/friendship.types";

interface FriendsListProps {
  maxHeight?: string;
  showSearch?: boolean;
  showCount?: boolean;
  showRemoveButton?: boolean;
}

const FriendsList: React.FC<FriendsListProps> = ({
  maxHeight = "calc(100vh - 200px)",
  showSearch = true,
  showCount = true,
  showRemoveButton = true,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  // Fetch friends data (no userId needed - uses current user from JWT)
  const { data: friends = [], isLoading, error } = useGetFriendsQuery();

  // Fetch friends count
  const { data: friendsCount = 0 } = useGetFriendsCountQuery();

  // Remove friendship mutation
  const [removeFriendship, { isLoading: isRemoving }] =
    useRemoveFriendshipMutation();

  // Filter friends based on search query
  const filteredFriends = React.useMemo(() => {
    if (!searchQuery.trim()) return friends;

    const query = searchQuery.toLowerCase();
    return friends.filter((friend: FriendshipWithUserInfo) => {
      // Safety check: skip if otherUser is undefined
      if (!friend.otherUser) return false;

      const fullName =
        `${friend.otherUser.firstName} ${friend.otherUser.lastName}`.toLowerCase();
      return fullName.includes(query);
    });
  }, [friends, searchQuery]);

  const handleRemoveFriend = async (friendshipId: string) => {
    try {
      await removeFriendship(friendshipId).unwrap();
    } catch (error) {
      console.error("Failed to remove friend:", error);
    }
  };

  return (
    <SpotlightWrapper enableVerticalFade={false} className="rounded-xl">
      <Card>
        <CardContent className="p-4">
          {/* Header: Search + Count */}
          <div className="flex items-center justify-between gap-3 mb-4">
            {showSearch && (
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search friends..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            )}
            {showCount && (
              <Badge variant="secondary" className="shrink-0">
                <Users className="w-3 h-3 mr-1" />
                {friendsCount}
              </Badge>
            )}
          </div>

          {/* Scrollable Friends List */}
          <ScrollArea style={{ height: maxHeight }}>
            {isLoading ? (
              <FriendsListSkeleton count={5} />
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  Failed to load friends
                </p>
              </div>
            ) : filteredFriends.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? "No friends found matching your search"
                    : "No friends yet"}
                </p>
                {!searchQuery && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Start connecting with other travelers!
                  </p>
                )}
              </div>
            ) : (
              filteredFriends.map((friend: FriendshipWithUserInfo) => (
                <FriendCard
                  key={friend.id}
                  friend={friend}
                  onRemove={handleRemoveFriend}
                  showRemoveButton={showRemoveButton}
                  isRemoving={isRemoving}
                />
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </SpotlightWrapper>
  );
};

export default FriendsList;

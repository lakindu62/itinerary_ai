"use client";

import * as React from "react";
import { Card, CardContent } from "@frontend/components/ui/card";
import { Input } from "@frontend/components/ui/input";
import { Search, Users } from "lucide-react";
import SpotlightWrapper from "@frontend/components/SpotLightWrapper";
import { useGetAllUsersQuery } from "../../lib/social.api";
import { useGetCurrentUserProfileQuery } from "../../lib/social.api";
import UserCard from "./UserCard";
import BrowseUsersListSkeleton from "./BrowseUsersListSkeleton";

interface BrowseUsersListProps {
  maxHeight?: string;
  layout?: "grid" | "row";
  showCard?: boolean;
}

const BrowseUsersList: React.FC<BrowseUsersListProps> = ({
  maxHeight = "calc(100vh - 300px)",
  layout = "grid",
  showCard = false,
}) => {
  const { data: allUsers = [], isLoading, error } = useGetAllUsersQuery();
  const { data: currentUser } = useGetCurrentUserProfileQuery();
  const [searchQuery, setSearchQuery] = React.useState("");

  // Filter out current user and apply search
  const filteredUsers = React.useMemo(() => {
    let users = allUsers;

    // Remove current user from the list
    if (currentUser) {
      const currentUserId = currentUser.id || currentUser._id;
      users = users.filter((user) => {
        const userId = user.id || user._id;
        return userId !== currentUserId;
      });
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      users = users.filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const email = user.email.toLowerCase();
        return fullName.includes(query) || email.includes(query);
      });
    }

    return users;
  }, [allUsers, currentUser, searchQuery]);

  if (error) {
    const errorContent = (
      <CardContent className="p-6">
        <p className="text-center text-muted-foreground">
          Failed to load users. Please try again.
        </p>
      </CardContent>
    );

    return showCard ? <Card>{errorContent}</Card> : errorContent;
  }

  const content = (
    <div className={showCard ? "p-4 h-full flex flex-col" : "space-y-4"}>
      {/* Search Bar */}
      <div className="relative shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* User Count */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
        <Users className="h-4 w-4" />
        <span>
          {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"}{" "}
          found
        </span>
      </div>

      {/* Users List/Grid - fills remaining space when in card */}
      {isLoading ? (
        <BrowseUsersListSkeleton />
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-8">
          <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground">
            {searchQuery
              ? "No users found matching your search"
              : "No users available"}
          </p>
        </div>
      ) : (
        <div
          className={
            showCard
              ? layout === "row"
                ? "flex-1 overflow-y-auto space-y-2 pr-2"
                : "flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pr-2"
              : layout === "row"
              ? "space-y-2 overflow-y-auto pr-2"
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2"
          }
          style={!showCard ? { maxHeight } : undefined}
        >
          {filteredUsers.map((user) => (
            <UserCard key={user.id || user._id} user={user} layout={layout} />
          ))}
        </div>
      )}
    </div>
  );

  return showCard ? (
    <SpotlightWrapper enableVerticalFade={false} className="rounded-xl h-full flex flex-col">
      <Card className="h-full flex flex-col">{content}</Card>
    </SpotlightWrapper>
  ) : (
    content
  );
};

export default BrowseUsersList;

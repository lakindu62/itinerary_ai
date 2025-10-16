"use client";

import * as React from "react";
import { Card, CardContent } from "@frontend/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@frontend/components/ui/tabs";
import { Badge } from "@frontend/components/ui/badge";
import SpotlightWrapper from "@frontend/components/SpotLightWrapper";
import {
  FriendsList,
  FriendRequestsList,
  SentRequestsList,
} from "@frontend/features/social/components/friends";
import {
  useGetFriendsCountQuery,
  useGetPendingRequestsCountQuery,
  useGetPendingSentRequestsQuery,
} from "@frontend/features/social/lib/friendship.api";

const FriendsPage: React.FC = () => {
  // Fetch counts for badges
  const { data: friendsCount = 0 } = useGetFriendsCountQuery();
  const { data: receivedCount = 0 } = useGetPendingRequestsCountQuery();
  const { data: sentRequests = [] } = useGetPendingSentRequestsQuery();
  const sentCount = sentRequests.length;

  return (
    <div className="container max-w-7xl mx-auto py-6 px-4">
      <SpotlightWrapper enableVerticalFade={false} className="rounded-xl">
        <Card>
          <CardContent className="p-6">
            {/* Page Title */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold">Friends</h1>
              <p className="text-muted-foreground mt-1">
                Manage your friends and friend requests
              </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="friends" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="friends" className="flex items-center gap-2">
                  Friends
                  <Badge variant="secondary" className="ml-1">
                    {friendsCount}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="received" className="flex items-center gap-2">
                  Requests Received
                  {receivedCount > 0 && (
                    <Badge variant="destructive" className="ml-1">
                      {receivedCount}
                    </Badge>
                  )}
                  {receivedCount === 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {receivedCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="sent" className="flex items-center gap-2">
                  Requests Sent
                  <Badge variant="secondary" className="ml-1">
                    {sentCount}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              {/* Friends Tab */}
              <TabsContent value="friends" className="mt-0">
                <FriendsList
                  showSearch={true}
                  showCount={false}
                  maxHeight="calc(100vh - 350px)"
                />
              </TabsContent>

              {/* Requests Received Tab */}
              <TabsContent value="received" className="mt-0">
                <FriendRequestsList
                  showCount={false}
                  maxHeight="calc(100vh - 350px)"
                />
              </TabsContent>

              {/* Requests Sent Tab */}
              <TabsContent value="sent" className="mt-0">
                <SentRequestsList
                  showCount={false}
                  maxHeight="calc(100vh - 350px)"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </SpotlightWrapper>
    </div>
  );
};

export default FriendsPage;

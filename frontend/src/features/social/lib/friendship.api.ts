// frontend/src/features/social/lib/friendship.api.ts

import { rootApiSlice } from "@frontend/store/api/rootApiSlice";
import type {
  Friendship,
  FriendshipWithUserInfo,
  FriendshipStatusResponse,
  FriendshipApiResponse,
  FriendshipListResponse,
  FriendshipCountResponse,
  SendFriendRequestBody,
} from "../types/friendship.types";

/**
 * RTK Query slice for friendship features (friend requests, friendships)
 * All endpoints use Clerk authentication automatically via rootApiSlice
 * Backend extracts user ID from JWT token, so no need to pass userId
 */
export const friendshipApi = rootApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Send a friend request to another user
    sendFriendRequest: builder.mutation<
      FriendshipApiResponse<Friendship>,
      SendFriendRequestBody
    >({
      query: (body) => ({
        url: "/social/friendships/request",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Friendships", id: "SENT_PENDING" },
        { type: "FriendshipStatus", id: "LIST" },
      ],
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log("[RTK] sendFriendRequest called with:", arg);
        try {
          const { data } = await queryFulfilled;
          console.log("[RTK] sendFriendRequest response:", data);
        } catch (error) {
          console.error("[RTK] sendFriendRequest error:", error);
        }
      },
    }),

    // Accept a pending friend request
    acceptFriendRequest: builder.mutation<
      FriendshipApiResponse<Friendship>,
      string
    >({
      query: (friendshipId) => ({
        url: `/social/friendships/${friendshipId}/accept`,
        method: "PATCH",
      }),
      invalidatesTags: [
        { type: "Friendships", id: "LIST" },
        { type: "Friendships", id: "RECEIVED_PENDING" },
        { type: "FriendshipStatus", id: "LIST" },
        { type: "FriendshipCount", id: "FRIENDS" },
        { type: "FriendshipCount", id: "PENDING" },
      ],
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log("[RTK] acceptFriendRequest called with:", arg);
        try {
          const { data } = await queryFulfilled;
          console.log("[RTK] acceptFriendRequest response:", data);
        } catch (error) {
          console.error("[RTK] acceptFriendRequest error:", error);
        }
      },
    }),

    // Reject a pending friend request
    rejectFriendRequest: builder.mutation<
      FriendshipApiResponse<Friendship>,
      string
    >({
      query: (friendshipId) => ({
        url: `/social/friendships/${friendshipId}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: [
        { type: "Friendships", id: "RECEIVED_PENDING" },
        { type: "FriendshipStatus", id: "LIST" },
        { type: "FriendshipCount", id: "PENDING" },
      ],
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log("[RTK] rejectFriendRequest called with:", arg);
        try {
          const { data } = await queryFulfilled;
          console.log("[RTK] rejectFriendRequest response:", data);
        } catch (error) {
          console.error("[RTK] rejectFriendRequest error:", error);
        }
      },
    }),

    // Remove a friendship (unfriend) or cancel a pending request
    removeFriendship: builder.mutation<FriendshipApiResponse<void>, string>({
      query: (friendshipId) => ({
        url: `/social/friendships/${friendshipId}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Friendships", id: "LIST" },
        { type: "Friendships", id: "SENT_PENDING" },
        { type: "FriendshipStatus", id: "LIST" },
        { type: "FriendshipCount", id: "FRIENDS" },
      ],
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log("[RTK] removeFriendship called with:", arg);
        try {
          const { data } = await queryFulfilled;
          console.log("[RTK] removeFriendship response:", data);
        } catch (error) {
          console.error("[RTK] removeFriendship error:", error);
        }
      },
    }),

    // Get all friends of the current user (with user info)
    getFriends: builder.query<FriendshipWithUserInfo[], void>({
      query: () => ({
        url: "/social/friendships",
        method: "GET",
      }),
      transformResponse: (response: FriendshipListResponse) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((friendship) => ({
                type: "Friendships" as const,
                id: friendship.id,
              })),
              { type: "Friendships", id: "LIST" },
            ]
          : [{ type: "Friendships", id: "LIST" }],
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log("[RTK] getFriends called");
        try {
          const { data } = await queryFulfilled;
          console.log("[RTK] getFriends response:", data);
        } catch (error) {
          console.error("[RTK] getFriends error:", error);
        }
      },
    }),

    // Get pending friend requests received by the current user
    getPendingReceivedRequests: builder.query<FriendshipWithUserInfo[], void>({
      query: () => ({
        url: "/social/friendships/pending/received",
        method: "GET",
      }),
      transformResponse: (response: FriendshipListResponse) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((friendship) => ({
                type: "Friendships" as const,
                id: friendship.id,
              })),
              { type: "Friendships", id: "RECEIVED_PENDING" },
            ]
          : [{ type: "Friendships", id: "RECEIVED_PENDING" }],
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log("[RTK] getPendingReceivedRequests called");
        try {
          const { data } = await queryFulfilled;
          console.log("[RTK] getPendingReceivedRequests response:", data);
        } catch (error) {
          console.error("[RTK] getPendingReceivedRequests error:", error);
        }
      },
    }),

    // Get pending friend requests sent by the current user
    getPendingSentRequests: builder.query<FriendshipWithUserInfo[], void>({
      query: () => ({
        url: "/social/friendships/pending/sent",
        method: "GET",
      }),
      transformResponse: (response: FriendshipListResponse) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((friendship) => ({
                type: "Friendships" as const,
                id: friendship.id,
              })),
              { type: "Friendships", id: "SENT_PENDING" },
            ]
          : [{ type: "Friendships", id: "SENT_PENDING" }],
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log("[RTK] getPendingSentRequests called");
        try {
          const { data } = await queryFulfilled;
          console.log("[RTK] getPendingSentRequests response:", data);
        } catch (error) {
          console.error("[RTK] getPendingSentRequests error:", error);
        }
      },
    }),

    // Check friendship status between current user and another user
    getFriendshipStatus: builder.query<FriendshipStatusResponse, string>({
      query: (userId) => ({
        url: `/social/friendships/status/${userId}`,
        method: "GET",
      }),
      transformResponse: (
        response: FriendshipApiResponse<FriendshipStatusResponse>
      ) => response.data!,
      providesTags: (result, error, userId) => [
        { type: "FriendshipStatus", id: userId },
        { type: "FriendshipStatus", id: "LIST" },
      ],
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log("[RTK] getFriendshipStatus called with userId:", arg);
        try {
          const { data } = await queryFulfilled;
          console.log("[RTK] getFriendshipStatus response:", data);
        } catch (error) {
          console.error("[RTK] getFriendshipStatus error:", error);
        }
      },
    }),

    // Get count of friends
    getFriendsCount: builder.query<number, void>({
      query: () => ({
        url: "/social/friendships/count",
        method: "GET",
      }),
      transformResponse: (response: FriendshipCountResponse) =>
        response.data.count,
      providesTags: [{ type: "FriendshipCount", id: "FRIENDS" }],
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log("[RTK] getFriendsCount called");
        try {
          const { data } = await queryFulfilled;
          console.log("[RTK] getFriendsCount response:", data);
        } catch (error) {
          console.error("[RTK] getFriendsCount error:", error);
        }
      },
    }),

    // Get count of pending received requests (for notification badges)
    getPendingRequestsCount: builder.query<number, void>({
      query: () => ({
        url: "/social/friendships/pending/count",
        method: "GET",
      }),
      transformResponse: (response: FriendshipCountResponse) =>
        response.data.count,
      providesTags: [{ type: "FriendshipCount", id: "PENDING" }],
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log("[RTK] getPendingRequestsCount called");
        try {
          const { data } = await queryFulfilled;
          console.log("[RTK] getPendingRequestsCount response:", data);
        } catch (error) {
          console.error("[RTK] getPendingRequestsCount error:", error);
        }
      },
    }),
  }),
  overrideExisting: true,
});

// Export hooks for use in components
export const {
  useSendFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
  useRemoveFriendshipMutation,
  useGetFriendsQuery,
  useGetPendingReceivedRequestsQuery,
  useGetPendingSentRequestsQuery,
  useGetFriendshipStatusQuery,
  useGetFriendsCountQuery,
  useGetPendingRequestsCountQuery,
} = friendshipApi;

/**
 * Usage in components:
 *
 * // Send friend request
 * const [sendRequest] = useSendFriendRequestMutation();
 * await sendRequest({ receiverId: 'user123' });
 *
 * // Get friends list
 * const { data: friends, isLoading } = useGetFriendsQuery();
 *
 * // Check friendship status with specific user
 * const { data: status } = useGetFriendshipStatusQuery('user123');
 *
 * // Accept friend request
 * const [acceptRequest] = useAcceptFriendRequestMutation();
 * await acceptRequest(friendshipId);
 *
 * All endpoints use Clerk authentication automatically.
 * No need to pass current user ID - backend extracts from JWT.
 */

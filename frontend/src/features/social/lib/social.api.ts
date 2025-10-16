// frontend/src/features/social/api/social.api.ts

import { rootApiSlice } from "@frontend/store/api/rootApiSlice";
import type { Post, Comment, UserProfile } from "../types/social.types";

// RTK Query slice for social features (posts, comments, likes)
export const socialApi = rootApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all posts (optionally by user)
    getPosts: builder.query<Post[], { userId?: string } | void>({
      query: (params) => {
        const url = params?.userId
          ? `/social/posts?userId=${encodeURIComponent(params.userId)}`
          : "/social/posts";
        return { url, method: "GET" };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((post) => ({
                type: "Posts" as const,
                id: post.id,
              })),
              { type: "Posts", id: "LIST" },
            ]
          : [{ type: "Posts", id: "LIST" }],
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log("[RTK] getPosts called with:", arg);
        try {
          const { data } = await queryFulfilled;
          console.log("[RTK] getPosts response:", data);
          // Debug: Log isOwner values for first 3 posts
          console.log(
            "[RTK] isOwner values:",
            data.slice(0, 3).map((p) => ({
              id: p.id,
              user: p.user,
              isOwner: p.isOwner,
              userInfo: p.userInfo
                ? `${p.userInfo.firstName} ${p.userInfo.lastName}`
                : "none",
            }))
          );
        } catch (error) {
          console.error("[RTK] getPosts error:", error);
        }
      },
    }),

    // Create a new post
    createPost: builder.mutation<
      Post,
      {
        content: string;
        mediaFiles?: string[];
        image?: string;
        isArchived?: boolean;
      }
    >({
      query: (body) => ({
        url: "/social/posts",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Posts", id: "LIST" }],
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log("[RTK] createPost called with:", arg);
        try {
          const { data } = await queryFulfilled;
          console.log("[RTK] createPost response:", data);
        } catch (error) {
          console.error("[RTK] createPost error:", error);
        }
      },
    }),

    // Delete a post
    deletePost: builder.mutation<{ success: boolean }, string>({
      query: (postId) => ({
        url: `/social/posts/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Posts", id: "LIST" }],
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log("[RTK] deletePost called with:", arg);
        try {
          const { data } = await queryFulfilled;
          console.log("[RTK] deletePost response:", data);
        } catch (error) {
          console.error("[RTK] deletePost error:", error);
        }
      },
    }),

    // Update a post (edit content, add/remove media)
    updatePost: builder.mutation<
      Post,
      {
        postId: string;
        updates: {
          content?: string;
          mediaFilesToAdd?: string[];
          mediaFilesToRemove?: string[];
          isArchived?: boolean;
        };
      }
    >({
      query: ({ postId, updates }) => ({
        url: `/social/posts/${postId}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: [{ type: "Posts", id: "LIST" }],
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log("[RTK] updatePost called with:", arg);
        try {
          const { data } = await queryFulfilled;
          console.log("[RTK] updatePost response:", data);
        } catch (error) {
          console.error("[RTK] updatePost error:", error);
        }
      },
    }),

    // Get comments for a post
    getComments: builder.query<Comment[], string>({
      query: (postId) => ({
        url: `/social/posts/${postId}/comments`,
        method: "GET",
      }),
      transformResponse: (response: any[]): Comment[] => {
        // Ensure fallback for display name/profile pic
        return response.map((comment) => {
          const displayName = comment.userInfo?.name?.trim()
            ? comment.userInfo.name
            : comment.userInfo?.id?.slice(0, 8) ||
              comment.user?.slice(0, 8) ||
              "Unknown";
          const displayProfilePic =
            comment.userInfo?.profilePicture || "/alien-profile-pic-1.jpg";
          return {
            ...comment,
            userInfo: {
              ...comment.userInfo,
              name: displayName,
              profilePicture: displayProfilePic,
            },
          };
        });
      },
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log("[RTK] getComments called with:", arg);
        try {
          const { data } = await queryFulfilled;
          console.log("[RTK] getComments response:", data);
        } catch (error) {
          console.error("[RTK] getComments error:", error);
        }
      },
    }),

    // Add a comment to a post
    addComment: builder.mutation<Comment, { postId: string; content: string }>({
      query: ({ postId, content }) => ({
        url: `/social/posts/${postId}/comments`,
        method: "POST",
        body: { content },
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log("[RTK] addComment called with:", arg);
        try {
          const { data } = await queryFulfilled;
          console.log("[RTK] addComment response:", data);
        } catch (error) {
          console.error("[RTK] addComment error:", error);
        }
      },
    }),

    // Delete a comment
    deleteComment: builder.mutation<
      { success: boolean },
      { postId: string; commentId: string }
    >({
      query: ({ postId, commentId }) => ({
        url: `/social/posts/${postId}/comments/${commentId}`,
        method: "DELETE",
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log("[RTK] deleteComment called with:", arg);
        try {
          const { data } = await queryFulfilled;
          console.log("[RTK] deleteComment response:", data);
        } catch (error) {
          console.error("[RTK] deleteComment error:", error);
        }
      },
    }),

    // Update a comment
    updateComment: builder.mutation<
      Comment,
      { postId: string; commentId: string; content: string }
    >({
      query: ({ postId, commentId, content }) => ({
        url: `/social/posts/${postId}/comments/${commentId}`,
        method: "PATCH",
        body: { content },
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log("[RTK] updateComment called with:", arg);
        try {
          const { data } = await queryFulfilled;
          console.log("[RTK] updateComment response:", data);
        } catch (error) {
          console.error("[RTK] updateComment error:", error);
        }
      },
    }),

    // Like a post
    likePost: builder.mutation<{ success: boolean }, string>({
      query: (postId) => ({
        url: `/social/posts/${postId}/likes`,
        method: "POST",
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log("[RTK] likePost called with:", arg);
        try {
          const { data } = await queryFulfilled;
          console.log("[RTK] likePost response:", data);
        } catch (error) {
          console.error("[RTK] likePost error:", error);
        }
      },
    }),

    // Unlike a post
    unlikePost: builder.mutation<{ success: boolean }, string>({
      query: (postId) => ({
        url: `/social/posts/${postId}/likes`,
        method: "DELETE",
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log("[RTK] unlikePost called with:", arg);
        try {
          const { data } = await queryFulfilled;
          console.log("[RTK] unlikePost response:", data);
        } catch (error) {
          console.error("[RTK] unlikePost error:", error);
        }
      },
    }),
    // Get current user profile
    getCurrentUserProfile: builder.query<UserProfile, void>({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log("[RTK] getCurrentUserProfile called");
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("[RTK] getCurrentUserProfile error:", error);
        }
      },
    }),

    // Get all users (for browsing/discovery)
    getAllUsers: builder.query<UserProfile[], void>({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      providesTags: [{ type: "Posts", id: "USERS_LIST" }],
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log("[RTK] getAllUsers called");
        try {
          const { data } = await queryFulfilled;
          console.log("[RTK] getAllUsers response:", data.length, "users");
        } catch (error) {
          console.error("[RTK] getAllUsers error:", error);
        }
      },
    }),
  }),
  overrideExisting: true,
});

// Export hooks for use in components
export const {
  useGetCurrentUserProfileQuery,
  useGetAllUsersQuery,
  useGetPostsQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useUpdatePostMutation,
  useGetCommentsQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
  useLikePostMutation,
  useUnlikePostMutation,
} = socialApi;

/*
  - All endpoints use Clerk authentication automatically (via rootApiSlice).
  - Media handling (upload/get signed URLs) should use your existing media.api.ts functions directly in your components.
  - No need to pass userId; backend extracts user from Clerk JWT.
  - Use the exported hooks in your React components for all social actions.
*/

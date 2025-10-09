// frontend/src/features/social/api/social.api.ts

import { rootApiSlice } from "@frontend/store/api/rootApiSlice";
import type { Post, Comment } from "../types/social.types";

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
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log("[RTK] getPosts called with:", arg);
        try {
          const { data } = await queryFulfilled;
          console.log("[RTK] getPosts response:", data);
        } catch (error) {
          console.error("[RTK] getPosts error:", error);
        }
      },
    }),

    // Create a new post
    createPost: builder.mutation<
      Post,
      { content: string; mediaFiles?: string[]; image?: string }
    >({
      query: (body) => ({
        url: "/social/posts",
        method: "POST",
        body,
      }),
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
        };
      }
    >({
      query: ({ postId, updates }) => ({
        url: `/social/posts/${postId}`,
        method: "PATCH",
        body: updates,
      }),
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
  }),
  overrideExisting: true,
});

// Export hooks for use in components
export const {
  useGetPostsQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useUpdatePostMutation,
  useGetCommentsQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
  useLikePostMutation,
  useUnlikePostMutation,
} = socialApi;

/*
  - All endpoints use Clerk authentication automatically (via rootApiSlice).
  - Media handling (upload/get signed URLs) should use your existing media.api.ts functions directly in your components.
  - No need to pass userId; backend extracts user from Clerk JWT.
  - Use the exported hooks in your React components for all social actions.
*/

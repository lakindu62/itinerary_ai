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
    }),

    // Delete a post
    deletePost: builder.mutation<{ success: boolean }, string>({
      query: (postId) => ({
        url: `/social/posts/${postId}`,
        method: "DELETE",
      }),
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
    }),

    // Get comments for a post
    getComments: builder.query<Comment[], string>({
      query: (postId) => ({
        url: `/social/posts/${postId}/comments`,
        method: "GET",
      }),
    }),

    // Add a comment to a post
    addComment: builder.mutation<Comment, { postId: string; content: string }>({
      query: ({ postId, content }) => ({
        url: `/social/posts/${postId}/comments`,
        method: "POST",
        body: { content },
      }),
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
    }),

    // Like a post
    likePost: builder.mutation<{ success: boolean }, string>({
      query: (postId) => ({
        url: `/social/posts/${postId}/likes`,
        method: "POST",
      }),
    }),

    // Unlike a post
    unlikePost: builder.mutation<{ success: boolean }, string>({
      query: (postId) => ({
        url: `/social/posts/${postId}/likes`,
        method: "DELETE",
      }),
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

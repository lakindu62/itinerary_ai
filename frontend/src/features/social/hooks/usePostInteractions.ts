import {
  useLikePostMutation,
  useUnlikePostMutation,
  useAddCommentMutation,
  useDeletePostMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
  useGetCommentsQuery,
} from "../lib/social.api";
import { useState } from "react";
import type { Post, Comment } from "../types/social.types";

export const usePostInteractions = (
  post: Post,
  onDelete?: (id: string) => void
) => {
  // Like state
  const [hasLiked, setHasLiked] = useState(post.userLiked ?? false);
  const [optimisticLikes, setOptimisticLikes] = useState(post.likeCount ?? 0);

  // Comment state
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);

  // RTK Query hooks for comments
  const {
    data: comments = [],
    isLoading: loadingComments,
    refetch: refetchComments,
  } = useGetCommentsQuery(post.id);

  // Like mutations
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();

  // Comment mutations
  const [addComment] = useAddCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [updateComment] = useUpdateCommentMutation();

  // Delete post mutation
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  // Like handling
  const handleLike = async () => {
    if (hasLiked) {
      setOptimisticLikes(optimisticLikes - 1);
      setHasLiked(false);
      await unlikePost(post.id);
    } else {
      setOptimisticLikes(optimisticLikes + 1);
      setHasLiked(true);
      await likePost(post.id);
    }
  };

  // Add comment handling
  const handleAddComment = async (content: string) => {
    if (!content.trim()) return;
    setIsCommenting(true);
    try {
      await addComment({ postId: post.id, content });
      setCommentText("");
      refetchComments(); // Refetch comments after posting
    } catch (error) {
      console.error("Error adding comment:", error);
    }
    setIsCommenting(false);
  };

  // Delete post
  const handleDeletePost = async () => {
    try {
      await deletePost(post.id);
      if (onDelete) onDelete(post.id);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Toggle comments
  const handleShowComments = () => {
    setShowComments(!showComments);
    if (!showComments) {
      refetchComments(); // Fetch comments when opening
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment({ postId: post.id, commentId });
      refetchComments(); // Refetch after deletion
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // Edit comment
  const handleEditComment = async (commentId: string, content: string) => {
    try {
      await updateComment({ postId: post.id, commentId, content });
      refetchComments(); // Refetch after update
    } catch (error) {
      console.error("Error updating comment:", error);
      throw error; // Re-throw to let UI handle it
    }
  };

  return {
    hasLiked,
    optimisticLikes,
    showComments,
    commentText,
    setCommentText,
    isCommenting,
    comments,
    loadingComments,
    isDeleting, // NEW: RTK Query mutation loading state
    handleLike,
    handleAddComment,
    handleDeletePost,
    handleShowComments,
    handleDeleteComment,
    handleEditComment,
    // No need for currentUserId anymore - using post.isOwner from backend
  };
};

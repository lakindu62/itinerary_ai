import { useState } from "react";
import { useAuth } from "@clerk/nextjs"; // CHANGE: Add Clerk auth hook
import { likePost, unlikePost } from "../lib/like.api";
import { addComment, getComments, deleteComment } from "../lib/comment.api";
import { deletePost } from "../lib/post.api";
import { Post, Comment } from "../types/social.types";

// CHANGE: Removed STATIC_USER_ID - no longer needed

export const usePostInteractions = (
  post: Post,
  onDelete?: (id: string) => void
) => {
  // CHANGE: Add Clerk authentication
  const { getToken, userId } = useAuth();

  // CHANGE: Use Clerk userId directly - ownership is now handled in PostHeader using userInfo.clerkUserId
  const currentUserId = userId || ""; // Use Clerk user ID

  // Like state
  const [hasLiked, setHasLiked] = useState(post.userLiked ?? false);
  const [optimisticLikes, setOptimisticLikes] = useState(post.likeCount ?? 0);

  // Comment state
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsLoaded, setCommentsLoaded] = useState(false);

  // Delete state
  const [isDeleting, setIsDeleting] = useState(false);

  // Like handling
  const handleLike = async () => {
    const token = await getToken(); // CHANGE: Get Clerk token
    if (hasLiked) {
      setOptimisticLikes(optimisticLikes - 1);
      setHasLiked(false);
      await unlikePost(post.id, token); // CHANGE: Pass token to API
    } else {
      setOptimisticLikes(optimisticLikes + 1);
      setHasLiked(true);
      await likePost(post.id, token); // CHANGE: Pass token to API
    }
  };

  // Add comment handling
  const handleAddComment = async (content: string) => {
    if (!content.trim()) return;
    setIsCommenting(true);
    try {
      const token = await getToken(); // CHANGE: Get Clerk token
      await addComment(post.id, content, token); // CHANGE: Pass token to API
      setCommentText("");
      // Refetch comments after posting (for accurate display)
      if (showComments) {
        setLoadingComments(true);
        const updated = await getComments(post.id);
        // Temporarily increment commentCount in frontend until screen refresh
        post.commentCount = post.commentCount + 1;
        setComments(updated);
        setLoadingComments(false);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
    setIsCommenting(false);
  };

  // Delete post
  const handleDeletePost = async () => {
    setIsDeleting(true);
    try {
      const token = await getToken(); // CHANGE: Get Clerk token
      await deletePost(post.id, token); // CHANGE: Pass token to API
      if (onDelete) onDelete(post.id); // Remove from list in parent
    } catch (error) {
      console.error("Error deleting post:", error);
    }
    setIsDeleting(false);
  };

  // Toggle comments and fetch if needed
  const handleShowComments = async () => {
    setShowComments(!showComments);
    if (!commentsLoaded && !showComments) {
      // only fetch if opening
      setLoadingComments(true);
      try {
        const fetchedComments = await getComments(post.id);
        setComments(fetchedComments);
        setCommentsLoaded(true);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
      setLoadingComments(false);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    try {
      const token = await getToken(); // CHANGE: Get Clerk token
      await deleteComment(post.id, commentId, token); // CHANGE: Pass token to API
      // Remove comment from local state
      setComments(comments.filter((comment) => comment.id !== commentId));
      // Decrement comment count
      post.commentCount = Math.max(0, post.commentCount - 1);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return {
    // Like state
    hasLiked,
    optimisticLikes,

    // Comment state
    showComments,
    commentText,
    setCommentText,
    isCommenting,
    comments,
    loadingComments,

    // Delete state
    isDeleting,

    // Actions
    handleLike,
    handleAddComment,
    handleDeletePost,
    handleShowComments,
    handleDeleteComment,

    // Current user
    currentUserId, // CHANGE: Use currentUserId for ownership comparison
  };
};

//comment.api.ts

const API_BASE_URL = "http://localhost:3000/api/social";
// CHANGE: Removed STATIC_USER_ID - no longer needed with authentication

// Comment API

export const getComments = async (postId: string): Promise<any[]> => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`);
  if (!response.ok) throw new Error("Failed to fetch comments");
  return response.json();
};

// CHANGE: Updated addComment to use authentication
export const addComment = async (
  postId: string,
  content: string,
  authToken?: string | null // CHANGE: Accept auth token parameter
): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }), // CHANGE: Add auth header
    },
    body: JSON.stringify({
      // CHANGE: Removed user field - backend gets it from authentication
      content: content,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to add comment to post: ${postId}`);
  }

  return response.json();
};

// CHANGE: Updated deleteComment to use authentication
export const deleteComment = async (
  postId: string,
  commentId: string,
  authToken?: string | null // CHANGE: Accept auth token parameter
): Promise<any> => {
  const response = await fetch(
    `${API_BASE_URL}/posts/${postId}/comments/${commentId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }), // CHANGE: Add auth header
      },
      // CHANGE: Removed body - backend gets user from authentication
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to delete comment ${commentId} from post: ${postId}`
    );
  }

  return response.json();
};

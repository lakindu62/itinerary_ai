//like.api.ts

const API_BASE_URL = "http://localhost:3000/api/social";
// CHANGE: Removed STATIC_USER_ID - no longer needed with authentication

// CHANGE: Updated likePost to use authentication
export const likePost = async (
  postId: string,
  authToken?: string | null // CHANGE: Accept auth token parameter
): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/likes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }), // CHANGE: Add auth header
    },
    // CHANGE: Removed body - backend gets user from authentication
  });

  if (!response.ok) {
    throw new Error(`Failed to like post: ${postId}`);
  }

  return response.json();
};

// CHANGE: Updated unlikePost to use authentication
export const unlikePost = async (
  postId: string,
  authToken?: string | null // CHANGE: Accept auth token parameter
): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/likes`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }), // CHANGE: Add auth header
    },
    // CHANGE: Removed body - backend gets user from authentication
  });

  if (!response.ok) {
    throw new Error(`Failed to unlike post: ${postId}`);
  }

  return response.json();
};

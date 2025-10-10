//post.api.ts

export const API_BASE_URL = "http://localhost:3000/api";
const API_BASE_URL_SOCIAL = "http://localhost:3000/api/social";
export const STATIC_USER_ID = "68bb23a6701962edcadb67e0";

// Post API
export const createPost = async (
  content: string,
  mediaFiles?: string[],
  imageUrl?: string
): Promise<any> => {
  const response = await fetch(`${API_BASE_URL_SOCIAL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: STATIC_USER_ID,
      content: content,
      image: imageUrl,
      mediaFiles: mediaFiles,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create post");
  }

  return response.json();
};

export const getAllPosts = async (userId?: string): Promise<any[]> => {
  // Build URL with optional userId query parameter
  const url = userId
    ? `${API_BASE_URL_SOCIAL}/posts?userId=${encodeURIComponent(userId)}`
    : `${API_BASE_URL_SOCIAL}/posts`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
};

export const deletePost = async (postId: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL_SOCIAL}/posts/${postId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user: STATIC_USER_ID }),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete post with ID: ${postId}`);
  }

  return response.json();
};

/**
 * Updates an existing post with new content and/or media files.
 * Supports partial updates allowing users to update content, add media, or remove media independently.
 * @param postId - The ID of the post to update
 * @param updates - Object containing the fields to update
 * @param updates.content - Optional new content for the post
 * @param updates.mediaFilesToAdd - Optional array of new media file keys to add
 * @param updates.mediaFilesToRemove - Optional array of existing media file keys to remove
 * @returns Promise resolving to the API response with updated post data
 * @throws Error if the update request fails
 */
export const updatePost = async (
  postId: string,
  updates: {
    content?: string;
    mediaFilesToAdd?: string[];
    mediaFilesToRemove?: string[];
  }
): Promise<any> => {
  const response = await fetch(`${API_BASE_URL_SOCIAL}/posts/${postId}`, {
    method: "PATCH", // Using PATCH for partial updates
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: STATIC_USER_ID, // Include user ID for ownership verification
      ...updates, // Spread the update fields
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage =
      errorData?.message || `Failed to update post with ID: ${postId}`;
    throw new Error(errorMessage);
  }

  return response.json();
};

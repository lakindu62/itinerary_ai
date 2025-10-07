//usePostEdits.ts /Comet

import { useState } from "react";
import { useAuth } from "@clerk/nextjs"; // CHANGE: Add Clerk auth hook
import { updatePost } from "../lib/post.api";
import { Post } from "../types/social.types";
import { getSignedUploadUrl, uploadFileToSignedUrl } from "src/lib/media.api";

// CHANGE: Removed STATIC_USER_ID - no longer needed

export const usePostEdit = (post: Post) => {
  // CHANGE: Add Clerk authentication
  const { getToken, userId } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content || "");
  const [editMediaFiles, setEditMediaFiles] = useState<File[]>([]);
  const [editMediaToRemove, setEditMediaToRemove] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editMediaPreviewUrls, setEditMediaPreviewUrls] = useState<string[]>(
    []
  );

  // Toggle edit mode and reset state when cancelling
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset all edit state to original values
      setEditContent(post.content || "");
      setEditMediaFiles([]);
      setEditMediaToRemove([]);
      setEditMediaPreviewUrls([]);
    }
    setIsEditing(!isEditing);
  };

  // Save post updates with comprehensive media management
  const handleSaveEdit = async () => {
    setIsUpdating(true);
    try {
      let mediaFilesToAdd: string[] = [];

      // Upload new media files if any were selected
      if (editMediaFiles.length > 0) {
        const bucket = "social-media";

        const uploadPromises = editMediaFiles.map(async (file) => {
          // Generate unique file path with timestamp and original name
          const timestamp = Date.now();
          const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_"); // Sanitize filename
          const filePath = `posts/${userId}/${timestamp}_${safeName}`; // CHANGE: Use userId from Clerk
          const fileKey = `${bucket}/${filePath}`;

          // Get signed upload URL and upload the file directly to MinIO
          const signedUrl = await getSignedUploadUrl(filePath, bucket);
          await uploadFileToSignedUrl(file, signedUrl);

          return fileKey;
        });

        mediaFilesToAdd = await Promise.all(uploadPromises);
      }

      // Prepare update payload with only the fields that need updating
      const updatePayload: {
        content?: string;
        mediaFilesToAdd?: string[];
        mediaFilesToRemove?: string[];
      } = {};

      // Include content update (even if empty - allows clearing content)
      if (editContent !== post.content) {
        updatePayload.content = editContent;
      }

      // Include media additions if any
      if (mediaFilesToAdd.length > 0) {
        updatePayload.mediaFilesToAdd = mediaFilesToAdd;
      }

      // Include media removals if any
      if (editMediaToRemove.length > 0) {
        updatePayload.mediaFilesToRemove = editMediaToRemove;
      }

      // CHANGE: Get authentication token and send update request to backend
      const token = await getToken();
      const response = await updatePost(post.id, updatePayload, token);
      const updatedPost = response;

      // Update local post object with new values
      post.content = updatedPost.content;
      post.mediaFiles = updatedPost.mediaFiles;
      post.updatedAt = updatedPost.updatedAt;

      // Reset edit state
      setEditContent(updatedPost.content || "");
      setEditMediaFiles([]);
      setEditMediaToRemove([]);
      setEditMediaPreviewUrls([]);
      setIsEditing(false);

      // Refresh media URLs to show updated media
      // Simple approach: reload the page to refresh all signed URLs
      // In a more sophisticated app, you'd selectively update the URLs
      window.location.reload();
    } catch (error: any) {
      console.error("Error updating post:", error);
      alert("Error updating post: " + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Mark an existing media file for removal
  const handleRemoveExistingMedia = (mediaKey: string) => {
    setEditMediaToRemove((prev) => {
      if (!prev.includes(mediaKey)) {
        return [...prev, mediaKey];
      }
      return prev;
    });
  };

  // Remove a media file from the removal list (undo removal)
  const handleKeepExistingMedia = (mediaKey: string) => {
    setEditMediaToRemove((prev) => prev.filter((key) => key !== mediaKey));
  };

  // Handle file input changes for adding new media files
  const handleAddEditMedia = (files: File[]) => {
    // Basic validation: check file types
    const validFiles = files.filter((file) => {
      return file.type.startsWith("image/") || file.type.startsWith("video/");
    });

    if (validFiles.length !== files.length) {
      alert("Some files were skipped. Only image and video files are allowed.");
    }

    if (validFiles.length > 0) {
      setEditMediaFiles((prev) => [...prev, ...validFiles]);

      // Create preview URLs for new files
      const newPreviewUrls = validFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setEditMediaPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  // Remove a newly selected media file from the edit list (before upload)
  const handleRemoveNewMedia = (index: number) => {
    setEditMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setEditMediaPreviewUrls((prev) => {
      // Clean up the preview URL to avoid memory leaks
      if (prev[index]) {
        URL.revokeObjectURL(prev[index]);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  return {
    isEditing,
    editContent,
    editMediaFiles,
    editMediaToRemove,
    isUpdating,
    editMediaPreviewUrls,
    handleEditToggle,
    handleSaveEdit,
    handleRemoveExistingMedia,
    handleKeepExistingMedia,
    handleAddEditMedia,
    handleRemoveNewMedia,
    setEditContent,
  };
};

// ===== POST EDIT HOOK =====
// src/features/social/hooks/usePostEdit.ts
// import { useState } from "react";
// import { STATIC_USER_ID, updatePost } from "../lib/post.api";
// import { getSignedUploadUrl, uploadFileToSignedUrl } from "src/lib/media.api";
// import { Post } from "../types/social.types";

// export const usePostEdit = (post: Post) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [editContent, setEditContent] = useState(post.content || "");
//   const [editMediaFiles, setEditMediaFiles] = useState<File[]>([]);
//   const [editMediaToRemove, setEditMediaToRemove] = useState<string[]>([]);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [editMediaPreviewUrls, setEditMediaPreviewUrls] = useState<string[]>(
//     []
//   );

//   const handleEditToggle = () => {
//     if (isEditing) {
//       setEditContent(post.content || "");
//       setEditMediaFiles([]);
//       setEditMediaToRemove([]);
//       setEditMediaPreviewUrls([]);
//     }
//     setIsEditing(!isEditing);
//   };

//   const handleSaveEdit = async () => {
//     setIsUpdating(true);
//     try {
//       let mediaFilesToAdd: string[] = [];

//       if (editMediaFiles.length > 0) {
//         const bucket = "social-media";
//         const uploadPromises = editMediaFiles.map(async (file) => {
//           const timestamp = Date.now();
//           const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
//           const filePath = `posts/${STATIC_USER_ID}/${timestamp}_${safeName}`;
//           const fileKey = `${bucket}/${filePath}`;
//           const signedUrl = await getSignedUploadUrl(filePath, bucket);
//           await uploadFileToSignedUrl(file, signedUrl);
//           return fileKey;
//         });
//         mediaFilesToAdd = await Promise.all(uploadPromises);
//       }

//       const updatePayload: {
//         content?: string;
//         mediaFilesToAdd?: string[];
//         mediaFilesToRemove?: string[];
//       } = {};

//       if (editContent !== post.content) {
//         updatePayload.content = editContent;
//       }

//       if (mediaFilesToAdd.length > 0) {
//         updatePayload.mediaFilesToAdd = mediaFilesToAdd;
//       }

//       if (editMediaToRemove.length > 0) {
//         updatePayload.mediaFilesToRemove = editMediaToRemove;
//       }

//       const response = await updatePost(post.id, updatePayload);
//       const updatedPost = response;

//       post.content = updatedPost.content;
//       post.mediaFiles = updatedPost.mediaFiles;
//       post.updatedAt = updatedPost.updatedAt;

//       setEditContent(updatedPost.content || "");
//       setEditMediaFiles([]);
//       setEditMediaToRemove([]);
//       setIsEditing(false);

//       window.location.reload();
//     } catch (error: any) {
//       console.error("Error updating post:", error);
//       alert("Error updating post: " + error.message);
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const handleRemoveExistingMedia = (mediaKey: string) => {
//     setEditMediaToRemove((prev) => {
//       if (!prev.includes(mediaKey)) {
//         return [...prev, mediaKey];
//       }
//       return prev;
//     });
//   };

//   const handleKeepExistingMedia = (mediaKey: string) => {
//     setEditMediaToRemove((prev) => prev.filter((key) => key !== mediaKey));
//   };

//   const handleAddEditMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     const validFiles = files.filter((file) => {
//       return file.type.startsWith("image/") || file.type.startsWith("video/");
//     });

//     if (validFiles.length !== files.length) {
//       alert("Some files were skipped. Only image and video files are allowed.");
//     }

//     if (validFiles.length > 0) {
//       setEditMediaFiles((prev) => [...prev, ...validFiles]);
//     }

//     e.target.value = "";
//   };

//   const handleRemoveNewMedia = (index: number) => {
//     setEditMediaFiles((prev) => prev.filter((_, i) => i !== index));
//   };

//   return {
//     isEditing,
//     editContent,
//     setEditContent,
//     editMediaFiles,
//     editMediaToRemove,
//     isUpdating,
//     editMediaPreviewUrls,
//     handleEditToggle,
//     handleSaveEdit,
//     handleRemoveExistingMedia,
//     handleKeepExistingMedia,
//     handleAddEditMedia,
//     handleRemoveNewMedia,
//   };
// };

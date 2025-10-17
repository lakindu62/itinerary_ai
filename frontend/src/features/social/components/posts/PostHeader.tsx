"use client";

// PostHeader component for rendering post header UI and actions
// -------------------------------------------------------------
// - Displays user avatar, name, and post timestamp
// - Shows edit, delete, and PDF download actions for post owner
// - Integrates async PDF generation using custom hook and button

import { Avatar, AvatarImage } from "@frontend/components/ui/avatar";
import { Button } from "@frontend/components/ui/button";
import {
  PencilIcon, // Edit icon
  XIcon, // Cancel edit icon
  TrashIcon, // Delete icon
  DownloadIcon, // PDF download icon
  Loader, // Loading spinner icon
  ArchiveIcon, // Archive icon
  ArchiveRestoreIcon, // Unarchive icon
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { PostHeaderProps } from "../../types/social.types";
import { AsyncPdfDownloadButton } from "@frontend/components/pdf";
import { usePostPdfDocument } from "../../hooks/usePostPdfDocument";

const PostHeader: React.FC<PostHeaderProps> = ({
  post,
  currentUserId,
  onEdit,
  onDelete,
  onToggleArchive,
  isDeleting,
  isEditing,
  isTogglingArchive = false,
}) => {
  // Debug: log post data for troubleshooting
  console.log("[PostHeader] Post data:", {
    postId: post.id,
    isOwner: post.isOwner,
    userInfo: post.userInfo,
    user: post.user,
  });

  // Compute display name for user
  const displayName = post.userInfo
    ? `${post.userInfo.firstName} ${post.userInfo.lastName}`
    : `User ${post.user}`;

  // Get profile picture URL (fallback to default)
  const profilePictureUrl =
    post.userInfo?.profilePicture || "/alien-profile-pic-1.jpg";

  // Prepare PDF document using custom hook
  const { preparePdfDocument } = usePostPdfDocument({
    post: {
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      mediaFiles: post.mediaFiles,
      likeCount: post.likeCount,
    },
    user: {
      displayName,
      profilePictureUrl,
    },
  });

  // Render post header UI
  return (
    <div className="flex space-x-3 mb-2">
      {/* User avatar */}
      <Avatar>
        <AvatarImage src={profilePictureUrl} alt={displayName} />
      </Avatar>
      {/* User name and post timestamp */}
      <div className="flex-grow">
        <div className="font-semibold">{displayName}</div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-500">
            {post.createdAt && formatDistanceToNow(new Date(post.createdAt))}{" "}
            ago
          </div>
          {/* Archive badge */}
          {post.isArchived && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs rounded-full">
              <ArchiveIcon className="h-3 w-3" />
              <span>Archived</span>
            </div>
          )}
        </div>
      </div>
      {/* Owner actions: PDF download, edit, delete */}
      {post.isOwner && (
        <div className="flex gap-2">
          {/* PDF download button (async) */}
          <AsyncPdfDownloadButton
            preparePdfDocument={preparePdfDocument}
            fileName={`itinerary_ai_post_${post.id}_by_user_${post.user}`}
            buttonText={<DownloadIcon className="h-4 w-4" />}
            loadingText={<Loader className="h-4 w-4 animate-spin" />}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          />

          {/* Archive/Unarchive toggle button */}
          {onToggleArchive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleArchive}
              disabled={isDeleting || isTogglingArchive}
              className="h-8 w-8 p-0"
              title={post.isArchived ? "Unarchive post" : "Archive post"}
            >
              {isTogglingArchive ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : post.isArchived ? (
                <ArchiveRestoreIcon className="h-4 w-4" />
              ) : (
                <ArchiveIcon className="h-4 w-4" />
              )}
            </Button>
          )}

          {/* Edit button (toggles between edit/cancel) */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            disabled={isDeleting}
            className="h-8 w-8 p-0"
          >
            {isEditing ? (
              <XIcon className="h-4 w-4" />
            ) : (
              <PencilIcon className="h-4 w-4" />
            )}
          </Button>

          {/* Delete button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            disabled={isDeleting}
            className="h-8 w-8 p-0"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

// Export component
export default PostHeader;

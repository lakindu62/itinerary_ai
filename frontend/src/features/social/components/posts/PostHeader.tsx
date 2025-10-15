"use client";

import { Avatar, AvatarImage } from "@frontend/components/ui/avatar";
import { Button } from "@frontend/components/ui/button";
import { PencilIcon, XIcon, TrashIcon, DownloadIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { PostHeaderProps } from "../../types/social.types";
import { AuthSetup } from "@frontend/lib/AuthSetup";
import { BasePdfTemplate, PdfDownloadButton } from "@frontend/components/pdf";
import { PostPDFTemplate } from "@frontend/components/pdf/templates/PostPDFTemplate";

const PostHeader: React.FC<PostHeaderProps> = ({
  post,
  currentUserId,
  onEdit,
  onDelete,
  isDeleting,
  isEditing,
}) => {
  // Debug logging
  console.log("[PostHeader] Post data:", {
    postId: post.id,
    isOwner: post.isOwner,
    userInfo: post.userInfo,
    user: post.user,
  });

  // Get user display info
  const displayName = post.userInfo
    ? `${post.userInfo.firstName} ${post.userInfo.lastName}`
    : `User ${post.user}`;

  const profilePictureUrl =
    post.userInfo?.profilePicture || "/alien-profile-pic-1.jpg";

  return (
    <div className="flex space-x-3 mb-2">
      {/* <AuthSetup /> */}
      <Avatar>
        <AvatarImage src={profilePictureUrl} alt={displayName} />
      </Avatar>
      <div className="flex-grow">
        <div className="font-semibold">{displayName}</div>
        <div className="text-xs text-gray-500">
          {post.createdAt && formatDistanceToNow(new Date(post.createdAt))} ago
        </div>
      </div>
      {post.isOwner && (
        <div className="flex gap-2">
          <PdfDownloadButton
            document={
              <PostPDFTemplate
                data={{
                  user: {
                    displayName,
                    profilePictureUrl,
                  },
                  post: {
                    id: post.id,
                    content: post.content,
                    createdAt: post.createdAt,
                    updatedAt: post.updatedAt,
                    mediaFiles: post.mediaFiles || [], // adjust if your post object uses a different field
                    likesCount: post.likeCount ?? 0, // adjust if your post object uses a different field
                  },
                }}
              />
            }
            fileName={`itinerary_ai_post_${post.id}_by_user_${post.user}`}
            buttonDisplay={<DownloadIcon className="h-4 w-4" />}
            variant="ghost"
          />

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

export default PostHeader;

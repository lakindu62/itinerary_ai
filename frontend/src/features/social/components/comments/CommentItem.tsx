"use client";

import { Avatar, AvatarImage } from "@frontend/components/ui/avatar";
import { Button } from "@frontend/components/ui/button";
import { TrashIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { CommentItemProps } from "../../types/social.types";

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onDelete,
  canDelete = false,
}) => {
  // Fallbacks for display name and profile picture
  const displayName = comment.userInfo?.name?.trim()
    ? comment.userInfo.name
    : comment.userInfo?.id?.slice(0, 8) ||
      comment.user?.slice(0, 8) ||
      "Unknown";
  const displayProfilePic =
    comment.userInfo?.profilePicture || "/alien-profile-pic-1.jpg";

  // ===== COMMENT DEBUG =====
  console.log("[CommentItem] Displaying comment:", comment);
  console.log("[CommentItem] canDelete:", canDelete);
  console.log("[CommentItem] comment.isOwner:", comment.isOwner);

  return (
    <div className="flex items-start gap-2 mb-3 group">
      <Avatar className="h-8 w-8">
        <AvatarImage src={displayProfilePic} />
      </Avatar>
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <div className="text-xs font-medium">{displayName}</div>
          <div className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(comment.createdAt))} ago
          </div>
          {canDelete && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(comment.id)}
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <TrashIcon className="h-3 w-3" />
            </Button>
          )}
        </div>
        <div className="text-sm mt-1">{comment.content}</div>
      </div>
    </div>
  );
};

export default CommentItem;

"use client";

import { Button } from "@frontend/components/ui/button";
import { HeartIcon, MessageCircleIcon } from "lucide-react";
import { PostActionsProps } from "../../types/social.types";

const PostActions: React.FC<PostActionsProps> = ({
  likeCount,
  commentCount,
  hasLiked,
  onLike,
  onToggleComments,
}) => {
  return (
    <div className="flex items-center gap-3 mb-2">
      <Button
        variant="ghost"
        size="sm"
        className={hasLiked ? "text-red-500" : ""}
        onClick={onLike}
      >
        <HeartIcon className="size-4" />
        <span className="ml-2">{likeCount}</span>
      </Button>
      <Button variant="ghost" size="sm" onClick={onToggleComments}>
        <MessageCircleIcon className="size-4" />
        <span className="ml-2">{commentCount}</span>
      </Button>
    </div>
  );
};

export default PostActions;

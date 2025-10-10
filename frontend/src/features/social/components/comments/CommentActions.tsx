"use client";

import { useState } from "react";
import { Button } from "@frontend/components/ui/button";
import { Textarea } from "@frontend/components/ui/textarea";
import { TrashIcon, Edit2Icon, CheckIcon, XIcon } from "lucide-react";
import type { Comment } from "../../types/social.types";

interface CommentActionsProps {
  comment: Comment;
  onDelete?: (commentId: string) => void;
  onEdit?: (commentId: string, content: string) => Promise<void>;
  canDelete?: boolean;
  canEdit?: boolean;
}

const CommentActions: React.FC<CommentActionsProps> = ({
  comment,
  onDelete,
  onEdit,
  canDelete = false,
  canEdit = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveEdit = async () => {
    if (!editContent.trim() || !onEdit) return;
    setIsSubmitting(true);
    try {
      await onEdit(comment.id, editContent);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 w-full">
        <Textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="text-sm min-h-[60px] resize-none"
          disabled={isSubmitting}
        />
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleSaveEdit}
            disabled={!editContent.trim() || isSubmitting}
            className="h-7"
          >
            <CheckIcon className="h-3 w-3 mr-1" />
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancelEdit}
            disabled={isSubmitting}
            className="h-7"
          >
            <XIcon className="h-3 w-3 mr-1" />
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="text-sm flex-1">{comment.content}</div>
      {/* Action buttons */}
      {canEdit && onEdit && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Edit2Icon className="h-3 w-3" />
        </Button>
      )}
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
  );
};

export default CommentActions;

"use client";

import { useState } from "react";
import { Button } from "@frontend/components/ui/button";
import { Textarea } from "@frontend/components/ui/textarea";
import { SendIcon } from "lucide-react";
import { CommentFormProps } from "../../types/social.types";

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  isSubmitting,
  placeholder = "Write a comment...",
}) => {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = () => {
    if (!commentText.trim()) return;
    onSubmit(commentText);
    setCommentText(""); // Clear form after submission
  };

  return (
    <div className="flex items-end gap-2 mt-4">
      <Textarea
        placeholder={placeholder}
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        className="min-h-[40px] resize-none"
        disabled={isSubmitting}
      />
      <Button
        size="sm"
        onClick={handleSubmit}
        disabled={!commentText.trim() || isSubmitting}
      >
        {isSubmitting ? (
          "Posting..."
        ) : (
          <>
            <SendIcon className="size-3 mr-1" />
            Comment
          </>
        )}
      </Button>
    </div>
  );
};

export default CommentForm;

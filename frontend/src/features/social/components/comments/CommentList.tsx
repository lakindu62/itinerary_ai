import CommentItem from "./CommentItem";
import { CommentsListProps } from "../../types/social.types";
import { Skeleton } from "@frontend/components/ui/skeleton";

const CommentsList: React.FC<CommentsListProps> = ({
  comments,
  loading,
  onDeleteComment,
  onEditComment,
  currentUserId,
}) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-start gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-gray-500 text-sm text-center py-4">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onDelete={onDeleteComment}
          onEdit={onEditComment}
          canDelete={comment.isOwner}
          canEdit={comment.isOwner}
        />
      ))}
    </div>
  );
};

export default CommentsList;

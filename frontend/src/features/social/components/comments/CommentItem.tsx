import { Avatar, AvatarImage } from "@frontend/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { CommentItemProps } from "../../types/social.types";
import CommentActions from "./CommentActions";

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onDelete,
  onEdit,
  canDelete = false,
  canEdit = false,
}) => {
  const displayName = comment.userInfo?.name?.trim()
    ? comment.userInfo.name
    : comment.userInfo?.id?.slice(0, 8) ||
      comment.user?.slice(0, 8) ||
      "Unknown";
  const displayProfilePic =
    comment.userInfo?.profilePicture || "/alien-profile-pic-1.jpg";

  return (
    <div className="flex items-start gap-2 mb-3 group">
      <Avatar className="h-8 w-8">
        <AvatarImage src={displayProfilePic} />
      </Avatar>
      <div className="flex-grow">
        <div className="flex items-center gap-2 mb-1">
          <div className="text-xs font-medium">{displayName}</div>
          <div className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(comment.createdAt))} ago
          </div>
        </div>
        {/* Only show comment+actions if not editing, otherwise show edit box over entire area */}
        <CommentActions
          comment={comment}
          onDelete={onDelete}
          onEdit={onEdit}
          canDelete={canDelete}
          canEdit={canEdit}
        />
      </div>
    </div>
  );
};

export default CommentItem;

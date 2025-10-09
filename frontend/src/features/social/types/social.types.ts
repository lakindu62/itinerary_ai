// Types for social media components
export type Comment = {
  id: string;
  user: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type PostUserInfo = {
  _id: string;
  clerkUserId: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
};

export type Post = {
  id: string;
  user: string;
  content?: string;
  likeCount: number;
  commentCount: number;
  userLiked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  image?: string; // Kept for backward compatibility
  mediaFiles?: string[];
  userInfo?: PostUserInfo; // User details from backend
  isOwner?: boolean; // Whether current user owns this post
};

export interface PostCardProps {
  post: Post;
  onDelete?: (id: string) => void;
}

export interface MediaDisplayProps {
  mediaFiles?: string[];
  fallbackImage?: string;
  className?: string;
}

export interface PostHeaderProps {
  post: Post;
  currentUserId?: string; // Optional since we use post.isOwner now
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  isEditing: boolean;
}

export interface PostContentProps {
  content?: string;
  className?: string;
}

export interface PostActionsProps {
  likeCount: number;
  commentCount: number;
  hasLiked: boolean;
  onLike: () => void;
  onToggleComments: () => void;
}

export interface CommentItemProps {
  comment: Comment;
  onDelete?: (commentId: string) => void;
  canDelete?: boolean;
}

export interface CommentsListProps {
  comments: Comment[];
  loading: boolean;
  onDeleteComment?: (commentId: string) => void;
  currentUserId?: string;
}

export interface CommentFormProps {
  onSubmit: (content: string) => void;
  isSubmitting: boolean;
  placeholder?: string;
}

export interface PostEditorProps {
  post: Post;
  editContent: string;
  editMediaFiles: File[];
  editMediaToRemove: string[];
  editMediaPreviewUrls: string[];
  signedMediaUrls: string[];
  isUpdating: boolean;
  onContentChange: (content: string) => void;
  onAddMedia: (files: File[]) => void;
  onRemoveNewMedia: (index: number) => void;
  onRemoveExistingMedia: (mediaKey: string) => void;
  onKeepExistingMedia: (mediaKey: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export interface EditActionsProps {
  onSave: () => void;
  onCancel: () => void;
  isUpdating: boolean;
}

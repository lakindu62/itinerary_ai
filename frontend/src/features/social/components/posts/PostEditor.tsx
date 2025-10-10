"use client";

import { Textarea } from "@frontend/components/ui/textarea";
import MediaEditor from "../MediaEditor";
import EditActions from "../EditActions";
import { PostEditorProps } from "../../types/social.types";

const PostEditor: React.FC<PostEditorProps> = ({
  post,
  editContent,
  editMediaFiles,
  editMediaToRemove,
  editMediaPreviewUrls,
  signedMediaUrls,
  isUpdating,
  onContentChange,
  onAddMedia,
  onRemoveNewMedia,
  onRemoveExistingMedia,
  onKeepExistingMedia,
  onSave,
  onCancel,
}) => {
  return (
    <div className="space-y-4 mb-4">
      {/* Content editor */}
      <Textarea
        value={editContent}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="What's on your mind?"
        disabled={isUpdating}
        className="min-h-[80px] resize-none"
      />

      {/* Media editor */}
      <MediaEditor
        signedMediaUrls={signedMediaUrls}
        editMediaFiles={editMediaFiles}
        editMediaToRemove={editMediaToRemove}
        editMediaPreviewUrls={editMediaPreviewUrls}
        mediaFiles={post.mediaFiles}
        fallbackImage={post.image}
        isUpdating={isUpdating}
        onRemoveExistingMedia={onRemoveExistingMedia}
        onKeepExistingMedia={onKeepExistingMedia}
        onAddEditMedia={onAddMedia}
        onRemoveNewMedia={onRemoveNewMedia}
        postId={post.id}
      />

      {/* Save/Cancel buttons */}
      <EditActions
        onSave={onSave}
        onCancel={onCancel}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default PostEditor;

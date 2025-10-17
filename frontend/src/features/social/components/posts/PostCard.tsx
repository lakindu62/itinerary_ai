"use client";

import { Card, CardContent } from "@frontend/components/ui/card";
import { useState } from "react";

// Import types
import { PostCardProps } from "../../types/social.types";

// Import components
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import MediaCarousel from "../MediaCarousel";
import PostActions from "./PostActions";
import PostEditor from "./PostEditor";
import CommentsList from "../comments/CommentList";
import CommentForm from "../comments/CommentForm";

// Import hooks
import { usePostInteractions } from "../../hooks/usePostInteractions";
import { usePostEdit } from "../../hooks/usePostEdit";
import { useMediaManager } from "../../hooks/useMediaManager";
import { useUpdatePostMutation } from "../../lib/social.api";
import { AuthSetup } from "@frontend/lib/AuthSetup";
import SpotlightWrapper from "@frontend/components/SpotLightWrapper";

const PostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
  // Archive toggle state and mutation
  const [isTogglingArchive, setIsTogglingArchive] = useState(false);
  const [updatePost] = useUpdatePostMutation();

  // Custom hooks for different concerns
  const {
    hasLiked,
    optimisticLikes,
    showComments,
    isCommenting,
    comments,
    loadingComments,
    isDeleting,
    handleLike,
    handleAddComment,
    handleDeletePost,
    handleShowComments,
    handleDeleteComment,
    handleEditComment,
  } = usePostInteractions(post, onDelete);

  const {
    isEditing,
    editContent,
    editMediaFiles,
    editMediaToRemove,
    isUpdating,
    editMediaPreviewUrls,
    handleEditToggle,
    handleSaveEdit,
    handleRemoveExistingMedia,
    handleKeepExistingMedia,
    handleAddEditMedia,
    handleRemoveNewMedia,
    setEditContent,
  } = usePostEdit(post);

  const { signedMediaUrls } = useMediaManager(post.mediaFiles, post.image);

  // Handle archive toggle
  const handleToggleArchive = async () => {
    try {
      setIsTogglingArchive(true);
      await updatePost({
        postId: post.id,
        updates: {
          isArchived: !post.isArchived, // Toggle the current state
        },
      }).unwrap();
      // The post will be refetched automatically by RTK Query
    } catch (error) {
      console.error("[PostCard] Failed to toggle archive status:", error);
      alert("Failed to update archive status. Please try again.");
    } finally {
      setIsTogglingArchive(false);
    }
  };

  return (
    <SpotlightWrapper enableVerticalFade={false} className="mb-4  rounded-xl">
      <Card>
        {/* <AuthSetup /> */}
        <CardContent className="p-4">
          {/* Post Header with user info and action buttons */}
          <PostHeader
            post={post}
            onEdit={handleEditToggle}
            onDelete={handleDeletePost}
            onToggleArchive={handleToggleArchive}
            isDeleting={isDeleting}
            isEditing={isEditing}
            isTogglingArchive={isTogglingArchive}
          />

          {/* Content section - conditional rendering for edit mode */}
          {isEditing ? (
            // Edit mode UI
            <PostEditor
              post={post}
              editContent={editContent}
              editMediaFiles={editMediaFiles}
              editMediaToRemove={editMediaToRemove}
              editMediaPreviewUrls={editMediaPreviewUrls}
              signedMediaUrls={signedMediaUrls}
              isUpdating={isUpdating}
              onContentChange={setEditContent}
              onAddMedia={handleAddEditMedia}
              onRemoveNewMedia={handleRemoveNewMedia}
              onRemoveExistingMedia={handleRemoveExistingMedia}
              onKeepExistingMedia={handleKeepExistingMedia}
              onSave={handleSaveEdit}
              onCancel={handleEditToggle}
            />
          ) : (
            // View mode content display
            <>
              <PostContent content={post.content} />

              {/* Media Carousel */}
              <MediaCarousel
                mediaFiles={signedMediaUrls}
                fallbackImage={undefined}
              />
            </>
          )}

          {/* Like and comment buttons - only show in view mode */}
          {!isEditing && (
            <PostActions
              likeCount={optimisticLikes}
              commentCount={post.commentCount}
              hasLiked={hasLiked}
              onLike={handleLike}
              onToggleComments={handleShowComments}
            />
          )}

          {/* Comments Section - only show in view mode */}
          {!isEditing && showComments && (
            <div className="pt-3 border-t space-y-4">
              <CommentsList
                comments={comments}
                loading={loadingComments}
                onDeleteComment={handleDeleteComment}
                onEditComment={handleEditComment}
                currentUserId="" // TODO: Handle comment ownership separately
              />

              <CommentForm
                onSubmit={handleAddComment}
                isSubmitting={isCommenting}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </SpotlightWrapper>
  );
};

export default PostCard;

// "use client";

// import { Card, CardContent } from "@frontend/components/ui/card";

// // Import types
// import { PostCardProps } from "../types/social.types";

// // Import components
// import PostHeader from "./PostHeader";
// import PostContent from "./PostContent";
// import MediaCarousel from "./MediaCarousel";
// import PostActions from "./PostActions";
// import PostEditor from "./PostEditor";
// import CommentsList from "./CommentsList";
// import CommentForm from "./CommentForm";

// // Import hooks
// import { usePostInteractions } from "../hooks/usePostInteractions";
// import { usePostEdit } from "../hooks/usePostEdit";
// import { useMediaManager } from "../hooks/useMediaManager";

// const PostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
//   // Custom hooks for different concerns
//   const {
//     hasLiked,
//     optimisticLikes,
//     showComments,
//     isCommenting,
//     comments,
//     loadingComments,
//     isDeleting,
//     handleLike,
//     handleAddComment,
//     handleDeletePost,
//     handleShowComments,
//     handleDeleteComment,
//     currentUserId,
//   } = usePostInteractions(post, onDelete);

//   const {
//     isEditing,
//     editContent,
//     editMediaFiles,
//     editMediaToRemove,
//     isUpdating,
//     editMediaPreviewUrls,
//     handleEditToggle,
//     handleSaveEdit,
//     handleRemoveExistingMedia,
//     handleKeepExistingMedia,
//     handleAddEditMedia,
//     handleRemoveNewMedia,
//     setEditContent,
//   } = usePostEdit(post);

//   const { signedMediaUrls } = useMediaManager(post.mediaFiles, post.image);

//   return (
//     <Card className="mb-4">
//       <CardContent className="p-4">
//         {/* Post Header with user info and action buttons */}
//         <PostHeader
//           post={post}
//           currentUserId={currentUserId}
//           onEdit={handleEditToggle}
//           onDelete={handleDeletePost}
//           isDeleting={isDeleting}
//           isEditing={isEditing}
//         />

//         {/* Content section - conditional rendering for edit mode */}
//         {isEditing ? (
//           // Edit mode UI
//           <PostEditor
//             post={post}
//             editContent={editContent}
//             editMediaFiles={editMediaFiles}
//             editMediaToRemove={editMediaToRemove}
//             editMediaPreviewUrls={editMediaPreviewUrls}
//             signedMediaUrls={signedMediaUrls}
//             isUpdating={isUpdating}
//             onContentChange={setEditContent}
//             onAddMedia={handleAddEditMedia}
//             onRemoveNewMedia={handleRemoveNewMedia}
//             onRemoveExistingMedia={handleRemoveExistingMedia}
//             onKeepExistingMedia={handleKeepExistingMedia}
//             onSave={handleSaveEdit}
//             onCancel={handleEditToggle}
//           />
//         ) : (
//           // View mode content display
//           <>
//             <PostContent content={post.content} />

//             {/* Media Carousel */}
//             <MediaCarousel
//               mediaFiles={post.mediaFiles}
//               fallbackImage={post.image}
//             />
//           </>
//         )}

//         {/* Like and comment buttons - only show in view mode */}
//         {!isEditing && (
//           <PostActions
//             likeCount={optimisticLikes}
//             commentCount={post.commentCount}
//             hasLiked={hasLiked}
//             onLike={handleLike}
//             onToggleComments={handleShowComments}
//           />
//         )}

//         {/* Comments Section - only show in view mode */}
//         {!isEditing && showComments && (
//           <div className="pt-3 border-t">
//             <CommentsList
//               comments={comments}
//               loading={loadingComments}
//               onDeleteComment={handleDeleteComment}
//               currentUserId={currentUserId}
//             />
//             <CommentForm
//               onSubmit={handleAddComment}
//               isSubmitting={isCommenting}
//               placeholder="Write a comment..."
//             />
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default PostCard;

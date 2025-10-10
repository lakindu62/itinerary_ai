//MediaEditor.tsx /Comet
"use client";

import { Button } from "@frontend/components/ui/button";

interface MediaEditorProps {
  signedMediaUrls: string[];
  editMediaFiles: File[];
  editMediaToRemove: string[];
  editMediaPreviewUrls: string[];
  mediaFiles?: string[];
  fallbackImage?: string;
  isUpdating: boolean;
  onRemoveExistingMedia: (mediaKey: string) => void;
  onKeepExistingMedia: (mediaKey: string) => void;
  onAddEditMedia: (files: File[]) => void;
  onRemoveNewMedia: (index: number) => void;
  postId: string;
}

const MediaEditor: React.FC<MediaEditorProps> = ({
  signedMediaUrls,
  editMediaFiles,
  editMediaToRemove,
  editMediaPreviewUrls,
  mediaFiles,
  fallbackImage,
  isUpdating,
  onRemoveExistingMedia,
  onKeepExistingMedia,
  onAddEditMedia,
  onRemoveNewMedia,
  postId,
}) => {
  const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url.split("?")[0]);

  const handleAddEditMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Basic validation: check file types
    const validFiles = files.filter((file) => {
      return file.type.startsWith("image/") || file.type.startsWith("video/");
    });

    if (validFiles.length !== files.length) {
      alert("Some files were skipped. Only image and video files are allowed.");
    }

    if (validFiles.length > 0) {
      onAddEditMedia(validFiles);
    }

    // Reset file input
    e.target.value = "";
  };

  return (
    <div className="space-y-4">
      {/* Current media management */}
      {signedMediaUrls.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">Current Media:</p>
          <div className="grid grid-cols-2 gap-2">
            {signedMediaUrls.map((url, index) => {
              const mediaKey = mediaFiles?.[index] || fallbackImage || "";
              const isMarkedForRemoval = editMediaToRemove.includes(mediaKey);

              return (
                <div
                  key={index}
                  className={`relative rounded-lg overflow-hidden ${
                    isMarkedForRemoval ? "opacity-50" : ""
                  }`}
                >
                  {isVideo(url) ? (
                    <video
                      src={url}
                      className="w-full h-24 object-cover"
                      controls={false}
                    />
                  ) : (
                    <img
                      src={url}
                      alt={`Media ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  )}

                  {/* Remove/Keep button overlay */}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0 text-xs"
                    onClick={() =>
                      isMarkedForRemoval
                        ? onKeepExistingMedia(mediaKey)
                        : onRemoveExistingMedia(mediaKey)
                    }
                    disabled={isUpdating}
                    title={
                      isMarkedForRemoval
                        ? "Keep this media"
                        : "Remove this media"
                    }
                  >
                    {isMarkedForRemoval ? "+" : "×"}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* New media preview */}
      {editMediaFiles.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">New Media to Add:</p>
          <div className="grid grid-cols-2 gap-2">
            {editMediaFiles.map((file, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden">
                {file.type.startsWith("image/") ? (
                  <img
                    src={
                      editMediaPreviewUrls[index] || URL.createObjectURL(file)
                    }
                    alt={`New media ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                ) : file.type.startsWith("video/") ? (
                  <video
                    src={
                      editMediaPreviewUrls[index] || URL.createObjectURL(file)
                    }
                    className="w-full h-24 object-cover"
                    controls={false}
                  />
                ) : (
                  <div className="w-full h-24 bg-gray-200 flex items-center justify-center text-xs">
                    {file.name.substring(0, 10)}...
                  </div>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0 text-xs"
                  onClick={() => onRemoveNewMedia(index)}
                  disabled={isUpdating}
                  title="Remove this new media"
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add media input */}
      <div>
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleAddEditMedia}
          disabled={isUpdating}
          className="hidden"
          id={`media-input-${postId}`}
        />
        <label
          htmlFor={`media-input-${postId}`}
          className="inline-block cursor-pointer"
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUpdating}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(`media-input-${postId}`)?.click();
            }}
          >
            {editMediaFiles.length > 0
              ? `Add More Media (${editMediaFiles.length} selected)`
              : "Add Media"}
          </Button>
        </label>
      </div>
    </div>
  );
};

export default MediaEditor;

// "use client";

// import { Button } from "@frontend/components/ui/button";

// interface MediaEditorProps {
//   signedMediaUrls: string[];
//   editMediaFiles: File[];
//   editMediaToRemove: string[];
//   editMediaPreviewUrls: string[];
//   mediaFiles?: string[];
//   fallbackImage?: string;
//   isUpdating: boolean;
//   onRemoveExistingMedia: (mediaKey: string) => void;
//   onKeepExistingMedia: (mediaKey: string) => void;
//   onAddEditMedia: (files: File[]) => void;
//   onRemoveNewMedia: (index: number) => void;
//   postId: string;
// }

// const MediaEditor: React.FC<MediaEditorProps> = ({
//   signedMediaUrls,
//   editMediaFiles,
//   editMediaToRemove,
//   editMediaPreviewUrls,
//   mediaFiles,
//   fallbackImage,
//   isUpdating,
//   onRemoveExistingMedia,
//   onKeepExistingMedia,
//   onAddEditMedia,
//   onRemoveNewMedia,
//   postId,
// }) => {
//   const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url.split("?")[0]);

//   const handleAddEditMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     onAddEditMedia(files);
//     // Reset file input
//     e.target.value = "";
//   };

//   return (
//     <div className="space-y-4">
//       {/* Current media management */}
//       {signedMediaUrls.length > 0 && (
//         <div className="space-y-2">
//           <div className="text-sm font-medium text-gray-700">
//             Current Media:
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {signedMediaUrls.map((url, index) => {
//               const mediaKey = mediaFiles?.[index] || fallbackImage || "";
//               const isMarkedForRemoval = editMediaToRemove.includes(mediaKey);

//               return (
//                 <div
//                   key={index}
//                   className={`relative group ${
//                     isMarkedForRemoval ? "opacity-50" : ""
//                   }`}
//                 >
//                   {isVideo(url) ? (
//                     <video
//                       src={url}
//                       className="w-20 h-20 object-cover rounded border"
//                       muted
//                     />
//                   ) : (
//                     <img
//                       src={url}
//                       className="w-20 h-20 object-cover rounded border"
//                       alt="Post media"
//                     />
//                   )}

//                   {/* Remove/Keep button overlay */}
//                   <Button
//                     size="sm"
//                     variant={isMarkedForRemoval ? "default" : "destructive"}
//                     className="absolute -top-1 -right-1 h-5 w-5 p-0 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
//                     onClick={() =>
//                       isMarkedForRemoval
//                         ? onKeepExistingMedia(mediaKey)
//                         : onRemoveExistingMedia(mediaKey)
//                     }
//                     disabled={isUpdating}
//                     title={
//                       isMarkedForRemoval
//                         ? "Keep this media"
//                         : "Remove this media"
//                     }
//                   >
//                     {isMarkedForRemoval ? "+" : "×"}
//                   </Button>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* New media preview */}
//       {editMediaFiles.length > 0 && (
//         <div className="space-y-2">
//           <div className="text-sm font-medium text-gray-700">
//             New Media to Add:
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {editMediaFiles.map((file, index) => (
//               <div key={index} className="relative group">
//                 {file.type.startsWith("image/") ? (
//                   <img
//                     src={editMediaPreviewUrls[index]}
//                     className="w-20 h-20 object-cover rounded border"
//                     alt="New media preview"
//                   />
//                 ) : file.type.startsWith("video/") ? (
//                   <video
//                     src={editMediaPreviewUrls[index]}
//                     className="w-20 h-20 object-cover rounded border"
//                     muted
//                   />
//                 ) : (
//                   <div className="w-20 h-20 bg-gray-100 rounded border flex items-center justify-center">
//                     <div className="text-xs text-center p-1 text-gray-500">
//                       {file.name.substring(0, 10)}...
//                     </div>
//                   </div>
//                 )}

//                 <Button
//                   size="sm"
//                   variant="destructive"
//                   className="absolute -top-1 -right-1 h-5 w-5 p-0 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
//                   onClick={() => onRemoveNewMedia(index)}
//                   disabled={isUpdating}
//                   title="Remove this new media"
//                 >
//                   ×
//                 </Button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Add media input */}
//       <div>
//         <input
//           type="file"
//           accept="image/*,video/*"
//           multiple
//           onChange={handleAddEditMedia}
//           disabled={isUpdating}
//           className="hidden"
//           id={`edit-media-${postId}`}
//         />
//         <label htmlFor={`edit-media-${postId}`}>
//           <Button
//             variant="outline"
//             size="sm"
//             disabled={isUpdating}
//             asChild
//             className="cursor-pointer"
//           >
//             <span>
//               {editMediaFiles.length > 0
//                 ? `Add More Media (${editMediaFiles.length} selected)`
//                 : "Add Media"}
//             </span>
//           </Button>
//         </label>
//       </div>
//     </div>
//   );
// };

// export default MediaEditor;

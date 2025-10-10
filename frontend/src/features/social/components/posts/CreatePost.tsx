"use client";

import { Button } from "@frontend/components/ui/button";
import { Card, CardContent } from "@frontend/components/ui/card";
import { Textarea } from "@frontend/components/ui/textarea";
import { Avatar, AvatarImage } from "@frontend/components/ui/avatar";
// import { useUser } from "@clerk/nextjs";
// import { SetStateAction, useState } from "react";

import {
  ImageIcon,
  Loader2Icon,
  PlayIcon,
  SendIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import {
  useCreatePostMutation,
  useGetCurrentUserProfileQuery,
} from "../../lib/social.api";
import { getSignedUploadUrl, uploadFileToSignedUrl } from "src/lib/media.api";
import { useAuth } from "@clerk/nextjs";
import { error } from "console";

const CreatePost = () => {
  const { data: user, error } = useGetCurrentUserProfileQuery();

  const fallbackProfilePic = "/alien-profile-pic-1.jpg";
  const fallbackFirstName = "Jim";
  const fallbackUsername = "@username";

  // Extract profile data
  const profilePic = user?.travelProfile?.profilePicture || fallbackProfilePic;
  const firstName = user ? `${user.firstName}` : fallbackFirstName;
  const username = fallbackUsername;

  const [content, setContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [createPost, { isLoading }] = useCreatePostMutation();
  const { sessionClaims, isLoaded } = useAuth();
  const mongoUserId = sessionClaims?.metadata?._id;

  // Don't render until auth is loaded
  if (!isLoaded) {
    return null;
  }

  const handleSubmit = async () => {
    // Validate at submit time instead of render time
    if (
      !mongoUserId ||
      typeof mongoUserId !== "string" ||
      mongoUserId.length !== 24
    ) {
      const errorMsg = `[CreatePost] MongoDB user ID (_id) missing or invalid in Clerk sessionClaims: ${JSON.stringify(
        sessionClaims?.metadata
      )}`;
      console.error(errorMsg);
      alert("Authentication error. Please refresh the page and try again.");
      return;
    }
    let uploadedMediaUrls: string[] = [];
    try {
      if (selectedFiles.length > 0) {
        const bucket = "social-media";
        const uploadPromises = selectedFiles.map(async (file) => {
          const timestamp = Date.now();
          const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_"); // Sanitize filename
          // Use MongoDB user ID in file path
          const filePath = mongoUserId
            ? `posts/${mongoUserId}/${timestamp}_${safeName}`
            : `posts/${timestamp}_${safeName}`;
          const fileKeyStored = `${bucket}/${filePath}`;
          const signedUrl = await getSignedUploadUrl(filePath, bucket);
          await uploadFileToSignedUrl(file, signedUrl);
          return fileKeyStored;
        });
        uploadedMediaUrls = await Promise.all(uploadPromises);
      }
      await createPost({ content, mediaFiles: uploadedMediaUrls });
      setContent("");
      setSelectedFiles([]);
      setShowMediaUpload(false);
    } catch (error: any) {
      alert("Error posting: " + error.message);
    }
  };

  // **Handle file selection with multiple files**
  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  // **Remove specific file**
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // **Get file type for display**
  const getFileType = (file: File): "image" | "video" | "other" => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    return "other";
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={profilePic} />
            </Avatar>
            <Textarea
              placeholder={`Hey ${firstName}, What's on your mind?`}
              className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-2 text-base"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* {(showImageUpload || imageUrl) && (
            <div className="border rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setSelectedImage(file || null);
                }}
                disabled={isLoading}
              />
              
              {selectedImage && (
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="preview"
                  className="max-w-xs rounded mt-2"
                />
              )}
            </div>
          )} */}

          {/* **UPDATED: Multiple media files upload section** */}
          {(showMediaUpload || selectedFiles.length > 0) && (
            <div className="border rounded-lg p-4">
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileSelection}
                disabled={isLoading}
                className="mb-4"
              />

              {/* ** Preview selected files** */}
              {selectedFiles.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                        {getFileType(file) === "image" ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index}`}
                            className="w-full h-full object-cover"
                          />
                        ) : getFileType(file) === "video" ? (
                          <div className="relative w-full h-full">
                            <video
                              src={URL.createObjectURL(file)}
                              className="w-full h-full object-cover"
                              muted
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <PlayIcon className="w-8 h-8 text-white bg-black bg-opacity-50 rounded-full p-1" />
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 text-center p-2">
                            {file.name}
                          </div>
                        )}
                      </div>

                      {/* **ADDED: Remove file button** */}
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeFile(index)}
                        disabled={isLoading}
                      >
                        <XIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                onClick={() => setShowMediaUpload(!showMediaUpload)}
                disabled={isLoading}
              >
                <ImageIcon className="size-4 mr-2" />
                Media
              </Button>
            </div>
            <Button
              className="flex items-center"
              onClick={handleSubmit}
              disabled={
                (!content.trim() && selectedFiles.length === 0) || isLoading
              }
            >
              {isLoading ? (
                <>
                  <Loader2Icon className="size-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <SendIcon className="size-4 mr-2" />
                  Post
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;

"use client";

import { Button } from "@frontend/components/ui/button";
import { Card, CardContent } from "@frontend/components/ui/card";
import { Textarea } from "@frontend/components/ui/textarea";
import { Avatar, AvatarImage } from "@frontend/components/ui/avatar";
import { useAuth } from "@clerk/nextjs"; // CHANGE: Add Clerk auth hook
// import { SetStateAction, useState } from "react";

import {
  ImageIcon,
  Loader2Icon,
  PlayIcon,
  SendIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { createPost } from "../../lib"; // CHANGE: Removed STATIC_USER_ID import
import { getSignedUploadUrl, uploadFileToSignedUrl } from "src/lib/media.api";

const CreatePost = () => {
  // CHANGE: Use Clerk authentication instead of static user ID
  const { getToken, userId } = useAuth();
  const [content, setContent] = useState("");
  // const [imageUrl, setImageUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  // const [selectedImage, setSelectedImage] = useState<File | null>(null);
  // const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showMediaUpload, setShowMediaUpload] = useState(false);

  const handleSubmit = async () => {
    setIsPosting(true);
    let uploadedImageUrl = "";
    let uploadedMediaUrls: string[] = [];
    let fileKeyStored = "";

    try {
      // CHANGE: Get authentication token from Clerk
      const token = await getToken();

      //If files selected, get signed URL for each and upload
      if (selectedFiles.length > 0) {
        const bucket = "social-media";

        // Upload all files concurrently
        const uploadPromises = selectedFiles.map(async (file) => {
          const filePath = `posts/${userId}/${Date.now()}_${file.name}`; // CHANGE: Use userId from Clerk
          const fileKeyStored = `${bucket}/${filePath}`;
          const signedUrl = await getSignedUploadUrl(filePath, bucket);
          await uploadFileToSignedUrl(file, signedUrl);
          return fileKeyStored;
        });

        uploadedMediaUrls = await Promise.all(uploadPromises);
        console.log("Uploaded file keys:", uploadedMediaUrls);
      }

      await createPost(content, uploadedMediaUrls, undefined, token); // CHANGE: Pass token to createPost
      //Create the post with image reference
      // await createPost(content, fileKeyStored);

      setContent("");
      setSelectedFiles([]);
      setShowMediaUpload(false);
      // setSelectedImage(null);
      // setImageUrl("");
      // setShowImageUpload(false);
    } catch (error: any) {
      alert("Error posting: " + error.message);
    } finally {
      setIsPosting(false);
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
              <AvatarImage src="/alien-profile-pic-1.jpg" />
            </Avatar>
            <Textarea
              placeholder="What's on your mind?"
              className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 text-base"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPosting}
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
                disabled={isPosting}
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
                disabled={isPosting}
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
                        disabled={isPosting}
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
                disabled={isPosting}
              >
                <ImageIcon className="size-4 mr-2" />
                Photo
              </Button>
            </div>
            <Button
              className="flex items-center"
              onClick={handleSubmit}
              disabled={
                (!content.trim() && selectedFiles.length === 0) || isPosting
              }
            >
              {isPosting ? (
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

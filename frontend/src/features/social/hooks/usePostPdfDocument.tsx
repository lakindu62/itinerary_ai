import { ProcessedMedia } from "@frontend/components/pdf/templates/PostPDFTemplate";
import { PostPDFTemplate } from "@frontend/components/pdf/templates/PostPDFTemplate";
import { getSignedGetUrl } from "@frontend/lib/media.api";

interface PostData {
  id: string | number;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
  mediaFiles?: string[];
  likeCount?: number;
}

interface UserData {
  displayName: string;
  profilePictureUrl: string;
}

interface UsePostPdfDocumentProps {
  post: PostData;
  user: UserData;
}

/**
 * Custom hook to prepare PDF document for a post
 * Handles async media processing (fetching signed URLs for images)
 */
export const usePostPdfDocument = ({ post, user }: UsePostPdfDocumentProps) => {
  // Helper to determine if file is an image
  const isImageFile = (filePath: string): boolean => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
    return imageExtensions.some((ext) => filePath.toLowerCase().endsWith(ext));
  };

  // Prepare PDF document with async media processing
  const preparePdfDocument = async () => {
    const mediaFiles = post.mediaFiles || [];
    const processedMedia: ProcessedMedia[] = await Promise.all(
      mediaFiles.map(async (filePath) => {
        const isImage = isImageFile(filePath);

        if (isImage) {
          try {
            const signedUrl = await getSignedGetUrl(filePath);
            return {
              type: "image" as const,
              url: signedUrl,
              originalPath: filePath,
            };
          } catch (error) {
            console.error(`Failed to get signed URL for ${filePath}:`, error);
            return {
              type: "image" as const,
              url: "",
              originalPath: filePath,
            };
          }
        } else {
          return {
            type: "video" as const,
            url: "",
            originalPath: filePath,
          };
        }
      })
    );

    // Return the PDF document with processed media
    return (
      <PostPDFTemplate
        data={{
          user: {
            displayName: user.displayName,
            profilePictureUrl: user.profilePictureUrl,
          },
          post: {
            id: post.id,
            content: post.content,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            processedMedia,
            likesCount: post.likeCount ?? 0,
          },
        }}
      />
    );
  };

  return { preparePdfDocument };
};

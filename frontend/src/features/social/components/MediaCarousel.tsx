"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@frontend/components/ui/carousel";
import { Skeleton } from "@frontend/components/ui/skeleton";
import { MediaDisplayProps } from "../types/social.types";

const MediaCarousel: React.FC<MediaDisplayProps> = ({
  mediaFiles,
  fallbackImage,
  className = "",
}) => {
  // Use mediaFiles if available, fallback to single image
  const mediaUrls =
    mediaFiles && mediaFiles.length > 0
      ? mediaFiles
      : fallbackImage
      ? [fallbackImage]
      : [];

  if (mediaUrls.length === 0) return null;

  const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url.split("?")[0]);
  const MAX_MEDIA_HEIGHT = 500;

  return (
    <div className={`mb-3 ${className}`}>
      <Carousel className="w-full">
        <CarouselContent>
          {mediaUrls.map((url, index) => (
            <CarouselItem key={index}>
              <div
                className="relative rounded-lg overflow-hidden flex items-center justify-center bg-gray-100"
                style={{
                  height: `${MAX_MEDIA_HEIGHT}px`,
                  maxHeight: `${MAX_MEDIA_HEIGHT}px`,
                }}
              >
                {isVideo(url) ? (
                  <video
                    src={url}
                    controls
                    className="max-h-full max-w-full object-contain bg-black"
                    style={{ maxHeight: `${MAX_MEDIA_HEIGHT}px` }}
                  />
                ) : (
                  <img
                    src={url}
                    alt="Post media"
                    className="max-h-full max-w-full object-contain bg-gray-200"
                    style={{ maxHeight: `${MAX_MEDIA_HEIGHT}px` }}
                  />
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Only show navigation if multiple items */}
        {mediaUrls.length > 1 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
    </div>
  );
};

export default MediaCarousel;

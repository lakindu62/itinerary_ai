"use client";

import { useState, useEffect } from 'react';
import { getSignedGetUrl } from '@frontend/features/hotel-booking/lib/media-wrapper.api';
import { Loader2 } from 'lucide-react';

interface RoomImageProps {
  imagePath?: string;
  alt: string;
  className?: string;
  fallbackUrl?: string;
}

export default function RoomImage({ 
  imagePath, 
  alt, 
  className = "", 
  fallbackUrl = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop"
}: RoomImageProps) {
  const [imageSignedUrl, setImageSignedUrl] = useState<string>("");
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchImageSignedUrl = async () => {
      if (imagePath) {
        console.log('🏠 Fetching signed URL for room image path:', imagePath);
        setImageLoading(true);
        setImageError(false);
        
        try {
          const signedUrl = await getSignedGetUrl(imagePath);
          setImageSignedUrl(signedUrl);
          console.log('✅ Got signed URL for room image');
        } catch (error) {
          console.error('❌ Failed to get signed URL for room image:', error);
          setImageError(true);
        } finally {
          setImageLoading(false);
        }
      }
    };

    fetchImageSignedUrl();
  }, [imagePath]);

  // Show loading state
  if (imageLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Show image (signed URL if available, fallback if not)
  return (
    <img
      src={imageSignedUrl || fallbackUrl}
      alt={alt}
      className={className}
      onError={() => {
        setImageError(true);
        setImageSignedUrl(fallbackUrl);
      }}
    />
  );
}
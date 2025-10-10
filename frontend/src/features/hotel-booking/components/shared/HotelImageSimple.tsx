"use client";

import { useState, useEffect } from 'react';
import { getSignedGetUrl } from '@frontend/features/hotel-booking/lib/media-wrapper.api';
import { Loader2, ImageIcon } from 'lucide-react';

interface RoomImageSimpleProps {
  imagePath?: string;
  alt: string;
  className?: string;
  fallbackUrl?: string;
}

export default function RoomImageSimple({ 
  imagePath, 
  alt, 
  className = "", 
  fallbackUrl = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop"
}: RoomImageSimpleProps) {
  const [imageSignedUrl, setImageSignedUrl] = useState<string>("");
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchImageSignedUrl = async () => {
      // If no imagePath provided, use fallback
      if (!imagePath || imagePath.trim() === '') {
        console.log('🏠 No room image path provided, using fallback');
        setImageSignedUrl(fallbackUrl);
        return;
      }

      // If imagePath is already a valid URL (http/https), use it directly
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        console.log('🏠 Room image path is already a URL:', imagePath);
        setImageSignedUrl(imagePath);
        return;
      }

      console.log('🏠 Fetching signed URL for room image path:', imagePath);
      setImageLoading(true);
      setImageError(false);
      
      try {
        const signedUrl = await getSignedGetUrl(imagePath);
        console.log('✅ Got signed URL for room image:', signedUrl);
        setImageSignedUrl(signedUrl);
      } catch (error) {
        console.error('❌ Failed to get signed URL for room image:', error);
        console.log('🔄 Using fallback room image due to signed URL error');
        setImageError(true);
        setImageSignedUrl(fallbackUrl);
      } finally {
        setImageLoading(false);
      }
    };

    fetchImageSignedUrl();
  }, [imagePath, fallbackUrl]);

  // Show loading state
  if (imageLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  // Show fallback if no signed URL available
  if (!imageSignedUrl) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <ImageIcon className="h-6 w-6 text-gray-400" />
      </div>
    );
  }

  // Use regular img tag to avoid Next.js Image configuration issues
  return (
    <img
      src={imageSignedUrl}
      alt={alt}
      className={`${className} object-cover`}
      onError={() => {
        console.error('🏠 Room image failed to load:', imageSignedUrl);
        console.log('🔄 Switching to fallback room image');
        setImageError(true);
        setImageSignedUrl(fallbackUrl);
      }}
      onLoad={() => {
        console.log('✅ Room image loaded successfully:', imageSignedUrl);
      }}
    />
  );
}
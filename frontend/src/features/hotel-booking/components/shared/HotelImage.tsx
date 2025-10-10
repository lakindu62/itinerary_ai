"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getSignedGetUrl } from '@frontend/features/hotel-booking/lib/media-wrapper.api';
import { Loader2, ImageIcon } from 'lucide-react';

interface HotelImageProps {
  imagePath?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  fallbackUrl?: string;
  priority?: boolean;
}

export default function HotelImage({ 
  imagePath, 
  alt, 
  width,
  height,
  className = "", 
  fill = false,
  fallbackUrl = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
  priority = false
}: HotelImageProps) {
  const [imageSignedUrl, setImageSignedUrl] = useState<string>("");
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchImageSignedUrl = async () => {
      // If no imagePath provided, use fallback
      if (!imagePath || imagePath.trim() === '') {
        console.log('🏨 No image path provided, using fallback');
        setImageSignedUrl(fallbackUrl);
        return;
      }

      // If imagePath is already a valid URL (http/https), use it directly
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        console.log('🏨 Image path is already a URL:', imagePath);
        setImageSignedUrl(imagePath);
        return;
      }

      console.log('🏨 Fetching signed URL for hotel image path:', imagePath);
      setImageLoading(true);
      setImageError(false);
      
      try {
        const signedUrl = await getSignedGetUrl(imagePath);
        console.log('✅ Got signed URL for hotel image:', signedUrl);
        setImageSignedUrl(signedUrl);
      } catch (error) {
        console.error('❌ Failed to get signed URL for hotel image:', error);
        console.log('🔄 Using fallback image due to signed URL error');
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
      <div 
        className={`flex items-center justify-center bg-gray-100 ${className}`} 
        style={fill ? undefined : { width, height }}
      >
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Show fallback if no signed URL available
  if (!imageSignedUrl) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 ${className}`} 
        style={fill ? undefined : { width, height }}
      >
        <ImageIcon className="h-8 w-8 text-gray-400" />
      </div>
    );
  }

  // Show image with proper Next.js Image component
  if (fill) {
    return (
      <Image
        src={imageSignedUrl}
        alt={alt}
        fill
        className={className}
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={(e) => {
          console.error('🏨 Image failed to load:', imageSignedUrl);
          console.log('🔄 Switching to fallback image');
          setImageError(true);
          setImageSignedUrl(fallbackUrl);
        }}
      />
    );
  }

  return (
    <Image
      src={imageSignedUrl}
      alt={alt}
      width={width || 400}
      height={height || 300}
      className={className}
      priority={priority}
      onError={(e) => {
        console.error('🏨 Image failed to load:', imageSignedUrl);
        console.log('🔄 Switching to fallback image');
        setImageError(true);
        setImageSignedUrl(fallbackUrl);
      }}
    />
  );
}
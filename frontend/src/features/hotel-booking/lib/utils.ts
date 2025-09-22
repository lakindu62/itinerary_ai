// Utility function to get proper image URL
export const getImageUrl = (imagePath: string | null | undefined, type: 'hotel' | 'room' = 'hotel'): string => {
  if (!imagePath) {
    return `/images/${type}-placeholder.jpg`;
  }

  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // If it's a Minio path, construct the full URL
  if (imagePath.startsWith('/')) {
    return `${process.env.NEXT_PUBLIC_MINIO_ENDPOINT}${imagePath}`;
  }

  // Otherwise, assume it's a Minio object key
  const bucket = type === 'hotel' ? process.env.NEXT_PUBLIC_MINIO_BUCKET_HOTELS : process.env.NEXT_PUBLIC_MINIO_BUCKET_ROOMS;
  return `${process.env.NEXT_PUBLIC_MINIO_ENDPOINT}/${bucket}/${imagePath}`;
};
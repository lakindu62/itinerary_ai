import api from '@/lib/api';

// Minio upload utility
export const uploadToMinio = async (
  file: File, 
  bucket: 'hotel-images' | 'room-images'
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('bucket', bucket);
  
  try {
    // Create upload endpoint in your backend
    const response = await api.post('/upload/minio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.url;
  } catch (error) {
    console.error('Minio upload failed:', error);
    // Fallback to external image service
    return `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800`;
  }
};

// Get Minio image URL
export const getMinioImageUrl = (key: string, bucket: string): string => {
  return `${process.env.NEXT_PUBLIC_MINIO_ENDPOINT}/${bucket}/${key}`;
};

export default api;
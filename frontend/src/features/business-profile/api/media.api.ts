import axios from 'axios';
import { getSignedUrl } from '@/lib/media.api';

// Custom Error class for media operations
export class MediaUploadError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'MediaUploadError';
  }
}

export async function uploadMedia(file: File, type: string) {
  try {
    // Get a signed upload URL
    const filePath = `${type}/${Date.now()}_${file.name}`;
    const signedUrl = await getSignedUrl(filePath, type);

    // Upload directly to MinIO
    await axios.put(signedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });

    // Return the file path for database reference
    return filePath;
  } catch (error: any) {
    console.error('Media upload error:', error);
    throw new MediaUploadError(
      error.response?.data?.message || 'Failed to upload media',
      error
    );
  }
}
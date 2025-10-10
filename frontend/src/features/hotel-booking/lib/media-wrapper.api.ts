import { HotelResourceType, getHotelBucketConfig, generateHotelFileName, validateHotelFile } from './bucket-manager';

// Hotel booking specific media API configuration
const HOTEL_MEDIA_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

console.log('🖼️ Hotel Media API initialized:', {
  baseUrl: HOTEL_MEDIA_API_BASE_URL,
  timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
  user: 'NadPerz'
});

// Enhanced upload function for hotel booking resources
export const uploadToHotelResourceBucket = async (
  file: File,
  resourceType: HotelResourceType,
  userId: string = 'NadPerz'
): Promise<string> => {
  try {
    console.log(`🏨 Starting ${resourceType} upload:`, {
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      fileType: file.type,
      user: userId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    });

    // Validate file before upload
    const validation = validateHotelFile(file, resourceType);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const bucketConfig = getHotelBucketConfig(resourceType);
    const fileName = generateHotelFileName(resourceType, file.name, userId);
    
    console.log(`🪣 Hotel ${resourceType} upload details:`, {
      resourceType,
      bucketName: bucketConfig.bucketName,
      folder: bucketConfig.folder,
      fileName,
      userId,
      description: bucketConfig.description
    });

    // Get signed URL for hotel resource
    const signedUrl = await getHotelSignedUploadUrl(fileName, bucketConfig.bucketName);
    console.log(`✅ Got signed URL for ${bucketConfig.bucketName}/${resourceType}`);
    
    // Upload file to Minio
    await uploadHotelFileToSignedUrl(file, signedUrl, resourceType);
    
    // Return the storage path (not full HTTP URL)
    const storagePath = `${bucketConfig.bucketName}/${fileName}`;
    
    console.log(`✅ Hotel ${resourceType} upload completed:`, {
      storagePath,
      bucket: bucketConfig.bucketName,
      fileName,
      uploadedBy: userId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    });
    
    return storagePath;
    
  } catch (error) {
    console.error(`❌ Hotel ${resourceType} upload failed:`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      fileName: file.name,
      user: userId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    });
    throw error;
  }
};

// Get signed upload URL for hotel resources
export const getHotelSignedUploadUrl = async (
  fileName: string,
  bucket?: string
): Promise<string> => {
  const body: { fileName: string; bucket?: string } = { fileName };
  if (bucket) body.bucket = bucket;

  console.log('🔐 Requesting hotel signed upload URL:', { 
    fileName, 
    bucket,
    apiUrl: HOTEL_MEDIA_API_BASE_URL,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: 'NadPerz'
  });

  const response = await fetch(`${HOTEL_MEDIA_API_BASE_URL}/media/signed-upload-url`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "X-User-Login": "NadPerz",
      "X-Request-Timestamp": new Date().toISOString()
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    const error = `Failed to get hotel signed URL: ${response.status} - ${errorText}`;
    console.error(`❌ ${error}`);
    throw new Error(error);
  }
  
  const result = await response.json();
  console.log(`✅ Hotel signed upload URL obtained for bucket: ${bucket}`);
  return result.url;
};

// Upload file to signed URL with hotel-specific logging
export const uploadHotelFileToSignedUrl = async (
  file: File,
  signedUrl: string,
  resourceType: HotelResourceType
): Promise<void> => {
  console.log(`📤 Uploading hotel ${resourceType} file to Minio:`, {
    fileName: file.name,
    fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
    resourceType,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
  });

  const uploadResponse = await fetch(signedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
      "X-User-Login": "NadPerz",
    },
    body: file,
  });
  
  if (!uploadResponse.ok) {
    const error = `Hotel ${resourceType} file upload failed: ${uploadResponse.status}`;
    console.error(`❌ ${error}`);
    throw new Error(error);
  }
  
  console.log(`✅ Hotel ${resourceType} file uploaded successfully to Minio:`, {
    fileName: file.name,
    resourceType,
    status: uploadResponse.status,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: 'NadPerz'
  });
};

// Get signed GET URL for hotel resources
export const getHotelSignedGetUrl = async (
  filePath: string,
  expiry?: number
): Promise<string> => {
  if (!filePath) throw new Error("filePath is required for hotel media");
  
  const params = new URLSearchParams({ filePath });
  if (expiry) params.append("expiry", expiry.toString());
  
  console.log('🔍 Getting hotel signed GET URL:', {
    filePath,
    expiry: expiry || 'default',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: 'NadPerz'
  });
  
  const response = await fetch(
    `${HOTEL_MEDIA_API_BASE_URL}/media/signed-get-url?${params.toString()}`,
    {
      headers: {
        "X-User-Login": "NadPerz",
        "X-Request-Timestamp": new Date().toISOString()
      }
    }
  );
  
  if (!response.ok) {
    const error = `Failed to get hotel signed GET URL for: ${filePath}`;
    console.error(`❌ ${error}`);
    throw new Error(error);
  }
  
  const result = await response.json();
  console.log(`✅ Hotel signed GET URL obtained for: ${filePath}`);
  return result.url;
};

// Batch upload for multiple hotel files
export const uploadMultipleHotelFiles = async (
  files: File[],
  resourceType: HotelResourceType,
  userId: string = 'NadPerz'
): Promise<{ successful: string[]; failed: { file: File; error: string }[] }> => {
  console.log(`📁 Starting batch hotel ${resourceType} upload:`, {
    fileCount: files.length,
    resourceType,
    userId,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
  });

  const successful: string[] = [];
  const failed: { file: File; error: string }[] = [];

  for (const file of files) {
    try {
      const storagePath = await uploadToHotelResourceBucket(file, resourceType, userId);
      successful.push(storagePath);
      console.log(`✅ Successfully uploaded: ${file.name}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      failed.push({ file, error: errorMessage });
      console.error(`❌ Failed to upload: ${file.name} - ${errorMessage}`);
    }
  }

  console.log(`📊 Hotel ${resourceType} batch upload completed:`, {
    total: files.length,
    successful: successful.length,
    failed: failed.length,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: userId
  });

  return { successful, failed };
};

// Hotel booking media utilities
export const hotelMediaUtils = {
  // Get file preview URL
  getFilePreview: (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  },
  
  // Format file size
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
  
  // Get file extension
  getFileExtension: (fileName: string): string => {
    return fileName.split('.').pop()?.toLowerCase() || '';
  },
  
  // Check if file is image
  isImageFile: (file: File): boolean => {
    return file.type.startsWith('image/');
  }
};

// Legacy compatibility functions (for backward compatibility with existing code)
export const uploadToResourceBucket = uploadToHotelResourceBucket;
export const getSignedUploadUrl = getHotelSignedUploadUrl;
export const uploadFileToSignedUrl = uploadHotelFileToSignedUrl;
export const getSignedGetUrl = getHotelSignedGetUrl;
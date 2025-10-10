// Hotel booking specific bucket management
export type HotelResourceType = 'hotels' | 'rooms' | 'bookings' | 'users';

export interface HotelBucketConfig {
  bucketName: string;
  folder: string;
  allowedTypes: string[];
  maxSize: number; // in MB
  description: string;
}

// Hotel booking bucket configurations
const HOTEL_BUCKET_CONFIGS: Record<HotelResourceType, HotelBucketConfig> = {
  hotels: {
    bucketName: 'hotel-bucket',
    folder: 'images',
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    maxSize: 10, // 10MB
    description: 'Hotel main images and photos'
  },
  rooms: {
    bucketName: 'room-bucket',
    folder: 'images', 
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    maxSize: 8, // 8MB
    description: 'Room photos and interior images'
  },
  bookings: {
    bucketName: 'booking-bucket',
    folder: 'documents',
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
    maxSize: 5, // 5MB
    description: 'Booking confirmations and receipts'
  },
  users: {
    bucketName: 'user-bucket',
    folder: 'profiles',
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
    maxSize: 3, // 3MB
    description: 'User profile pictures and documents'
  }
};

export const getHotelBucketConfig = (resourceType: HotelResourceType): HotelBucketConfig => {
  const config = HOTEL_BUCKET_CONFIGS[resourceType];
  if (!config) {
    throw new Error(`Unknown hotel resource type: ${resourceType}`);
  }
  
  console.log(`🪣 Hotel Bucket Config for ${resourceType}:`, {
    bucket: config.bucketName,
    folder: config.folder,
    description: config.description,
    maxSize: `${config.maxSize}MB`,
    allowedTypes: config.allowedTypes.join(', '),
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: 'NadPerz'
  });
  
  return config;
};

export const generateHotelFileName = (
  resourceType: HotelResourceType, 
  originalName: string, 
  userId: string = 'NadPerz'
): string => {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  
  // Generate filename based on resource type
  const fileName = `${resourceType}_${userId}_${timestamp}_${randomId}.${extension}`;
  
  console.log(`📝 Generated hotel filename:`, {
    resourceType,
    originalName,
    generatedName: fileName,
    userId,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
  });
  
  return fileName;
};

export const validateHotelFile = (
  file: File, 
  resourceType: HotelResourceType
): { valid: boolean; error?: string } => {
  const config = getHotelBucketConfig(resourceType);
  
  console.log(`🔍 Validating hotel file:`, {
    fileName: file.name,
    fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
    fileType: file.type,
    resourceType,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: 'NadPerz'
  });
  
  // Check file type
  if (!config.allowedTypes.includes(file.type)) {
    const error = `Invalid file type for ${resourceType}. Allowed types: ${config.allowedTypes.join(', ')}`;
    console.error(`❌ ${error}`);
    return { valid: false, error };
  }
  
  // Check file size
  const fileSizeMB = file.size / 1024 / 1024;
  if (fileSizeMB > config.maxSize) {
    const error = `File too large for ${resourceType}. Maximum size: ${config.maxSize}MB, Got: ${fileSizeMB.toFixed(2)}MB`;
    console.error(`❌ ${error}`);
    return { valid: false, error };
  }
  
  console.log(`✅ Hotel file validation passed for ${resourceType}`);
  return { valid: true };
};

export const getHotelStoragePath = (
  resourceType: HotelResourceType,
  fileName: string
): string => {
  const config = getHotelBucketConfig(resourceType);
  const path = `${config.bucketName}/${config.folder}/${fileName}`;
  
  console.log(`📁 Hotel storage path:`, {
    resourceType,
    fileName,
    fullPath: path,
    bucket: config.bucketName,
    folder: config.folder,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
  });
  
  return path;
};

// Hotel booking specific bucket operations
export const hotelBucketManager = {
  // Get all supported resource types
  getSupportedResourceTypes: (): HotelResourceType[] => {
    return Object.keys(HOTEL_BUCKET_CONFIGS) as HotelResourceType[];
  },
  
  // Get bucket info
  getBucketInfo: (resourceType: HotelResourceType) => {
    const config = getHotelBucketConfig(resourceType);
    return {
      ...config,
      supportedExtensions: config.allowedTypes.map(type => 
        type.split('/')[1] || type
      ),
      maxSizeFormatted: `${config.maxSize}MB`
    };
  },
  
  // Validate multiple files
  validateMultipleFiles: (files: File[], resourceType: HotelResourceType) => {
    const results = files.map(file => ({
      file,
      ...validateHotelFile(file, resourceType)
    }));
    
    const validFiles = results.filter(r => r.valid);
    const invalidFiles = results.filter(r => !r.valid);
    
    console.log(`🔍 Bulk validation for ${resourceType}:`, {
      totalFiles: files.length,
      validFiles: validFiles.length,
      invalidFiles: invalidFiles.length,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    });
    
    return { validFiles, invalidFiles, results };
  }
};

export default hotelBucketManager;
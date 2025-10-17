/**
 * Converts a File or Blob object to a base64 encoded string.
 * @param file The File or Blob to convert
 * @returns Promise that resolves with the base64 encoded string
 */
export const convertToBase64 = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64String = result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Validates if a file is an image and within size limits
 * @param file The File to validate
 * @param maxSizeMB Maximum file size in megabytes
 * @returns True if file is valid, false otherwise
 */
export const validateImageFile = (file: File, maxSizeMB: number = 5): boolean => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return false;
  }

  // Check file size (convert MB to bytes)
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return false;
  }

  return true;
};

/**
 * Gets the file extension from a File object or filename
 * @param fileOrName File object or filename string
 * @returns The file extension (without the dot) or empty string if none found
 */
export const getFileExtension = (fileOrName: File | string): string => {
  const name = typeof fileOrName === 'string' ? fileOrName : fileOrName.name;
  const match = /\.([^.]+)$/.exec(name);
  return match ? match[1].toLowerCase() : '';
};

/**
 * Formats a file size in bytes to a human-readable string
 * @param bytes File size in bytes
 * @returns Formatted string (e.g., "1.5 MB" or "900 KB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};
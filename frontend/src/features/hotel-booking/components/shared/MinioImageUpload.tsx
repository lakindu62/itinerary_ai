"use client";

import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';

interface MinioImageUploadProps {
  label: string;
  onImageSelect: (file: File | null) => void;
  preview?: string;
  accept?: string;
  isUploading?: boolean;
  bucket?: string;
  folder?: string;
}

export default function MinioImageUpload({ 
  label, 
  onImageSelect, 
  preview, 
  accept = "image/*",
  isUploading = false,
  bucket = "common-itinerary-ai-storage",
  folder = "uploads"
}: MinioImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(preview || null);

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return false;
    }

    return true;
  };

  const handleImageChange = (file: File | null) => {
    if (file) {
      if (!validateFile(file)) {
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
      
      toast.success(`Image selected: ${file.name}`);
    } else {
      setImagePreview(null);
      onImageSelect(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleImageChange(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  return (
    <div>
      <Label className="text-sm font-medium">{label}</Label>
      <div className="mt-2">
        <input
          type="file"
          accept={accept}
          onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
          className="hidden"
          id={`image-upload-${folder}`}
          disabled={isUploading}
        />
        
        {imagePreview ? (
          <div className="relative group">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border"
            />
            
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm font-medium">Uploading to Minio...</p>
                  <p className="text-xs opacity-75">{bucket}/{folder}</p>
                </div>
              </div>
            )}
            
            {!isUploading && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleImageChange(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`flex items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              dragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            } ${isUploading ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={() => !isUploading && document.getElementById(`image-upload-${folder}`)?.click()}
          >
            <div className="text-center">
              {isUploading ? (
                <>
                  <Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
                  <p className="mt-2 text-sm text-gray-500">Uploading...</p>
                </>
              ) : (
                <>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                  {/* <p className="text-xs text-blue-500 mt-1">
                    📦 Minio: {bucket}/{folder}
                  </p> */}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
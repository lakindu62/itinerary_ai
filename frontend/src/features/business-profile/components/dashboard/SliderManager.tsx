'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, ImagePlus, Trash2 } from 'lucide-react';
import { useMediaQuery, useCreateMedia, useDeleteMedia } from '../../hooks/useBusinessProfile';
import { MediaResponse } from '../../types/media.types';
import { toast } from 'sonner';
import styles from './SliderManager.module.css';

export default function SliderManager() {
  const [title, setTitle] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const { data: sliders = [], isLoading, error } = useMediaQuery('slider');
  const createMediaMutation = useCreateMedia();
  const deleteMediaMutation = useDeleteMedia();

  const validateFiles = (files: FileList): File[] => {
    return Array.from(files).filter(file => {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Files must be less than 5MB`);
        return false;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }

      return true;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const validFiles = validateFiles(e.target.files);
      setSelectedFiles(validFiles);
      
      // Generate preview URLs
      const urls = validFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => {
        // Clean up old preview URLs to avoid memory leaks
        prev.forEach(url => URL.revokeObjectURL(url));
        return urls;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0 || !title) {
      toast.error('Please provide both a title and at least one image');
      return;
    }

    toast.promise(
      createMediaMutation.mutateAsync({
        media: selectedFiles,
        type: 'slider',
        title
      }),
      {
        loading: 'Uploading slider...',
        success: () => {
          setTitle('');
          setSelectedFiles([]);
          setPreviewUrls(prev => {
            prev.forEach(url => URL.revokeObjectURL(url));
            return [];
          });
          if (e.target instanceof HTMLFormElement) {
            e.target.reset();
          }
          return 'Slider added successfully';
        },
        error: (err) => `Upload failed: ${err.message}`
      }
    );
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMediaMutation.mutateAsync(id);
      toast.success('Slider deleted successfully');
    } catch (error) {
      console.error('Error deleting slider:', error);
      toast.error('Failed to delete slider. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">Error loading sliders. Please try again later.</div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
            <Input
              id="title"
              type="text"
              placeholder="Slider Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium mb-1">Images</label>
            <div className="flex flex-col gap-4">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                multiple
                required
                className="border-2 border-dashed hover:border-primary transition-colors"
              />
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={url} className="relative aspect-video">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="object-cover w-full h-full rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          URL.revokeObjectURL(url);
                          setPreviewUrls(prev => prev.filter(u => u !== url));
                          setSelectedFiles(prev => prev.filter((_, i) => i !== index));
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 rounded text-white text-xs">
                        {Math.round(selectedFiles[index].size / 1024)}KB
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <Button 
          type="submit" 
          disabled={createMediaMutation.isPending || selectedFiles.length === 0 || !title}
          className="w-full"
        >
          {createMediaMutation.isPending ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</>
          ) : (
            'Add Slider'
          )}
        </Button>
      </form>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sliders && sliders.length > 0 ? (
          sliders.map((slider: MediaResponse) => (
            <Card key={slider.id} className="p-4">
              <div className="aspect-video relative mb-2">
                <div className={styles.carousel}>
                  {slider.media.map((url: string, index: number) => (
                    <img
                      key={index}
                      src={url}
                      alt={`${slider.title} - Image ${index + 1}`}
                      className="object-cover w-full h-full rounded-md"
                      loading="lazy"
                    />
                  ))}
                  <div className={styles.dots}>
                    {slider.media.map((_: string, index: number) => (
                      <div
                        key={index}
                        className={`${styles.dot} ${index === 0 ? styles.active : ''}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{slider.title}</h3>
                  <p className="text-sm text-muted-foreground">{slider.media.length} images</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(slider.id)}
                  disabled={deleteMediaMutation.isPending}
                >
                  {deleteMediaMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Delete'
                  )}
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-6 text-muted-foreground">
            No sliders found. Add your first slider above.
          </div>
        )}
      </div>
    </div>
  );
}
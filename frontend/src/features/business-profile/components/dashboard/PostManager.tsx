'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2, ImagePlus, Trash2 } from 'lucide-react';
import { useMediaQuery, useCreateMedia, useDeleteMedia } from '../../hooks/useBusinessProfile';
import { MediaResponse } from '../../types/media.types';
import { toast } from 'sonner';
import { validateImageFile, formatFileSize } from '../../utils/fileUtils';
import styles from './SliderManager.module.css';

export default function PostManager() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const { data: posts = [], isLoading, error } = useMediaQuery('post');
  const createMediaMutation = useCreateMedia();
  const deleteMediaMutation = useDeleteMedia();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(file => {
        if (!validateImageFile(file)) {
          toast.error(`${file.name} is not a valid image file or exceeds size limit`);
          return false;
        }
        return true;
      });

      setSelectedFiles(validFiles);
      
      // Generate preview URLs
      const urls = validFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => {
        // Clean up old preview URLs
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
        type: 'post',
        title,
        description
      }),
      {
        loading: 'Creating post...',
        success: () => {
          setTitle('');
          setDescription('');
          setSelectedFiles([]);
          setPreviewUrls(prev => {
            prev.forEach(url => URL.revokeObjectURL(url));
            return [];
          });
          if (e.target instanceof HTMLFormElement) {
            e.target.reset();
          }
          return 'Post created successfully';
        },
        error: (err) => `Failed to create post: ${err.message}`
      }
    );
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMediaMutation.mutateAsync(id);
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post. Please try again.');
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
        <div className="text-red-500 mb-4">Error loading posts. Please try again later.</div>
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
              placeholder="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              id="description"
              placeholder="Post Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div>
            <label htmlFor="images" className="block text-sm font-medium mb-1">Images</label>
            <div className="flex flex-col gap-4">
              <Input
                id="images"
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
                        {formatFileSize(selectedFiles[index].size)}
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
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Post...</>
          ) : (
            'Create Post'
          )}
        </Button>
      </form>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts && posts.length > 0 ? (
          posts.map((post: MediaResponse) => (
            <Card key={post.id} className="p-4">
              <div className="aspect-video relative mb-2">
                <div className={styles.carousel}>
                  {post.media.map((media: string | File, index: number) => {
                    const url = typeof media === 'string' ? media : URL.createObjectURL(media);
                    return (
                      <img
                        key={index}
                        src={url}
                        alt={`${post.title} - Image ${index + 1}`}
                        className="object-cover w-full h-full rounded-md"
                        loading="lazy"
                        onLoad={() => {
                          if (typeof media !== 'string') {
                            URL.revokeObjectURL(url);
                          }
                        }}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{post.title}</h3>
                    <p className="text-sm text-muted-foreground">{post.media.length} images</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                    disabled={deleteMediaMutation.isPending}
                  >
                    {deleteMediaMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Delete'
                    )}
                  </Button>
                </div>
                {post.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">{post.description}</p>
                )}
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-6 text-muted-foreground">
            No posts found. Create your first post above.
          </div>
        )}
      </div>
    </div>
  );
}
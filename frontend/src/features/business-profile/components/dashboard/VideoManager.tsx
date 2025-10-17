'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { convertToBase64 } from '../../utils/fileUtils';
import { validateFile, formatBytes } from '../../utils/mediaUtils';
import { useMediaQuery, useCreateMedia, useDeleteMedia } from '../../hooks/useBusinessProfile';
import { BusinessMedia } from '../../api/business-profile.api';
import { Loader2, AlertCircle, Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function VideoManager() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const { data: videos, isLoading } = useMediaQuery('video');
  const createMediaMutation = useCreateMedia();
  const deleteMediaMutation = useDeleteMedia();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file, 'video');
    if (!validation.isValid) {
      setFileError(validation.error || 'Invalid file');
      toast.error(validation.error || 'Invalid file');
      return;
    }

    setSelectedFile(file);
    toast.info(`Selected file: ${file.name} (${formatBytes(file.size)})`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !title) {
      toast.error('Please provide both a title and a video file');
      return;
    }

    if (fileError) {
      toast.error('Please fix the file error before uploading');
      return;
    }

    const loadingToast = toast.loading('Uploading video... This may take a while.');

    try {
      const base64Video = await convertToBase64(selectedFile);
      const newVideo: Omit<BusinessMedia, 'id' | 'createdAt'> = {
        type: 'video',
        title,
        description,
        media: [base64Video],
      };

      await createMediaMutation.mutateAsync(newVideo);
      toast.dismiss(loadingToast);
      toast.success('Video uploaded successfully!');
      
      // Reset form
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Error uploading video. Please try again.');
      console.error('Error adding video:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMediaMutation.mutateAsync(id);
      toast.success('Video deleted successfully');
    } catch (error: any) {
      toast.error('Error deleting video');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="w-full aspect-video bg-muted rounded-lg mb-4"></div>
              <div className="h-5 w-1/3 bg-muted rounded mb-2"></div>
              <div className="h-4 w-2/3 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Video</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter video title"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter video description (optional)"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Video File</label>
              <Input
                type="file"
                onChange={handleFileChange}
                accept="video/*"
                required
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Maximum file size: 50MB. Supported formats: MP4, WebM, OGG
              </p>
            </div>

            {fileError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{fileError}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={createMediaMutation.isPending || !selectedFile || !title || !!fileError}
            >
              {createMediaMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Video
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.map((video: BusinessMedia) => (
          <Card key={video.id}>
            <CardContent className="p-4 space-y-3">
              <video controls className="w-full aspect-video rounded-lg bg-muted">
                <source src={video.media[0]} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="space-y-2">
                <h3 className="font-medium">{video.title}</h3>
                {video.description && (
                  <p className="text-sm text-muted-foreground">{video.description}</p>
                )}
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(video.id)}
                  size="sm"
                  className="w-full"
                  disabled={deleteMediaMutation.isPending}
                >
                  {deleteMediaMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Delete Video
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {videos.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No videos uploaded yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
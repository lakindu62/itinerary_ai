export interface BusinessMedia {
  id: string;
  type: 'slider' | 'post' | 'video';
  title: string;
  description?: string;
  media: string[] | File[];
  createdAt: string;
  businessProfileId?: string;
}

export interface CreateMediaDTO {
  type: 'slider' | 'post' | 'video';
  title: string;
  description?: string;
  media: File[];
  businessProfileId?: string;
}

export interface MediaResponse extends BusinessMedia {
  url: string;
  thumbnailUrl?: string;
}
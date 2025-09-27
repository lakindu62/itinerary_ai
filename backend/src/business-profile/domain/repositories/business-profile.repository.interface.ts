import { BusinessProfile, CreateBusinessProfileData, UpdateBusinessProfileData, BusinessMedia, CreateMediaData } from '../entities/business-profile.entity';

export interface IBusinessProfileRepository {
  // Profile management
  create(data: CreateBusinessProfileData): Promise<BusinessProfile>;
  findById(id: string): Promise<BusinessProfile | null>;
  findByOwnerId(ownerId: string): Promise<BusinessProfile[]>;
  update(id: string, data: UpdateBusinessProfileData): Promise<BusinessProfile | null>;
  delete(id: string): Promise<boolean>;
  findAll(page?: number, limit?: number): Promise<{ profiles: BusinessProfile[], total: number }>;

  // Media management
  addSliderImage(profileId: string, mediaData: CreateMediaData): Promise<BusinessProfile | null>;
  removeSliderImage(profileId: string, mediaId: string): Promise<BusinessProfile | null>;
  updateSliderImageOrder(profileId: string, mediaId: string, order: number): Promise<BusinessProfile | null>;
  getSliderImages(profileId: string): Promise<BusinessMedia[]>;

  addVideo(profileId: string, mediaData: CreateMediaData): Promise<BusinessProfile | null>;
  removeVideo(profileId: string, mediaId: string): Promise<BusinessProfile | null>;
  getVideos(profileId: string): Promise<BusinessMedia[]>;
}
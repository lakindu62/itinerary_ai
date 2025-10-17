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

  // Posts management
  addPost(profileId: string, postData: any): Promise<BusinessProfile | null>;
  removePost(profileId: string, postId: string): Promise<BusinessProfile | null>;
  updatePost(profileId: string, postId: string, updateData: any): Promise<BusinessProfile | null>;
  getPosts(profileId: string): Promise<any[]>;

  // Reels management
  addReel(profileId: string, reelData: any): Promise<BusinessProfile | null>;
  removeReel(profileId: string, reelId: string): Promise<BusinessProfile | null>;
  updateReel(profileId: string, reelId: string, updateData: any): Promise<BusinessProfile | null>;
  getReels(profileId: string): Promise<any[]>;
  migrateReelIds(profileId: string): Promise<BusinessProfile | null>;

  // Menu Items management
  addMenuItem(profileId: string, menuItemData: any): Promise<BusinessProfile | null>;
  updateMenuItem(profileId: string, menuItemId: string, updateData: any): Promise<BusinessProfile | null>;
  removeMenuItem(profileId: string, menuItemId: string): Promise<BusinessProfile | null>;
  getMenuItems(profileId: string): Promise<any[]>;
}
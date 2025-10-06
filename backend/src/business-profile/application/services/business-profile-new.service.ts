import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { IBusinessProfileRepository } from '../../domain/repositories/business-profile.repository.interface';
import { CreateBusinessProfileDto, UpdateBusinessProfileDto, BusinessProfileResponseDto } from '../dtos/business-profile.dto';
import { CreateMediaDto, MediaType } from '../dtos/create-media.dto';
import { BusinessProfile, CreateMediaData } from '../../domain/entities/business-profile.entity';

@Injectable()
export class BusinessProfileService {
  constructor(
    @Inject('IBusinessProfileRepository')
    private readonly businessProfileRepository: IBusinessProfileRepository,
  ) {}

  async create(createBusinessProfileDto: CreateBusinessProfileDto): Promise<BusinessProfileResponseDto> {
    const existingProfiles = await this.businessProfileRepository.findByOwnerId(createBusinessProfileDto.ownerId);
    
    if (existingProfiles.length > 0) {
      throw new BadRequestException('User already has a business profile');
    }

    const profile = await this.businessProfileRepository.create({
      businessName: createBusinessProfileDto.businessName,
      ownerId: createBusinessProfileDto.ownerId,
      description: createBusinessProfileDto.description,
      location: createBusinessProfileDto.location,
      phone: createBusinessProfileDto.phone,
      email: createBusinessProfileDto.email,
      website: createBusinessProfileDto.website,
      categories: createBusinessProfileDto.categories || [],
    });

    return this.mapToResponseDto(profile);
  }

  async update(id: string, updateBusinessProfileDto: UpdateBusinessProfileDto, ownerId: string): Promise<BusinessProfileResponseDto> {
    const profile = await this.businessProfileRepository.findById(id);
    if (!profile) {
      throw new NotFoundException('Business profile not found');
    }

    if (profile.ownerId !== ownerId) {
      throw new BadRequestException('Not authorized to update this profile');
    }

    const updatedProfile = await this.businessProfileRepository.update(id, updateBusinessProfileDto);
    if (!updatedProfile) {
      throw new NotFoundException('Business profile not found after update');
    }

    return this.mapToResponseDto(updatedProfile);
  }

  async findById(id: string): Promise<BusinessProfileResponseDto> {
    const profile = await this.businessProfileRepository.findById(id);
    if (!profile) {
      throw new NotFoundException('Business profile not found');
    }
    return this.mapToResponseDto(profile);
  }

  async findByOwnerId(ownerId: string): Promise<BusinessProfileResponseDto[]> {
    const profiles = await this.businessProfileRepository.findByOwnerId(ownerId);
    return profiles.map(profile => this.mapToResponseDto(profile));
  }

  async delete(id: string, ownerId: string): Promise<void> {
    const profile = await this.businessProfileRepository.findById(id);
    if (!profile) {
      throw new NotFoundException('Business profile not found');
    }

    if (profile.ownerId !== ownerId) {
      throw new BadRequestException('Not authorized to delete this profile');
    }

    const deleted = await this.businessProfileRepository.delete(id);
    if (!deleted) {
      throw new BadRequestException('Failed to delete business profile');
    }
  }

  async findAll(page = 1, limit = 10): Promise<{ profiles: BusinessProfileResponseDto[], total: number }> {
    const result = await this.businessProfileRepository.findAll(page, limit);
    return {
      profiles: result.profiles.map(profile => this.mapToResponseDto(profile)),
      total: result.total
    };
  }

  // Media management methods
  async addSliderImage(profileId: string, createMediaDto: CreateMediaDto, ownerId: string): Promise<BusinessProfileResponseDto> {
    const profile = await this.businessProfileRepository.findById(profileId);
    if (!profile) {
      throw new NotFoundException('Business profile not found');
    }

    if (profile.ownerId !== ownerId) {
      throw new BadRequestException('Not authorized to update this profile');
    }

    if (createMediaDto.type !== MediaType.IMAGE) {
      throw new BadRequestException('Media type must be image for slider');
    }

    const mediaData: CreateMediaData = {
      type: 'image',
      url: createMediaDto.url,
      filename: createMediaDto.filename,
      order: createMediaDto.order || profile.sliderImages.length,
      title: createMediaDto.title,
      description: createMediaDto.description,
    };

    const updatedProfile = await this.businessProfileRepository.addSliderImage(profileId, mediaData);
    if (!updatedProfile) {
      throw new BadRequestException('Failed to add slider image');
    }

    return this.mapToResponseDto(updatedProfile);
  }

  async removeSliderImage(profileId: string, mediaId: string, ownerId: string): Promise<BusinessProfileResponseDto> {
    const profile = await this.businessProfileRepository.findById(profileId);
    if (!profile) {
      throw new NotFoundException('Business profile not found');
    }

    if (profile.ownerId !== ownerId) {
      throw new BadRequestException('Not authorized to update this profile');
    }

    const updatedProfile = await this.businessProfileRepository.removeSliderImage(profileId, mediaId);
    if (!updatedProfile) {
      throw new BadRequestException('Failed to remove slider image');
    }

    return this.mapToResponseDto(updatedProfile);
  }

  async addVideo(profileId: string, createMediaDto: CreateMediaDto, ownerId: string): Promise<BusinessProfileResponseDto> {
    const profile = await this.businessProfileRepository.findById(profileId);
    if (!profile) {
      throw new NotFoundException('Business profile not found');
    }

    if (profile.ownerId !== ownerId) {
      throw new BadRequestException('Not authorized to update this profile');
    }

    if (createMediaDto.type !== MediaType.VIDEO) {
      throw new BadRequestException('Media type must be video');
    }

    const mediaData: CreateMediaData = {
      type: 'video',
      url: createMediaDto.url,
      filename: createMediaDto.filename,
      order: createMediaDto.order || profile.videos.length,
    };

    const updatedProfile = await this.businessProfileRepository.addVideo(profileId, mediaData);
    if (!updatedProfile) {
      throw new BadRequestException('Failed to add video');
    }

    return this.mapToResponseDto(updatedProfile);
  }

  async removeVideo(profileId: string, mediaId: string, ownerId: string): Promise<BusinessProfileResponseDto> {
    const profile = await this.businessProfileRepository.findById(profileId);
    if (!profile) {
      throw new NotFoundException('Business profile not found');
    }

    if (profile.ownerId !== ownerId) {
      throw new BadRequestException('Not authorized to update this profile');
    }

    const updatedProfile = await this.businessProfileRepository.removeVideo(profileId, mediaId);
    if (!updatedProfile) {
      throw new BadRequestException('Failed to remove video');
    }

    return this.mapToResponseDto(updatedProfile);
  }

  async getSliderImages(profileId: string): Promise<any[]> {
    const images = await this.businessProfileRepository.getSliderImages(profileId);
    return images;
  }

  async getVideos(profileId: string): Promise<any[]> {
    const videos = await this.businessProfileRepository.getVideos(profileId);
    return videos;
  }

  // Posts management methods
  async addPost(profileId: string, postData: any, ownerId: string): Promise<BusinessProfileResponseDto> {
    console.log('🚀 Adding post to profile:', profileId);
    console.log('📝 Post data:', JSON.stringify(postData, null, 2));
    
    const profile = await this.businessProfileRepository.findById(profileId);
    if (!profile) {
      throw new NotFoundException('Business profile not found');
    }

    if (profile.ownerId !== ownerId) {
      throw new BadRequestException('Not authorized to update this profile');
    }

    console.log('📊 Current posts count:', profile.posts?.length || 0);

    // Use atomic operation to add post directly to MongoDB
    const updatedProfile = await this.businessProfileRepository.addPost(profileId, postData);

    if (!updatedProfile) {
      throw new BadRequestException('Failed to update profile with post');
    }

    console.log('✅ Service: Post added successfully. Updated profile posts count:', updatedProfile.posts?.length || 0);
    const responseDto = this.mapToResponseDto(updatedProfile);
    console.log('📤 Service: Response DTO posts count:', responseDto.posts?.length || 0);
    
    return responseDto;
  }

  async removePost(profileId: string, postId: string, ownerId: string): Promise<BusinessProfileResponseDto> {
    const profile = await this.businessProfileRepository.findById(profileId);
    if (!profile) {
      throw new NotFoundException('Business profile not found');
    }

    if (profile.ownerId !== ownerId) {
      throw new BadRequestException('Not authorized to update this profile');
    }

    // Use atomic operation to remove post directly from MongoDB
    const updatedProfile = await this.businessProfileRepository.removePost(profileId, postId);

    if (!updatedProfile) {
      throw new BadRequestException('Failed to update profile');
    }

    return this.mapToResponseDto(updatedProfile);
  }

  async updatePost(profileId: string, postId: string, updateData: any, ownerId: string): Promise<BusinessProfileResponseDto> {
    console.log('🚀 Updating post:', postId, 'in profile:', profileId);
    console.log('📝 Update data:', JSON.stringify(updateData, null, 2));
    
    // Find the profile first
    const profile = await this.businessProfileRepository.findById(profileId);
    if (!profile) {
      throw new NotFoundException('Business profile not found');
    }

    // Verify ownership
    if (profile.ownerId !== ownerId) {
      throw new BadRequestException('Not authorized to update this profile');
    }

    // Check if the post exists in the profile
    const existingPost = profile.posts?.find((p: any) => p.id === postId || p._id === postId);
    if (!existingPost) {
      throw new NotFoundException('Post not found in profile');
    }

    // Use atomic operation to update post directly in MongoDB
    const updatedProfile = await this.businessProfileRepository.updatePost(profileId, postId, updateData);
    
    if (!updatedProfile) {
      throw new BadRequestException('Failed to update post in profile');
    }

    console.log('✅ Service: Post updated successfully');
    return this.mapToResponseDto(updatedProfile);
  }

  async updateReel(profileId: string, reelId: string, updateData: any, ownerId: string): Promise<BusinessProfileResponseDto> {
    console.log('🚀 Updating reel:', reelId, 'in profile:', profileId);
    console.log('📝 Update data:', JSON.stringify(updateData, null, 2));
    
    // Find the profile first
    const profile = await this.businessProfileRepository.findById(profileId);
    if (!profile) {
      throw new NotFoundException('Business profile not found');
    }

    // Verify ownership
    if (profile.ownerId !== ownerId) {
      throw new BadRequestException('Not authorized to update this profile');
    }

    // Check if the reel exists in the profile
    const existingReel = profile.reels?.find((r: any) => r.id === reelId || r._id === reelId);
    if (!existingReel) {
      throw new NotFoundException('Reel not found in profile');
    }

    // Use atomic operation to update reel directly in MongoDB
    const updatedProfile = await this.businessProfileRepository.updateReel(profileId, reelId, updateData);
    
    if (!updatedProfile) {
      throw new BadRequestException('Failed to update reel in profile');
    }

    console.log('✅ Service: Reel updated successfully');
    return this.mapToResponseDto(updatedProfile);
  }

  async getPosts(profileId: string): Promise<any[]> {
    // Use dedicated method to get only posts
    const posts = await this.businessProfileRepository.getPosts(profileId);
    return posts;
  }

  // Reels management methods
  async addReel(profileId: string, reelData: any, ownerId: string): Promise<BusinessProfileResponseDto> {
    const profile = await this.businessProfileRepository.findById(profileId);
    if (!profile) {
      throw new NotFoundException('Business profile not found');
    }

    if (profile.ownerId !== ownerId) {
      throw new BadRequestException('Not authorized to update this profile');
    }

    // Use atomic operation to add reel directly to MongoDB
    const updatedProfile = await this.businessProfileRepository.addReel(profileId, reelData);

    if (!updatedProfile) {
      throw new BadRequestException('Failed to update profile with reel');
    }

    return this.mapToResponseDto(updatedProfile);
  }

  async removeReel(profileId: string, reelId: string, ownerId: string): Promise<BusinessProfileResponseDto> {
    const profile = await this.businessProfileRepository.findById(profileId);
    if (!profile) {
      throw new NotFoundException('Business profile not found');
    }

    if (profile.ownerId !== ownerId) {
      throw new BadRequestException('Not authorized to update this profile');
    }

    // Use atomic operation to remove reel directly from MongoDB
    const updatedProfile = await this.businessProfileRepository.removeReel(profileId, reelId);

    if (!updatedProfile) {
      throw new BadRequestException('Failed to update profile');
    }

    return this.mapToResponseDto(updatedProfile);
  }

  async getReels(profileId: string): Promise<any[]> {
    // Use dedicated method to get only reels
    const reels = await this.businessProfileRepository.getReels(profileId);
    return reels;
  }

  // Menu items management methods
  async addMenuItem(profileId: string, menuItemData: any, ownerId: string): Promise<BusinessProfileResponseDto> {
    const profile = await this.businessProfileRepository.findById(profileId);
    if (!profile) {
      throw new NotFoundException('Business profile not found');
    }

    if (profile.ownerId !== ownerId) {
      throw new BadRequestException('Not authorized to update this profile');
    }

    // Use atomic operation to add menu item directly to MongoDB
    const updatedProfile = await this.businessProfileRepository.addMenuItem(profileId, menuItemData);

    if (!updatedProfile) {
      throw new BadRequestException('Failed to update profile with menu item');
    }

    return this.mapToResponseDto(updatedProfile);
  }

  async removeMenuItem(profileId: string, menuItemId: string, ownerId: string): Promise<BusinessProfileResponseDto> {
    const profile = await this.businessProfileRepository.findById(profileId);
    if (!profile) {
      throw new NotFoundException('Business profile not found');
    }

    if (profile.ownerId !== ownerId) {
      throw new BadRequestException('Not authorized to update this profile');
    }

    // Use atomic operation to remove menu item directly from MongoDB
    const updatedProfile = await this.businessProfileRepository.removeMenuItem(profileId, menuItemId);

    if (!updatedProfile) {
      throw new BadRequestException('Failed to update profile');
    }

    return this.mapToResponseDto(updatedProfile);
  }

  async updateMenuItem(profileId: string, menuItemId: string, updateData: any, ownerId: string): Promise<BusinessProfileResponseDto> {
    console.log('🔍 Service: updateMenuItem called with:', {
      profileId,
      menuItemId,
      ownerId,
      updateDataKeys: Object.keys(updateData),
      updateDataSize: JSON.stringify(updateData).length
    });

    const profile = await this.businessProfileRepository.findById(profileId);
    if (!profile) {
      console.log('❌ Service: Business profile not found');
      throw new NotFoundException('Business profile not found');
    }

    console.log('✅ Service: Profile found, owner check:', {
      profileOwnerId: profile.ownerId,
      requestOwnerId: ownerId,
      matches: profile.ownerId === ownerId
    });

    if (profile.ownerId !== ownerId) {
      console.log('❌ Service: Not authorized to update this profile');
      throw new BadRequestException('Not authorized to update this profile');
    }

    console.log('📍 Service: Calling repository updateMenuItem');
    // Use atomic operation to update menu item directly in MongoDB
    const updatedProfile = await this.businessProfileRepository.updateMenuItem(profileId, menuItemId, updateData);

    if (!updatedProfile) {
      console.log('❌ Service: Failed to update menu item - repository returned null');
      throw new BadRequestException('Failed to update menu item');
    }

    console.log('✅ Service: Menu item updated successfully');
    return this.mapToResponseDto(updatedProfile);
  }

  async getMenuItems(profileId: string): Promise<any[]> {
    // Use dedicated method to get only menu items
    const menuItems = await this.businessProfileRepository.getMenuItems(profileId);
    return menuItems;
  }

  async fixMenuItemIds(profileId: string): Promise<number> {
    console.log('🔧 Service: Fixing menu item IDs for profile:', profileId);
    const profile = await this.businessProfileRepository.findById(profileId);
    if (!profile) {
      throw new NotFoundException('Business profile not found');
    }

    const menuItems = profile.menuItems || [];
    let fixedCount = 0;

    // Add _id to menu items that don't have it
    menuItems.forEach(item => {
      if (!item._id) {
        // Generate a new MongoDB ObjectId for the menu item
        const { ObjectId } = require('mongodb');
        item._id = new ObjectId();
        fixedCount++;
        console.log('🔧 Service: Added _id to menu item:', item.name, 'ID:', item._id);
      }
    });

    if (fixedCount > 0) {
      await this.businessProfileRepository.update(profileId, { menuItems });
      console.log('✅ Service: Fixed', fixedCount, 'menu items');
    } else {
      console.log('ℹ️ Service: No menu items needed fixing');
    }

    return fixedCount;
  }

  async migrateReelIds(profileId: string, ownerId: string): Promise<BusinessProfileResponseDto> {
    const profile = await this.businessProfileRepository.findById(profileId);
    if (!profile) {
      throw new NotFoundException('Business profile not found');
    }

    if (profile.ownerId !== ownerId) {
      throw new BadRequestException('Not authorized to update this profile');
    }

    // Migrate reels to have proper MongoDB ObjectIds
    const updatedProfile = await this.businessProfileRepository.migrateReelIds(profileId);

    if (!updatedProfile) {
      throw new BadRequestException('Failed to migrate reel IDs');
    }

    return this.mapToResponseDto(updatedProfile);
  }

  private mapToResponseDto(profile: BusinessProfile): BusinessProfileResponseDto {
    return {
      id: profile.id,
      businessName: profile.businessName,
      ownerId: profile.ownerId,
      description: profile.description,
      categories: profile.categories,
      location: profile.location,
      phone: profile.phone,
      email: profile.email,
      website: profile.website,
      sliderImages: profile.sliderImages,
      videos: profile.videos,
      posts: profile.posts || [], // Include posts in response
      reels: profile.reels || [], // Include reels in response
      menuItems: profile.menuItems || [], // Include menu items in response
      isActive: profile.isActive,
      isVerified: profile.isVerified,
      createdAt: (profile as any).createdAt || new Date(),
      updatedAt: (profile as any).updatedAt || new Date(),
    };
  }
}
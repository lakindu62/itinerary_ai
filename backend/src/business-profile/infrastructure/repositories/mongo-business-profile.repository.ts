import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IBusinessProfileRepository } from '../../domain/repositories/business-profile.repository.interface';
import { BusinessProfile, CreateBusinessProfileData, UpdateBusinessProfileData, BusinessMedia, CreateMediaData } from '../../domain/entities/business-profile.entity';

@Injectable()
export class MongoBusinessProfileRepository implements IBusinessProfileRepository {
  constructor(
    @InjectModel(BusinessProfile.name) private businessProfileModel: Model<BusinessProfile>,
  ) {}

  async create(data: CreateBusinessProfileData): Promise<BusinessProfile> {
    const businessProfile = new this.businessProfileModel({
      ...data,
      sliderImages: [],
      videos: [],
      isActive: true,
      isVerified: false,
    });
    return await businessProfile.save();
  }

  async findById(id: string): Promise<BusinessProfile | null> {
    return await this.businessProfileModel.findById(id).exec();
  }

  async findByOwnerId(ownerId: string): Promise<BusinessProfile[]> {
    return await this.businessProfileModel.find({ ownerId }).exec();
  }

  async update(id: string, data: UpdateBusinessProfileData): Promise<BusinessProfile | null> {
    return await this.businessProfileModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.businessProfileModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async findAll(page = 1, limit = 10): Promise<{ profiles: BusinessProfile[], total: number }> {
    const skip = (page - 1) * limit;
    const [profiles, total] = await Promise.all([
      this.businessProfileModel.find().skip(skip).limit(limit).exec(),
      this.businessProfileModel.countDocuments().exec(),
    ]);
    return { profiles, total };
  }

  // Media management methods
  async addMedia(profileId: string, mediaData: CreateMediaData): Promise<BusinessProfile | null> {
    const updateQuery = mediaData.type === 'image' 
      ? { $push: { sliderImages: mediaData } }
      : { $push: { videos: mediaData } };
    
    return await this.businessProfileModel.findByIdAndUpdate(
      profileId,
      updateQuery,
      { new: true }
    ).exec();
  }

  async removeMedia(profileId: string, mediaId: string, mediaType: 'image' | 'video'): Promise<BusinessProfile | null> {
    const updateQuery = mediaType === 'image'
      ? { $pull: { sliderImages: { _id: mediaId } } }
      : { $pull: { videos: { _id: mediaId } } };
    
    return await this.businessProfileModel.findByIdAndUpdate(
      profileId,
      updateQuery,
      { new: true }
    ).exec();
  }

  async updateMedia(profileId: string, mediaId: string, mediaType: 'image' | 'video', updateData: Partial<BusinessMedia>): Promise<BusinessProfile | null> {
    const arrayField = mediaType === 'image' ? 'sliderImages' : 'videos';
    const updateQuery = Object.keys(updateData).reduce((acc, key) => {
      acc[`${arrayField}.$.${key}`] = updateData[key];
      return acc;
    }, {} as any);

    return await this.businessProfileModel.findOneAndUpdate(
      { _id: profileId, [`${arrayField}._id`]: mediaId },
      { $set: updateQuery },
      { new: true }
    ).exec();
  }

  async getMedia(profileId: string, mediaType?: 'image' | 'video'): Promise<BusinessMedia[]> {
    const profile = await this.businessProfileModel.findById(profileId).exec();
    if (!profile) return [];

    if (mediaType === 'image') return profile.sliderImages || [];
    if (mediaType === 'video') return profile.videos || [];
    
    return [...(profile.sliderImages || []), ...(profile.videos || [])];
  }

  // Posts management methods
  async addPost(profileId: string, postData: any): Promise<BusinessProfile | null> {
    console.log('🔧 Repository: Adding post to profile', profileId);
    console.log('📄 Repository: Post data received:', JSON.stringify(postData, null, 2));
    
    const result = await this.businessProfileModel.findByIdAndUpdate(
      profileId,
      { $push: { posts: postData } },
      { new: true }
    ).exec();

    if (result) {
      console.log('✅ Repository: Post added successfully. Total posts:', result.posts?.length || 0);
    } else {
      console.log('❌ Repository: Failed to add post');
    }

    return result;
  }

  async removePost(profileId: string, postId: string): Promise<BusinessProfile | null> {
    return await this.businessProfileModel.findByIdAndUpdate(
      profileId,
      { $pull: { posts: { id: postId } } },
      { new: true }
    ).exec();
  }

  async updatePost(profileId: string, postId: string, updateData: any): Promise<BusinessProfile | null> {
    console.log('🔧 Repository: Updating post', postId, 'in profile', profileId);
    console.log('📄 Repository: Update data received:', JSON.stringify(updateData, null, 2));
    
    // Prepare the update data with timestamps
    const updatedPostData = {
      ...updateData,
      updatedAt: new Date()
    };
    
    // Use MongoDB's positional operator to update the specific post in the array
    const result = await this.businessProfileModel.findOneAndUpdate(
      { _id: profileId, 'posts.id': postId },
      { 
        $set: Object.keys(updatedPostData).reduce((acc, key) => {
          acc[`posts.$.${key}`] = updatedPostData[key];
          return acc;
        }, {} as any)
      },
      { new: true }
    ).exec();

    if (result) {
      console.log('✅ Repository: Post updated successfully');
    } else {
      console.log('❌ Repository: Post update failed - post or profile not found');
    }

    return result;
  }

  async updateReel(profileId: string, reelId: string, updateData: any): Promise<BusinessProfile | null> {
    console.log('🔧 Repository: Updating reel', reelId, 'in profile', profileId);
    console.log('📄 Repository: Update data received:', JSON.stringify(updateData, null, 2));
    
    // Prepare the update data with timestamps
    const updatedReelData = {
      ...updateData,
      updatedAt: new Date()
    };
    
    // Use MongoDB's positional operator to update the specific reel in the array
    // Try to find by 'id' field first, then by '_id' field
    let result = await this.businessProfileModel.findOneAndUpdate(
      { _id: profileId, 'reels.id': reelId },
      { 
        $set: Object.keys(updatedReelData).reduce((acc, key) => {
          acc[`reels.$.${key}`] = updatedReelData[key];
          return acc;
        }, {} as any)
      },
      { new: true }
    ).exec();

    // If not found by 'id', try searching by '_id'
    if (!result) {
      console.log('🔄 Repository: Reel not found by id, trying _id field');
      result = await this.businessProfileModel.findOneAndUpdate(
        { _id: profileId, 'reels._id': reelId },
        { 
          $set: Object.keys(updatedReelData).reduce((acc, key) => {
            acc[`reels.$.${key}`] = updatedReelData[key];
            return acc;
          }, {} as any)
        },
        { new: true }
      ).exec();
    }

    if (result) {
      console.log('✅ Repository: Reel updated successfully');
    } else {
      console.log('❌ Repository: Reel update failed - reel or profile not found');
    }

    return result;
  }

  async getPosts(profileId: string): Promise<any[]> {
    const profile = await this.businessProfileModel.findById(profileId).exec();
    return profile?.posts || [];
  }

  async getPost(profileId: string, postId: string): Promise<any | null> {
    const profile = await this.businessProfileModel.findById(profileId).exec();
    if (!profile || !profile.posts) return null;
    
    return profile.posts.find(post => post.id === postId) || null;
  }

  // Specific media methods for interface compatibility
  async addSliderImage(profileId: string, mediaData: CreateMediaData): Promise<BusinessProfile | null> {
    return await this.businessProfileModel.findByIdAndUpdate(
      profileId,
      { $push: { sliderImages: mediaData } },
      { new: true }
    ).exec();
  }

  async removeSliderImage(profileId: string, mediaId: string): Promise<BusinessProfile | null> {
    return await this.businessProfileModel.findByIdAndUpdate(
      profileId,
      { $pull: { sliderImages: { _id: mediaId } } },
      { new: true }
    ).exec();
  }

  async updateSliderImageOrder(profileId: string, mediaId: string, order: number): Promise<BusinessProfile | null> {
    return await this.businessProfileModel.findOneAndUpdate(
      { _id: profileId, 'sliderImages._id': mediaId },
      { $set: { 'sliderImages.$.order': order } },
      { new: true }
    ).exec();
  }

  async getSliderImages(profileId: string): Promise<BusinessMedia[]> {
    const profile = await this.businessProfileModel.findById(profileId).exec();
    return profile?.sliderImages || [];
  }

  async addVideo(profileId: string, mediaData: CreateMediaData): Promise<BusinessProfile | null> {
    return await this.businessProfileModel.findByIdAndUpdate(
      profileId,
      { $push: { videos: mediaData } },
      { new: true }
    ).exec();
  }

  async removeVideo(profileId: string, mediaId: string): Promise<BusinessProfile | null> {
    return await this.businessProfileModel.findByIdAndUpdate(
      profileId,
      { $pull: { videos: { id: mediaId } } },
      { new: true }
    ).exec();
  }

  async getVideos(profileId: string): Promise<BusinessMedia[]> {
    const profile = await this.businessProfileModel.findById(profileId).exec();
    return profile?.videos || [];
  }

  // Reels management
  async addReel(profileId: string, reelData: any): Promise<BusinessProfile | null> {
    const mongoose = require('mongoose');
    
    // Create reel with MongoDB ObjectId for proper _id field
    const reelWithId = {
      _id: new mongoose.Types.ObjectId(), // Generate proper MongoDB ObjectId
      ...reelData,
      id: reelData.id || new Date().getTime().toString(), // Keep custom id for compatibility
      createdAt: reelData.createdAt || new Date(),
      updatedAt: reelData.updatedAt || new Date()
    };

    console.log('📝 Repository: Adding reel with MongoDB _id:', reelWithId._id, 'and custom id:', reelWithId.id);

    return await this.businessProfileModel.findByIdAndUpdate(
      profileId,
      { $push: { reels: reelWithId } },
      { new: true }
    ).exec();
  }

  async removeReel(profileId: string, reelId: string): Promise<BusinessProfile | null> {
    const mongoose = require('mongoose');
    
    console.log('🗑️ Repository: Attempting to remove reel with ID:', reelId);
    
    // Check if the reelId is a valid MongoDB ObjectId
    const isValidObjectId = mongoose.Types.ObjectId.isValid(reelId);
    
    let result: BusinessProfile | null = null;
    
    if (isValidObjectId) {
      // Try to remove by '_id' field first if it's a valid ObjectId
      console.log('🔄 Repository: Removing by MongoDB _id field');
      result = await this.businessProfileModel.findByIdAndUpdate(
        profileId,
        { $pull: { reels: { _id: reelId } } },
        { new: true }
      ).exec();
    }
    
    // If not removed by _id or not a valid ObjectId, try removing by custom 'id' field
    if (!result || (result && result.reels?.find((r: any) => r.id === reelId || r._id?.toString() === reelId))) {
      console.log('🔄 Repository: Removing by custom id field');
      result = await this.businessProfileModel.findByIdAndUpdate(
        profileId,
        { $pull: { reels: { id: reelId } } },
        { new: true }
      ).exec();
    }
    
    console.log('📊 Repository: Remove operation result:', result ? 'Success' : 'Failed');
    return result;
  }

  async migrateReelIds(profileId: string): Promise<BusinessProfile | null> {
    const mongoose = require('mongoose');
    
    console.log('🔄 Repository: Starting reel ID migration for profile:', profileId);
    
    // Get the current profile
    const profile = await this.businessProfileModel.findById(profileId).exec();
    if (!profile || !profile.reels) {
      console.log('📊 Repository: No profile or reels found for migration');
      return profile;
    }
    
    // Check if migration is needed
    const reelsNeedingMigration = profile.reels.filter((reel: any) => !reel._id);
    
    if (reelsNeedingMigration.length === 0) {
      console.log('📊 Repository: All reels already have MongoDB _id fields');
      return profile;
    }
    
    console.log(`🔄 Repository: Migrating ${reelsNeedingMigration.length} reels out of ${profile.reels.length} total reels`);
    
    // Create updated reels array with proper MongoDB ObjectIds
    const updatedReels = profile.reels.map((reel: any) => {
      if (!reel._id) {
        return {
          _id: new mongoose.Types.ObjectId(),
          ...reel,
          updatedAt: new Date()
        };
      }
      return reel;
    });
    
    // Update the profile with migrated reels
    const result = await this.businessProfileModel.findByIdAndUpdate(
      profileId,
      { 
        reels: updatedReels,
        updatedAt: new Date()
      },
      { new: true }
    ).exec();
    
    console.log('📊 Repository: Reel ID migration completed');
    return result;
  }

  async getReels(profileId: string): Promise<any[]> {
    const profile = await this.businessProfileModel.findById(profileId).exec();
    return profile?.reels || [];
  }

  // Menu Items management
  async addMenuItem(profileId: string, menuItemData: any): Promise<BusinessProfile | null> {
    return await this.businessProfileModel.findByIdAndUpdate(
      profileId,
      { $push: { menuItems: menuItemData } },
      { new: true }
    ).exec();
  }

  async updateMenuItem(profileId: string, menuItemId: string, updateData: any): Promise<BusinessProfile | null> {
    console.log('🔍 Repository: updateMenuItem called with:', {
      profileId,
      menuItemId,
      updateDataKeys: Object.keys(updateData)
    });

    // First, let's check what menu items actually exist
    const profile = await this.businessProfileModel.findById(profileId).exec();
    if (profile && profile.menuItems) {
      console.log('📋 Repository: Existing menu items before update:');
      profile.menuItems.forEach((item, index) => {
        console.log(`  ${index}: _id=${item._id}, name=${item.name}`);
      });
      
      const targetItem = profile.menuItems.find(item => item._id?.toString() === menuItemId);
      console.log('🎯 Repository: Target menu item found:', !!targetItem);
      if (targetItem) {
        console.log('📝 Repository: Target item details:', {
          _id: targetItem._id,
          name: targetItem.name,
          idString: targetItem._id?.toString(),
          idMatches: targetItem._id?.toString() === menuItemId
        });
      }
    }

    const updateQuery = Object.keys(updateData).reduce((acc, key) => {
      acc[`menuItems.$.${key}`] = updateData[key];
      return acc;
    }, {} as any);

    console.log('🔧 Repository: Update query prepared:', {
      findQuery: { _id: profileId, 'menuItems._id': menuItemId },
      updateQuery: Object.keys(updateQuery)
    });

    try {
      // Convert string IDs to ObjectId for proper MongoDB querying
      const profileObjectId = new Types.ObjectId(profileId);
      const menuItemObjectId = new Types.ObjectId(menuItemId);
      
      console.log('🔧 Repository: Converting to ObjectIds:', {
        profileId: profileObjectId,
        menuItemId: menuItemObjectId
      });

      const result = await this.businessProfileModel.findOneAndUpdate(
        { _id: profileObjectId, 'menuItems._id': menuItemObjectId },
        { $set: updateQuery },
        { new: true }
      ).exec();

      console.log('✅ Repository: Update result:', {
        found: !!result,
        menuItemsCount: result?.menuItems?.length || 0
      });

      return result;
    } catch (error) {
      console.error('❌ Repository: Update failed:', error.message);
      throw error;
    }
  }

  async removeMenuItem(profileId: string, menuItemId: string): Promise<BusinessProfile | null> {
    return await this.businessProfileModel.findByIdAndUpdate(
      profileId,
      { $pull: { menuItems: { _id: menuItemId } } },
      { new: true }
    ).exec();
  }

  async getMenuItems(profileId: string): Promise<any[]> {
    const profile = await this.businessProfileModel.findById(profileId).exec();
    const menuItems = profile?.menuItems || [];
    console.log('🔍 Repository: Getting menu items, count:', menuItems.length);
    if (menuItems.length > 0) {
      console.log('📋 Repository: First menu item structure:', {
        _id: menuItems[0]._id,
        id: menuItems[0].id,
        name: menuItems[0].name,
        hasId: !!menuItems[0]._id,
        keys: Object.keys(menuItems[0])
      });
    }
    return menuItems;
  }
}
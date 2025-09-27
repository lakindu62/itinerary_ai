import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
  async addSliderImage(profileId: string, mediaData: CreateMediaData): Promise<BusinessProfile | null> {
    const newMedia = {
      type: mediaData.type,
      url: mediaData.url,
      filename: mediaData.filename,
      order: mediaData.order || 0,
      createdAt: new Date(),
    };

    return await this.businessProfileModel.findByIdAndUpdate(
      profileId,
      { $push: { sliderImages: newMedia } },
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
    const profile = await this.businessProfileModel.findById(profileId).select('sliderImages').exec();
    return profile?.sliderImages || [];
  }

  async addVideo(profileId: string, mediaData: CreateMediaData): Promise<BusinessProfile | null> {
    const newMedia = {
      type: mediaData.type,
      url: mediaData.url,
      filename: mediaData.filename,
      order: mediaData.order || 0,
      createdAt: new Date(),
    };

    return await this.businessProfileModel.findByIdAndUpdate(
      profileId,
      { $push: { videos: newMedia } },
      { new: true }
    ).exec();
  }

  async removeVideo(profileId: string, mediaId: string): Promise<BusinessProfile | null> {
    return await this.businessProfileModel.findByIdAndUpdate(
      profileId,
      { $pull: { videos: { _id: mediaId } } },
      { new: true }
    ).exec();
  }

  async getVideos(profileId: string): Promise<BusinessMedia[]> {
    const profile = await this.businessProfileModel.findById(profileId).select('videos').exec();
    return profile?.videos || [];
  }
}
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessProfile } from '../entities/business-profile.entity';

@Injectable()
export class BusinessProfileRepository {
  constructor(
    @InjectModel(BusinessProfile.name)
    private readonly businessProfileModel: Model<BusinessProfile>,
  ) {}

  async create(data: Partial<BusinessProfile>): Promise<BusinessProfile> {
    const created = new this.businessProfileModel(data);
    return await created.save();
  }

  async findById(id: string): Promise<BusinessProfile | null> {
    return await this.businessProfileModel.findById(id).exec();
  }

  async findByUserId(userId: string): Promise<BusinessProfile | null> {
    return await this.businessProfileModel.findOne({ userId }).exec();
  }

  async update(id: string, data: Partial<BusinessProfile>): Promise<BusinessProfile | null> {
    return await this.businessProfileModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  async delete(id: string): Promise<BusinessProfile | null> {
    return await this.businessProfileModel.findByIdAndDelete(id).exec();
  }

  async findAll(): Promise<BusinessProfile[]> {
    return await this.businessProfileModel.find().exec();
  }
}
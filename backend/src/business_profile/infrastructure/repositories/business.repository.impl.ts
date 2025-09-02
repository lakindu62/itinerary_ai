import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessProfileRepository } from '../../domain/repositories/business-profile.repository';
import { BusinessProfile } from '../../domain/entities/business-profile.entity';
import { BusinessProfileDocument } from '../schemas/business-profile.schema';

@Injectable()
export class BusinessProfileRepositoryImpl extends BusinessProfileRepository {
  constructor(
    @InjectModel(BusinessProfile.name)
    private readonly businessProfileModel: Model<BusinessProfileDocument>,
  ) {
    super();
  }

  async create(businessProfile: BusinessProfile): Promise<BusinessProfile> {
    const doc = new this.businessProfileModel({
      business_name: businessProfile.businessName,
      business_type: businessProfile.businessType,
      email: businessProfile.email,
      phone: businessProfile.phone,
      description: businessProfile.description,
      logo_image: businessProfile.logoImage,
      cover_image: businessProfile.coverImage,
      active_status: businessProfile.activeStatus,
      average_rating: businessProfile.averageRating,
      total_reviews: businessProfile.totalReviews,
      owner_id: businessProfile.ownerId,
    });

    const saved = await doc.save();
    return this.toDomainEntity(saved);
  }

  async findById(id: string): Promise<BusinessProfile | null> {
    const doc = await this.businessProfileModel.findById(id).exec();
    return doc ? this.toDomainEntity(doc) : null;
  }

  async findByOwnerId(ownerId: string): Promise<BusinessProfile[]> {
    const docs = await this.businessProfileModel
      .find({ owner_id: ownerId })
      .exec();
    return docs.map(doc => this.toDomainEntity(doc));
  }

  async findByBusinessType(businessType: string): Promise<BusinessProfile[]> {
    const docs = await this.businessProfileModel
      .find({ business_type: businessType, active_status: true })
      .exec();
    return docs.map(doc => this.toDomainEntity(doc));
  }

  async findActiveBusinesses(): Promise<BusinessProfile[]> {
    const docs = await this.businessProfileModel
      .find({ active_status: true })
      .sort({ average_rating: -1 })
      .exec();
    return docs.map(doc => this.toDomainEntity(doc));
  }

  async update(id: string, updates: Partial<BusinessProfile>): Promise<BusinessProfile | null> {
    const updateData: any = {};
    
    if (updates.businessName) updateData.business_name = updates.businessName;
    if (updates.businessType) updateData.business_type = updates.businessType;
    if (updates.email) updateData.email = updates.email;
    if (updates.phone) updateData.phone = updates.phone;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.logoImage !== undefined) updateData.logo_image = updates.logoImage;
    if (updates.coverImage !== undefined) updateData.cover_image = updates.coverImage;
    if (updates.activeStatus !== undefined) updateData.active_status = updates.activeStatus;
    if (updates.averageRating !== undefined) updateData.average_rating = updates.averageRating;
    if (updates.totalReviews !== undefined) updateData.total_reviews = updates.totalReviews;

    const doc = await this.businessProfileModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    
    return doc ? this.toDomainEntity(doc) : null;
  }

  async updateRating(id: string, newRating: number, reviewCount: number): Promise<BusinessProfile | null> {
    const doc = await this.businessProfileModel
      .findByIdAndUpdate(
        id, 
        { 
          average_rating: newRating,
          total_reviews: reviewCount 
        }, 
        { new: true }
      )
      .exec();
    
    return doc ? this.toDomainEntity(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.businessProfileModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async findByEmail(email: string): Promise<BusinessProfile | null> {
    const doc = await this.businessProfileModel
      .findOne({ email: email.toLowerCase() })
      .exec();
    return doc ? this.toDomainEntity(doc) : null;
  }

  async searchByName(searchTerm: string): Promise<BusinessProfile[]> {
    const docs = await this.businessProfileModel
      .find({
        business_name: { $regex: searchTerm, $options: 'i' },
        active_status: true
      })
      .sort({ average_rating: -1 })
      .exec();
    return docs.map(doc => this.toDomainEntity(doc));
  }

  private toDomainEntity(doc: BusinessProfileDocument): BusinessProfile {
    return new BusinessProfile(
      doc._id.toString(),
      doc.business_name,
      doc.business_type,
      doc.email,
      doc.phone,
      doc.description,
      doc.logo_image,
      doc.cover_image,
      doc.active_status,
      doc.average_rating,
      doc.total_reviews,
      doc.owner_id.toString(),
      doc.createdAt,
      doc.updatedAt,
    );
  }
}
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// ==================== BUSINESS PROFILES SCHEMA ====================
export type BusinessProfileDocument = BusinessProfile & Document & { _id: Types.ObjectId; createdAt: string; updatedAt: string };

@Schema({
  timestamps: true,
  strict: 'throw',
})
export class BusinessProfile {
  @Prop({ required: true, trim: true })
  business_name: string;

  @Prop({ required: true, trim: true })
  business_type: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ trim: true })
  logo_image?: string;

  @Prop({ trim: true })
  cover_image?: string;

  @Prop({ default: true })
  active_status: boolean;

  @Prop({ default: 0, min: 0, max: 5 })
  average_rating: number;

  @Prop({ default: 0, min: 0 })
  total_reviews: number;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  owner_id: Types.ObjectId;
}

export const BusinessProfileSchema = SchemaFactory.createForClass(BusinessProfile);
BusinessProfileSchema.index({ owner_id: 1 });
BusinessProfileSchema.index({ business_type: 1, active_status: 1 });
BusinessProfileSchema.index({ average_rating: -1 });
BusinessProfileSchema.index({ email: 1 }, { unique: true });

// ==================== BUSINESS STAFF SCHEMA ====================
export type BusinessStaffDocument = BusinessStaff & Document & { _id: Types.ObjectId; createdAt: string; updatedAt: string };

@Schema({
  timestamps: true,
  strict: 'throw',
})
export class BusinessStaff {
  @Prop({ required: true, type: Types.ObjectId, ref: 'BusinessProfile' })
  business_id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user_id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  assigned_by: Types.ObjectId;

  @Prop({ trim: true })
  role?: string;

  @Prop({ trim: true })
  permissions?: string;

  @Prop({ default: Date.now })
  assigned_at: Date;

  @Prop({ default: true })
  is_active: boolean;
}

export const BusinessStaffSchema = SchemaFactory.createForClass(BusinessStaff);
BusinessStaffSchema.index({ business_id: 1, user_id: 1 }, { unique: true });
BusinessStaffSchema.index({ business_id: 1, is_active: 1 });
BusinessStaffSchema.index({ user_id: 1 });

// ==================== MENU CATEGORIES SCHEMA ====================
export type MenuCategoryDocument = MenuCategory & Document & { _id: Types.ObjectId; createdAt: string; updatedAt: string };

@Schema({
  timestamps: true,
  strict: 'throw',
})
export class MenuCategory {
  @Prop({ required: true, type: Types.ObjectId, ref: 'BusinessProfile' })
  business_id: Types.ObjectId;

  @Prop({ required: true, trim: true })
  category_name: string;

  @Prop({ required: true, min: 0 })
  display_order: number;

  @Prop({ default: true })
  is_active: boolean;
}

export const MenuCategorySchema = SchemaFactory.createForClass(MenuCategory);
MenuCategorySchema.index({ business_id: 1, display_order: 1 });
MenuCategorySchema.index({ business_id: 1, is_active: 1 });

// ==================== BUSINESS LOCATIONS SCHEMA ====================
export type BusinessLocationDocument = BusinessLocation & Document & { _id: Types.ObjectId; createdAt: string; updatedAt: string };

@Schema({
  timestamps: true,
  strict: 'throw',
})
export class BusinessLocation {
  @Prop({ required: true, type: Types.ObjectId, ref: 'BusinessProfile' })
  business_id: Types.ObjectId;

  @Prop({ required: true, trim: true })
  country: string;

  @Prop({ required: true, trim: true })
  state: string;

  @Prop({ required: true, trim: true })
  postal_code: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ trim: true })
  operating_hours?: string;

  @Prop({ type: Number })
  longitude?: number;

  @Prop({ type: Number })
  latitude?: number;

  @Prop({ default: true })
  is_active: boolean;
}

export const BusinessLocationSchema = SchemaFactory.createForClass(BusinessLocation);
BusinessLocationSchema.index({ business_id: 1 });
BusinessLocationSchema.index({ country: 1, state: 1 });
BusinessLocationSchema.index({ longitude: 1, latitude: 1 });

// ==================== BUSINESS REVIEWS SCHEMA ====================
export type BusinessReviewDocument = BusinessReview & Document & { _id: Types.ObjectId; createdAt: string; updatedAt: string };

@Schema({
  timestamps: true,
  strict: 'throw',
})
export class BusinessReview {
  @Prop({ required: true, type: Types.ObjectId, ref: 'BusinessProfile' })
  business_id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  reviewer_id: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ trim: true })
  review_text?: string;

  @Prop({ trim: true })
  travel_preferences?: string;

  @Prop({ default: true })
  is_active: boolean;
}

export const BusinessReviewSchema = SchemaFactory.createForClass(BusinessReview);
BusinessReviewSchema.index({ business_id: 1, is_active: 1 });
BusinessReviewSchema.index({ reviewer_id: 1 });
BusinessReviewSchema.index({ business_id: 1, rating: -1 });
BusinessReviewSchema.index({ business_id: 1, reviewer_id: 1 }, { unique: true }); // One review per user per business
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// Media subdocument schema
@Schema({ _id: true })
export class BusinessMedia {
  @Prop({ required: true })
  type: string; // 'image' | 'video'

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  filename: string;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const BusinessMediaSchema = SchemaFactory.createForClass(BusinessMedia);

@Schema({ timestamps: true })
export class BusinessProfile extends Document {
  @Prop({ required: true })
  businessName: string;

  @Prop({ required: true })
  ownerId: string; // Reference to the auth user ID

  @Prop()
  description?: string;

  @Prop([String])
  categories: string[];

  @Prop()
  location?: string;

  @Prop()
  phone?: string;

  @Prop()
  email?: string;

  @Prop()
  website?: string;

  @Prop({ type: [BusinessMediaSchema], default: [] })
  sliderImages: BusinessMedia[];

  @Prop({ type: [BusinessMediaSchema], default: [] })
  videos: BusinessMedia[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isVerified: boolean;
}

export const BusinessProfileSchema = SchemaFactory.createForClass(BusinessProfile);

// Export interfaces for clean architecture
export interface CreateBusinessProfileData {
  businessName: string;
  ownerId: string;
  description?: string;
  location?: string;
  phone?: string;
  email?: string;
  website?: string;
  categories?: string[];
}

export interface UpdateBusinessProfileData {
  businessName?: string;
  description?: string;
  location?: string;
  phone?: string;
  email?: string;
  website?: string;
  categories?: string[];
  isActive?: boolean;
}

export interface CreateMediaData {
  type: 'image' | 'video';
  url: string;
  filename: string;
  order?: number;
}
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BusinessProfileDocument = BusinessProfile & Document;

@Schema({ timestamps: true })
export class BusinessProfile {
  @Prop({ required: true })
  businessName: string;

  @Prop({ required: true })
  ownerId: string;

  @Prop()
  description: string;

  @Prop()
  location: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop()
  website: string;

  @Prop({ type: [String], default: [] })
  categories: string[];

  @Prop({ type: [String], default: [] })
  sliderImages: string[];

  @Prop({ type: [String], default: [] })
  videos: string[];

  @Prop({ type: Array, default: [] })
  posts: any[];

  @Prop({ type: Array, default: [] })
  reels: any[];

  @Prop({ type: Array, default: [] })
  menuItems: any[];

  @Prop({ default: true })
  isActive: boolean;
}

export const BusinessProfileSchema = SchemaFactory.createForClass(BusinessProfile);
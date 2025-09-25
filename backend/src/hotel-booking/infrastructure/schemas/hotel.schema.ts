import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HotelDocument = HotelSchema & Document;

@Schema({ timestamps: true })
export class HotelSchema {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  locationDescription: string;

  @Prop({ default: false })
  gym: boolean;

  @Prop({ default: false })
  spa: boolean;

  @Prop({ default: false })
  bar: boolean;

  @Prop({ default: false })
  laundry: boolean;

  @Prop({ default: false })
  restaurant: boolean;

  @Prop({ default: false })
  shopping: boolean;

  @Prop({ default: false })
  freeParking: boolean;

  @Prop({ default: false })
  bikeRental: boolean;

  @Prop({ default: false })
  freeWifi: boolean;

  @Prop({ default: false })
  movieNights: boolean;

  @Prop({ default: false })
  swimmingPool: boolean;

  @Prop({ default: false })
  coffeeShop: boolean;

  @Prop({ default: Date.now })
  addedAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const HotelMongoSchema = SchemaFactory.createForClass(HotelSchema);

// Create indexes
HotelMongoSchema.index({ userId: 1 });
HotelMongoSchema.index({ city: 1 });
HotelMongoSchema.index({ state: 1 });
HotelMongoSchema.index({ country: 1 });
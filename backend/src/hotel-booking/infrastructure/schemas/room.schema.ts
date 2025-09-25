import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoomDocument = RoomSchema & Document;

@Schema()
export class RoomSchema {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: 0 })
  bedCount: number;

  @Prop({ default: 0 })
  guestCount: number;

  @Prop({ default: 0 })
  bathroomCount: number;

  @Prop({ default: 0 })
  kingBed: number;

  @Prop({ default: 0 })
  queenBed: number;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  breakfastPrice: number;

  @Prop({ required: true })
  roomPrice: number;

  @Prop({ default: false })
  roomService: boolean;

  @Prop({ default: false })
  tv: boolean;

  @Prop({ default: false })
  balcony: boolean;

  @Prop({ default: false })
  freeWifi: boolean;

  @Prop({ default: false })
  cityView: boolean;

  @Prop({ default: false })
  oceanView: boolean;

  @Prop({ default: false })
  forestView: boolean;

  @Prop({ default: false })
  mountainView: boolean;

  @Prop({ default: false })
  airCondition: boolean;

  @Prop({ default: false })
  soundProofed: boolean;

  @Prop({ required: true })
  hotelId: string;
}

export const RoomMongoSchema = SchemaFactory.createForClass(RoomSchema);

// Create indexes
RoomMongoSchema.index({ hotelId: 1 });
RoomMongoSchema.index({ guestCount: 1 });
RoomMongoSchema.index({ roomPrice: 1 });
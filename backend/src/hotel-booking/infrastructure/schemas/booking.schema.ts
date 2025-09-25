import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookingDocument = BookingSchema & Document;

@Schema({ timestamps: true })
export class BookingSchema {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  roomId: string;

  @Prop({ required: true })
  hotelId: string;

  @Prop({ required: true })
  hotelOwnerId: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  breakfastIncluded: boolean;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ default: false })
  paymentStatus: boolean;

  @Prop()
  paymentIntentId?: string;

  @Prop({ default: Date.now })
  bookedAt: Date;
}

export const BookingMongoSchema = SchemaFactory.createForClass(BookingSchema);

// Create indexes
BookingMongoSchema.index({ userId: 1 });
BookingMongoSchema.index({ hotelOwnerId: 1 });
BookingMongoSchema.index({ roomId: 1 });
BookingMongoSchema.index({ startDate: 1, endDate: 1 });
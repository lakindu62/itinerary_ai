import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ItineraryDocument = Itinerary &
  Document & { _id: Types.ObjectId; createdAt: string; updatedAt: string };

@Schema({
  timestamps: true,
  strict: 'throw',
})
export class Itinerary {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  destination: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const ItinerarySchema = SchemaFactory.createForClass(Itinerary);

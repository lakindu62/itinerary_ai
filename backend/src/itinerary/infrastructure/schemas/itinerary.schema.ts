import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ItineraryDocument = Itinerary &
  Document & { _id: Types.ObjectId; createdAt: string; updatedAt: string };

@Schema({ _id: false })
export class Activity {
  @Prop({ required: true })
  time: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true, type: [Number] })
  coordinates: [number, number]; // [longitude, latitude]
}

@Schema({ _id: false })
export class Day {
  @Prop({ required: true })
  dayNumber: number;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  destination: string;

  @Prop({ required: true, type: [Activity] })
  activities: Activity[];
}

@Schema({
  timestamps: true,
  strict: 'throw',
})
export class Itinerary {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  summary: string;

  @Prop({ required: true, type: [Day] })
  days: Day[];

  @Prop({ required: true })
  accommodation: string;

  @Prop({ required: true, type: [String] })
  tips: string[];
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
export const DaySchema = SchemaFactory.createForClass(Day);
export const ItinerarySchema = SchemaFactory.createForClass(Itinerary);

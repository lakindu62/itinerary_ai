import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EventVenueDocument = EventVenue &
  Document & { _id: Types.ObjectId };

@Schema({
  timestamps: true,
  strict: 'throw',
})
export class EventVenue {
  @Prop({ required: true, index: true })
  businessAccountId: string;

  @Prop({ required: true })
  venueName: string;

  @Prop()
  address: string;

  @Prop()
  city: string;

  @Prop()
  province: string;

  @Prop()
  postalCode: string;

  @Prop()
  country: string;

  @Prop()
  coordinates: [number, number];

  @Prop()
  capacity: number;

  @Prop({ type: [String] })
  facilities: string[];
}

export const EventVenueSchema = SchemaFactory.createForClass(EventVenue);

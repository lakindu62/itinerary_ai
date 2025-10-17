import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ConversationDocument } from './conversation.schema';
import { Conversation } from 'src/itinerary/domain/entities/conversation.entity';
import { ItineraryVisibility } from 'src/itinerary/domain/entities/itinerary.entity';
import { Activity } from 'src/itinerary/domain/value-objects/itinerary/activity.vo';
import { randomBytes } from 'crypto';
export type ItineraryDocument = Itinerary &
  Document & { _id: Types.ObjectId; createdAt: string; updatedAt: string };

export type ItineraryDocumentPopulated = Omit<
  ItineraryDocument,
  'conversation'
> & {
  conversation: ConversationDocument;
};

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
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

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

  @Prop({ required: true, type: Conversation })
  conversation: Conversation;

  //privacy and sharing options
  @Prop({ required: true })
  visibility: ItineraryVisibility;

  @Prop({ type: String, index: true, unique: true, sparse: true })
  shareToken?: string; // present only when visibility === 'link'

  @Prop({ type: String, index: true, unique: true })
  slug: string; // for public route like /itineraries/:slug

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  sharedWith?: Types.ObjectId[]; // optional: specific friends
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
export const DaySchema = SchemaFactory.createForClass(Day);
export const ItinerarySchema = SchemaFactory.createForClass(Itinerary);
// auto-generate slug and sanitize
ItinerarySchema.pre('validate', function (next) {
  if (!this.slug && this.title) {
    const base = this.title
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 60);
    // ensure uniqueness suffix; you can also enforce at service level
    this.slug = `${base}-${this._id?.toString().slice(-6) || randomBytes(3).toString('hex')}`;
  }
  next();
});

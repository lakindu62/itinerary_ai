import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ConversationDocument } from './conversation.schema';
import { Conversation } from 'src/itinerary/domain/entities/conversation.entity';
import { ItineraryVisibility } from 'src/itinerary/domain/entities/itinerary.entity';
import {
  Activity,
  AdditionalDetails,
} from 'src/itinerary/domain/value-objects/itinerary/activity.vo';
import { randomBytes } from 'crypto';

export type ActivitySubdoc = ActivitySchema & { _id: Types.ObjectId };

export type DayDocument = Omit<Day, 'activities'> &
  Document & {
    _id: Types.ObjectId;
    activities: ActivitySubdoc[];
  };

export type ItineraryDocument = Omit<Itinerary, 'days'> &
  Document & {
    _id: Types.ObjectId;
    createdAt: string;
    updatedAt: string;
    days: DayDocument[];
  };
export type ItineraryDocumentPopulated = Omit<
  ItineraryDocument,
  'conversation'
> & {
  conversation: ConversationDocument;
};

// Schema classes (infrastructure layer) - separate from domain
@Schema({ _id: false })
class AdditionalDetailsSchema implements AdditionalDetails {
  @Prop()
  id?: string;

  @Prop()
  imageUrl?: string;

  @Prop()
  startDate?: string;

  @Prop()
  endDate?: string;

  @Prop()
  startTime?: string;

  @Prop()
  endTime?: string;
}

const AdditionalDetailsSchemaFactory = SchemaFactory.createForClass(
  AdditionalDetailsSchema,
);

@Schema({ _id: true })
export class ActivitySchema extends Activity {
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
  coordinates: [number, number];

  @Prop({ type: AdditionalDetailsSchemaFactory })
  additionalDetails?: AdditionalDetails;

  @Prop({ type: Number, min: 0 })
  budgetedAmount?: number;

  @Prop({ type: Number, min: 0 })
  actualSpend?: number;
}

const ActivitySchemaFactory = SchemaFactory.createForClass(ActivitySchema);

@Schema({ _id: false })
export class Day {
  @Prop({ required: true })
  dayNumber: number;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  destination: string;

  @Prop({ required: true, type: [ActivitySchemaFactory] })
  activities: Activity[];
}

export const DaySchema = SchemaFactory.createForClass(Day);

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

  @Prop({ required: true, type: [DaySchema] })
  days: Day[];

  @Prop({ required: true })
  accommodation: string;

  @Prop({ required: true, type: [String] })
  tips: string[];

  @Prop({ required: true, type: Conversation })
  conversation: Conversation;

  @Prop({ required: true })
  visibility: ItineraryVisibility;

  @Prop({ type: String, index: true, unique: true, sparse: true })
  shareToken?: string;

  @Prop({ type: String, index: true, unique: true })
  slug: string;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  sharedWith?: Types.ObjectId[];
}

export const ItinerarySchema = SchemaFactory.createForClass(Itinerary);

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
    this.slug = `${base}-${this._id?.toString().slice(-6) || randomBytes(3).toString('hex')}`;
  }
  next();
});

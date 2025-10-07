import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type TravelPlanningSessionDocument = TravelPlanningSession &
  Document & {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  };
@Schema({
  timestamps: true,
  strict: 'throw',
  collection: 'travel_planning_sessions',
})
export class TravelPlanningSession {
  @Prop({ required: true, type: Types.ObjectId, index: true })
  userId: Types.ObjectId;
  @Prop({ required: true, type: Types.ObjectId, ref: 'Conversation' })
  conversationId: Types.ObjectId;
  @Prop({ required: false, type: Types.ObjectId, ref: 'Itinerary' })
  currentItineraryId?: Types.ObjectId;
  @Prop({ required: true, default: true })
  isActive: boolean;
  @Prop({ required: true, default: () => new Date() })
  lastActivityAt: Date;
}
export const TravelPlanningSessionSchema = SchemaFactory.createForClass(
  TravelPlanningSession,
);
// Indexes
TravelPlanningSessionSchema.index({ userId: 1, isActive: 1 });
// Ensure only one active session per user
TravelPlanningSessionSchema.index(
  { userId: 1, isActive: 1 },
  {
    unique: true,
    partialFilterExpression: { isActive: true },
    name: 'unique_active_session_per_user',
  },
);

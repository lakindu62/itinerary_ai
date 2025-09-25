import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TravelerDocument = Traveler & Document & { _id: Types.ObjectId };

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'travelers',
})
export class Traveler {
  @Prop({ type: Types.ObjectId, required: true }) //, unique: true
  user_id: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  interest?: string[];

  @Prop({ type: String })
  travel_preferences?: string;

  @Prop({ type: String })
  budget_range?: string;

  @Prop({ type: String })
  group_size_preference?: string;
}

export const TravelerSchema = SchemaFactory.createForClass(Traveler);

// Indexes
TravelerSchema.index({ user_id: 1 }, { unique: true });

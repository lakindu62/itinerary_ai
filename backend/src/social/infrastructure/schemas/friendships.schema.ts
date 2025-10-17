import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type HasFriendshipDocument = HasFriendship &
  Document & { _id: Types.ObjectId; createdAt: Date; updatedAt: Date };

@Schema({
  timestamps: true,
  collection: 'friendships',
})
export class HasFriendship {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  requester_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  receiver_id: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  })
  status: string;
}

export const HasFriendshipSchema = SchemaFactory.createForClass(HasFriendship);

// Indexes for efficient queries
HasFriendshipSchema.index(
  { requester_id: 1, receiver_id: 1 },
  { unique: true },
);
HasFriendshipSchema.index({ status: 1 });
HasFriendshipSchema.index({ requester_id: 1, status: 1 });
HasFriendshipSchema.index({ receiver_id: 1, status: 1 });

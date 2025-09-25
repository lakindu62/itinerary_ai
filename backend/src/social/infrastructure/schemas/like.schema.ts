import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LikeDocument = Like &
  Document & { _id: Types.ObjectId; createdAt: string; updatedAt: string };

@Schema({
  timestamps: true,
  collection: 'likes',
})
export class Like {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  post: Types.ObjectId;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

// Index to prevent duplicate likes
LikeSchema.index({ user: 1, post: 1 }, { unique: true });

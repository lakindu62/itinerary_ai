import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PostDocument = Post &
  Document & { _id: Types.ObjectId; createdAt: string; updatedAt: string };

@Schema({
  timestamps: true,
  collection: 'posts',
})
export class Post {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: String })
  content?: string;

  @Prop({ type: String })
  image?: string;

  @Prop({ type: [String], default: [] })
  mediaFiles?: string[];

  @Prop({ type: Number, default: 0 })
  likeCount: number;

  @Prop({ type: Number, default: 0 })
  commentCount: number;

  // @Prop({ type: [Types.ObjectId], ref: 'Like', default: [] })
  // likes?: Types.ObjectId[];

  // Virtual fields for relations
  // author?: Types.ObjectId;
  // // comments?: Types.ObjectId[];
  // notifications?: Types.ObjectId[];
}

export const PostSchema = SchemaFactory.createForClass(Post);

// // Add indexes
PostSchema.index({ user: 1 });
PostSchema.index({ createdAt: -1 });
PostSchema.index({ user: 1, createdAt: -1 });

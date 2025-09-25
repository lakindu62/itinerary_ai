import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({
  timestamps: true,
  collection: 'posts',
})
export class Post {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  authorId: Types.ObjectId;

  @Prop({ type: String })
  content?: string;

  @Prop({ type: String })
  image?: string;

  // Virtual fields for relations
  author?: Types.ObjectId;
  comments?: Types.ObjectId[];
  likes?: Types.ObjectId[];
  notifications?: Types.ObjectId[];
}

export const PostSchema = SchemaFactory.createForClass(Post);

// Add indexes
PostSchema.index({ authorId: 1 });
PostSchema.index({ createdAt: -1 });
PostSchema.index({ authorId: 1, createdAt: -1 });

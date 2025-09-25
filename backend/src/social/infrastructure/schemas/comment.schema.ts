import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CommentDocument = Comment &
  Document & { _id: Types.ObjectId; createdAt: string; updatedAt: string };

@Schema({
  timestamps: true,
  collection: 'comments',
})
export class Comment {
  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  post: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  likeCount: number;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

// Indexes
// PostCommentSchema.index({ post: 1 });
// PostCommentSchema.index({ user: 1 });

// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';

// export type PostCommentDocument = PostComment &
//   Document & { _id: Types.ObjectId };

// @Schema({
//   timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
//   collection: 'post_comments',
// })
// export class PostComment {
//   @Prop({ type: String, required: true })
//   content: string;

//   @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
//   post: Types.ObjectId;

//   @Prop({ type: Types.ObjectId, ref: 'User', required: true })
//   user: Types.ObjectId;
// }

// export const PostCommentSchema = SchemaFactory.createForClass(PostComment);

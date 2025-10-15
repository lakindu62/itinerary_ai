import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ConversationContext } from '../../domain/value-objects/conversation/conversation-context.vo';
import { ConversationMessage } from '../../domain/value-objects/conversation/conversation-message.vo';

export type ConversationDocument = Conversation &
  Document & {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({
  timestamps: true,
  strict: 'throw',
  collection: 'conversations',
})
export class Conversation {
  @Prop({ required: true, type: Types.ObjectId, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, type: [ConversationMessage], default: [] })
  messages: ConversationMessage[];

  @Prop({
    required: true,
    type: ConversationContext,
    default: () => new ConversationContext('initial'),
  })
  context: ConversationContext;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

// Indexes
ConversationSchema.index({ userId: 1 });

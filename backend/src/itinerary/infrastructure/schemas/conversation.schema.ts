import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ConversationDocument = Conversation &
  Document & {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({ _id: false })
export class ConversationMessage {
  @Prop({ required: true, enum: ['user', 'assistant'] })
  role: 'user' | 'assistant';

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, default: () => new Date() })
  timestamp: Date;
}

@Schema({ _id: false })
export class ConversationContext {
  @Prop({
    required: true,
    enum: ['initial', 'clarifying', 'creating', 'modifying'],
    default: 'initial',
  })
  stage: 'initial' | 'clarifying' | 'creating' | 'modifying';

  @Prop({ required: false })
  destination?: string;

  @Prop({ required: false })
  dates?: string;

  @Prop({ required: false })
  travelers?: string;

  @Prop({ required: false })
  preferences?: string;

  @Prop({ required: false })
  budget?: string;
}

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
    default: () => ({ stage: 'initial' }),
  })
  context: ConversationContext;
}

export const ConversationMessageSchema =
  SchemaFactory.createForClass(ConversationMessage);
export const ConversationContextSchema =
  SchemaFactory.createForClass(ConversationContext);
export const ConversationSchema = SchemaFactory.createForClass(Conversation);

// Indexes
ConversationSchema.index({ userId: 1 });

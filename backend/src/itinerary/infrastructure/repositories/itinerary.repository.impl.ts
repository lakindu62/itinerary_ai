import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ItineraryRepository } from '../../domain/repositories/itinerary.repository';
import {
  Itinerary,
  ItineraryVisibility,
} from '../../domain/entities/itinerary.entity';
import { ItineraryDocument } from '../schemas/itinerary.schema';
import { Conversation } from 'src/itinerary/domain/entities/conversation.entity';
import { TravelPlanningSession } from 'src/itinerary/domain/aggregates/travel-planning-session.aggregate';
import {
  ConversationContext,
  ConversationMessage,
} from 'src/itinerary/domain/value-objects/conversation';
import { ItineraryMapper } from './mappers/itinerary-mapper';
import { ItineraryVisibilityEnum } from '@shared/types/itinerary/chat-itinerary.response.dto';

@Injectable()
export class ItineraryRepositoryImpl extends ItineraryRepository {
  constructor(
    @InjectModel(Itinerary.name)
    private readonly itineraryModel: Model<ItineraryDocument>,
  ) {
    super();
  }
  async updateVisibility(
    id: string,
    visibility: ItineraryVisibilityEnum,
  ): Promise<Itinerary | null> {
    const doc = await this.itineraryModel
      .findByIdAndUpdate(id, {
        visibility: visibility,
      })
      .exec();

    if (!doc) return null;
    return ItineraryMapper.toDomainEntity(doc);
  }
  async create(
    sessionId: string,
    userId: string,
    itineraryWithConversation: {
      itinerary: Itinerary;
      conversation: Conversation;
    },
  ): Promise<void> {
    const doc = new this.itineraryModel({
      _id: new Types.ObjectId(sessionId),
      ...itineraryWithConversation.itinerary,
      conversation: itineraryWithConversation.conversation,
      user: userId,
    });
    await doc.save();
    // return this.toDomainEntity(saved);
  }

  async getTravelPlanningSession(
    sessionId: string,
  ): Promise<TravelPlanningSession | null> {
    const doc = await this.itineraryModel.findById(sessionId).exec();
    if (!doc) {
      return null;
    }
    return new TravelPlanningSession(
      sessionId,
      new Conversation(
        doc.conversation.messages.map(
          (message: ConversationMessage) =>
            new ConversationMessage(message.role, message.content),
        ),
        new ConversationContext(
          doc.conversation.context.stage,
          doc.conversation.context.destination,
          doc.conversation.context.dates,
          doc.conversation.context.budget,
          doc.conversation.context.interests,
          doc.conversation.context.travelers,
        ),
      ),
      ItineraryMapper.toDomainEntity(doc),
    );
  }
  async updateTravelPlanningSession(
    sessionId: string,
    session: TravelPlanningSession,
  ): Promise<void> {
    const conversation = session.getConversation();
    const itinerary = session.getCurrentItinerary();
    await this.itineraryModel.findByIdAndUpdate(
      sessionId,
      {
        title: itinerary?.title,
        summary: itinerary?.summary,
        days: itinerary?.days,
        accommodation: itinerary?.accommodation,
        tips: itinerary?.tips,
        conversation: conversation,
      },
      {
        new: true,
      },
    );
  }

  async findById(id: string) {
    const i = await this.itineraryModel.findById(id);
    if (!i) return null;
    return ItineraryMapper.toDomainEntity(i);
  }

  async getMyItineraries(userId: string): Promise<Itinerary[]> {
    const docs = await this.itineraryModel.find({ user: userId }).exec();
    return docs.map((doc) => ItineraryMapper.toDomainEntityWithFirstDay(doc));
  }
  async getPublicItineraries(): Promise<Itinerary[]> {
    const docs = await this.itineraryModel
      .find({ visibility: ItineraryVisibility.PUBLIC })
      .exec();
    return docs.map((doc) => ItineraryMapper.toDomainEntityWithFirstDay(doc));
  }
  async getPublicItineraryBySlug(slug: string): Promise<Itinerary | null> {
    const doc = await this.itineraryModel
      .findOne({
        slug,
        visibility: ItineraryVisibility.PUBLIC,
      })
      .exec();

    if (!doc) {
      return null;
    }

    return ItineraryMapper.toDomainEntity(doc);
  }
}

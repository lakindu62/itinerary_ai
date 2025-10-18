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
import { randomBytes } from 'crypto';
import { UpdateActivityBudgetDto } from '../../application/dtos/update-activity-budget.dto';

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
    console.log('🚀 ~ ItineraryRepositoryImpl ~ updateVisibility ~ id:', id);
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
  ): Promise<Itinerary> {
    const doc = new this.itineraryModel({
      _id: new Types.ObjectId(sessionId),
      ...itineraryWithConversation.itinerary,
      conversation: itineraryWithConversation.conversation,
      user: userId,
    });
    const saved = await doc.save();
    const i = ItineraryMapper.toDomainEntity(saved);
    console.log('🚀 ~ ItineraryRepositoryImpl ~ create ~ i:', i);

    return i;
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

  async ensureShareToken(itineraryId: string): Promise<string> {
    const doc = await this.itineraryModel.findById(itineraryId).exec();
    if (!doc) {
      throw new Error('Itinerary not found');
    }
    if (doc.shareToken) {
      return doc.shareToken;
    }
    // Generate a stable random token once; keep it immutable thereafter
    const token = randomBytes(16).toString('hex');
    doc.shareToken = token;
    await doc.save();
    return token;
  }

  async findByShareToken(token: string): Promise<Itinerary | null> {
    const doc = await this.itineraryModel.findOne({ shareToken: token }).exec();
    if (!doc) return null;
    return ItineraryMapper.toDomainEntity(doc);
  }

  async updateActivityBudget(
    itineraryId: string,
    activityId: string,
    budgetData: UpdateActivityBudgetDto,
  ): Promise<Itinerary> {
    console.log(
      '🚀 ~ ItineraryRepositoryImpl ~ updateActivityBudget ~ budgetData:',
      budgetData,
    );
    const doc = await this.itineraryModel.findById(itineraryId).exec();
    if (!doc) {
      throw new Error('Itinerary not found');
    }

    // Find the activity by ID across all days
    let activityFound = false;
    for (const day of doc.days) {
      const activity = day.activities.find(
        (a) => a._id.toString() === activityId,
      );
      if (activity) {
        activityFound = true;
        if (budgetData.budgetedAmount !== undefined) {
          activity.budgetedAmount = budgetData.budgetedAmount;
        }
        if (budgetData.actualSpend !== undefined) {
          activity.actualSpend = budgetData.actualSpend;
        }
        break;
      }
    }

    if (!activityFound) {
      throw new Error('Activity not found');
    }

    // Save the document
    await doc.save();

    return ItineraryMapper.toDomainEntity(doc);
  }
}

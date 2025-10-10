import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ItineraryRepository } from '../../domain/repositories/itinerary.repository';
import { Itinerary } from '../../domain/entities/itinerary.entity';
import { ItineraryDocument } from '../schemas/itinerary.schema';
import { Conversation } from 'src/itinerary/domain/entities/conversation.entity';
import { TravelPlanningSession } from 'src/itinerary/domain/aggregates/travel-planning-session.aggregate';
import { Day } from '../../domain/value-objects/itinerary/day.vo';
import { Activity } from '../../domain/value-objects/itinerary/activity.vo';
import {
  ConversationContext,
  ConversationMessage,
} from 'src/itinerary/domain/value-objects/conversation';

@Injectable()
export class ItineraryRepositoryImpl extends ItineraryRepository {
  constructor(
    @InjectModel(Itinerary.name)
    private readonly itineraryModel: Model<ItineraryDocument>,
  ) {
    super();
  }

  async create(
    userId: string,
    itineraryWithConversation: {
      itinerary: Itinerary;
      conversation: Conversation;
    },
  ): Promise<void> {
    const doc = new this.itineraryModel({
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
      new Itinerary(
        doc.title,
        doc.summary,
        doc.days.map(
          (day) =>
            new Day(
              day.dayNumber,
              day.date,
              day.destination,
              day.activities.map(
                (activity) =>
                  new Activity(
                    activity.time,
                    activity.name,
                    activity.description,
                    activity.address,
                    activity.type,
                    activity.coordinates,
                  ),
              ),
            ),
        ),
        doc.accommodation,
        doc.tips,
        doc._id.toString(),
      ),
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

  // private toDomainEntity(doc: ItineraryDocument): Itinerary {
  //   // Reconstruct domain value objects from the saved document
  //   const days = doc.days.map(
  //     (dayDoc) =>
  //       new Day(
  //         dayDoc.dayNumber,
  //         dayDoc.date,
  //         dayDoc.destination,
  //         dayDoc.activities.map(
  //           (activityDoc) =>
  //             new Activity(
  //               activityDoc.time,
  //               activityDoc.name,
  //               activityDoc.description,
  //               activityDoc.address,
  //               activityDoc.type,
  //               activityDoc.coordinates,
  //             ),
  //         ),
  //       ),
  //   );

  //   return new Itinerary(
  //     doc.title,
  //     doc.summary,
  //     days,
  //     doc.accommodation,
  //     doc.tips,
  //     doc._id.toString(),
  //   );
  // }
}

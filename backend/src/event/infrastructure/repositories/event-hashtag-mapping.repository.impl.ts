import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventHashtagMappingRepository } from '../../domain/repositories/event-hashtag-mapping.repository';
import { EventHashtagMapping } from '../../domain/entities/event-hashtag-mapping.entity';
import { EventHashtagMappingDocument } from '../schemas/event-hashtag-mapping.schema';

@Injectable()
export class EventHashtagMappingRepositoryImpl
  extends EventHashtagMappingRepository
{
  constructor(
    @InjectModel(EventHashtagMapping.name)
    private readonly eventHashtagMappingModel: Model<EventHashtagMappingDocument>,
  ) {
    super();
  }

  async create(
    eventHashtagMapping: EventHashtagMapping,
  ): Promise<EventHashtagMapping> {
    // const newEventHashtagMapping = new this.eventHashtagMappingModel(
    //   eventHashtagMapping,
    // );
   const objectToSave = {
    event: typeof eventHashtagMapping.event === 'object'
    ? (eventHashtagMapping.event as any)._id || (eventHashtagMapping.event as any).id
    : eventHashtagMapping.event,
    hashtag: typeof eventHashtagMapping.hashtag === 'object'
    ? (eventHashtagMapping.hashtag as any)._id || (eventHashtagMapping.hashtag as any).id
    : eventHashtagMapping.hashtag,
};
  console.log('EventHashtagMapping to save:', objectToSave);
  if (!objectToSave.event || !objectToSave.hashtag) {
  throw new Error('Event or Hashtag mapping is missing _id!');
}
  const newEventHashtagMapping = new this.eventHashtagMappingModel(objectToSave);
    const savedEventHashtagMapping = await newEventHashtagMapping.save();
    return savedEventHashtagMapping as unknown as EventHashtagMapping;
  }

    async findByEventId(eventId: string): Promise<any[]> {
    return await this.eventHashtagMappingModel
      .find({ event: eventId })
      .populate('hashtag') // This is key to get hashtag details
      .exec();
  }

    async deleteByEventId(eventId: string): Promise<void> {
    await this.eventHashtagMappingModel.deleteMany({ event: eventId }).exec();
  }


}

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
    const newEventHashtagMapping = new this.eventHashtagMappingModel(
      eventHashtagMapping,
    );
    const savedEventHashtagMapping = await newEventHashtagMapping.save();
    return savedEventHashtagMapping as unknown as EventHashtagMapping;
  }
}

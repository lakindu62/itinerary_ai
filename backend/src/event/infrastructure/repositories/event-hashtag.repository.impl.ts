import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventHashtagRepository } from '../../domain/repositories/event-hashtag.repository';
import { EventHashtag } from '../../domain/entities/event-hashtag.entity';
import { EventHashtagDocument } from '../schemas/event-hashtag.schema';

@Injectable()
export class EventHashtagRepositoryImpl extends EventHashtagRepository {
  constructor(
    @InjectModel(EventHashtag.name)
    private readonly eventHashtagModel: Model<EventHashtagDocument>,
  ) {
    super();
  }

  async create(eventHashtag: EventHashtag): Promise<any> {
    const newEventHashtag = new this.eventHashtagModel(eventHashtag);
    const savedEventHashtag = await newEventHashtag.save();
    return this.toDomainEntity(savedEventHashtag);
  }

  async findById(id: string): Promise<any | null> {
    const doc = await this.eventHashtagModel.findById(id).exec();
    return doc ? this.toDomainEntity(doc) : null;
  }

  async findByName(name: string): Promise<any | null> {
    const doc = await this.eventHashtagModel.findOne({ hashtagName: name }).exec();
    return doc ? this.toDomainEntity(doc) : null;
  }

  async update(eventHashtag: EventHashtag): Promise<any | null> {
    const updatedDoc = await this.eventHashtagModel.findByIdAndUpdate(eventHashtag.id, eventHashtag, { new: true }).exec();
    return updatedDoc ? this.toDomainEntity(updatedDoc) : null;
  }

  async delete(id: string): Promise<void> {
    await this.eventHashtagModel.findByIdAndDelete(id).exec();
  }

  private toDomainEntity(doc: EventHashtagDocument): any {
    return {
      id: doc._id.toString(),
      hashtagName: doc.hashtagName,
      createdAt: (doc as any).createdAt,
    };
  }
}

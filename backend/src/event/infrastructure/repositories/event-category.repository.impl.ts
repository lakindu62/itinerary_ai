import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventCategoryRepository } from '../../domain/repositories/event-category.repository';
import { EventCategory } from '../../domain/entities/event-category.entity';
import { EventCategoryDocument } from '../schemas/event-category.schema';

@Injectable()
export class EventCategoryRepositoryImpl extends EventCategoryRepository {
  constructor(
    @InjectModel(EventCategory.name) private readonly eventCategoryModel: Model<EventCategoryDocument>,
  ) {
    super();
  }

  async create(eventCategory: EventCategory): Promise<any> {
    const newEventCategory = new this.eventCategoryModel(eventCategory);
    const savedEventCategory = await newEventCategory.save();
    return this.toDomainEntity(savedEventCategory);
  }

  async findById(id: string): Promise<any | null> {
    const doc = await this.eventCategoryModel.findById(id).exec();
    return doc ? this.toDomainEntity(doc) : null;
  }

  async update(eventCategory: EventCategory): Promise<any | null> {
    const updatedDoc = await this.eventCategoryModel.findByIdAndUpdate(eventCategory.id, eventCategory, { new: true }).exec();
    return updatedDoc ? this.toDomainEntity(updatedDoc) : null;
  }

  async delete(id: string): Promise<void> {
    await this.eventCategoryModel.findByIdAndDelete(id).exec();
  }


  

  private toDomainEntity(doc: EventCategoryDocument): any {
    return {
      id: doc._id.toString(),
      categoryName: doc.categoryName,
      description: doc.description,
      createdAt: (doc as any).createdAt,
    };
  }
}

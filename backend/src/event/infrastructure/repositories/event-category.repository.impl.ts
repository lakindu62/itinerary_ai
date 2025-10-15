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

  async create(eventCategory: EventCategory): Promise<EventCategory> {
    const newEventCategory = new this.eventCategoryModel(eventCategory);
    const savedEventCategory = await newEventCategory.save();
    return this.toDomainEntity(savedEventCategory);
  }

  async findAll(businessAccountId: string): Promise<EventCategory[]> {
    const docs = await this.eventCategoryModel.find({ businessAccountId }).exec();
    return docs.map(doc => this.toDomainEntity(doc));
  }

  async findById(id: string, businessAccountId: string): Promise<EventCategory | null> {
    const doc = await this.eventCategoryModel.findOne({ _id: id, businessAccountId }).exec();
    return doc ? this.toDomainEntity(doc) : null;
  }

  async update(id: string, updates: Partial<EventCategory>, businessAccountId: string): Promise<EventCategory | null> {
    const updatedDoc = await this.eventCategoryModel.findOneAndUpdate({ _id: id, businessAccountId }, updates, { new: true }).exec();
    return updatedDoc ? this.toDomainEntity(updatedDoc) : null;
  }

  async delete(id: string, businessAccountId: string): Promise<boolean> {
    const result = await this.eventCategoryModel.deleteOne({ _id: id, businessAccountId }).exec();
    return result.deletedCount > 0;
  }

  private toDomainEntity(doc: EventCategoryDocument): EventCategory {
    return new EventCategory(
      doc._id.toString(),
      doc.businessAccountId,
      doc.categoryName,
      doc.description,
    );
  }
}
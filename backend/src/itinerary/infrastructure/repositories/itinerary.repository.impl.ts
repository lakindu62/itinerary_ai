import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ItineraryRepository } from '../../domain/repositories/itinerary.repository';
import { Itinerary } from '../../domain/entities/itinerary.entity';
import { ItineraryDocument } from '../schemas/itinerary.schema';

@Injectable()
export class ItineraryRepositoryImpl extends ItineraryRepository {
  constructor(
    @InjectModel(Itinerary.name)
    private readonly itineraryModel: Model<ItineraryDocument>,
  ) {
    super();
  }

  async create(itinerary: Itinerary): Promise<Itinerary> {
    const doc = new this.itineraryModel({
      title: itinerary.title,
      destination: itinerary.destination,
      isActive: itinerary.isActive,
    });

    const saved = await doc.save();
    return this.toDomainEntity(saved);
  }

  async findById(id: string): Promise<Itinerary | null> {
    const doc = await this.itineraryModel.findById(id).exec();
    return doc ? this.toDomainEntity(doc) : null;
  }

  private toDomainEntity(doc: ItineraryDocument): Itinerary {
    return new Itinerary(
      doc._id.toString(),
      doc.title,
      doc.destination,
      doc.isActive,
      doc.createdAt,
      doc.updatedAt,
    );
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HotelRepository } from '../../domain/repositories/hotel.repository';
import { Hotel } from '../../domain/entities/hotel.entity';
import { HotelSchema, HotelDocument } from '../schemas/hotel.schema';

@Injectable()
export class HotelRepositoryImpl implements HotelRepository {
  constructor(
    @InjectModel(HotelSchema.name)
    private hotelModel: Model<HotelDocument>,
  ) {}

  async create(hotel: Hotel): Promise<Hotel> {
    const hotelDoc = new this.hotelModel(this.entityToDocument(hotel));
    const savedDoc = await hotelDoc.save();
    return this.documentToEntity(savedDoc);
  }

  async findById(id: string): Promise<Hotel | null> {
    const hotelDoc = await this.hotelModel.findOne({ id }).exec();
    return hotelDoc ? this.documentToEntity(hotelDoc) : null;
  }

  async findByUserId(userId: string): Promise<Hotel[]> {
    const hotelDocs = await this.hotelModel.find({ userId }).exec();
    return hotelDocs.map(doc => this.documentToEntity(doc));
  }

  async findAll(filters?: {
    city?: string;
    state?: string;
    country?: string;
    amenities?: string[];
  }): Promise<Hotel[]> {
    const query: any = {};

    if (filters?.city) query.city = new RegExp(filters.city, 'i');
    if (filters?.state) query.state = new RegExp(filters.state, 'i');
    if (filters?.country) query.country = new RegExp(filters.country, 'i');
    
    if (filters?.amenities?.length) {
      const amenityQuery = {};
      filters.amenities.forEach(amenity => {
        amenityQuery[amenity] = true;
      });
      Object.assign(query, amenityQuery);
    }

    const hotelDocs = await this.hotelModel.find(query).exec();
    return hotelDocs.map(doc => this.documentToEntity(doc));
  }

  async update(hotel: Hotel): Promise<Hotel> {
    const updatedDoc = await this.hotelModel
      .findOneAndUpdate(
        { id: hotel.id },
        this.entityToDocument(hotel),
        { new: true }
      )
      .exec();
    
    if (!updatedDoc) {
      throw new Error(`Hotel with ID ${hotel.id} not found for update`);
    }
    
    return this.documentToEntity(updatedDoc);
  }

  async delete(id: string): Promise<void> {
    await this.hotelModel.deleteOne({ id }).exec();
  }

  async findByLocation(city: string, state?: string, country?: string): Promise<Hotel[]> {
    const query: any = { city: new RegExp(city, 'i') };
    if (state) query.state = new RegExp(state, 'i');
    if (country) query.country = new RegExp(country, 'i');

    const hotelDocs = await this.hotelModel.find(query).exec();
    return hotelDocs.map(doc => this.documentToEntity(doc));
  }

  private entityToDocument(hotel: Hotel): any {
    return {
      id: hotel.id,
      userId: hotel.userId,
      title: hotel.title,
      description: hotel.description,
      image: hotel.image,
      country: hotel.country,
      state: hotel.state,
      city: hotel.city,
      locationDescription: hotel.locationDescription,
      gym: hotel.gym,
      spa: hotel.spa,
      bar: hotel.bar,
      laundry: hotel.laundry,
      restaurant: hotel.restaurant,
      shopping: hotel.shopping,
      freeParking: hotel.freeParking,
      bikeRental: hotel.bikeRental,
      freeWifi: hotel.freeWifi,
      movieNights: hotel.movieNights,
      swimmingPool: hotel.swimmingPool,
      coffeeShop: hotel.coffeeShop,
      addedAt: hotel.addedAt,
      updatedAt: hotel.updatedAt,
    };
  }

  private documentToEntity(doc: HotelDocument): Hotel {
    return new Hotel(
      doc.id,
      doc.userId,
      doc.title,
      doc.description,
      doc.image,
      doc.country,
      doc.state,
      doc.city,
      doc.locationDescription,
      doc.gym,
      doc.spa,
      doc.bar,
      doc.laundry,
      doc.restaurant,
      doc.shopping,
      doc.freeParking,
      doc.bikeRental,
      doc.freeWifi,
      doc.movieNights,
      doc.swimmingPool,
      doc.coffeeShop,
      doc.addedAt,
      doc.updatedAt,
    );
  }
}
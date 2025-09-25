import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoomRepository } from '../../domain/repositories/room.repository';
import { Room } from '../../domain/entities/room.entity';
import { RoomSchema, RoomDocument } from '../schemas/room.schema';

@Injectable()
export class RoomRepositoryImpl implements RoomRepository {
  constructor(
    @InjectModel(RoomSchema.name)
    private roomModel: Model<RoomDocument>,
  ) {}

  async create(room: Room): Promise<Room> {
    const roomDoc = new this.roomModel(this.entityToDocument(room));
    const savedDoc = await roomDoc.save();
    return this.documentToEntity(savedDoc);
  }

  async findById(id: string): Promise<Room | null> {
    const roomDoc = await this.roomModel.findOne({ id }).exec();
    return roomDoc ? this.documentToEntity(roomDoc) : null;
  }

  async findByHotelId(hotelId: string): Promise<Room[]> {
    const roomDocs = await this.roomModel.find({ hotelId }).exec();
    return roomDocs.map(doc => this.documentToEntity(doc));
  }

  async findAvailableRooms(hotelId: string, startDate: Date, endDate: Date): Promise<Room[]> {
    // For now, return all rooms in the hotel
    // Later you can add booking conflict checking logic here
    const roomDocs = await this.roomModel.find({ hotelId }).exec();
    return roomDocs.map(doc => this.documentToEntity(doc));
  }

  async update(room: Room): Promise<Room> {
    const updatedDoc = await this.roomModel
      .findOneAndUpdate(
        { id: room.id },
        this.entityToDocument(room),
        { new: true }
      )
      .exec();
    
    if (!updatedDoc) {
      throw new Error(`Room with ID ${room.id} not found for update`);
    }
    
    return this.documentToEntity(updatedDoc);
  }

  async delete(id: string): Promise<void> {
    await this.roomModel.deleteOne({ id }).exec();
  }

  async findByCapacity(guestCount: number, hotelId?: string): Promise<Room[]> {
    const query: any = { guestCount: { $gte: guestCount } };
    if (hotelId) query.hotelId = hotelId;

    const roomDocs = await this.roomModel.find(query).exec();
    return roomDocs.map(doc => this.documentToEntity(doc));
  }

  private entityToDocument(room: Room): any {
    return {
      id: room.id,
      title: room.title,
      description: room.description,
      bedCount: room.bedCount,
      guestCount: room.guestCount,
      bathroomCount: room.bathroomCount,
      kingBed: room.kingBed,
      queenBed: room.queenBed,
      image: room.image,
      breakfastPrice: room.breakfastPrice,
      roomPrice: room.roomPrice,
      roomService: room.roomService,
      tv: room.tv,
      balcony: room.balcony,
      freeWifi: room.freeWifi,
      cityView: room.cityView,
      oceanView: room.oceanView,
      forestView: room.forestView,
      mountainView: room.mountainView,
      airCondition: room.airCondition,
      soundProofed: room.soundProofed,
      hotelId: room.hotelId,
    };
  }

  private documentToEntity(doc: RoomDocument): Room {
    return new Room(
      doc.id,
      doc.title,
      doc.description,
      doc.bedCount,
      doc.guestCount,
      doc.bathroomCount,
      doc.kingBed,
      doc.queenBed,
      doc.image,
      doc.breakfastPrice,
      doc.roomPrice,
      doc.roomService,
      doc.tv,
      doc.balcony,
      doc.freeWifi,
      doc.cityView,
      doc.oceanView,
      doc.forestView,
      doc.mountainView,
      doc.airCondition,
      doc.soundProofed,
      doc.hotelId,
    );
  }
}
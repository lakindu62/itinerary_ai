import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookingRepository } from '../../domain/repositories/booking.repository';
import { Booking } from '../../domain/entities/booking.entity';
import { BookingSchema, BookingDocument } from '../schemas/booking.schema';

@Injectable()
export class BookingRepositoryImpl implements BookingRepository {
  constructor(
    @InjectModel(BookingSchema.name)
    private bookingModel: Model<BookingDocument>,
  ) {}

  async create(booking: Booking): Promise<Booking> {
    const bookingDoc = new this.bookingModel(this.entityToDocument(booking));
    const savedDoc = await bookingDoc.save();
    return this.documentToEntity(savedDoc);
  }

  async findById(id: string): Promise<Booking | null> {
    const bookingDoc = await this.bookingModel.findOne({ id }).exec();
    return bookingDoc ? this.documentToEntity(bookingDoc) : null;
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    const bookingDocs = await this.bookingModel.find({ userId }).exec();
    return bookingDocs.map(doc => this.documentToEntity(doc));
  }

  async findByHotelOwnerId(hotelOwnerId: string): Promise<Booking[]> {
    const bookingDocs = await this.bookingModel.find({ hotelOwnerId }).exec();
    return bookingDocs.map(doc => this.documentToEntity(doc));
  }

  async findByRoomId(roomId: string): Promise<Booking[]> {
    const bookingDocs = await this.bookingModel.find({ roomId }).exec();
    return bookingDocs.map(doc => this.documentToEntity(doc));
  }

  async update(booking: Booking): Promise<Booking> {
    const updatedDoc = await this.bookingModel
      .findOneAndUpdate(
        { id: booking.id },
        this.entityToDocument(booking),
        { new: true }
      )
      .exec();
    
    if (!updatedDoc) {
      throw new Error(`Booking with ID ${booking.id} not found for update`);
    }
    
    return this.documentToEntity(updatedDoc);
  }

  async delete(id: string): Promise<void> {
    await this.bookingModel.deleteOne({ id }).exec();
  }

  async findConflictingBookings(roomId: string, startDate: Date, endDate: Date): Promise<Booking[]> {
    const bookingDocs = await this.bookingModel.find({
      roomId,
      $or: [
        {
          startDate: { $lte: endDate },
          endDate: { $gte: startDate }
        }
      ]
    }).exec();
    
    return bookingDocs.map(doc => this.documentToEntity(doc));
  }

  private entityToDocument(booking: Booking): any {
    return {
      id: booking.id,
      userId: booking.userId,
      roomId: booking.roomId,
      hotelId: booking.hotelId,
      hotelOwnerId: booking.hotelOwnerId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      breakfastIncluded: booking.breakfastIncluded,
      currency: booking.currency,
      totalPrice: booking.totalPrice,
      paymentStatus: booking.paymentStatus,
      paymentIntentId: booking.paymentIntentId,
      bookedAt: booking.bookedAt,
    };
  }

  private documentToEntity(doc: BookingDocument): Booking {
    return new Booking(
      doc.id,
      doc.userId,
      doc.roomId,
      doc.hotelId,
      doc.hotelOwnerId,
      doc.startDate,
      doc.endDate,
      doc.breakfastIncluded,
      doc.currency,
      doc.totalPrice,
      doc.paymentStatus,
      doc.paymentIntentId,
      doc.bookedAt,
    );
  }
}
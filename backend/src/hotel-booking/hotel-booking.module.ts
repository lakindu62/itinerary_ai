import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelController } from './presentation/controllers/hotel.controller';
import { RoomController } from './presentation/controllers/room.controller';
import { HotelService } from './application/services/hotel.service';
import { RoomService } from './application/services/room.service';
import { HotelRepositoryImpl } from './infrastructure/repositories/hotel.repository.impl';
import { RoomRepositoryImpl } from './infrastructure/repositories/room.repository.impl';
import { HotelSchema, HotelMongoSchema } from './infrastructure/schemas/hotel.schema';
import { RoomSchema, RoomMongoSchema } from './infrastructure/schemas/room.schema';
import { BookingController } from './presentation/controllers/booking.controller';
import { PaymentController } from './presentation/controllers/payment.controller';
import { BookingService } from './application/services/booking.service';
import { BookingRepositoryImpl } from './infrastructure/repositories/booking.repository.impl';
import { BookingSchema, BookingMongoSchema } from './infrastructure/schemas/booking.schema';


import { Hotel } from './domain/entities/hotel.entity';
import { Room } from './domain/entities/room.entity';
import { Booking } from './domain/entities/booking.entity';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Hotel.name, schema: HotelSchema },
    { name: Room.name, schema: RoomSchema },
    { name: Booking.name, schema: BookingSchema },
  ])],
  controllers: [HotelController, RoomController, BookingController, PaymentController],
  providers: [
    HotelService,
    RoomService,
    BookingService,
    { provide: 'HotelRepository', useClass: HotelRepositoryImpl },
    { provide: 'RoomRepository', useClass: RoomRepositoryImpl },
    { provide: 'BookingRepository', useClass: BookingRepositoryImpl },
  ],
})
export class HotelBookingModule {}
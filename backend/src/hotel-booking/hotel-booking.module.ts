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
import { BookingService } from './application/services/booking.service';
import { BookingRepositoryImpl } from './infrastructure/repositories/booking.repository.impl';
import { BookingSchema, BookingMongoSchema } from './infrastructure/schemas/booking.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HotelSchema.name, schema: HotelMongoSchema },
      { name: RoomSchema.name, schema: RoomMongoSchema },
      { name: BookingSchema.name, schema: BookingMongoSchema },
    ]),
  ],
  controllers: [HotelController, RoomController, BookingController],
  providers: [
    HotelService,
    RoomService,
    BookingService,
    {
      provide: 'HotelRepository',
      useClass: HotelRepositoryImpl,
    },
    {
      provide: 'RoomRepository',
      useClass: RoomRepositoryImpl,
    },
    {
      provide: 'BookingRepository',
      useClass: BookingRepositoryImpl,
    },
  ],
  exports: [HotelService, RoomService, BookingService],
})
export class HotelBookingModule {}
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItineraryModule } from './itinerary/itinerary.module';

import { HotelBookingModule } from './hotel-booking/hotel-booking.module'; // Add this

import { SocialModule } from './social/social.module';
import { EventModule } from './event/event.module'; 
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserManagementModule } from './user-management/user-management.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes config globally available
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    ItineraryModule,

    HotelBookingModule,

    SocialModule,
    UserManagementModule,
    EventModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestController } from './test.controller';
import { ItineraryModule } from './itinerary/itinerary.module';
import { HotelBookingModule } from './hotel-booking/hotel-booking.module';
import { SocialModule } from './social/social.module';
import { EventModule } from './event/event.module';
// import { BusinessProfileModule } from './business-profile/business-profile.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserManagementModule } from './user-management/user-management.module';
import { StorageModule } from './shared/kernel/storage/storage.module';
import { BusinessProfileNewModule } from './business-profile/business-profile-new.module';

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
    BusinessProfileNewModule, // New working business profile module
    // BusinessProfileModule, // Temporarily disabled until fixed
    StorageModule,
  ],
  controllers: [AppController, TestController],
  providers: [AppService],
})
export class AppModule {}

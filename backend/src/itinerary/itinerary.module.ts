import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItineraryController } from './presentation/controllers/itinerary.controller';
import { ItineraryService } from './application/services/itinerary.service';
import { ItineraryRepository } from './domain/repositories/itinerary.repository';
import { ItineraryRepositoryImpl } from './infrastructure/repositories/itinerary.repository.impl';
import { ItinerarySchema } from './infrastructure/schemas/itinerary.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Itinerary', schema: ItinerarySchema }]),
  ],
  controllers: [ItineraryController],
  providers: [
    ItineraryService,
    {
      provide: ItineraryRepository,
      useClass: ItineraryRepositoryImpl,
    },
  ],
  exports: [ItineraryService],
})
export class ItineraryModule {}

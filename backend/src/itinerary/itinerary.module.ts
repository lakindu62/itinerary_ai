import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItineraryController } from './presentation/controllers/itinerary.controller';
import { ItineraryService } from './application/services/itinerary.service';
import { ItineraryRepository } from './domain/repositories/itinerary.repository';
import { ItineraryRepositoryImpl } from './infrastructure/repositories/itinerary.repository.impl';
import { ItinerarySchema } from './infrastructure/schemas/itinerary.schema';
import { ItineraryChatService } from './application/services/itinerary-chat.service';
import {
  CreateItineraryUseCase,
  HandleClarificationUseCase,
  ModifyItineraryUseCase,
  UpdateContextUseCase,
} from './application/use-cases/itinerary-generation';
import { HotelsRepository } from './infrastructure/repositories/mocks/hotels.repository.mock';
import { AttractionsRepository } from './infrastructure/repositories/mocks/attraction.repository.mock';
import { GoogleMapsService } from './infrastructure/external-api/google-maps-service';
import { ItineraryChatServiceMock } from './application/services/mocks/itinerary-chat.service.mock';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Itinerary', schema: ItinerarySchema }]),
  ],
  controllers: [ItineraryController],
  providers: [
    ItineraryChatService,
    ItineraryService,
    HandleClarificationUseCase,
    UpdateContextUseCase,
    CreateItineraryUseCase,
    ModifyItineraryUseCase,
    HotelsRepository,
    AttractionsRepository,
    GoogleMapsService,
    ItineraryChatServiceMock,
    {
      provide: ItineraryRepository,
      useClass: ItineraryRepositoryImpl,
    },
  ],
  exports: [
    ItineraryService,
    ItineraryChatService,
    HandleClarificationUseCase,
    UpdateContextUseCase,
    CreateItineraryUseCase,
    ModifyItineraryUseCase,
    HotelsRepository,
    AttractionsRepository,
    GoogleMapsService,
    ItineraryChatServiceMock,
  ],
})
export class ItineraryModule {}

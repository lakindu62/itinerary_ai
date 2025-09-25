import { Controller, Post, Body } from '@nestjs/common';
import { ItineraryService } from 'src/itinerary/application/services/itinerary.service';
import { CreateItineraryDto } from '../../application/dtos/create-itinerary.dto';
import { ItineraryChatService } from 'src/itinerary/application/services/itinerary-chat.service';
import { ChatItineraryRequestDto } from 'src/itinerary/application/dtos/requests/chatItinerary.dto';
import { ItineraryChatServiceMock } from 'src/itinerary/application/services/mocks/itinerary-chat.service.mock';
import { ChatItineraryResponseDto } from '@shared/types/itinerary/chat-itinerary.response.dto';
@Controller('itineraries')
export class ItineraryController {
  constructor(
    private readonly itineraryService: ItineraryService,
    private readonly itineraryChatService: ItineraryChatService,
    private readonly itineraryChatServiceMock: ItineraryChatServiceMock,
  ) {}

  @Post()
  async create(@Body() createDto: CreateItineraryDto) {
    return await this.itineraryService.create(createDto);
  }
  @Post('chat')
  async chatItinerary(
    @Body()
    { message, conversationId }: ChatItineraryRequestDto,
  ): Promise<ChatItineraryResponseDto> {
    const mock = false;

    if (mock) {
      return this.itineraryChatServiceMock.chatItinerary();
    }
    return await this.itineraryChatService.chatItinerary(
      message,
      conversationId,
    );
  }
}

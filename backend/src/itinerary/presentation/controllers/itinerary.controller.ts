import {
  Controller,
  Post,
  Body,
  UseGuards,
  UnauthorizedException,
  Req,
  Logger,
  Param,
  Get,
} from '@nestjs/common';
import { ItineraryService } from 'src/itinerary/application/services/itinerary.service';
import { ItineraryChatService } from 'src/itinerary/application/services/itinerary-chat.service';
import { ChatItineraryRequestDto } from 'src/itinerary/application/dtos/requests/chatItinerary.dto';
import { ItineraryChatServiceMock } from 'src/itinerary/application/services/mocks/itinerary-chat.service.mock';
import { ChatItineraryResponseDto } from '@shared/types/itinerary/chat-itinerary.response.dto';
import { ClerkAuthGuard } from 'src/shared/guards/clerk-auth-guard';
import { UserRole } from '@shared/types/user-management';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Request } from 'express';
@Controller('itineraries')
export class ItineraryController {
  private readonly logger = new Logger(ItineraryController.name);
  constructor(
    private readonly itineraryService: ItineraryService,
    private readonly itineraryChatService: ItineraryChatService,
    private readonly itineraryChatServiceMock: ItineraryChatServiceMock,
  ) {}

  @UseGuards(ClerkAuthGuard)
  @Roles([UserRole.TRAVELER])
  @Get('/')
  async getMyItineraries(@Req() req: Request) {
    const userId = req.user?._id;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return await this.itineraryService.getMyItineraries(userId);
  }

  @Get('/public')
  async getPublicItineraries() {
    return await this.itineraryService.getPublicItineraries();
  }

  @Get('/public/:slug')
  async getPublicItineraryBySlug(@Param('slug') slug: string) {
    return await this.itineraryService.getPublicItineraryBySlug(slug);
  }
  @Get('chat/:id')
  async getChatItinerary(@Param('id') id: string) {
    return await this.itineraryChatService.getChatItinerary(id);
  }

  @UseGuards(ClerkAuthGuard)
  @Roles([UserRole.TRAVELER])
  @Post('chat')
  async chatItinerary(
    @Body()
    { message, conversationId }: ChatItineraryRequestDto,
    @Req() req: Request,
  ): Promise<ChatItineraryResponseDto> {
    console.log('🚀 ~ ItineraryController ~ chatItinerary ~ message:', message);
    console.log(
      '🚀 ~ ItineraryController ~ chatItinerary ~ conversationId:',
      conversationId,
    );
    const userId = req.user?._id;
    if (!userId) {
      this.logger.error('User not authenticated', req.user);
      throw new UnauthorizedException('User not authenticated');
    }
    const mock = false;

    if (mock) {
      return this.itineraryChatServiceMock.chatItinerary();
    }
    return await this.itineraryChatService.chatItinerary(
      userId,
      message,
      conversationId,
    );
  }
}

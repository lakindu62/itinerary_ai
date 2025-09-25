import { Injectable, Logger } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { Itinerary } from 'src/itinerary/domain/entities/itinerary.entity';
import { HotelsRepository } from 'src/itinerary/infrastructure/repositories/mocks/hotels.repository.mock';
import { AttractionsRepository } from 'src/itinerary/infrastructure/repositories/mocks/attraction.repository.mock';
import { GoogleMapsService } from 'src/itinerary/infrastructure/external-api/google-maps-service';
import { ConversationContext } from 'src/itinerary/domain/value-objects/conversation';
import { AiItineraryResponseMapper } from '../../mappers/ai-itinerary-response.mapper';

@Injectable()
export class CreateItineraryUseCase {
  private llm = new ChatGoogleGenerativeAI({
    model: 'gemini-2.0-flash',
    temperature: 0.7,
  });
  private logger = new Logger(CreateItineraryUseCase.name);
  constructor(
    private readonly hotelsRepository: HotelsRepository,
    private readonly attractionsRepository: AttractionsRepository,
    private readonly googleMapsService: GoogleMapsService,
  ) {}

  async execute(
    context: ConversationContext,
  ): Promise<{ itinerary: Itinerary; response: string }> {
    try {
      // Gather external data (keeping original flow)
      const hotels = this.hotelsRepository.findByDestination(
        context.destination!,
        context.budget,
      );

      const attractions =
        this.attractionsRepository.findByDestinationAndInterests(
          context.destination!,
          context.interests,
        );

      const placesData = await this.googleMapsService.getPlaces(
        context.destination!,
        context.interests,
      );

      // Generate itinerary using AI
      const chain = this.itineraryPrompt.pipe(this.llm);

      const result = await chain.invoke({
        destination: context.destination,
        dates: context.dates || 'Flexible dates',
        travelers: context.travelers || 'Not specified',
        budget: context.budget || 'Not specified',
        interests: context.interests?.join(', ') || 'General sightseeing',
        hotels: JSON.stringify(hotels),
        attractions: JSON.stringify(attractions),
        places: JSON.stringify(placesData),
      });
      this.logger.log('Raw Ai Reponse Received -- ', result);
      // Use mapper to validate and transform AI response
      const itinerary = AiItineraryResponseMapper.validateAndTransform(
        result.content as string,
      );

      // Generate response message
      const response = `Here's your personalized itinerary for ${context.destination}!\n\nWould you like me to modify anything?`;

      return { itinerary, response };
    } catch (error) {
      throw new Error(`Failed to create itinerary: ${error}`);
    }
  }
  private itineraryPrompt = PromptTemplate.fromTemplate(`
    Create a detailed itinerary for:
    - Destination: {destination}
    - Dates: {dates}
    - Travelers: {travelers}
    - Budget: {budget}
    - Interests: {interests}

    Available hotels: {hotels}
    Available attractions: {attractions}
    Google Places data: {places}

    Create a day-by-day itinerary with specific times, locations, and practical details.

    Return ONLY a valid JSON object with this exact structure:
    {{
      "title": "Trip title",
      "summary": "Brief overview",
      "days": [
        {{
          "dayNumber": 1,
          "date": "YYYY-MM-DD",
          "destination": "city name",
          "activities": [
            {{
              "time": "09:00",
              "name": "Activity name",
              "description": "Details",
              "address": "Address",
              "type": "restaurant",
              "coordinates": [longitude, latitude]
            }}
          ]
        }}
      ],
      "accommodation": "Hotel recommendation",
      "tips": ["Helpful tip 1", "Helpful tip 2"]
    }}
  `);
}

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { Itinerary } from 'src/itinerary/domain/entities/itinerary.entity';
import { HotelsRepository } from 'src/itinerary/infrastructure/repositories/mocks/hotels.repository.mock';
import { AttractionsRepository } from 'src/itinerary/infrastructure/repositories/mocks/attraction.repository.mock';
import { GoogleMapsService } from 'src/itinerary/infrastructure/integrations/google-maps-service';
import { ConversationContext } from 'src/itinerary/domain/value-objects/conversation';
import { AiItineraryResponseMapper } from '../../mappers/ai-itinerary-response.mapper';
import { EVENT_READ_PORT, EventReadPort } from '../../ports/event-read-port';

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
    @Inject(EVENT_READ_PORT) private readonly eventRead: EventReadPort,
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
      this.logger.log(`Found ${hotels.length} hotels--`, hotels);
      const nearbyEvents = await this.eventRead.getPublicEventsByDestination(
        context.destination!,
      );
      this.logger.log(
        `Found ${nearbyEvents.length} nearby events--nearbyEvents`,
        nearbyEvents,
      );

      const attractions =
        this.attractionsRepository.findByDestinationAndInterests(
          context.destination!,
          context.interests,
        );
      this.logger.log(`Found ${attractions.length} attractions`);
      const placesData = await this.googleMapsService.getPlaces(
        context.destination!,
        context.interests,
      );
      this.logger.log(`Found ${placesData.length} places`);

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
        events: JSON.stringify(nearbyEvents),
      });
      console.log(
        '🔍 ~ execute ~ backend/src/itinerary/application/use-cases/itinerary-generation/create-itinerary.use-case.ts:59 ~ result:',
        result.content,
      );
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
    Available events: {events}

    Requirements:
    - Map relevant events and hotels into itinerary activities on matching dates.
    - When type is "event" or "hotel", include an "additionalDetails" object with available fields: startDate, endDate, startTime, endTime, id, imageUrl.
    - For every hotel activity during the stay, reuse the same hotel's id and imageUrl in additionalDetails.
    - Use the event's venue city/name and coordinates for address/coordinates when available.
    - Ensure all times are realistic and formatted as HH:MM.
    - Prefer events that fall within the provided trip dates and destination.
    - If no suitable events exist, you may omit event activities.

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
            // Example of a non-event | non hotel activity
            {{
              "time": "09:00",
              "name": "Activity name",
              "description": "Details",
              "address": "Address",
              "type": "restaurant", // one of: restaurant, hotel, attraction, event, other
              "coordinates": [longitude, latitude]
            }},
             // Example of an hotel activity (note additionalDetails is REQUIRED when type === "hotel")
      
            {{
              "time": "09:00",
              "name": "Hotel Name",
              "description": "Hotel Description.",
              "address": "Hotel Address",
              "type": "hotel",
              "coordinates": [longitude, latitude],
              "additionalDetails": {{
                "imageUrl": "imageUrl",
                "id": "id"
              }}
            }},
            // Example of an event activity (note additionalDetails is REQUIRED when type === "event" or "hotel")
            {{
              "time": "18:00",
              "name": "Event name",
              "description": "Event description",
              "address": "Venue address or city",
              "type": "event",
              "coordinates": [longitude, latitude],
              "additionalDetails": {{
                "startDate": "YYYY-MM-DD",
                "endDate": "YYYY-MM-DD",
                "startTime": "HH:MM",
                "endTime": "HH:MM",
                "imageUrl": "imageUrl",
                "id": "id",
              }}
            }}
          ]
        }}
      ],
      "accommodation": "Hotel recommendation",
      "tips": ["Helpful tip 1", "Helpful tip 2"]
    }}
  `);
}

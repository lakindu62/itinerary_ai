import { Injectable, Logger } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { Itinerary } from 'src/itinerary/domain/entities/itinerary.entity';
import { HotelsRepository } from 'src/itinerary/infrastructure/repositories/mocks/hotels.repository.mock';
import { AttractionsRepository } from 'src/itinerary/infrastructure/repositories/mocks/attraction.repository.mock';
import { GoogleMapsService } from 'src/itinerary/infrastructure/external-api/google-maps-service';
import { ConversationContext } from 'src/itinerary/domain/value-objects/conversation';
import { parseModelJson } from '../../support/parse-model-json';

@Injectable()
export class ModifyItineraryUseCase {
  private llm = new ChatGoogleGenerativeAI({
    model: 'gemini-2.0-flash',
    temperature: 0.7,
  });
  private logger = new Logger(ModifyItineraryUseCase.name);
  constructor(
    private readonly hotelsRepository: HotelsRepository,
    private readonly attractionsRepository: AttractionsRepository,
    private readonly googleMapsService: GoogleMapsService,
  ) {}

  async execute(
    modification: string,
    currentItinerary: Itinerary,
    context: ConversationContext,
  ): Promise<{ itinerary: Itinerary; response: string }> {
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

    this.logger.log(
      'Attractions from repo:',
      JSON.stringify(attractions, null, 2),
    );
    this.logger.log('Hotels from repo:', JSON.stringify(hotels, null, 2));

    const modifyPrompt = PromptTemplate.fromTemplate(`
      User wants to modify their itinerary: "{modification}"
      Current itinerary: {currentItinerary}

      Apply the requested changes and return ONLY the updated itinerary as a valid JSON object.
      Use this additional data:
      Database data: {dbData}
      Google Places data: {placesData}

      Return the same JSON structure as the original itinerary.
    `);
    this.logger.log('prompt to modify itinerary -- ', modifyPrompt);

    const formattedPrompt = await modifyPrompt.format({
      modification: 'add a museum visit',
      currentItinerary: JSON.stringify(currentItinerary),
      dbData: JSON.stringify({ hotels, attractions }),
      placesData: JSON.stringify(placesData),
    });

    this.logger.log(
      'formatted prompt to modify itinerary -- ',
      formattedPrompt,
    );

    try {
      const chain = modifyPrompt.pipe(this.llm);
      const result = await chain.invoke({
        modification,
        currentItinerary: JSON.stringify(currentItinerary),
        dbData: JSON.stringify({ hotels, attractions }),
        placesData: JSON.stringify(placesData),
      });

      const itineraryData = parseModelJson(result.content) as Itinerary;
      const itinerary = new Itinerary(
        itineraryData.title,
        itineraryData.summary,
        itineraryData.days,
        itineraryData.accommodation,
        itineraryData.tips,
      );

      const response = `I've updated your itinerary based on your request!\n\nAny other changes you'd like to make?`;

      return { itinerary, response };
    } catch (error) {
      throw new Error('Failed to modify itinerary: ' + error);
    }
  }
}

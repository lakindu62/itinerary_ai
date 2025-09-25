import { z } from 'zod';
import { Itinerary } from 'src/itinerary/domain/entities/itinerary.entity';
import { Day } from 'src/itinerary/domain/value-objects/itinerary/day.vo';
import { Activity } from 'src/itinerary/domain/value-objects/itinerary/activity.vo';
import { parseModelJson } from '../support/parse-model-json';

// Schema for AI response validation
const activitySchema = z.object({
  time: z.string(),
  name: z.string(),
  description: z.string(),
  address: z.string(),
  type: z.string(),
  coordinates: z.tuple([z.number(), z.number()]),
});

const daySchema = z.object({
  dayNumber: z.number(),
  date: z.string(),
  destination: z.string(),
  activities: z.array(activitySchema),
});

export const itineraryResponseSchema = z.object({
  title: z.string(),
  summary: z.string(),
  days: z.array(daySchema),
  accommodation: z.string(),
  tips: z.array(z.string()),
});

export type ItineraryResponse = z.infer<typeof itineraryResponseSchema>;

export class AiItineraryResponseMapper {
  /**
   * Maps AI response to domain entity
   */
  static toDomain(aiResponse: ItineraryResponse): Itinerary {
    const days = aiResponse.days.map(
      (dayData) =>
        new Day(
          dayData.dayNumber,
          dayData.date,
          dayData.destination,
          dayData.activities.map(
            (activityData) =>
              new Activity(
                activityData.time,
                activityData.name,
                activityData.description,
                activityData.address,
                activityData.type,
                activityData.coordinates,
              ),
          ),
        ),
    );

    return new Itinerary(
      aiResponse.title,
      aiResponse.summary,
      days,
      aiResponse.accommodation,
      aiResponse.tips,
    );
  }

  /**
   * Validates and transforms raw AI response
   */
  static validateAndTransform(rawResponse: string): Itinerary {
    try {
      // Parse the JSON
      const parsedData = parseModelJson(rawResponse);

      // Validate against schema
      const validatedData = itineraryResponseSchema.parse(parsedData);

      // Transform to domain entity
      return this.toDomain(validatedData);
    } catch (error) {
      throw new Error(`Failed to map AI response to domain: ${error}`);
    }
  }
}

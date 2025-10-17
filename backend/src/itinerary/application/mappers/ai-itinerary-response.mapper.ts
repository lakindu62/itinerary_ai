import { z } from 'zod';
import { Itinerary } from 'src/itinerary/domain/entities/itinerary.entity';
import { Day } from 'src/itinerary/domain/value-objects/itinerary/day.vo';
import {
  Activity,
  AdditionalDetails,
} from 'src/itinerary/domain/value-objects/itinerary/activity.vo';
import { parseModelJson } from '../support/parse-model-json';

// Schema for AI response validation
const baseFields = {
  time: z.string(),
  name: z.string(),
  description: z.string(),
  address: z.string(),
  coordinates: z.tuple([z.number(), z.number()]),
};

// Updated: allow hotel and event types to have additionalDetails
const nonEventNonHotelActivitySchema = z.object({
  ...baseFields,
  type: z.enum(['restaurant', 'attraction', 'other']),
});

const hotelActivitySchema = z.object({
  ...baseFields,
  type: z.literal('hotel'),
  additionalDetails: z.object({
    imageUrl: z.string().optional(),
    id: z.string().optional(),
    venueName: z.string().optional(),
  }),
});

const eventActivitySchema = z.object({
  ...baseFields,
  type: z.literal('event'),
  additionalDetails: z.object({
    startDate: z.string().optional(), // ISO
    endDate: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    imageUrl: z.string().optional(),
    id: z.string().optional(),
    venueName: z.string().optional(),
  }),
});

// Final schema: hotel and event can have additionalDetails, others cannot
const activitySchema = z.discriminatedUnion('type', [
  nonEventNonHotelActivitySchema,
  hotelActivitySchema,
  eventActivitySchema,
]);
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
                // allow additionalDetails for hotel and event
                'additionalDetails' in activityData &&
                activityData.additionalDetails
                  ? activityData.type === 'hotel'
                    ? new AdditionalDetails(
                        activityData.additionalDetails.id,
                        activityData.additionalDetails.imageUrl,
                      )
                    : new AdditionalDetails(
                        activityData.additionalDetails.id,
                        activityData.additionalDetails.imageUrl,
                        activityData.additionalDetails.startDate,
                        activityData.additionalDetails.endDate,
                        activityData.additionalDetails.startTime,
                        activityData.additionalDetails.endTime,
                      )
                  : undefined,
              ),
          ),
        ),
    );

    return new Itinerary(
      'will be added',
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

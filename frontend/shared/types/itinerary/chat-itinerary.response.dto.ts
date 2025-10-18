export type ConversationStageDto = "initial" | "clarifying" | "creating" | "modifying";

import { IsEnum } from "class-validator";

export enum ItineraryVisibilityEnum {
  PRIVATE = "private",
  PUBLIC = "public",
  ALL_FRIENDS = "all_friends",
  SPECIFIC_FRIENDS = "specific_friends",
}

export class ItineraryVisibilityDto {
  @IsEnum(ItineraryVisibilityEnum)
  visibility: ItineraryVisibilityEnum;
}

export interface ConversationMessageDto {
  role: "user" | "assistant";
  content: string;
}
export interface ConversationContextDto {
  stage: ConversationStageDto;
  destination?: string;
  dates?: string;
  budget?: string;
  interests?: string[];
  travelers?: number;
}

export interface ConversationDto {
  messages: ConversationMessageDto[];
  context: ConversationContextDto;
}

/**
 * Discriminated union to mirror the Zod schema in the mapper:
 * - restaurant | attraction | other: no additionalDetails
 * - hotel: additionalDetails { imageUrl?, id?, venueName? }
 * - event: additionalDetails { startDate?, endDate?, startTime?, endTime?, imageUrl?, id?, venueName? }
 */

export type Coordinates = [number, number];

type NonEventNonHotelType = "restaurant" | "attraction" | "other";

interface BaseFields {
  id: string;
  time: string;
  name: string;
  description: string;
  address: string;
  coordinates: Coordinates;
  budgetedAmount?: number;
  actualSpend?: number;
}

export interface POIActivityDto extends BaseFields {
  type: NonEventNonHotelType;
}

export interface HotelActivityDto extends BaseFields {
  type: "hotel";
  additionalDetails: {
    imageUrl?: string;
    id?: string;
    venueName?: string;
  };
}

export interface EventActivityDto extends BaseFields {
  type: "event";
  additionalDetails: {
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    imageUrl?: string;
    id?: string;
    venueName?: string;
  };
}

export type ActivityDto = POIActivityDto | HotelActivityDto | EventActivityDto;

export interface DayDto {
  dayNumber: number;
  date: string;
  destination: string;
  activities: ActivityDto[];
}

export interface ItineraryDto {
  title: string;
  summary: string;
  days: DayDto[];
  accommodation: string;
  tips: string[];
  id?: string;
  slug?: string;
}

export interface ChatItineraryResponseDto {
  response: string;
  conversation: ConversationDto;
  currentItinerary: ItineraryDto | undefined;
}

/** Optional: narrowers for ergonomic UI code */
export const isHotelActivity = (a: ActivityDto): a is HotelActivityDto => a.type === "hotel";
export const isEventActivity = (a: ActivityDto): a is EventActivityDto => a.type === "event";
export const isPOIActivity = (a: ActivityDto): a is POIActivityDto =>
  a.type === "restaurant" || a.type === "attraction" || a.type === "other";

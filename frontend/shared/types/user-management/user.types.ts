import { z } from "zod";
import {
  CoordinatesSchema,
  BranchLocationSchema,
  BranchSchema,
  BusinessOnboardingSchema,
} from "./schemas/BusinessOnboardingSchema";

export enum UserRole {
  BUSINESS_OWNER = "BUSINESS_OWNER",
  BRANCH_MANAGER = "BRANCH_MANAGER",
  CONTENT_MANAGER = "CONTENT_MANAGER",
  EVENT_MANAGER = "EVENT_MANAGER",
  RESERVATIONS_MANAGER = "RESERVATIONS_MANAGER",
  TRAVELER = "TRAVELER",
}
export enum UserType {
  TRAVELER = "TRAVELER",
  BUSINESS_USER = "BUSINESS_USER",
}
export enum BusinessType {
  RESTAURANT = "restaurant",
  EVENT = "event",
  HOTEL = "hotel",
}

export type AuthenticatedUser = {
  clerk_id: string;
  role: UserRole;
  _id: string | undefined;
  business_account_id: string | undefined;
  branch_id: string | undefined;
};

export type Coordinates = z.infer<typeof CoordinatesSchema>;
export type BranchLocation = z.infer<typeof BranchLocationSchema>;
export type Branch = z.infer<typeof BranchSchema>;
export type BusinessOnboardingData = z.infer<typeof BusinessOnboardingSchema>;

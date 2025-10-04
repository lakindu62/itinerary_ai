import { BusinessType } from "@shared/types/user-management";
import { z } from "zod";

export const CoordinatesSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const BranchLocationSchema = z.object({
  coords: CoordinatesSchema,
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
});

export const BranchSchema = z.object({
  bName: z.string().min(1, "Branch name is required"),
  bLocation: BranchLocationSchema,
});

export const BusinessOnboardingSchema = z.object({
  brandName: z.string().min(1, "Brand name is required"),
  type: z.enum(BusinessType),
  branch: BranchSchema,
  primaryContactNumber: z.string().min(10, "Please enter a valid phone number"),
  legalEntityName: z.string().min(1, "Legal entity name is required"),
  legalEntityAddress: z.string().min(1, "Legal entity address is required"),
  legalEntitySigner: z.string().min(1, "Legal entity signer is required"),
});

// Infer all types from schemas - NO DUPLICATION!

// Individual step schemas
export const BusinessDetailsSchema = BusinessOnboardingSchema.pick({
  brandName: true,
  type: true,
  primaryContactNumber: true,
  branch: true,
});

export const BusinessLegalEntitySchema = BusinessOnboardingSchema.pick({
  legalEntityName: true,
  legalEntityAddress: true,
  legalEntitySigner: true,
});

// Inferred types for partial schemas
export type BusinessDetailsData = z.infer<typeof BusinessDetailsSchema>;
export type BusinessLegalEntityData = z.infer<typeof BusinessLegalEntitySchema>;

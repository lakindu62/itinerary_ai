import { UserType } from "@shared/types/user-management";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
      _id: string;
      business_account_id: string | undefined;
      branch_id: string | undefined;
    };
    unsafe_metadata?: {
      userType?: UserType;
    };
  }
}

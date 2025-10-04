import { rootApiSlice } from "@frontend/store/api/rootApiSlice";
import { BusinessOnboardingData } from "@shared/types/user-management";

export const businessUserApi = rootApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    completeOnboarding: builder.mutation<{ success: boolean }, BusinessOnboardingData>({
      query: (data) => ({
        url: "/business/onboarding/complete",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCompleteOnboardingMutation } = businessUserApi;

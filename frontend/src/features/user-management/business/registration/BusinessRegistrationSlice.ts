import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BusinessOnboardingSchema } from "../../../../../../shared/types/user-management/schemas/BusinessOnboardingSchema";


type BusinessOnboardingState = Partial<BusinessOnboardingSchema> & {
  currentStep: number;
};

// Initial state
const initialState: BusinessOnboardingState = {
  currentStep: 1,
  brandName: undefined,
  type: undefined,
  primaryContactNumber: undefined,
  branch: undefined,
  legalEntityName: undefined,
  legalEntityAddress: undefined,
  legalEntitySigner: undefined,
};

// Redux slice with clean single reducer
export const BusinessOnboardingSlice = createSlice({
  name: "businessOnboarding",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<Partial<BusinessOnboardingSchema>>) => {
      return { ...state, ...action.payload };
    },
    nextStep: (state) => {
      state.currentStep += 1;
    },
    prevStep: (state) => {
      state.currentStep -= 1;
    },
    resetForm: () => initialState,
  },
});

export const { setData, nextStep, prevStep, resetForm } = BusinessOnboardingSlice.actions;

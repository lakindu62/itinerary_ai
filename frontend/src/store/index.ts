import { BusinessOnboardingSlice } from "../features/user-management/business/registration/BusinessRegistrationSlice";
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { reducerBasePath, rootApiSlice } from "./api/rootApiSlice";

export const store = configureStore({
  reducer: {
    businessOnboarding: BusinessOnboardingSlice.reducer,
    [reducerBasePath]: rootApiSlice.reducer, // Add this line
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

import { rootApiSlice } from "@frontend/store/api/rootApiSlice";

const ITINERARY_URL = "/itineraries";

export const itineraryApi = rootApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createItinerary: builder.mutation({
      query: (data) => ({
        url: `${ITINERARY_URL}/`,
        method: "POST",
        body: data,
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useCreateItineraryMutation } = itineraryApi;

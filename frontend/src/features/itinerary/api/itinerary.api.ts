import { rootApiSlice } from "@frontend/store/api/rootApiSlice";

const ITINERARY_URL = "/itineraries";

export const itineraryApi = rootApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChatItinerary: builder.query({
      query: (id) => ({
        url: `${ITINERARY_URL}/chat/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Itinerary", id }],
    }),
    createItinerary: builder.mutation({
      query: (data) => ({
        url: `${ITINERARY_URL}/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, data) => [{ type: "Itinerary", id: data.id }],
    }),
  }),
  overrideExisting: true,
});

export const { useCreateItineraryMutation, useGetChatItineraryQuery } = itineraryApi;

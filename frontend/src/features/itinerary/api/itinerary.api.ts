import { rootApiSlice } from "@frontend/store/api/rootApiSlice";
import { ItineraryDto } from "@shared/types/itinerary/chat-itinerary.response.dto";

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
    chatItinerary: builder.mutation({
      query: ({ message, conversationId }) => ({
        url: `${ITINERARY_URL}/chat`,
        method: "POST",
        body: { message, conversationId },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Itinerary", id: arg.conversationId }],
    }),
    createItinerary: builder.mutation({
      query: (data) => ({
        url: `${ITINERARY_URL}/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, data) => [{ type: "Itinerary", id: data.id }],
    }),
    getMyItineraries: builder.query({
      query: () => ({
        url: `${ITINERARY_URL}/`,
        method: "GET",
      }),
    }),
    getPublicItineraries: builder.query<ItineraryDto[], void>({
      query: () => ({
        url: `${ITINERARY_URL}/public`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? result.map((itinerary: { id: string }) => ({
              type: "Itinerary" as const,
              id: itinerary.id,
            }))
          : [],
    }),

    getPublicItineraryBySlug: builder.query<ItineraryDto, string>({
      query: (slug: string) => ({
        url: `${ITINERARY_URL}/public/${slug}`,
        method: "GET",
      }),
      providesTags: (result, error, slug) => [{ type: "Itinerary", id: slug }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateItineraryMutation,
  useGetChatItineraryQuery,
  useChatItineraryMutation,
  useGetMyItinerariesQuery,
  useGetPublicItinerariesQuery,
  useGetPublicItineraryBySlugQuery,
} = itineraryApi;

import { rootApiSlice } from "@frontend/store/api/rootApiSlice";
import { ItineraryDto, ItineraryVisibilityEnum } from "@shared/types/itinerary/chat-itinerary.response.dto";

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
          ? result
              .filter((itinerary) => Boolean(itinerary.id))
              .map((itinerary) => ({ type: "Itinerary" as const, id: itinerary.id as string }))
          : [],
    }),

    getPublicItineraryBySlug: builder.query<ItineraryDto, string>({
      query: (slug: string) => ({
        url: `${ITINERARY_URL}/public/${slug}`,
        method: "GET",
      }),
      providesTags: (result, error, slug) => [{ type: "Itinerary", id: slug }],
    }),
    getShareToken: builder.mutation<{ token: string }, { itineraryId: string }>({
      query: ({ itineraryId }) => ({
        url: `${ITINERARY_URL}/${itineraryId}/share-token`,
        method: "POST",
      }),
    }),
    getItineraryByToken: builder.query<ItineraryDto, string>({
      query: (token: string) => ({
        url: `${ITINERARY_URL}/share/${token}`,
        method: "GET",
      }),
      providesTags: (result, error, token) => [{ type: "Itinerary", id: token }],
    }),
    updateItineraryVisibility: builder.mutation<
      ItineraryDto,
      { itineraryId: string; visibility: ItineraryVisibilityEnum }
    >({
      query: ({ itineraryId, visibility }) => ({
        url: `${ITINERARY_URL}/${itineraryId}/visibility`,
        method: "POST",
        body: { visibility },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Itinerary", id: arg.itineraryId }],
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
  useGetShareTokenMutation,
  useGetItineraryByTokenQuery,
  useUpdateItineraryVisibilityMutation,
} = itineraryApi;

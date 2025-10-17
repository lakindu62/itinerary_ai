import { authenticatedFetch } from './auth-fetch';
import { GetToken } from '@clerk/types';

export type SingleEventType = {
  id: string;
  eventName: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  maxAttendees: number;
  imagesUrl?: string[];
  venue: { venueName: string; address: string; city: string; state: string; zipCode: string; coordinates: { lat: number; lng: number; }; };
  organizer: { id: string; organizerName: string; contactEmail: string; contactPhone: string; organization: string; };
  category: { categoryName: string; };
  hashtags: { id: string; hashtagName: string; }[]; // Corrected this line
  ticketPrice: number;
  eventStatus: 'active' | 'inactive' | 'completed';
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/events';

// =================================================================
// PUBLIC FUNCTIONS (No Authentication Needed)
// =================================================================

export const getAllEventsPublic = async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/all`);
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
};

export const getEventByIdPublic = async (id: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/${id}/public`);
    if (!response.ok) throw new Error('Failed to fetch event');
    return response.json();
};

// =================================================================
// ADMIN/BUSINESS FUNCTIONS (Authentication Required)
// =================================================================

// --- Event API ---
export const getBusinessEvents = async (getToken: GetToken): Promise<any[]> => {
    const response = await authenticatedFetch('/events', getToken);
    if (!response.ok) throw new Error('Failed to fetch business events');
    return response.json();
};

export const getBusinessEventById = async (id: string, getToken: GetToken): Promise<any> => {
    const response = await authenticatedFetch(`/events/${id}`, getToken);
    if (!response.ok) throw new Error('Failed to fetch business event');
    return response.json();
};

export const createBusinessEvent = async (eventData: any, getToken: GetToken): Promise<any> => {
    const response = await authenticatedFetch('/events', getToken, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
    });
    if (!response.ok) throw new Error('Failed to create event');
    return response.json();
};

export const updateBusinessEvent = async (id: string, eventData: any, getToken: GetToken): Promise<any> => {
    const response = await authenticatedFetch(`/events/${id}`, getToken, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
    });
    if (!response.ok) throw new Error('Failed to update event');
    return response.json();
};

export const deleteBusinessEvent = async (id: string, getToken: GetToken): Promise<void> => {
    const response = await authenticatedFetch(`/events/${id}`, getToken, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete event');
};

// --- Venue API ---
export const getBusinessVenues = async (getToken: GetToken): Promise<any[]> => {
    const response = await authenticatedFetch('/events/venue/all', getToken);
    if (!response.ok) throw new Error('Failed to fetch venues');
    return response.json();
};

export const createBusinessVenue = async (venueData: any, getToken: GetToken): Promise<any> => {
    const response = await authenticatedFetch('/events/venue', getToken, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(venueData),
    });
    if (!response.ok) throw new Error('Failed to create venue');
    return response.json();
};

export const updateBusinessVenue = async (id: string, venueData: any, getToken: GetToken): Promise<any> => {
    const response = await authenticatedFetch(`/events/venue/${id}`, getToken, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(venueData),
    });
    if (!response.ok) throw new Error('Failed to update venue');
    return response.json();
};

export const deleteBusinessVenue = async (id: string, getToken: GetToken): Promise<void> => {
    const response = await authenticatedFetch(`/events/venue/${id}`, getToken, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete venue');
};

export const getVenueById = async (id: string, getToken: GetToken): Promise<any> => {
    const response = await authenticatedFetch(`/events/venue/${id}`, getToken);
    if (!response.ok) throw new Error('Failed to fetch venue');
    return response.json();
};

// --- Organizer API ---
export const getBusinessOrganizers = async (getToken: GetToken): Promise<any[]> => {
    const response = await authenticatedFetch('/events/organizer/all', getToken);
    if (!response.ok) throw new Error('Failed to fetch organizers');
    return response.json();
};

export const createBusinessOrganizer = async (organizerData: any, getToken: GetToken): Promise<any> => {
    const response = await authenticatedFetch('/events/organizer', getToken, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(organizerData),
    });
    if (!response.ok) throw new Error('Failed to create organizer');
    return response.json();
};

export const updateBusinessOrganizer = async (id: string, organizerData: any, getToken: GetToken): Promise<any> => {
    const response = await authenticatedFetch(`/events/organizer/${id}`, getToken, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(organizerData),
    });
    if (!response.ok) throw new Error('Failed to update organizer');
    return response.json();
};

export const deleteBusinessOrganizer = async (id: string, getToken: GetToken): Promise<void> => {
    const response = await authenticatedFetch(`/events/organizer/${id}`, getToken, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete organizer');
};

export const getOrganizerById = async (id: string, getToken: GetToken): Promise<any> => {
    const response = await authenticatedFetch(`/events/organizer/${id}`, getToken);
    if (!response.ok) throw new Error('Failed to fetch organizer');
    return response.json();
};

// --- Category API ---
export const getBusinessCategories = async (getToken: GetToken): Promise<any[]> => {
    const response = await authenticatedFetch('/events/category/all', getToken);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
};

export const createBusinessCategory = async (categoryData: any, getToken: GetToken): Promise<any> => {
    const response = await authenticatedFetch('/events/category', getToken, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
    });
    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
};

export const updateBusinessCategory = async (id: string, categoryData: any, getToken: GetToken): Promise<any> => {
    const response = await authenticatedFetch(`/events/category/${id}`, getToken, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
    });
    if (!response.ok) throw new Error('Failed to update category');
    return response.json();
};

export const deleteBusinessCategory = async (id: string, getToken: GetToken): Promise<void> => {
    const response = await authenticatedFetch(`/events/category/${id}`, getToken, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete category');
};

export const getCategoryById = async (id: string, getToken: GetToken): Promise<any> => {
    const response = await authenticatedFetch(`/events/category/${id}`, getToken);
    if (!response.ok) throw new Error('Failed to fetch category');
    return response.json();
};

// --- Global Hashtag API ---
export const getHashtags = async (getToken: GetToken): Promise<any[]> => {
    const response = await authenticatedFetch(`/events/hashtag/all`, getToken);
    if (!response.ok) throw new Error('Failed to fetch hashtags');
    return response.json();
};

export const createHashtag = async (data: any, getToken: GetToken): Promise<any> => {
    const response = await authenticatedFetch(`/events/hashtag`, getToken, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create hashtag');
    return response.json();
};

export const getHashtagById = async (id: string, getToken: GetToken): Promise<any> => {
    const response = await authenticatedFetch(`/events/hashtag/${id}`, getToken);
    if (!response.ok) throw new Error('Failed to fetch hashtag');
    return response.json();
};

export const updateHashtag = async (id: string, data: any, getToken: GetToken): Promise<any> => {
    const response = await authenticatedFetch(`/events/hashtag/${id}`, getToken, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update hashtag');
    return response.json();
};

export const deleteHashtag = async (id: string, getToken: GetToken): Promise<void> => {
    const response = await authenticatedFetch(`/events/hashtag/${id}`, getToken, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete hashtag');
};

export const getEventHashtagMappings = async (eventId: string, getToken: GetToken): Promise<any[]> => {
    const response = await authenticatedFetch(`/events/hashtag-mapping?eventId=${eventId}`, getToken);
    if (!response.ok) throw new Error('Failed to fetch hashtag mappings');
    return response.json();
};

export const getRsvps = async (getToken: GetToken): Promise<any[]> => {
    const response = await authenticatedFetch('/events/rsvp/all', getToken);
    if (!response.ok) throw new Error('Failed to fetch rsvps');
    return response.json();
};

export const deleteRsvp = async (id: string, getToken: GetToken): Promise<void> => {
    const response = await authenticatedFetch(`/events/rsvp/${id}`, getToken, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete rsvp');
};

export const createRsvp = async (rsvpData: { eventId: string; guestCount: number; rsvpStatus: string; }, getToken: GetToken): Promise<any> => {
    const response = await authenticatedFetch('/events/rsvp', getToken, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rsvpData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create RSVP');
    }
    return response.json();
};

export const getBusinessAnalytics = async (getToken: GetToken): Promise<any> => {
    const response = await authenticatedFetch('/events/analytics', getToken);
    if (!response.ok) throw new Error('Failed to fetch analytics data');
    return response.json();
};

// import { Venue } from "@shared/types/event/venue.types";

const API_BASE_URL = 'http://localhost:3000/api/events';

// Venue API
export const getVenues = async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/venue`);
    if (!response.ok) {
        throw new Error('Failed to fetch venue');
    }
    return response.json();
};

export const getVenueById = async (id: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/venue/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch venue with ID: ${id}`);
    }
    return response.json();
};

export const createVenue = async (venueData: Omit<any, 'id'>): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/venue`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(venueData),
    });
    if (!response.ok) {
        throw new Error('Failed to create venue');
    }
    return response.json();
};

export const updateVenue = async (id: string, venueData: Partial<Omit<any, 'id'>>): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/venue/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(venueData),
    });
    if (!response.ok) {
        throw new Error('Failed to update venue');
    }
    return response.json();
};

export const deleteVenue = async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/venue/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete venue');
    }
};








// Organizer API

export const getOrganizers = async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/organizer`);
    if (!response.ok) {
        throw new Error('Failed to fetch organizer');
    }
    return response.json();
};

export const getOrganizerById = async (id: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/organizer/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch organizer with ID: ${id}`);
    }
    return response.json();
}

export const createOrganizer = async (organizerData: any): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/organizer`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(organizerData),
    });
    if (!response.ok) {
        throw new Error('Failed to create organizer');
    }
    return response.json();
};

export const updateOrganizer = async (id: string, organizerData: any): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/organizer/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(organizerData),
    });
    if (!response.ok) {
        throw new Error('Failed to update organizer');
    }
    return response.json();
};

export const deleteOrganizer = async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/organizer/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete organizer');
    }
};




// Category API

export const getCategories = async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/category`);
    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }
    return response.json();
};

export const getCategoryById = async (id: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/category/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch category with ID: ${id}`);
    }
    return response.json();
}

export const createCategory = async (categoryData: any): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/category`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
    });
    if (!response.ok) {
        throw new Error('Failed to create category');
    }
    return response.json();
};

export const updateCategory = async (id: string, categoryData: any): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/category/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
    });
    if (!response.ok) {
        throw new Error('Failed to update category');
    }
    return response.json();
};

export const deleteCategory = async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/category/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete category');
    }
};





// Hashtag API

export const getHashtags = async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/hashtag`);
    if (!response.ok) {
        throw new Error('Failed to fetch hashtags');
    }
    return response.json();
};

export const getHashtagById = async (id: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/hashtag/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch hashtag with ID: ${id}`);
    }
    return response.json();
}

export const createHashtag = async (hashtagData: any): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/hashtag`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(hashtagData),
    });
    if (!response.ok) {
        throw new Error('Failed to create hashtag');
    }
    return response.json();
};

export const updateHashtag = async (id: string, hashtagData: any): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/hashtag/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(hashtagData),
    });
    if (!response.ok) {
        throw new Error('Failed to update hashtag');
    }
    return response.json();
};

export const deleteHashtag = async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/hashtag/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete hashtag');
    }
};

// RSVP API

export const getRsvps = async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/rsvp`);
    if (!response.ok) {
        throw new Error('Failed to fetch rsvps');
    }
    return response.json();
}

export const deleteRsvp = async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/rsvp/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete rsvp');
    }
}

// Event API

export const createEvent = async (eventData: any): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
    });
    if (!response.ok) {
        throw new Error('Failed to create event');
    }
    return response.json();
};

export const getEvents = async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/allEvents`);
    if (!response.ok) {
        throw new Error('Failed to fetch events');
    }
    return response.json();
};

export const deleteEvent = async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) {
        throw new Error('Failed to delete event');
    }
};

export const getEventById = async (id: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch event');
    }
    return response.json();
};

export const updateEvent = async (id: string, data: any): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Failed to update event');
    }
    return response.json();
};

// GET hashtag mappings for a specific event
export const getEventHashtagMappings = async (eventId: string): Promise<any[]> => {
  const response = await fetch(`${API_BASE_URL}/hashtag-mapping?eventId=${eventId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch hashtag mappings for event ${eventId}`);
  }
  return response.json();
};

// SET (replace all) hashtag mappings for an event
export const setEventHashtagMappings = async (eventId: string, hashtagIds: string[]): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/hashtag-mapping/batch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ eventId, hashtagIds }),
  });
  if (!response.ok) {
    throw new Error(`Failed to update hashtag mappings for event ${eventId}`);
  }
  return response.json();
};

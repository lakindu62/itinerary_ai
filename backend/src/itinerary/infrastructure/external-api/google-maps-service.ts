import { Injectable, Logger } from '@nestjs/common';
import { Client, Language } from '@googlemaps/google-maps-services-js';
import { ConfigService } from '@nestjs/config';

export interface GooglePlace {
  name?: string;
  rating?: number;
  address?: string;
  types?: string[];
  price_level?: number;
  coordinates: (number | undefined)[]; // [longitude, latitude]
  place_id?: string;
  opening_hours?: { open_now: boolean };
  photos?: Array<{ photo_reference: string }>;
}

@Injectable()
export class GoogleMapsService {
  private readonly logger = new Logger(GoogleMapsService.name);
  private readonly client: Client;
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.client = new Client({});
    this.apiKey =
      this.configService.get<string>('GOOGLE_MAPS_API_KEY') ||
      'AIzaSyDySpj6a8j-HIbSKGJL0lju9SDMyNq0waE';
  }

  async getPlaces(
    destination: string,
    interests?: string[],
    query?: string,
  ): Promise<GooglePlace[]> {
    if (!destination) {
      this.logger.warn('No destination provided for Google Places search');
      return [];
    }

    const searchQuery =
      query ||
      `${interests?.join(' ') || 'attractions restaurants'} in ${destination}`;

    try {
      this.logger.log(`Searching Google Places for: ${searchQuery}`);

      const response = await this.client.textSearch({
        params: {
          query: searchQuery,
          key: this.apiKey,
          language: Language.en,
        },
      });

      const places = response.data.results.slice(0, 10).map((place) => ({
        name: place.name,
        rating: place.rating,
        address: place.formatted_address,
        types: place.types,
        price_level: place.price_level,
        coordinates: [
          place.geometry?.location.lng,
          place.geometry?.location.lat,
        ],
        place_id: place.place_id,
        opening_hours: place.opening_hours,
        photos: place.photos,
      }));

      this.logger.log(
        `Found ${places.length} places for destination: ${destination}`,
      );
      return places;
    } catch (error) {
      this.logger.error('Google Places API error:', error);

      // Fallback to mock data if API fails (for development)
      if (this.configService.get('NODE_ENV') === 'development') {
        this.logger.warn('Using mock Google Places data due to API error');
        return this.getMockPlaces(destination);
      }

      return [];
    }
  }

  async getPlaceDetails(placeId: string): Promise<any> {
    try {
      const response = await this.client.placeDetails({
        params: {
          place_id: placeId,
          key: this.apiKey,
          fields: [
            'name',
            'formatted_address',
            'rating',
            'price_level',
            'opening_hours',
            'photos',
            'website',
            'phone_number',
          ],
        },
      });

      return response.data.result;
    } catch (error) {
      this.logger.error('Google Place Details API error:', error);
      return null;
    }
  }

  async findNearbyPlaces(
    latitude: number,
    longitude: number,
    radius: number = 5000,
    type?: string,
  ): Promise<GooglePlace[]> {
    try {
      const response = await this.client.placesNearby({
        params: {
          location: { lat: latitude, lng: longitude },
          radius,
          type,
          key: this.apiKey,
        },
      });

      return response.data.results.map((place) => ({
        name: place.name,
        rating: place.rating,
        address: place.vicinity!,
        types: place.types,
        price_level: place.price_level,
        coordinates: [
          place.geometry?.location.lng,
          place.geometry?.location.lat,
        ],
        place_id: place.place_id,
      }));
    } catch (error) {
      this.logger.error('Google Nearby Places API error:', error);
      return [];
    }
  }

  // Mock data for development/fallback
  private getMockPlaces(destination: string): GooglePlace[] {
    const mockPlaces: Record<string, GooglePlace[]> = {
      colombo: [
        {
          name: 'Galle Face Green',
          rating: 4.4,
          address: 'Galle Face Center Road, Colombo',
          types: ['park', 'tourist_attraction'],
          price_level: 1,
          coordinates: [79.8443, 6.9276],
        },
        {
          name: 'Arcade Independence Square',
          rating: 4.3,
          address: 'Independence Avenue, Colombo 07',
          types: ['shopping_mall', 'restaurant'],
          price_level: 2,
          coordinates: [79.8682, 6.9018],
        },
      ],
      kandy: [
        {
          name: 'Kandy Lake',
          rating: 4.5,
          address: 'Kandy',
          types: ['lake', 'tourist_attraction'],
          price_level: 0,
          coordinates: [80.6395, 7.2932],
        },
        {
          name: 'Royal Palace of Kandy',
          rating: 4.2,
          address: 'Kandy',
          types: ['museum', 'historic_site'],
          price_level: 1,
          coordinates: [80.6414, 7.2959],
        },
      ],
      galle: [
        {
          name: 'Galle Fort Walk',
          rating: 4.7,
          address: 'Galle Fort',
          types: ['tourist_attraction', 'point_of_interest'],
          price_level: 0,
          coordinates: [80.2167, 6.0273],
        },
        {
          name: 'Galle Lighthouse',
          rating: 4.3,
          address: 'Galle Fort',
          types: ['tourist_attraction', 'point_of_interest'],
          price_level: 0,
          coordinates: [80.2196, 6.0249],
        },
      ],
    };

    const destinationKey = destination.toLowerCase();
    return mockPlaces[destinationKey] || mockPlaces.colombo;
  }
}

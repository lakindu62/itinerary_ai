export class CreateItineraryDto {
  title: string;
  summary: string;
  days: {
    dayNumber: number;
    date: string;
    destination: string;
    activities: {
      time: string;
      name: string;
      description: string;
      address: string;
      type: string;
      coordinates: [number, number];
    }[];
  }[];
  accommodation: string;
  tips: string[];
}

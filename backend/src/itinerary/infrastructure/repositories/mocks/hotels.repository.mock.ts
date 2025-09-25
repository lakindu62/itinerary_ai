import { Injectable } from '@nestjs/common';
export interface Hotel {
  id: string;
  name: string;
  price: string;
  rating: number;
  address: string;
  destination: string;
  coordinates: [number, number]; // [longitude, latitude]
  amenities: string[];
  budgetLevel: 'budget' | 'mid-range' | 'luxury';
  imageUrl?: string;
  description?: string;
}
@Injectable()
export class HotelsRepository {
  private readonly hotels: Hotel[] = [
    {
      id: '1',
      name: 'Galle Face Hotel',
      price: 'LKR 25,000/night',
      rating: 4.5,
      address: '2 Galle Face Terrace, Colombo 03',
      destination: 'Colombo',
      coordinates: [79.84617964070814, 6.920276053213045],
      amenities: ['pool', 'spa', 'restaurant', 'wifi'],
      budgetLevel: 'luxury',
      description: 'Historic luxury hotel with ocean views',
    },
    {
      id: '2',
      name: 'Jetwing Vil Uyana',
      price: 'LKR 35,000/night',
      rating: 4.8,
      address: 'Rangirigama, Sigiriya Road, Kandy',
      destination: 'Kandy',
      coordinates: [80.7207121909633, 7.930892027212704],
      amenities: ['pool', 'spa', 'wildlife', 'restaurant'],
      budgetLevel: 'luxury',
      description: 'Eco-luxury resort with private pools',
    },
    {
      id: '3',
      name: 'Fort Printers',
      price: 'LKR 18,000/night',
      rating: 4.3,
      address: '39 Pedlar Street, Galle Fort',
      destination: 'Galle',
      coordinates: [80.2180098548954, 6.026160554576693],
      amenities: ['boutique', 'restaurant', 'garden'],
      budgetLevel: 'mid-range',
      description: 'Boutique hotel in historic Galle Fort',
    },
    {
      id: '4',
      name: 'Heritance Tea Factory',
      price: 'LKR 22,000/night',
      rating: 4.6,
      address: 'Kandapola, Nuwara Eliya',
      destination: 'Nuwara Eliya',
      coordinates: [80.83373442883529, 6.991369190627885],
      amenities: ['pool', 'spa', 'tea estate', 'restaurant'],
      budgetLevel: 'luxury',
      description: 'Unique hotel in a converted tea factory',
    },
    {
      id: '5',
      name: 'Clock Inn Colombo',
      price: 'LKR 8,000/night',
      rating: 4.0,
      address: '20 Hospital Street, Colombo 01',
      destination: 'Colombo',
      coordinates: [79.8543597542021, 6.897434256187379],
      amenities: ['budget', 'wifi', 'breakfast'],
      budgetLevel: 'budget',
      description: 'Modern budget hotel in central Colombo',
    },
  ];

  findByDestination(destination: string, budget?: string): Hotel[] {
    let filteredHotels = this.hotels.filter((hotel) =>
      hotel.destination.toLowerCase().includes(destination.toLowerCase()),
    );

    if (budget) {
      const budgetLevel = this.mapBudgetToLevel(budget);
      if (budgetLevel) {
        filteredHotels = filteredHotels.filter(
          (hotel) => hotel.budgetLevel === budgetLevel,
        );
      }
    }

    return filteredHotels.sort((a, b) => b.rating - a.rating);
  }

  findById(id: string): Hotel | null {
    return this.hotels.find((hotel) => hotel.id === id) || null;
  }

  findByBudgetRange(min: number, max: number): Hotel | null {
    return (
      this.hotels.find((hotel) => {
        const price = this.extractPrice(hotel.price);
        return price >= min && price <= max;
      }) ?? null
    );
  }

  findByRating(minRating: number): Hotel | null {
    return (
      this.hotels
        .filter((hotel) => hotel.rating >= minRating)
        .sort((a, b) => b.rating - a.rating)[0] ?? null
    );
  }
  private mapBudgetToLevel(
    budget: string,
  ): 'budget' | 'mid-range' | 'luxury' | null {
    const lowerBudget = budget.toLowerCase();

    if (
      lowerBudget.includes('budget') ||
      lowerBudget.includes('cheap') ||
      lowerBudget.includes('economy')
    ) {
      return 'budget';
    } else if (
      lowerBudget.includes('mid') ||
      lowerBudget.includes('moderate') ||
      lowerBudget.includes('medium')
    ) {
      return 'mid-range';
    } else if (
      lowerBudget.includes('luxury') ||
      lowerBudget.includes('premium') ||
      lowerBudget.includes('high')
    ) {
      return 'luxury';
    }

    return null;
  }

  private extractPrice(priceString: string): number {
    const match = priceString.match(/LKR\s*([\d,]+)/);
    if (match) {
      return parseInt(match[1].replace(/,/g, ''), 10);
    }
    return 0;
  }
}

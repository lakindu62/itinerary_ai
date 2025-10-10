"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  MapPin,
  Star,
  Users,
  Wifi,
  Car,
  Coffee,
  Waves,
  Eye,
  Heart,
  Filter
} from 'lucide-react';
import { useHotels } from '@/features/hotel-booking/hooks/useHotels';
import { useRooms } from '@/features/hotel-booking/hooks/useRooms';
import { Hotel } from '@/features/hotel-booking/types/hotel.types';
import HotelImageSimple from '@/features/hotel-booking/components/shared/HotelImageSimple';
import LoadingSpinner from '@/features/hotel-booking/components/shared/LoadingSpinner';

// Component to get minimum room price for a hotel
function HotelPriceDisplay({ hotelId }: { hotelId: string }) {
  const { rooms, isLoading } = useRooms(hotelId);
  
  const getMinimumPrice = () => {
    if (isLoading || !rooms || rooms.length === 0) {
      return 99; // Fallback price while loading
    }
    
    const prices = rooms.map(room => room.roomPrice).filter(price => price > 0);
    return prices.length > 0 ? Math.min(...prices) : 99;
  };

  const minimumPrice = getMinimumPrice();

  console.log('💰 Hotel pricing:', {
    hotelId: hotelId.slice(-8),
    roomsCount: rooms.length,
    minimumPrice,
    allPrices: rooms.map(r => r.roomPrice),
    timestamp: '2025-09-26 09:01:21',
    user: 'NadPerz'
  });

  return (
    <div className="text-right">
      <div className="text-xs text-gray-500 mb-1">Starting from</div>
      <div className="text-2xl font-bold text-green-600">
        ${minimumPrice}
        <span className="text-sm font-normal text-gray-500">/night</span>
      </div>
      {isLoading && (
        <div className="text-xs text-gray-400">Loading prices...</div>
      )}
    </div>
  );
}

export default function HotelsPage() {
  const router = useRouter();
  const { hotels, isLoading } = useHotels();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);

  console.log('🏨 Hotels Page loaded with dynamic pricing:', {
    hotelsCount: hotels.length,
    timestamp: '2025-09-26 09:01:21',
    user: 'NadPerz'
  });

  // Get unique cities for filter
  const cities = Array.from(new Set(hotels.map(hotel => hotel.city))).sort();

  useEffect(() => {
    let filtered = hotels;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(hotel =>
        hotel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply city filter
    if (selectedCity) {
      filtered = filtered.filter(hotel => hotel.city === selectedCity);
    }

    setFilteredHotels(filtered);
  }, [hotels, searchTerm, selectedCity]);

  const handleViewAndBook = (hotelId: string, hotelTitle: string) => {
    console.log('👁️ Viewing hotel:', {
      hotelId,
      hotelTitle,
      timestamp: '2025-09-26 09:01:21',
      user: 'NadPerz'
    });
    router.push(`/hotels/${hotelId}/book`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">Loading hotels with dynamic pricing...</p>
            <p className="text-xs text-gray-500 mt-1">User: NadPerz | 2025-09-26 09:01:21</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Find Your Perfect Stay</h1>
              <p className="text-gray-600 mt-1">Discover amazing hotels with real-time pricing</p>
            </div>
            {/* <div className="text-sm text-gray-500 text-right">
              <p>💰 Dynamic Pricing Enabled</p>
              <p>👤 Browsed by: NadPerz</p>
              <p>📅 2025-09-26 09:01:21</p>
            </div> */}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search hotels by name, city, or country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm min-w-[150px]"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-gray-600">
              {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''} found
              {searchTerm && ` for "${searchTerm}"`}
              {selectedCity && ` in ${selectedCity}`}
            </p>
            {/* <div className="text-sm text-blue-600">
              💡 Prices shown are starting rates per night
            </div> */}
          </div>
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredHotels.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hotels found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCity 
                ? 'Try adjusting your search criteria or filters.'
                : 'No hotels are currently available.'}
            </p>
            {(searchTerm || selectedCity) && (
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCity('');
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map((hotel: Hotel) => (
              <Card key={hotel.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <CardContent className="p-0">
                  {/* Hotel Image */}
                  <div className="relative h-48 overflow-hidden">
                    <HotelImageSimple
                      imagePath={hotel.image}
                      alt={hotel.title}
                      className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Rating Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-yellow-500 text-black">
                        <Star className="h-3 w-3 mr-1" />
                        4.5
                      </Badge>
                    </div>

                    {/* Wishlist Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('💝 Added to wishlist:', hotel.title);
                      }}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Hotel Details */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {hotel.title}
                        </h3>
                        <div className="flex items-center text-gray-600 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="text-sm">{hotel.city}, {hotel.country}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {hotel.description}
                    </p>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {hotel.freeWifi && (
                        <Badge variant="secondary" className="text-xs">
                          <Wifi className="h-3 w-3 mr-1" />WiFi
                        </Badge>
                      )}
                      {hotel.freeParking && (
                        <Badge variant="secondary" className="text-xs">
                          <Car className="h-3 w-3 mr-1" />Parking
                        </Badge>
                      )}
                      {hotel.coffeeShop && (
                        <Badge variant="secondary" className="text-xs">
                          <Coffee className="h-3 w-3 mr-1" />Coffee
                        </Badge>
                      )}
                      {hotel.swimmingPool && (
                        <Badge variant="secondary" className="text-xs">
                          <Waves className="h-3 w-3 mr-1" />Pool
                        </Badge>
                      )}
                    </div>

                    {/* Price and Booking */}
                    <div className="flex items-end justify-between">
                      <HotelPriceDisplay hotelId={hotel.id} />
                    </div>

                    {/* Book Button */}
                    <Button 
                      onClick={() => handleViewAndBook(hotel.id, hotel.title)}
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View & Book
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          {/* <p className="text-sm text-gray-500">
            Hotel Booking System • Browsed by NadPerz • 2025-09-26 09:01:21 UTC
          </p> */}
          {/* <p className="text-xs text-gray-400 mt-1">
            💰 Prices are dynamically calculated from actual room rates • 
            🏨 {filteredHotels.length} hotels available • 
            ⭐ Best rates guaranteed
          </p> */}
        </div>
      </div>
    </div>
  );
}
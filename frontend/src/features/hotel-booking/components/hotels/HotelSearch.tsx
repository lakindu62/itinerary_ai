"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, MapPin, Calendar } from 'lucide-react';
import HotelCard from './HotelCard';
import LoadingSpinner from '../shared/LoadingSpinner';
import { useHotels } from '../../hooks/useHotels';

interface HotelSearchProps {
  initialParams?: {
    city?: string;
    country?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  };
}

export default function HotelSearch({ initialParams }: HotelSearchProps) {
  const { hotels, isLoading } = useHotels();
  const [searchTerm, setSearchTerm] = useState(initialParams?.city || '');
  const [filteredHotels, setFilteredHotels] = useState(hotels);

  useEffect(() => {
    const filtered = hotels.filter(hotel =>
      hotel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHotels(filtered);
  }, [hotels, searchTerm]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
          {initialParams?.city && (
            <p className="text-gray-600">Showing hotels in {initialParams.city}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search hotels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>

      {filteredHotels.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No hotels found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
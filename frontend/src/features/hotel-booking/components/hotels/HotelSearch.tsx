"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import { Hotel } from '../../types/hotel.types';
import HotelCard from './HotelCard';
import LoadingSpinner from '../shared/LoadingSpinner';

interface HotelSearchProps {
  hotels: Hotel[];
  isLoading?: boolean;
  onSearch?: (query: string, location: string) => void;
}

export default function HotelSearch({ hotels, isLoading = false, onSearch }: HotelSearchProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  console.log('🔍 Hotel Search component loaded:', {
    hotelCount: hotels.length,
    timestamp: '2025-09-25 08:47:17',
    user: 'NadPerz'
  });

  const handleSearch = () => {
    console.log('🔍 Searching hotels:', { searchQuery, locationQuery });
    onSearch?.(searchQuery, locationQuery);
  };

  const handleViewDetails = (hotel: Hotel) => {
    console.log('👁️ Viewing hotel details:', hotel.id);
    router.push(`/hotels/${hotel.id}`);
  };

  const handleEdit = (hotel: Hotel) => {
    console.log('✏️ Editing hotel:', hotel.id);
    router.push(`/hotels/${hotel.id}/edit`);
  };

  const handleDelete = (hotel: Hotel) => {
    console.log('🗑️ Deleting hotel:', hotel.id);
    // Handle delete - this would typically call an API
    if (window.confirm(`Are you sure you want to delete "${hotel.title}"?`)) {
      // Delete logic here
      console.log('Hotel deletion confirmed');
    }
  };

  const handleManageRooms = (hotel: Hotel) => {
    console.log('🏠 Managing rooms for hotel:', hotel.id);
    router.push(`/hotels/${hotel.id}/rooms`);
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Find Hotels</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input
              placeholder="Search hotels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Input
              placeholder="Location (city, state, country)"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Button onClick={handleSearch} className="w-full">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Search Results ({hotels.length} hotel{hotels.length !== 1 ? 's' : ''})
          </h3>
          <p className="text-sm text-gray-500">
            User: NadPerz | 2025-09-25 08:47:17
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
            <p className="ml-4 text-gray-600">Searching hotels...</p>
          </div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Hotels Found</h3>
            <p className="text-gray-600">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onManageRooms={handleManageRooms}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
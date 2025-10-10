"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Building } from 'lucide-react';
import { Hotel } from '../../types/hotel.types';
import HotelCard from './HotelCard';
import LoadingSpinner from '../shared/LoadingSpinner';

interface HotelsListProps {
  hotels: Hotel[];
  isLoading?: boolean;
  onEdit?: (hotel: Hotel) => void;
  onDelete?: (hotel: Hotel) => void;
}

export default function HotelsList({ 
  hotels, 
  isLoading = false, 
  onEdit, 
  onDelete 
}: HotelsListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHotels, setFilteredHotels] = useState(hotels);

  console.log('🏨 Hotels List loaded:', {
    totalHotels: hotels.length,
    filteredCount: filteredHotels.length,
    timestamp: '2025-09-25 08:47:17',
    user: 'NadPerz'
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredHotels(hotels);
    } else {
      const filtered = hotels.filter(hotel =>
        hotel.title.toLowerCase().includes(term.toLowerCase()) ||
        hotel.city.toLowerCase().includes(term.toLowerCase()) ||
        hotel.country.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredHotels(filtered);
    }
  };

  const handleViewDetails = (hotel: Hotel) => {
    console.log('👁️ Viewing hotel details:', hotel.id);
    router.push(`/hotels/${hotel.id}`);
  };

  const handleEditHotel = (hotel: Hotel) => {
    console.log('✏️ Editing hotel:', hotel.id);
    if (onEdit) {
      onEdit(hotel);
    } else {
      router.push(`/hotels/${hotel.id}/edit`);
    }
  };

  const handleDeleteHotel = (hotel: Hotel) => {
    console.log('🗑️ Deleting hotel:', hotel.id);
    if (onDelete) {
      onDelete(hotel);
    } else {
      // Default delete behavior
      if (window.confirm(`Are you sure you want to delete "${hotel.title}"?`)) {
        console.log('Hotel deletion confirmed');
        // Handle deletion here
      }
    }
  };

  const handleManageRooms = (hotel: Hotel) => {
    console.log('🏠 Managing rooms for hotel:', hotel.id);
    router.push(`/hotels/${hotel.id}/rooms`);
  };

  const handleCreateHotel = () => {
    console.log('➕ Creating new hotel');
    router.push('/hotels/create');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Hotels</h1>
          <p className="text-gray-600 mt-1">
            Manage your hotel portfolio | User: NadPerz | 2025-09-25 08:47:17
          </p>
        </div>
        <Button onClick={handleCreateHotel}>
          <Plus className="mr-2 h-4 w-4" />
          Add Hotel
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search hotels by name, city, or country..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Hotels Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
          <p className="ml-4 text-gray-600">Loading hotels...</p>
        </div>
      ) : filteredHotels.length === 0 ? (
        <div className="text-center py-12">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No Hotels Match Your Search' : 'No Hotels Yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? 'Try adjusting your search terms.' 
              : 'Get started by creating your first hotel.'}
          </p>
          {!searchTerm && (
            <Button onClick={handleCreateHotel}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Hotel
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              onViewDetails={handleViewDetails}
              onEdit={handleEditHotel} // Pass the hotel object, not undefined
              onDelete={handleDeleteHotel} // Pass the hotel object, not string
              onManageRooms={handleManageRooms}
            />
          ))}
        </div>
      )}

      {/* Results Summary */}
      {filteredHotels.length > 0 && (
        <div className="flex items-center justify-between pt-6 border-t">
          <p className="text-sm text-gray-600">
            Showing {filteredHotels.length} of {hotels.length} hotels
          </p>
          <p className="text-xs text-gray-500">
            Last updated: 2025-09-25 08:47:17 UTC
          </p>
        </div>
      )}
    </div>
  );
}
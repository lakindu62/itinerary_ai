"use client";

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import HotelCard from './HotelCard';
import LoadingSpinner from '../shared/LoadingSpinner';
import { useHotels } from '../../hooks/useHotels';
import { Hotel } from '../../types/hotel.types';

interface HotelsListProps {
  showMyHotels?: boolean;
  onCreateNew?: () => void;
  onEdit?: (hotel: Hotel) => void;
}

export default function HotelsList({ showMyHotels, onCreateNew, onEdit }: HotelsListProps) {
  const { hotels, myHotels, isLoading, deleteHotel } = useHotels();
  const [searchTerm, setSearchTerm] = useState('');

  const displayHotels = showMyHotels ? myHotels : hotels;
  const filteredHotels = displayHotels.filter(hotel =>
    hotel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (hotelId: string) => {
    if (window.confirm('Are you sure you want to delete this hotel? This action cannot be undone.')) {
      try {
        await deleteHotel(hotelId);
      } catch (error) {
        console.error('Failed to delete hotel:', error);
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-brown">
            {showMyHotels ? 'My Hotels' : 'All Hotels'}
          </h1>
          <p className="text-gray-600">
            {showMyHotels 
              ? `Manage your ${myHotels.length} hotel${myHotels.length !== 1 ? 's' : ''}`
              : `Discover ${hotels.length} amazing hotel${hotels.length !== 1 ? 's' : ''}`
            }
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search hotels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          {/* Create Button */}
          {showMyHotels && onCreateNew && (
            <Button
              onClick={onCreateNew}
              className="bg-dark-brown text-white hover:bg-opacity-90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Hotel
            </Button>
          )}
        </div>
      </div>

      {/* Hotels Grid */}
      {filteredHotels.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {searchTerm ? 'No hotels match your search' : 'No hotels found'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : showMyHotels 
                ? 'Create your first hotel to get started'
                : 'No hotels available at the moment'
            }
          </p>
          {showMyHotels && onCreateNew && !searchTerm && (
            <Button
              onClick={onCreateNew}
              className="bg-dark-brown text-white hover:bg-opacity-90"
            >
              <Plus className="h-4 w-4 mr-2" />
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
              isOwner={showMyHotels}
              onEdit={onEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
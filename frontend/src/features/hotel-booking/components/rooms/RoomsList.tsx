"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Bed, Building } from 'lucide-react';
import { Room } from '../../types/room.types';
import RoomCard from './RoomCard';
import LoadingSpinner from '../shared/LoadingSpinner';

interface RoomsListProps {
  rooms: Room[];
  hotelId?: string;
  hotelName?: string;
  isLoading?: boolean;
  showManageActions?: boolean;
  showBookButton?: boolean;
  onViewDetails?: (room: Room) => void;
  onEdit?: (room: Room) => void;
  onDelete?: (room: Room) => void;
  onBook?: (room: Room) => void;
}

export default function RoomsList({ 
  rooms, 
  hotelId,
  hotelName,
  isLoading = false, 
  showManageActions = true,
  showBookButton = false,
  onViewDetails,
  onEdit,
  onDelete,
  onBook
}: RoomsListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRooms, setFilteredRooms] = useState(rooms);

  console.log('🏠 Rooms List loaded:', {
    totalRooms: rooms.length,
    filteredCount: filteredRooms.length,
    hotelId,
    hotelName,
    showManageActions,
    showBookButton,
    timestamp: '2025-09-25 08:58:24',
    user: 'NadPerz'
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredRooms(rooms);
    } else {
      const filtered = rooms.filter(room =>
        room.title.toLowerCase().includes(term.toLowerCase()) ||
        room.description.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredRooms(filtered);
      console.log(`🔍 Filtered rooms: ${filtered.length} results for "${term}"`);
    }
  };

  const handleViewDetails = (room: Room) => {
    console.log('👁️ Viewing room details:', {
      roomId: room.id,
      title: room.title,
      timestamp: '2025-09-25 08:58:24',
      user: 'NadPerz'
    });
    
    if (onViewDetails) {
      onViewDetails(room);
    } else {
      router.push(`/hotels/${hotelId}/rooms/${room.id}`);
    }
  };

  const handleEdit = (room: Room) => {
    console.log('✏️ Editing room:', {
      roomId: room.id,
      title: room.title,
      timestamp: '2025-09-25 08:58:24',
      user: 'NadPerz'
    });
    
    if (onEdit) {
      onEdit(room);
    } else {
      router.push(`/hotels/${hotelId}/rooms/${room.id}/edit`);
    }
  };

  const handleDelete = (room: Room) => {
    console.log('🗑️ Deleting room:', {
      roomId: room.id,
      title: room.title,
      timestamp: '2025-09-25 08:58:24',
      user: 'NadPerz'
    });
    
    if (onDelete) {
      onDelete(room);
    } else {
      // Default delete behavior
      if (window.confirm(`Are you sure you want to delete "${room.title}"?`)) {
        console.log('Room deletion confirmed by NadPerz');
        // Handle deletion here
      }
    }
  };

  const handleBook = (room: Room) => {
    console.log('📅 Booking room:', {
      roomId: room.id,
      title: room.title,
      price: room.roomPrice,
      timestamp: '2025-09-25 08:58:24',
      user: 'NadPerz'
    });
    
    if (onBook) {
      onBook(room);
    } else {
      router.push(`/hotels/${hotelId}/rooms/${room.id}/book`);
    }
  };

  const handleCreateRoom = () => {
    console.log('➕ Creating new room for hotel:', hotelId);
    router.push(`/hotels/${hotelId}/rooms/create`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {hotelName ? `Rooms in ${hotelName}` : 'Rooms'}
          </h2>
          <p className="text-gray-600 mt-1">
            Manage your room inventory | User: NadPerz | 2025-09-25 08:58:24
          </p>
        </div>
        {showManageActions && hotelId && (
          <Button onClick={handleCreateRoom}>
            <Plus className="mr-2 h-4 w-4" />
            Add Room
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search rooms by title or description..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Rooms Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">Loading rooms...</p>
            <p className="text-xs text-gray-500 mt-1">User: NadPerz | 2025-09-25 08:58:24</p>
          </div>
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="text-center py-12">
          <Bed className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No Rooms Match Your Search' : 'No Rooms Yet'}
          </h3>
          <p className="text-gray-600 mb-2">
            {searchTerm 
              ? 'Try adjusting your search terms.' 
              : 'Get started by creating your first room.'}
          </p>
          <p className="text-xs text-gray-500 mb-6">
            User: NadPerz | 2025-09-25 08:58:24
          </p>
          {!searchTerm && showManageActions && hotelId && (
            <Button onClick={handleCreateRoom}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Room
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onViewDetails={handleViewDetails}
              onEdit={showManageActions ? handleEdit : undefined}
              onDelete={showManageActions ? handleDelete : undefined}
              onBook={showBookButton ? handleBook : undefined}
            />
          ))}
        </div>
      )}

      {/* Results Summary */}
      {filteredRooms.length > 0 && (
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>
              Showing {filteredRooms.length} of {rooms.length} rooms
            </span>
            {hotelName && (
              <span className="flex items-center">
                <Building className="h-4 w-4 mr-1" />
                {hotelName}
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500">
            <span>User: NadPerz | Last updated: 2025-09-25 08:58:24 UTC</span>
          </div>
        </div>
      )}
    </div>
  );
}
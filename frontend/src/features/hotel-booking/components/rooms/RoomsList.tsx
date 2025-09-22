"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import RoomCard from './RoomCard';
import { Room } from '../../types/room.types';

interface RoomsListProps {
  hotelId: string;
  rooms: Room[];
  showManageActions?: boolean;
  showBookButton?: boolean;
}

export default function RoomsList({ 
  hotelId, 
  rooms, 
  showManageActions = false, 
  showBookButton = false 
}: RoomsListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRooms = rooms.filter(room =>
    room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Rooms Grid */}
      {filteredRooms.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'No rooms match your search' : 'No rooms available'}
          </p>
          {showManageActions && (
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add First Room
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              showManageActions={showManageActions}
              showBookButton={showBookButton}
            />
          ))}
        </div>
      )}
    </div>
  );
}
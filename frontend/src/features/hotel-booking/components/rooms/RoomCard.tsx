"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreVertical, 
  Users, 
  Bed, 
  Bath,
  Eye,
  Edit,
  Trash2,
  Calendar
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Room } from '../../types/room.types';
import { ROOM_AMENITIES } from '../../lib/constants';
import { formatPrice, formatRoomCapacity } from '../../lib/formatters';
import HotelImageSimple from '../shared/HotelImageSimple';

interface RoomCardProps {
  room: Room;
  onViewDetails?: (room: Room) => void;
  onEdit?: (room: Room) => void;
  onDelete?: (room: Room) => void;
  onBook?: (room: Room) => void;
  showManageActions?: boolean; // Add this prop to satisfy the interface
  showBookButton?: boolean; // Add this prop to satisfy the interface
}

export default function RoomCard({ 
  room, 
  onViewDetails, 
  onEdit, 
  onDelete, 
  onBook,
  showManageActions = true,
  showBookButton = false
}: RoomCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  console.log('🏠 Room Card rendered:', {
    roomId: room.id,
    title: room.title,
    price: room.roomPrice,
    showManageActions,
    showBookButton,
    timestamp: '2025-09-25 08:58:24',
    user: 'NadPerz'
  });

  // Get available amenities for this room
  const availableAmenities = ROOM_AMENITIES.filter((amenity: any) => {
    return room[amenity.key as keyof Room] === true;
  });

  // Format room type with proper parameters
  const getRoomType = () => {
    const bedTypes = [];
    if (room.kingBed > 0) bedTypes.push(`${room.kingBed} King`);
    if (room.queenBed > 0) bedTypes.push(`${room.queenBed} Queen`);
    
    if (bedTypes.length === 0) {
      return `${room.bedCount} Bed${room.bedCount !== 1 ? 's' : ''}`;
    }
    
    return bedTypes.join(' + ');
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${room.title}"?`)) {
      setIsDeleting(true);
      try {
        console.log('🗑️ Deleting room:', {
          roomId: room.id,
          title: room.title,
          timestamp: '2025-09-25 08:58:24',
          user: 'NadPerz'
        });
        await onDelete?.(room);
      } catch (error) {
        console.error('❌ Failed to delete room:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Room Image */}
      <div className="relative h-48">
        <HotelImageSimple
          imagePath={room.image}
          alt={room.title}
          className="w-full h-full rounded-t-lg"
          fallbackUrl="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop"
        />
        
        {/* Price Badge */}
        <div className="absolute top-2 right-2">
          <Badge className="bg-green-600 text-white">
            {formatPrice(room.roomPrice)}/night
          </Badge>
        </div>
        
        {/* Options Menu - Only show if manage actions are enabled */}
        {showManageActions && (
          <div className="absolute top-2 left-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/90 backdrop-blur-sm"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => onViewDetails?.(room)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(room)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Room
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={handleDelete}
                    className="text-red-600"
                    disabled={isDeleting}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isDeleting ? 'Deleting...' : 'Delete Room'}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Room Title */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{room.title}</h3>
        
        {/* Room Type */}
        <p className="text-sm text-gray-600 mb-2">{getRoomType()}</p>
        
        {/* Room Capacity */}
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <Users className="h-4 w-4 mr-1" />
          <span>{formatRoomCapacity(room.guestCount, room.bedCount, room.bathroomCount)}</span>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {room.description}
        </p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1 mb-4">
          {availableAmenities.slice(0, 4).map((amenity: any) => (
            <span
              key={amenity.key}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700"
            >
              <span className="mr-1">{amenity.icon}</span>
              {amenity.label}
            </span>
          ))}
          {availableAmenities.length > 4 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
              +{availableAmenities.length - 4} more
            </span>
          )}
        </div>

        {/* Room Details Grid */}
        <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mb-4">
          <div className="text-center">
            <Bed className="h-3 w-3 mx-auto mb-1" />
            <span>{room.bedCount} bed{room.bedCount !== 1 ? 's' : ''}</span>
          </div>
          <div className="text-center">
            <Bath className="h-3 w-3 mx-auto mb-1" />
            <span>{room.bathroomCount} bath</span>
          </div>
          <div className="text-center">
            <Users className="h-3 w-3 mx-auto mb-1" />
            <span>{room.guestCount} guest{room.guestCount !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails?.(room)}
            className="flex-1"
          >
            <Eye className="mr-1 h-4 w-4" />
            View
          </Button>
          {showBookButton && onBook && (
            <Button
              size="sm"
              onClick={() => onBook(room)}
              className="flex-1"
            >
              <Calendar className="mr-1 h-4 w-4" />
              Book Now
            </Button>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-3 pt-2 border-t border-gray-50">
          <p className="text-xs text-gray-400">
            Room ID: {room.id.slice(-8)} | Updated by NadPerz | 2025-09-25 08:58:24
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
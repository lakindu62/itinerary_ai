"use client";

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bed, Users, Bath, Edit, Trash2, Calendar } from 'lucide-react';
import { Room } from '../../types/room.types';
import { ROOM_AMENITIES } from '../../lib/constants';
import { formatPrice, formatRoomType } from '../../lib/formatters';

interface RoomCardProps {
  room: Room;
  showManageActions?: boolean;
  showBookButton?: boolean;
  onEdit?: (room: Room) => void;
  onDelete?: (roomId: string) => void;
  onBook?: (roomId: string) => void;
}

export default function RoomCard({ 
  room, 
  showManageActions = false, 
  showBookButton = false,
  onEdit,
  onDelete,
  onBook
}: RoomCardProps) {
  const activeAmenities = ROOM_AMENITIES.filter(amenity => 
    room[amenity.key as keyof Room] === true
  ).slice(0, 3);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image
          src={room.image || '/images/room-placeholder.jpg'}
          alt={room.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 right-4">
          <Badge className="bg-white text-gray-800">
            Available
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {room.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {room.description}
          </p>
        </div>
        
        {/* Room Details */}
        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>{formatRoomType(room)}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{room.guestCount} guests</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span>{room.bathroomCount} bath</span>
          </div>
        </div>
        
        {/* Amenities */}
        <div className="flex items-center space-x-2 mb-4">
          {activeAmenities.map((amenity) => (
            <Badge 
              key={amenity.key} 
              variant="secondary"
              className="text-xs"
            >
              {amenity.icon}
            </Badge>
          ))}
          {activeAmenities.length < ROOM_AMENITIES.filter(amenity => 
            room[amenity.key as keyof Room] === true
          ).length && (
            <Badge variant="secondary" className="text-xs">
              +{ROOM_AMENITIES.filter(amenity => 
                room[amenity.key as keyof Room] === true
              ).length - activeAmenities.length}
            </Badge>
          )}
        </div>
        
        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(room.roomPrice)}
            </span>
            <span className="text-gray-600 text-sm">/night</span>
          </div>
          
          <div className="flex space-x-2">
            {showBookButton && (
              <Button 
                size="sm"
                onClick={() => onBook?.(room.id)}
              >
                <Calendar className="h-4 w-4 mr-1" />
                Book Now
              </Button>
            )}
            
            {showManageActions && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit?.(room)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDelete?.(room.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
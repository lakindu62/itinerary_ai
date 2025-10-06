"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  MoreVertical,
  MapPin,
  Eye,
  Edit,
  Trash2,
  Users,
  Calendar,
  Bed
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Hotel } from '../../types/hotel.types';
import { Room } from '../../types/room.types';
import { useRooms } from '../../hooks/useRooms';
import HotelImageSimple from '../shared/HotelImageSimple';
import { useAuth } from '@/hooks/useAuth'; // Import useAuth

interface HotelCardProps {
  hotel: Hotel;
  onViewDetails: (hotel: Hotel) => void;
  onEdit: (hotel: Hotel) => void;
  onDelete: (hotel: Hotel) => void;
  onManageRooms: (hotel: Hotel) => void;
}

export default function HotelCard({
  hotel,
  onViewDetails,
  onEdit,
  onDelete,
  onManageRooms
}: HotelCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { userId } = useAuth(); // Get current user ID
  
  // Get room count for this hotel - Fixed type
  const { rooms = [] }: { rooms: Room[] } = useRooms(hotel.id);

  const amenities = [];
  if (hotel.gym) amenities.push({ icon: '🏋️', name: 'Gym' });
  if (hotel.spa) amenities.push({ icon: '🧘', name: 'Spa' });
  if (hotel.restaurant) amenities.push({ icon: '🍽️', name: 'Restaurant' });
  if (hotel.freeParking) amenities.push({ icon: '🚗', name: 'Free Parking' });
  if (hotel.freeWifi) amenities.push({ icon: '📶', name: 'Free WiFi' });
  if (hotel.swimmingPool) amenities.push({ icon: '🏊', name: 'Swimming Pool' });

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${hotel.title}"?`)) {
      setIsDeleting(true);
      try {
        await onDelete(hotel);
      } catch (error) {
        console.error('Failed to delete hotel:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Hotel Image */}
      <div className="relative h-48">
        <HotelImageSimple
          imagePath={hotel.image}
          alt={hotel.title}
          className="w-full h-full rounded-t-lg"
        />
        
        {/* Room Count Badge */}
        {rooms.length > 0 && (
          <div className="absolute top-2 left-2">
            <div className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs flex items-center">
              <Bed className="h-3 w-3 mr-1" />
              {rooms.length} Room{rooms.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}
        
        {/* Options Menu */}
        <div className="absolute top-2 right-2">
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
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails(hotel)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onManageRooms(hotel)}>
                <Users className="mr-2 h-4 w-4" />
                Manage Rooms ({rooms.length})
              </DropdownMenuItem>
              {hotel.userId === userId && ( // Conditionally render Edit and Delete
                <>
                  <DropdownMenuItem onClick={() => onEdit(hotel)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Hotel
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleDelete}
                    className="text-red-600"
                    disabled={isDeleting}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isDeleting ? 'Deleting...' : 'Delete Hotel'}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Hotel Title */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{hotel.title}</h3>
        
        {/* Location */}
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">
            {hotel.city}, {hotel.state}, {hotel.country}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {hotel.description}
        </p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1 mb-4">
          {amenities.slice(0, 4).map((amenity, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100"
            >
              <span className="mr-1">{amenity.icon}</span>
              {amenity.name}
            </span>
          ))}
          {amenities.length > 4 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100">
              +{amenities.length - 4} more
            </span>
          )}
        </div>

        {/* Stats - NOW DYNAMIC */}
        <div className="flex justify-between items-center pt-3 border-t">
          <div className="flex space-x-4 text-sm text-gray-600">
            <div className="text-center">
              <div className="font-semibold text-gray-900">{rooms.length}</div>
              <div>Rooms</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">0</div>
              <div>Bookings</div>
            </div>
          </div>
          
          <Button
            onClick={() => onViewDetails(hotel)}
            size="sm"
            className="ml-auto"
          >
            <Eye className="mr-1 h-4 w-4" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

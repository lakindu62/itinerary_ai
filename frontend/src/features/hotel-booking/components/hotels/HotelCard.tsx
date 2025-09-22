"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Users, Edit, Trash2 } from 'lucide-react';
import { Hotel } from '../../types/hotel.types';
import { AMENITIES } from '../../utils/constants';
import { formatPrice } from '../../utils/formatters';

interface HotelCardProps {
  hotel: Hotel;
  isOwner?: boolean;
  onEdit?: (hotel: Hotel) => void;
  onDelete?: (hotelId: string) => void;
}

export default function HotelCard({ hotel, isOwner, onEdit, onDelete }: HotelCardProps) {
  const activeAmenities = AMENITIES.filter(amenity => 
    hotel[amenity.key as keyof Hotel] === true
  ).slice(0, 4);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={hotel.image || '/images/hotel-placeholder.jpg'}
          alt={hotel.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <Badge className="bg-dark-brown text-white">
            Featured
          </Badge>
        </div>
        {isOwner && (
          <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onEdit?.(hotel)}
              className="bg-white/90 hover:bg-white"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete?.(hotel.id)}
              className="bg-red-500/90 hover:bg-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-dark-brown line-clamp-1">
            {hotel.title}
          </h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm text-gray-600 ml-1">4.8</span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{hotel.city}, {hotel.state}, {hotel.country}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {hotel.description}
        </p>
        
        {/* Amenities */}
        <div className="flex items-center space-x-1 mb-4">
          {activeAmenities.map((amenity) => (
            <span
              key={amenity.key}
              className="text-sm px-2 py-1 bg-light-purple text-dark-brown rounded-full"
              title={amenity.label}
            >
              {amenity.icon}
            </span>
          ))}
          {activeAmenities.length < AMENITIES.filter(amenity => 
            hotel[amenity.key as keyof Hotel] === true
          ).length && (
            <span className="text-xs text-gray-500">
              +{AMENITIES.filter(amenity => 
                hotel[amenity.key as keyof Hotel] === true
              ).length - activeAmenities.length} more
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-dark-brown">
              {formatPrice(299)}
            </span>
            <span className="text-gray-600 text-sm">/night</span>
          </div>
          
          <Link href={`/hotels/${hotel.id}`}>
            <Button className="bg-dark-brown text-white hover:bg-opacity-90">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
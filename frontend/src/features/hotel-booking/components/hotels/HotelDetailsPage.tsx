"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Star, Wifi, Car, Utensils, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '../shared/LoadingSpinner';
import RoomsList from '../rooms/RoomsList';
import { useHotel } from '../../hooks/useHotels';
import { useRooms } from '../../hooks/useRooms';
import { AMENITIES } from '../../utils/constants';

interface HotelDetailsPageProps {
  hotelId: string;
}

export default function HotelDetailsPage({ hotelId }: HotelDetailsPageProps) {
  const router = useRouter();
  const { data: hotel, isLoading: hotelLoading } = useHotel(hotelId);
  const { rooms, isLoading: roomsLoading } = useRooms(hotelId);

  if (hotelLoading) return <LoadingSpinner />;

  if (!hotel) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Hotel Not Found</h1>
        <Button onClick={() => router.push('/hotels')}>
          Back to Hotels
        </Button>
      </div>
    );
  }

  const activeAmenities = AMENITIES.filter(amenity => 
    hotel[amenity.key as keyof typeof hotel] === true
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-96">
        <Image
          src={hotel.image || '/images/hotel-placeholder.jpg'}
          alt={hotel.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <div className="absolute bottom-6 left-6 text-white">
          <div className="flex items-center mb-2">
            <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
            <span className="font-semibold">4.8</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">{hotel.title}</h1>
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-1" />
            <span>{hotel.city}, {hotel.state}, {hotel.country}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="rooms">Rooms</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">About this hotel</h2>
                    <p className="text-gray-600 mb-6">{hotel.description}</p>
                    <p className="text-gray-600">{hotel.locationDescription}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rooms">
                <div className="space-y-4">
                  {roomsLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <RoomsList hotelId={hotelId} rooms={rooms} showBookButton />
                  )}
                </div>
              </TabsContent>

              <TabsContent value="amenities">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Amenities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeAmenities.map((amenity) => (
                        <div key={amenity.key} className="flex items-center space-x-3">
                          <span className="text-2xl">{amenity.icon}</span>
                          <span className="font-medium">{amenity.label}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Location</h2>
                    <div className="space-y-4">
                      <div>
                        <p className="font-semibold">Address</p>
                        <p className="text-gray-600">
                          {hotel.city}, {hotel.state}, {hotel.country}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">Description</p>
                        <p className="text-gray-600">{hotel.locationDescription}</p>
                      </div>
                      <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Map integration coming soon</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">$299</span>
                    <span className="text-gray-500 ml-1">/night</span>
                  </div>
                  <p className="text-sm text-gray-500">+ taxes and fees</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Check-in</label>
                    <input 
                      type="date" 
                      className="w-full p-2 border rounded-md"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Check-out</label>
                    <input 
                      type="date" 
                      className="w-full p-2 border rounded-md"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Guests</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>1 Guest</option>
                      <option>2 Guests</option>
                      <option>3 Guests</option>
                      <option>4 Guests</option>
                    </select>
                  </div>
                </div>

                <Button 
                  className="w-full mb-3"
                  onClick={() => router.push(`/hotels/${hotelId}/book`)}
                >
                  Check Availability
                </Button>

                <p className="text-xs text-center text-gray-500">
                  You won't be charged yet
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
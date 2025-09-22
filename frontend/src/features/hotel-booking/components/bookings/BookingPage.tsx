"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Users, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '../shared/LoadingSpinner';
import BookingForm from './BookingForm';
import { useHotel } from '../../hooks/useHotels';
import { useRoom } from '../../hooks/useRooms';

interface BookingPageProps {
  hotelId: string;
  roomId?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
}

export default function BookingPage({ 
  hotelId, 
  roomId, 
  checkIn, 
  checkOut, 
  guests 
}: BookingPageProps) {
  const router = useRouter();
  const { data: hotel, isLoading: hotelLoading } = useHotel(hotelId);
  const { data: room, isLoading: roomLoading } = useRoom(roomId || '');

  if (hotelLoading || roomLoading) return <LoadingSpinner />;

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button 
            onClick={() => router.back()} 
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Booking</h1>
          <p className="text-gray-600">{hotel.title}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <BookingForm 
              hotelId={hotelId}
              roomId={roomId}
              initialData={{
                checkIn,
                checkOut,
                guests: guests ? parseInt(guests) : 2
              }}
            />
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Check-in & Check-out</p>
                    <p className="text-sm text-gray-600">
                      {checkIn ? new Date(checkIn).toLocaleDateString() : 'Select dates'}
                      {checkIn && checkOut && (
                        <> - {new Date(checkOut).toLocaleDateString()}</>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Guests</p>
                    <p className="text-sm text-gray-600">{guests || '2'} guests</p>
                  </div>
                </div>

                {room && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">{room.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{room.description}</p>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${room.roomPrice}/night</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
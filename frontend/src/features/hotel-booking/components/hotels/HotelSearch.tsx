"use client";



import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, CalendarDays, Users, Hotel as HotelIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useHotels } from '../../hooks/useHotels';
import { Hotel } from '../../types/hotel.types';
import HotelCard from './HotelCard';
import LoadingSpinner from '../shared/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth'; // Import useAuth

export default function HotelSearch() {
  const router = useRouter();
  const { hotels, isLoading, error } = useHotels();
  const { userId } = useAuth(); // Get current user ID

  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [guests, setGuests] = useState(1);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    setFilteredHotels(hotels);
  }, [hotels]);

  console.log('🏨 Hotel Search Page loaded:', {
    totalHotels: hotels.length,
    filteredCount: filteredHotels.length,
    timestamp: '2025-09-25 08:47:17',
    user: userId // Use dynamic userId
  });

  const handleSearch = () => {
    let currentFiltered = hotels;

    if (city) {
      currentFiltered = currentFiltered.filter(hotel =>
        hotel.city.toLowerCase().includes(city.toLowerCase())
      );
    }
    if (country) {
      currentFiltered = currentFiltered.filter(hotel =>
        hotel.country.toLowerCase().includes(country.toLowerCase())
      );
    }
    // Date and guest filtering would require more complex logic, potentially involving room availability

    setFilteredHotels(currentFiltered);
  };

  const handleViewDetails = (hotel: Hotel) => {
    router.push(`/hotels/${hotel.id}`);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500">Error loading hotels: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Find Your Next Stay</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MapPin className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <Input
                type="text"
                id="city"
                placeholder="e.g. New York"
                className="pl-10"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MapPin className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <Input
                type="text"
                id="country"
                placeholder="e.g. USA"
                className="pl-10"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="dates" className="block text-sm font-medium text-gray-700">Check-in & Check-out</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick your dates</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange as any}
                  onSelect={setDateRange as any}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label htmlFor="guests" className="block text-sm font-medium text-gray-700">Guests</label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Users className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <Input
                type="number"
                id="guests"
                placeholder="1"
                min="1"
                className="pl-10"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
        <Button onClick={handleSearch} className="w-full mt-4">
          <Search className="mr-2 h-4 w-4" />
          Search Hotels
        </Button>
      </div>

      <h2 className="text-2xl font-bold mb-4">All Hotels</h2>
      {filteredHotels.length === 0 ? (
        <div className="text-center py-12">
          <HotelIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Hotels Found</h3>
          <p className="text-gray-600 mb-4">Adjust your search criteria or try again later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              onViewDetails={handleViewDetails}
              onEdit={() => router.push(`/hotels/${hotel.id}/edit`)}
              onDelete={() => console.log('Delete hotel', hotel.id)} // Placeholder
              onManageRooms={() => router.push(`/hotels/${hotel.id}/rooms`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
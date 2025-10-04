"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useHotels } from '@/features/hotel-booking/hooks/useHotels';
import { Hotel } from '@/features/hotel-booking/types/hotel.types';
import HotelSearch from '@/features/hotel-booking/components/hotels/HotelSearch';

export default function HotelSearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { hotels: allHotels, isLoading: isLoadingAllHotels } = useHotels();
  
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Get initial search params from URL
  const initialQuery = searchParams.get('query') || '';
  const initialLocation = searchParams.get('location') || '';
  const initialCity = searchParams.get('city') || '';
  const initialCountry = searchParams.get('country') || '';

  console.log('🔍 Hotel Search Page loaded with existing component:', {
    totalHotels: allHotels.length,
    initialQuery,
    initialLocation,
    initialCity,
    initialCountry,
    timestamp: '2025-09-26 11:57:49',
    user: 'NadPerz'
  });

  // Apply initial filters based on URL params
  useEffect(() => {
    if (allHotels.length > 0) {
      let filtered = [...allHotels];

      // Apply query filter
      if (initialQuery) {
        const query = initialQuery.toLowerCase();
        filtered = filtered.filter(hotel =>
          hotel.title.toLowerCase().includes(query) ||
          hotel.description.toLowerCase().includes(query)
        );
      }

      // Apply location filters
      if (initialLocation) {
        const location = initialLocation.toLowerCase();
        filtered = filtered.filter(hotel =>
          hotel.city.toLowerCase().includes(location) ||
          hotel.state?.toLowerCase().includes(location) ||
          hotel.country.toLowerCase().includes(location)
        );
      }

      if (initialCity) {
        filtered = filtered.filter(hotel =>
          hotel.city.toLowerCase().includes(initialCity.toLowerCase())
        );
      }

      if (initialCountry) {
        filtered = filtered.filter(hotel =>
          hotel.country.toLowerCase().includes(initialCountry.toLowerCase())
        );
      }

      setFilteredHotels(filtered);

      console.log('🎯 Applied URL filters:', {
        originalCount: allHotels.length,
        filteredCount: filtered.length,
        filters: { initialQuery, initialLocation, initialCity, initialCountry },
        timestamp: '2025-09-26 11:57:49',
        user: 'NadPerz'
      });
    } else {
      setFilteredHotels([]);
    }
  }, [allHotels, initialQuery, initialLocation, initialCity, initialCountry]);

  // Handle search from your existing HotelSearch component
  const handleSearch = (query: string, location: string) => {
    setIsSearching(true);
    
    console.log('🔍 Search triggered from existing component:', {
      query,
      location,
      timestamp: '2025-09-26 11:57:49',
      user: 'NadPerz'
    });

    // Simulate search delay for better UX
    setTimeout(() => {
      let filtered = [...allHotels];

      // Apply search query filter
      if (query.trim()) {
        const searchQuery = query.toLowerCase();
        filtered = filtered.filter(hotel =>
          hotel.title.toLowerCase().includes(searchQuery) ||
          hotel.description.toLowerCase().includes(searchQuery)
        );
      }

      // Apply location filter
      if (location.trim()) {
        const locationQuery = location.toLowerCase();
        filtered = filtered.filter(hotel =>
          hotel.city.toLowerCase().includes(locationQuery) ||
          hotel.state?.toLowerCase().includes(locationQuery) ||
          hotel.country.toLowerCase().includes(locationQuery)
        );
      }

      setFilteredHotels(filtered);
      setIsSearching(false);

      // Update URL with new search params
      const params = new URLSearchParams();
      if (query.trim()) params.set('query', query);
      if (location.trim()) params.set('location', location);
      
      const newUrl = `/hotels/search${params.toString() ? '?' + params.toString() : ''}`;
      router.push(newUrl);

      console.log('✅ Search completed using existing component:', {
        query,
        location,
        resultsCount: filtered.length,
        timestamp: '2025-09-26 11:57:49',
        user: 'NadPerz'
      });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/hotels')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Hotels
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hotel Search</h1>
              <p className="text-gray-600 mt-1">Find the perfect hotel for your stay</p>
            </div>
            <div className="text-sm text-gray-500 text-right">
              <p>🔍 Using Existing HotelSearch Component</p>
              <p>👤 User: NadPerz</p>
              <p>📅 2025-09-26 11:57:49</p>
            </div>
          </div>

          {/* Show active search filters */}
          {(initialQuery || initialLocation || initialCity || initialCountry) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <h3 className="font-medium text-blue-900 mb-2">Active Search Filters:</h3>
              <div className="flex flex-wrap gap-2">
                {initialQuery && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    Search: "{initialQuery}"
                  </span>
                )}
                {initialLocation && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    Location: "{initialLocation}"
                  </span>
                )}
                {initialCity && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    City: "{initialCity}"
                  </span>
                )}
                {initialCountry && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    Country: "{initialCountry}"
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    router.push('/hotels/search');
                    setFilteredHotels(allHotels);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Your Existing HotelSearch Component - No changes needed! */}
        <HotelSearch
          hotels={filteredHotels}
          isLoading={isLoadingAllHotels || isSearching}
          onSearch={handleSearch}
        />

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 py-6 mt-8">
          <p>
            Hotel Search System • Using existing HotelSearch component • 
            Searched by NadPerz • 2025-09-26 11:57:49
          </p>
        </div>
      </div>
    </div>
  );
}
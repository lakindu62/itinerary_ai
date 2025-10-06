import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';
import {
  MapPin,
  Star,
  Wifi,
  Car,
  Dumbbell,
  Utensils,
  Coffee,
  ShoppingBag,
  Waves,
  Loader2,
  Plus,
  Bed,
  Users,
  DollarSign,
  Edit
} from 'lucide-react';
import { Hotel } from '../../types/hotel.types';
import { Room } from '../../types/room.types';
import { useRooms } from '../../hooks/useRooms';
import HotelImageSimple from '../shared/HotelImageSimple';
import HotelForm from './HotelForm';
import { useAuth } from '@/hooks/useAuth'; // Import useAuth

interface HotelDetailsPageProps {
  hotel?: Hotel;
  isLoading?: boolean;
  error?: Error | null;
}

export default function HotelDetailsPage({ hotel, isLoading, error }: HotelDetailsPageProps) {
  const router = useRouter();
  const [showEditForm, setShowEditForm] = useState(false);
  const { userId } = useAuth(); // Get current user ID
  
  // Fetch rooms for this hotel with enhanced debugging
  const {
    rooms = [],
    isLoading: isLoadingRooms,
    error: roomsError
  }: {
    rooms: Room[];
    isLoading: boolean;
    error: any;
  } = useRooms(hotel?.id);

  // Debug logging
  console.log('🏨 HotelDetailsPage Debug:', {
    hotelId: hotel?.id,
    hotelTitle: hotel?.title,
    roomsCount: rooms.length,
    isLoadingRooms,
    roomsError: roomsError?.message,
    rooms: rooms.map((r: Room) => ({ id: r.id, title: r.title, hotelId: r.hotelId }))
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Loading hotel details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg border border-red-200">
          <div className="text-center">
            <div className="text-red-600 mb-4">❌</div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">Failed to Load Hotel</h3>
            <p className="text-red-700">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="text-gray-400 mb-4">🏨</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hotel Not Found</h3>
            <p className="text-gray-600">The hotel you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const amenities = [
    { key: 'freeWifi', label: 'Free WiFi', icon: Wifi, available: hotel.freeWifi },
    { key: 'freeParking', label: 'Free Parking', icon: Car, available: hotel.freeParking },
    { key: 'gym', label: 'Gym', icon: Dumbbell, available: hotel.gym },
    { key: 'restaurant', label: 'Restaurant', icon: Utensils, available: hotel.restaurant },
    { key: 'coffeeShop', label: 'Coffee Shop', icon: Coffee, available: hotel.coffeeShop },
    { key: 'shopping', label: 'Shopping', icon: ShoppingBag, available: hotel.shopping },
    { key: 'swimmingPool', label: 'Swimming Pool', icon: Waves, available: hotel.swimmingPool },
  ];

  const availableAmenities = amenities.filter(a => a.available);

  // Button handlers
  const handleViewRooms = () => {
    router.push(`/hotels/${hotel.id}/rooms`);
  };

  const handleManageBookings = () => {
    router.push(`/hotels/${hotel.id}/bookings`);
  };

  // NEW: Hotel Edit Modal Handler (instead of navigation)
  const handleEditHotel = () => {
    console.log('✏️ Opening edit modal for hotel:', hotel.id);
    setShowEditForm(true);
  };

  // NEW: Room Edit Handler - Navigate to room edit page
  const handleEditRoom = (room: Room) => {
    console.log('🏠 Navigating to edit room:', room.id);
    router.push(`/hotels/${hotel.id}/rooms/${room.id}/edit`);
  };

  const handleAddRoom = () => {
    router.push(`/hotels/${hotel.id}/rooms/create`);
  };

  // NEW: Modal handlers
  const handleCloseEditForm = () => {
    setShowEditForm(false);
  };

  const handleEditSuccess = () => {
    setShowEditForm(false);
    // Refresh the page to show updated data
    window.location.reload();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="mb-4"
        >
          ← Back to Hotels
        </Button>
        <Badge variant="outline" className="mb-4">
          {rooms.length} Room{rooms.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 rounded-lg overflow-hidden">
        <HotelImageSimple
          imagePath={hotel.image}
          alt={hotel.title}
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-4xl font-bold mb-2">{hotel.title}</h1>
          <div className="flex items-center text-lg">
            <MapPin className="h-5 w-5 mr-2" />
            {hotel.city}, {hotel.state}, {hotel.country}
          </div>
        </div>
        <div className="absolute top-6 right-6">
          <Badge className="bg-yellow-500 text-black">
            <Star className="h-4 w-4 mr-1" />
            4.5
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">About This Hotel</h2>
              <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
            </CardContent>
          </Card>

          {/* Rooms Section - UPDATED with clickable cards */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Bed className="mr-2 h-5 w-5" />
                  Hotel Rooms ({rooms.length})
                </CardTitle>
                {hotel.userId === userId && ( // Conditionally render Add Room button
                  <Button onClick={handleAddRoom}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Room
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingRooms ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Loading rooms...
                </div>
              ) : roomsError ? (
                <div className="text-center py-8 text-red-600">
                  <p>Error loading rooms: {roomsError.message}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.location.reload()}
                    className="mt-2"
                  >
                    Retry
                  </Button>
                </div>
              ) : rooms.length === 0 ? (
                <div className="text-center py-8">
                  <Bed className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Rooms Yet</h3>
                  <p className="text-gray-600 mb-4">Add your first room to start accepting bookings.</p>
                  {hotel.userId === userId && ( // Conditionally render Create First Room button
                    <Button onClick={handleAddRoom}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Room
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rooms.map((room: Room) => (
                    <Card 
                      key={room.id} 
                      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleEditRoom(room)} // Make entire card clickable
                    >
                      <div className="relative h-32">
                        <HotelImageSimple
                          imagePath={room.image}
                          alt={room.title}
                          className="w-full h-full"
                          fallbackUrl="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop"
                        />
                        
                        {/* Room Price Badge */}
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-green-600 text-white">
                            ${room.roomPrice}/night
                          </Badge>
                        </div>

                        {/* Edit Icon */}
                        {hotel.userId === userId && ( // Conditionally render Edit Icon
                          <div className="absolute top-2 left-2">
                            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors">
                              <Edit className="h-4 w-4 text-gray-600" />
                            </div>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2 line-clamp-1">{room.title}</h4>
                        
                        {/* Room Specs */}
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {room.guestCount} guests
                          </div>
                          <div className="flex items-center">
                            <Bed className="h-4 w-4 mr-1" />
                            {room.bedCount} beds
                          </div>
                          <div className="flex items-center">
                            🚿 {room.bathroomCount} bath{room.bathroomCount !== 1 ? 's' : ''}
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{room.description}</p>
                        
                        {/* Room Features */}
                        <div className="flex flex-wrap gap-1">
                          {room.freeWifi && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">WiFi</span>
                          )}
                          {room.tv && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">TV</span>
                          )}
                          {room.balcony && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Balcony</span>
                          )}
                          {room.airCondition && (
                            <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded">AC</span>
                          )}
                          {room.roomService && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Room Service</span>
                          )}
                        </div>

                        {/* Click to edit hint */}
                        {hotel.userId === userId && ( // Conditionally render Click to edit hint
                          <div className="mt-3 pt-2 border-t border-gray-100">
                            <p className="text-xs text-gray-400 flex items-center">
                              <Edit className="h-3 w-3 mr-1" />
                              Click to edit this room
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Amenities & Services</h2>
              {availableAmenities.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {availableAmenities.map((amenity) => {
                    const IconComponent = amenity.icon;
                    return (
                      <div key={amenity.key} className="flex items-center space-x-3">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                        <span className="text-gray-700">{amenity.label}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 italic">No amenities information available.</p>
              )}
            </CardContent>
          </Card>

          {/* Location Details */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Location</h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">
                    {hotel.city}, {hotel.state}, {hotel.country}
                  </span>
                </div>
                {hotel.locationDescription && (
                  <p className="text-gray-600 ml-8">{hotel.locationDescription}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions - UPDATED */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={handleViewRooms}
                >
                  <Bed className="mr-2 h-4 w-4" />
                  View Rooms ({rooms.length})
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleManageBookings}
                >
                  📅 Manage Bookings
                </Button>
                {hotel.userId === userId && ( // Conditionally render Edit Hotel button
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleEditHotel} // Now opens modal instead of navigation
                  >
                    ✏️ Edit Hotel
                  </Button>
                )}
                {hotel.userId === userId && ( // Conditionally render Add New Room button
                  <Button 
                    variant="secondary" 
                    className="w-full"
                    onClick={handleAddRoom}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Room
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats - DYNAMIC */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Hotel Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Rooms</span>
                  <Badge variant="secondary">{rooms.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Bookings</span>
                  <Badge variant="outline">0</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-600">Average Rating</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="font-semibold">4.5</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenue (MTD)</span>
                  <span className="font-semibold text-green-600">$0</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hotel Info */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Hotel Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Owner:</span>
                  <span className="font-medium">{hotel.userId}</span> {/* Display dynamic userId */}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span>{hotel.createdAt ? new Date(hotel.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span>9/24/2025</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Hotel ID:</span>
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {hotel.id.split('_')[1] || hotel.id.slice(-8)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* NEW: Edit Hotel Modal */}
      {showEditForm && hotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <HotelForm
              hotel={hotel} // Pass existing hotel for editing
              onSuccess={handleEditSuccess}
              onCancel={handleCloseEditForm}
            />
          </div>
        </div>
      )}
    </div>
  );
}
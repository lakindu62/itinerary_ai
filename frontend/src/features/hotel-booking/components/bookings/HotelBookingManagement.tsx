"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft,
  Search,
  Filter,
  Download,
  CheckCircle,
  AlertCircle,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  DollarSign,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Building,
  Bed,
  Users,
  TrendingUp,
  Clock,
  XCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { bookingsApi } from '../../services/api/bookings.api';
import { useHotel } from '../../hooks/useHotels';
import { useRooms } from '../../hooks/useRooms';

interface HotelBookingManagementProps {
  hotelId: string;
}

interface HotelBooking {
  id: string;
  paymentId?: string;
  hotelId: string;
  hotelName?: string;
  roomId: string;
  roomName?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
  canCancel: boolean;
}

export default function HotelBookingManagement({ hotelId }: HotelBookingManagementProps) {
  const router = useRouter();
  const { data: hotel, isLoading: isLoadingHotel } = useHotel(hotelId);
  const { rooms, isLoading: isLoadingRooms } = useRooms(hotelId);
  
  const [hotelBookings, setHotelBookings] = useState<HotelBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<HotelBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Current context for NadPerz - UPDATED TO CURRENT TIME
  const currentTimestamp = '2025-09-27 05:48:13';
  const currentUser = 'NadPerz';

  console.log('🏨 Hotel-Specific Booking Management - NadPerz:', {
    hotelId: hotelId.slice(-8),
    hotelTitle: hotel?.title,
    timestamp: currentTimestamp,
    user: currentUser,
    utc: true,
    role: 'hotel-owner'
  });

  useEffect(() => {
    if (hotel) {
      fetchHotelBookings();
    }
  }, [hotelId, hotel]);

  useEffect(() => {
    filterBookings();
  }, [hotelBookings, searchTerm, filterStatus]);

  const fetchHotelBookings = async () => {
    try {
      console.log('🏨 Fetching bookings for specific hotel - NadPerz:', {
        hotelId: hotelId.slice(-8),
        hotelName: hotel?.title,
        timestamp: currentTimestamp,
        user: currentUser
      });

      setIsLoading(true);
      const allBookings = await bookingsApi.getAll();
      
      // Filter bookings for this specific hotel
      const hotelSpecificBookings = allBookings.filter(booking => booking.hotelId === hotelId);

      console.log('✅ Hotel bookings loaded for NadPerz:', {
        hotelId: hotelId.slice(-8),
        totalBookings: hotelSpecificBookings.length,
        timestamp: currentTimestamp,
        user: currentUser
      });

      setHotelBookings(hotelSpecificBookings);
    } catch (error) {
      console.error('❌ Error fetching hotel bookings for NadPerz:', error);
      setHotelBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = hotelBookings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.guestEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.roomName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(booking => booking.status === filterStatus);
    }

    console.log('🔍 Hotel bookings filtered for NadPerz:', {
      hotelId: hotelId.slice(-8),
      total: hotelBookings.length,
      filtered: filtered.length,
      searchTerm,
      filterStatus,
      timestamp: currentTimestamp
    });

    setFilteredBookings(filtered);
  };

  const handleViewBooking = (bookingId: string) => {
    console.log('👁️ NadPerz viewing hotel booking:', {
      bookingId: bookingId.slice(-8),
      hotelId: hotelId.slice(-8),
      timestamp: currentTimestamp
    });
    router.push(`/dashboard/reservations/${bookingId}`);
  };

  const handleEditBooking = (bookingId: string) => {
    console.log('✏️ NadPerz editing hotel booking:', {
      bookingId: bookingId.slice(-8),
      hotelId: hotelId.slice(-8),
      timestamp: currentTimestamp
    });
    router.push(`/dashboard/reservations/${bookingId}/edit`);
  };

  const handleCancelBooking = (bookingId: string) => {
    console.log('❌ NadPerz cancelling hotel booking:', {
      bookingId: bookingId.slice(-8),
      hotelId: hotelId.slice(-8),
      timestamp: currentTimestamp
    });
    router.push(`/dashboard/reservations/${bookingId}/cancel`);
  };

  const handleRefresh = async () => {
    console.log('🔄 NadPerz refreshing hotel bookings:', {
      hotelId: hotelId.slice(-8),
      timestamp: currentTimestamp
    });
    setIsRefreshing(true);
    await fetchHotelBookings();
    setIsRefreshing(false);
  };

  const handleExportBookings = () => {
    console.log('📊 NadPerz exporting hotel bookings:', {
      hotelId: hotelId.slice(-8),
      count: filteredBookings.length,
      timestamp: currentTimestamp
    });
    // Export functionality would go here
  };

  // Calculate hotel-specific statistics
  const stats = {
    total: hotelBookings.length,
    confirmed: hotelBookings.filter(b => b.status === 'confirmed').length,
    pending: hotelBookings.filter(b => b.status === 'pending').length,
    cancelled: hotelBookings.filter(b => b.status === 'cancelled').length,
    completed: hotelBookings.filter(b => b.status === 'completed').length,
    revenue: hotelBookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + b.totalPrice, 0),
    avgBookingValue: hotelBookings.length > 0 ? 
      (hotelBookings.reduce((sum, b) => sum + b.totalPrice, 0) / hotelBookings.length).toFixed(2) : '0.00',
    occupancyRate: rooms.length > 0 ? Math.round((hotelBookings.length / (rooms.length * 30)) * 100) : 0 // Rough estimate
  };

  if (isLoadingHotel) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading hotel details...</p>
            <div className="text-xs text-gray-500 mt-2">
              <p>👤 User: {currentUser}</p>
              <p>⏰ {currentTimestamp} UTC</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <Building className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-red-600 mb-4">Hotel Not Found</h1>
            <p className="text-gray-600 mb-4">Unable to load hotel information.</p>
            <Button onClick={() => router.push('/dashboard/hotels')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Hotels
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/hotels')}
                className="flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Hotels
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Hotel Booking Management</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Building className="h-5 w-5 text-blue-600" />
                  <span className="text-xl font-semibold text-blue-600">{hotel.title}</span>
                </div>
                <p className="text-gray-600">
                  Manage bookings for <span className="font-semibold text-blue-600">{currentUser}</span>'s hotel in {hotel.city}, {hotel.country}
                </p>
                <p className="text-sm text-gray-500">
                  Last updated: {currentTimestamp} UTC • Hotel-specific booking data
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleExportBookings}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Hotel Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                    <p className="text-xl font-bold text-blue-600">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Confirmed</p>
                    <p className="text-xl font-bold text-green-600">{stats.confirmed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-xl font-bold text-orange-600">{stats.pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-xl font-bold text-green-600">${stats.revenue.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Avg Booking</p>
                    <p className="text-xl font-bold text-blue-600">${stats.avgBookingValue}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Bed className="h-6 w-6 text-purple-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Occupancy</p>
                    <p className="text-xl font-bold text-purple-600">{stats.occupancyRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hotel Information Card */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-blue-800">
                <div>
                  <p><strong>Hotel:</strong> {hotel.title}</p>
                  <p><strong>Location:</strong> {hotel.city}, {hotel.country}</p>
                </div>
                <div>
                  <p><strong>Total Rooms:</strong> {rooms.length}</p>
                  <p><strong>Hotel ID:</strong> {hotelId.slice(-8)}</p>
                </div>
                <div>
                  <p><strong>Manager:</strong> {currentUser}</p>
                  <p><strong>Current Time:</strong> {currentTimestamp} UTC</p>
                </div>
                <div>
                  <p><strong>Status:</strong> <span className="text-green-600 font-medium">Active</span></p>
                  <p><strong>Booking System:</strong> <span className="text-green-600 font-medium">Online</span></p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters and Search */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by booking ID, guest name, email, or room..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterStatus === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('all')}
                    size="sm"
                  >
                    All ({stats.total})
                  </Button>
                  <Button
                    variant={filterStatus === 'confirmed' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('confirmed')}
                    size="sm"
                  >
                    Confirmed ({stats.confirmed})
                  </Button>
                  <Button
                    variant={filterStatus === 'pending' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('pending')}
                    size="sm"
                  >
                    Pending ({stats.pending})
                  </Button>
                  <Button
                    variant={filterStatus === 'cancelled' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('cancelled')}
                    size="sm"
                  >
                    Cancelled ({stats.cancelled})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bookings List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Hotel Bookings ({filteredBookings.length})
                </CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Room Filters
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading hotel bookings for {currentUser}...</p>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Bookings Found</h3>
                  <p className="text-gray-600">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'Try adjusting your search or filters' 
                      : `No bookings have been made for ${hotel.title} yet`
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            {booking.status === 'confirmed' ? (
                              <CheckCircle className="h-8 w-8 text-green-600" />
                            ) : booking.status === 'cancelled' ? (
                              <XCircle className="h-8 w-8 text-red-600" />
                            ) : booking.status === 'completed' ? (
                              <CheckCircle className="h-8 w-8 text-blue-600" />
                            ) : (
                              <AlertCircle className="h-8 w-8 text-orange-600" />
                            )}
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-gray-900">
                                Booking #{booking.id.slice(-8)}
                              </h3>
                              <Badge 
                                variant={
                                  booking.status === 'confirmed' ? "default" : 
                                  booking.status === 'cancelled' ? "destructive" : 
                                  booking.status === 'completed' ? "secondary" : "outline"
                                }
                                className="text-xs"
                              >
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                                <span className="truncate">
                                  {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Bed className="h-4 w-4 mr-1 flex-shrink-0" />
                                <span className="truncate">{booking.roomName || 'Room'}</span>
                              </div>
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-1 flex-shrink-0" />
                                <span className="truncate">{booking.guestName}</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-500 mt-1">
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-1 flex-shrink-0" />
                                <span className="truncate">{booking.guestEmail}</span>
                              </div>
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1 flex-shrink-0" />
                                <span className="truncate">{booking.guests} guest{booking.guests !== 1 ? 's' : ''}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                                <span className="truncate">
                                  Booked: {new Date(booking.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 flex-shrink-0">
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">${booking.totalPrice}</p>
                            <p className="text-sm text-gray-500">
                              {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
                            </p>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewBooking(booking.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditBooking(booking.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {booking.canCancel && booking.status !== 'cancelled' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCancelBooking(booking.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {booking.specialRequests && (
                        <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
                          <strong>Special Requests:</strong> {booking.specialRequests}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
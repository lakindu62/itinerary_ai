"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  Search,
  Filter,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  MapPin,
  DollarSign,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Plus,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Mail,
  Phone
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { bookingsApi } from '../../services/api/bookings.api';

interface Booking {
  id: string;
  paymentId?: string;
  hotelId: string;
  hotelName?: string;
  hotelCity?: string;
  hotelCountry?: string;
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

export default function ReservationsOverview() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Current context for NadPerz
  const currentTimestamp = '2025-09-27 04:02:41';
  const currentUser = 'NadPerz';

  console.log('📅 Reservation Manager Overview - NadPerz:', {
    timestamp: currentTimestamp,
    user: currentUser,
    utc: true,
    role: 'hotel-owner'
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, filterStatus]);

  const fetchBookings = async () => {
    try {
      console.log('📅 Fetching all hotel bookings for NadPerz:', {
        timestamp: currentTimestamp,
        user: currentUser,
        endpoint: '/bookings/hotel-bookings'
      });

      setIsLoading(true);
      const fetchedBookings = await bookingsApi.getAll();
      
      console.log('✅ Bookings fetched for NadPerz:', {
        count: fetchedBookings.length,
        timestamp: currentTimestamp,
        user: currentUser
      });

      setBookings(fetchedBookings);
    } catch (error) {
      console.error('❌ Error fetching bookings for NadPerz:', error);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.hotelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.guestEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.guestName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(booking => booking.status === filterStatus);
    }

    console.log('🔍 Bookings filtered for NadPerz:', {
      total: bookings.length,
      filtered: filtered.length,
      searchTerm,
      filterStatus,
      timestamp: currentTimestamp
    });

    setFilteredBookings(filtered);
  };

  const handleViewBooking = (bookingId: string) => {
    console.log('👁️ NadPerz viewing booking details:', {
      bookingId: bookingId.slice(-8),
      timestamp: currentTimestamp
    });
    router.push(`/dashboard/reservations/${bookingId}`);
  };

  const handleEditBooking = (bookingId: string) => {
    console.log('✏️ NadPerz editing booking:', {
      bookingId: bookingId.slice(-8),
      timestamp: currentTimestamp
    });
    router.push(`/dashboard/reservations/${bookingId}/edit`);
  };

  const handleCancelBooking = (bookingId: string) => {
    console.log('❌ NadPerz initiating cancellation:', {
      bookingId: bookingId.slice(-8),
      timestamp: currentTimestamp
    });
    router.push(`/dashboard/reservations/${bookingId}/cancel`);
  };

  const handleRefresh = async () => {
    console.log('🔄 NadPerz refreshing reservations data:', {
      timestamp: currentTimestamp
    });
    setIsRefreshing(true);
    await fetchBookings();
    setIsRefreshing(false);
  };

  const handleExportBookings = () => {
    console.log('📊 NadPerz exporting bookings:', {
      count: filteredBookings.length,
      timestamp: currentTimestamp
    });
    // Export functionality would go here
  };

  const handleBulkAction = (action: string) => {
    console.log('🔄 NadPerz bulk action:', {
      action,
      selectedCount: selectedBookings.length,
      timestamp: currentTimestamp
    });
  };

  // Calculate statistics
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    revenue: bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + b.totalPrice, 0),
    avgBookingValue: bookings.length > 0 ? 
      (bookings.reduce((sum, b) => sum + b.totalPrice, 0) / bookings.length).toFixed(2) : '0.00',
    todayBookings: bookings.filter(b => 
      new Date(b.createdAt).toDateString() === new Date().toDateString()
    ).length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard')}
                className="flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Reservation Manager</h1>
                <p className="text-gray-600 mt-1">
                  Complete booking management for <span className="font-semibold text-blue-600">{currentUser}</span>'s hotels
                </p>
                <p className="text-sm text-gray-500">
                  Last updated: {currentTimestamp} UTC • Real-time reservation data
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleExportBookings}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
              <Button onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-xl font-bold text-gray-900">{stats.total}</p>
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
                  <Trash2 className="h-6 w-6 text-red-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Cancelled</p>
                    <p className="text-xl font-bold text-red-600">{stats.cancelled}</p>
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
                    <p className="text-sm font-medium text-gray-600">Today</p>
                    <p className="text-xl font-bold text-blue-600">{stats.todayBookings}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by booking ID, guest name, email, or hotel..."
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
                  Reservations ({filteredBookings.length})
                </CardTitle>
                <div className="flex space-x-2">
                  {selectedBookings.length > 0 && (
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleBulkAction('confirm')}
                      >
                        Confirm Selected ({selectedBookings.length})
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleBulkAction('cancel')}
                      >
                        Cancel Selected
                      </Button>
                    </div>
                  )}
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Advanced Filters
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading reservations for {currentUser}...</p>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Reservations Found</h3>
                  <p className="text-gray-600">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'Try adjusting your search or filters' 
                      : 'No bookings have been made yet'
                    }
                  </p>
                  {!searchTerm && filterStatus === 'all' && (
                    <Button className="mt-4" onClick={() => router.push('/hotels')}>
                      <Plus className="mr-2 h-4 w-4" />
                      View Hotels
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            className="rounded"
                            checked={selectedBookings.includes(booking.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedBookings([...selectedBookings, booking.id]);
                              } else {
                                setSelectedBookings(selectedBookings.filter(id => id !== booking.id));
                              }
                            }}
                          />
                          
                          <div className="flex-shrink-0">
                            {booking.status === 'confirmed' ? (
                              <CheckCircle className="h-8 w-8 text-green-600" />
                            ) : booking.status === 'cancelled' ? (
                              <Trash2 className="h-8 w-8 text-red-600" />
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
                                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                                <span className="truncate">{booking.hotelName || 'Hotel'}</span>
                              </div>
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-1 flex-shrink-0" />
                                <span className="truncate">{booking.guestName}</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-500 mt-1">
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-1 flex-shrink-0" />
                                <span className="truncate">{booking.guestEmail}</span>
                              </div>
                              {booking.guestPhone && (
                                <div className="flex items-center">
                                  <Phone className="h-4 w-4 mr-1 flex-shrink-0" />
                                  <span className="truncate">{booking.guestPhone}</span>
                                </div>
                              )}
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
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* NadPerz Context Info */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="text-sm text-blue-800">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p><strong>Hotel Owner:</strong> {currentUser}</p>
                    <p><strong>System Time:</strong> {currentTimestamp} UTC</p>
                  </div>
                  <div>
                    <p><strong>Total Bookings:</strong> {stats.total}</p>
                    <p><strong>Today's Bookings:</strong> {stats.todayBookings}</p>
                  </div>
                  <div>
                    <p><strong>Total Revenue:</strong> ${stats.revenue.toFixed(2)}</p>
                    <p><strong>Avg Booking:</strong> ${stats.avgBookingValue}</p>
                  </div>
                  <div>
                    <p><strong>Confirmed Rate:</strong> {stats.total > 0 ? Math.round((stats.confirmed / stats.total) * 100) : 0}%</p>
                    <p><strong>Status:</strong> <span className="text-green-600 font-medium">Active</span></p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
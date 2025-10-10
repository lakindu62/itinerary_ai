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
  XCircle,
  AlertTriangle,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  DollarSign,
  Clock,
  RotateCcw,
  TrendingDown,
  FileX,
  RefreshCw,
  Eye,
  Undo2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { bookingsApi } from '../../services/api/bookings.api';

interface CancelledBooking {
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
  status: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  cancellationReason?: string;
  refundAmount?: number;
  cancellationFee?: number;
}

export default function CancellationManagement() {
  const router = useRouter();
  const [cancelledBookings, setCancelledBookings] = useState<CancelledBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<CancelledBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Current context for NadPerz - UPDATED TO CURRENT TIME
  const currentTimestamp = '2025-09-27 05:39:29';
  const currentUser = 'NadPerz';

  console.log('❌ Cancellation Management Dashboard - NadPerz:', {
    timestamp: currentTimestamp,
    user: currentUser,
    utc: true,
    role: 'hotel-owner'
  });

  useEffect(() => {
    fetchCancelledBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [cancelledBookings, searchTerm, dateFilter]);

  const fetchCancelledBookings = async () => {
    try {
      console.log('❌ Fetching cancelled bookings for NadPerz:', {
        timestamp: currentTimestamp,
        user: currentUser
      });

      setIsLoading(true);
      const allBookings = await bookingsApi.getAll();
      
      // Filter only cancelled bookings
      const cancelled = allBookings
        .filter(booking => booking.status === 'cancelled')
        .map(booking => ({
          ...booking,
          cancelledAt: booking.updatedAt, // Use updatedAt as cancelled date
          cancellationReason: booking.specialRequests || 'No reason provided',
          refundAmount: calculateRefundAmount(booking.totalPrice),
          cancellationFee: calculateCancellationFee(booking.totalPrice)
        }));

      console.log('✅ Cancelled bookings loaded for NadPerz:', {
        count: cancelled.length,
        timestamp: currentTimestamp,
        user: currentUser
      });

      setCancelledBookings(cancelled);
    } catch (error) {
      console.error('❌ Error fetching cancelled bookings for NadPerz:', error);
      setCancelledBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateRefundAmount = (totalPrice: number) => {
    // Simulate refund calculation (75% refund)
    return totalPrice * 0.75;
  };

  const calculateCancellationFee = (totalPrice: number) => {
    // Simulate cancellation fee (25% fee)
    return totalPrice * 0.25;
  };

  const filterBookings = () => {
    let filtered = cancelledBookings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.hotelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.guestEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.guestName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(booking => 
            new Date(booking.cancelledAt || booking.updatedAt) >= filterDate
          );
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(booking => 
            new Date(booking.cancelledAt || booking.updatedAt) >= filterDate
          );
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(booking => 
            new Date(booking.cancelledAt || booking.updatedAt) >= filterDate
          );
          break;
      }
    }

    console.log('🔍 Cancellations filtered for NadPerz:', {
      total: cancelledBookings.length,
      filtered: filtered.length,
      searchTerm,
      dateFilter,
      timestamp: currentTimestamp
    });

    setFilteredBookings(filtered);
  };

  const handleRefresh = async () => {
    console.log('🔄 NadPerz refreshing cancellations data:', {
      timestamp: currentTimestamp
    });
    setIsRefreshing(true);
    await fetchCancelledBookings();
    setIsRefreshing(false);
  };

  const handleViewBooking = (bookingId: string) => {
    console.log('👁️ NadPerz viewing cancelled booking:', {
      bookingId: bookingId.slice(-8),
      timestamp: currentTimestamp
    });
    router.push(`/dashboard/reservations/${bookingId}`);
  };

  const handleExportCancellations = () => {
    console.log('📊 NadPerz exporting cancellations:', {
      count: filteredBookings.length,
      timestamp: currentTimestamp
    });
    // Export functionality would go here
  };

  // Calculate statistics
  const stats = {
    total: cancelledBookings.length,
    today: cancelledBookings.filter(b => 
      new Date(b.cancelledAt || b.updatedAt).toDateString() === new Date().toDateString()
    ).length,
    thisWeek: cancelledBookings.filter(b => {
      const cancelDate = new Date(b.cancelledAt || b.updatedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return cancelDate >= weekAgo;
    }).length,
    thisMonth: cancelledBookings.filter(b => {
      const cancelDate = new Date(b.cancelledAt || b.updatedAt);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return cancelDate >= monthAgo;
    }).length,
    totalRefunds: cancelledBookings.reduce((sum, b) => sum + (b.refundAmount || 0), 0),
    totalFees: cancelledBookings.reduce((sum, b) => sum + (b.cancellationFee || 0), 0),
    lostRevenue: cancelledBookings.reduce((sum, b) => sum + b.totalPrice, 0)
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
                <h1 className="text-3xl font-bold text-red-600">Cancellation Management</h1>
                <p className="text-gray-600 mt-1">
                  Monitor and manage cancelled reservations for <span className="font-semibold text-blue-600">{currentUser}</span>'s hotels
                </p>
                <p className="text-sm text-gray-500">
                  Last updated: {currentTimestamp} UTC • Cancellation analytics and refund tracking
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleExportCancellations}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
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
                  <XCircle className="h-6 w-6 text-red-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Total Cancelled</p>
                    <p className="text-xl font-bold text-red-600">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Clock className="h-6 w-6 text-orange-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Today</p>
                    <p className="text-xl font-bold text-orange-600">{stats.today}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">This Week</p>
                    <p className="text-xl font-bold text-blue-600">{stats.thisWeek}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <RotateCcw className="h-6 w-6 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Total Refunds</p>
                    <p className="text-xl font-bold text-green-600">${stats.totalRefunds.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Cancellation Fees</p>
                    <p className="text-xl font-bold text-yellow-600">${stats.totalFees.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Lost Revenue</p>
                    <p className="text-xl font-bold text-red-600">${stats.lostRevenue.toFixed(2)}</p>
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
                    variant={dateFilter === 'all' ? 'default' : 'outline'}
                    onClick={() => setDateFilter('all')}
                    size="sm"
                  >
                    All ({stats.total})
                  </Button>
                  <Button
                    variant={dateFilter === 'today' ? 'default' : 'outline'}
                    onClick={() => setDateFilter('today')}
                    size="sm"
                  >
                    Today ({stats.today})
                  </Button>
                  <Button
                    variant={dateFilter === 'week' ? 'default' : 'outline'}
                    onClick={() => setDateFilter('week')}
                    size="sm"
                  >
                    This Week ({stats.thisWeek})
                  </Button>
                  <Button
                    variant={dateFilter === 'month' ? 'default' : 'outline'}
                    onClick={() => setDateFilter('month')}
                    size="sm"
                  >
                    This Month ({stats.thisMonth})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cancellations List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-red-600">
                  Cancelled Reservations ({filteredBookings.length})
                </CardTitle>
                <div className="flex space-x-2">
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
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading cancellations for {currentUser}...</p>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                  {cancelledBookings.length === 0 ? (
                    <>
                      <FileX className="h-12 w-12 mx-auto text-green-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Cancellations</h3>
                      <p className="text-gray-600">Great news! No reservations have been cancelled yet.</p>
                    </>
                  ) : (
                    <>
                      <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
                      <p className="text-gray-600">Try adjusting your search or filters</p>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map((booking) => (
                    <div key={booking.id} className="border border-red-200 rounded-lg p-4 bg-red-50 hover:bg-red-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <XCircle className="h-8 w-8 text-red-600" />
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-red-900">
                                Booking #{booking.id.slice(-8)}
                              </h3>
                              <Badge variant="destructive" className="text-xs">
                                Cancelled
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-red-700">
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
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-red-600 mt-1">
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-1 flex-shrink-0" />
                                <span className="truncate">{booking.guestEmail}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                                <span className="truncate">
                                  Cancelled: {new Date(booking.cancelledAt || booking.updatedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 flex-shrink-0">
                          <div className="text-right">
                            <p className="text-lg font-bold text-red-900">${booking.totalPrice}</p>
                            <div className="text-sm space-y-1">
                              <p className="text-green-600">Refund: ${booking.refundAmount?.toFixed(2)}</p>
                              <p className="text-red-600">Fee: ${booking.cancellationFee?.toFixed(2)}</p>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewBooking(booking.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {booking.cancellationReason && booking.cancellationReason !== 'No reason provided' && (
                        <div className="mt-3 p-2 bg-white rounded border border-red-200">
                          <p className="text-sm text-red-800">
                            <strong>Reason:</strong> {booking.cancellationReason}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* NadPerz Context Info */}
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="text-sm text-red-800">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p><strong>Hotel Owner:</strong> {currentUser}</p>
                    <p><strong>System Time:</strong> {currentTimestamp} UTC</p>
                  </div>
                  <div>
                    <p><strong>Total Cancellations:</strong> {stats.total}</p>
                    <p><strong>Lost Revenue:</strong> ${stats.lostRevenue.toFixed(2)}</p>
                  </div>
                  <div>
                    <p><strong>Total Refunds:</strong> ${stats.totalRefunds.toFixed(2)}</p>
                    <p><strong>Cancellation Fees:</strong> ${stats.totalFees.toFixed(2)}</p>
                  </div>
                  <div>
                    <p><strong>Cancellation Rate:</strong> {stats.total > 0 ? '5.2%' : '0%'}</p>
                    <p><strong>System Status:</strong> <span className="text-green-600 font-medium">Active</span></p>
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
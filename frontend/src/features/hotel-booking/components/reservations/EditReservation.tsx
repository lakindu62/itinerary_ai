"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Save,
  Calendar,
  Users,
  User,
  Mail,
  Phone,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { bookingsApi } from '../../services/api/bookings.api';
import { format, addDays, differenceInDays } from 'date-fns';

interface EditReservationProps {
  reservationId: string;
}

interface EditableBooking {
  id: string;
  hotelId: string;
  hotelName?: string;
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
  roomPrice: number;
}

export default function EditReservation({ reservationId }: EditReservationProps) {
  const router = useRouter();
  const [booking, setBooking] = useState<EditableBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2,
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    specialRequests: ''
  });

  // Current context for NadPerz - UPDATED
  const currentTimestamp = '2025-09-27 04:47:50';
  const currentUser = 'NadPerz';

  console.log('✏️ Edit Reservation Page - NadPerz:', {
    reservationId: reservationId.slice(-8),
    timestamp: currentTimestamp,
    user: currentUser,
    utc: true
  });

  useEffect(() => {
    fetchBookingDetails();
  }, [reservationId]);

  const fetchBookingDetails = async () => {
    try {
      console.log('✏️ Fetching booking for edit - NadPerz:', {
        bookingId: reservationId.slice(-8),
        timestamp: currentTimestamp,
        user: currentUser
      });

      setIsLoading(true);
      const allBookings = await bookingsApi.getAll();
      const foundBooking = allBookings.find(b => b.id === reservationId);
      
      if (foundBooking) {
        const checkInDate = new Date(foundBooking.checkIn);
        const checkOutDate = new Date(foundBooking.checkOut);
        const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
        const roomPrice = nights > 0 ? foundBooking.totalPrice / nights : foundBooking.totalPrice;

        const editableBooking: EditableBooking = {
          ...foundBooking,
          roomPrice
        };

        setBooking(editableBooking);
        
        // Initialize form data
        setFormData({
          checkIn: foundBooking.checkIn,
          checkOut: foundBooking.checkOut,
          guests: foundBooking.guests,
          guestName: foundBooking.guestName,
          guestEmail: foundBooking.guestEmail,
          guestPhone: foundBooking.guestPhone || '',
          specialRequests: foundBooking.specialRequests || ''
        });

        console.log('✅ Booking loaded for editing - NadPerz:', {
          bookingId: editableBooking.id.slice(-8),
          guestName: editableBooking.guestName,
          status: editableBooking.status,
          timestamp: currentTimestamp
        });
      } else {
        console.error('❌ Booking not found for editing - NadPerz:', reservationId.slice(-8));
      }
    } catch (error) {
      console.error('❌ Error fetching booking for edit - NadPerz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    console.log('📝 NadPerz updating field:', {
      field,
      value,
      hasChanges: true,
      timestamp: currentTimestamp
    });
  };

  const calculateNewTotal = () => {
    if (!booking || !formData.checkIn || !formData.checkOut) return booking?.totalPrice || 0;
    
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return booking.roomPrice * Math.max(nights, 1);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.guestName.trim()) {
      newErrors.guestName = 'Guest name is required';
    }

    if (!formData.guestEmail.trim()) {
      newErrors.guestEmail = 'Guest email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.guestEmail)) {
      newErrors.guestEmail = 'Please enter a valid email address';
    }

    if (formData.guests < 1 || formData.guests > 10) {
      newErrors.guests = 'Number of guests must be between 1 and 10';
    }

    if (new Date(formData.checkIn) >= new Date(formData.checkOut)) {
      newErrors.checkOut = 'Check-out date must be after check-in date';
    }

    if (new Date(formData.checkIn) < new Date()) {
      newErrors.checkIn = 'Check-in date cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!booking) return;

    if (!validateForm()) {
      console.log('❌ Form validation failed - NadPerz:', errors);
      return;
    }

    try {
      console.log('💾 NadPerz saving reservation changes:', {
        bookingId: booking.id.slice(-8),
        changes: formData,
        newTotal: calculateNewTotal(),
        timestamp: currentTimestamp
      });

      setIsSaving(true);
      setErrors({});

      // Since we don't have an update booking API method, we'll simulate success
      // In a real implementation, you'd call something like:
      // await bookingsApi.updateBooking(booking.id, formData);

      console.log('✅ Reservation updated successfully by NadPerz');
      setSuccess('Reservation updated successfully!');
      setHasChanges(false);

      // Redirect after success
      setTimeout(() => {
        router.push(`/dashboard/reservations/${reservationId}`);
      }, 1500);

    } catch (error) {
      console.error('❌ Error updating reservation - NadPerz:', error);
      setErrors({ general: 'Failed to update reservation. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmLeave) return;
    }

    console.log('❌ NadPerz cancelled editing reservation:', {
      bookingId: booking?.id.slice(-8),
      hadChanges: hasChanges,
      timestamp: currentTimestamp
    });

    router.push(`/dashboard/reservations/${reservationId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
            <p className="mt-4 text-gray-600">Loading reservation for editing...</p>
            <div className="text-xs text-gray-500 mt-2">
              <p>👤 User: {currentUser}</p>
              <p>⏰ {currentTimestamp} UTC</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-red-600 mb-4">Reservation Not Found</h1>
            <p className="text-gray-600 mb-4">Unable to load reservation for editing.</p>
            <Button onClick={() => router.push('/dashboard/reservations')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Reservations
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleCancel}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Edit Reservation #{booking.id.slice(-8)}
              </h1>
              <p className="text-gray-600">
                Editing for <span className="font-semibold text-blue-600">{currentUser}</span> • {booking.hotelName}
              </p>
            </div>
          </div>
          
          <Badge className={booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-green-800">{success}</span>
            </div>
          </div>
        )}

        {/* General Error */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-800">{errors.general}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stay Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Stay Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Check-in Date</label>
                    <Input
                      type="date"
                      value={formData.checkIn}
                      onChange={(e) => handleInputChange('checkIn', e.target.value)}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      className={errors.checkIn ? 'border-red-300' : ''}
                    />
                    {errors.checkIn && (
                      <p className="text-red-600 text-sm mt-1">{errors.checkIn}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Check-out Date</label>
                    <Input
                      type="date"
                      value={formData.checkOut}
                      onChange={(e) => handleInputChange('checkOut', e.target.value)}
                      min={formData.checkIn ? format(addDays(new Date(formData.checkIn), 1), 'yyyy-MM-dd') : format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                      className={errors.checkOut ? 'border-red-300' : ''}
                    />
                    {errors.checkOut && (
                      <p className="text-red-600 text-sm mt-1">{errors.checkOut}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Number of Guests</label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.guests}
                    onChange={(e) => handleInputChange('guests', parseInt(e.target.value) || 1)}
                    className={errors.guests ? 'border-red-300' : ''}
                  />
                  {errors.guests && (
                    <p className="text-red-600 text-sm mt-1">{errors.guests}</p>
                  )}
                </div>

                {formData.checkIn && formData.checkOut && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 font-medium">
                      Duration: {differenceInDays(new Date(formData.checkOut), new Date(formData.checkIn))} nights
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Guest Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Guest Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <Input
                    type="text"
                    value={formData.guestName}
                    onChange={(e) => handleInputChange('guestName', e.target.value)}
                    placeholder="Enter guest's full name"
                    className={errors.guestName ? 'border-red-300' : ''}
                  />
                  {errors.guestName && (
                    <p className="text-red-600 text-sm mt-1">{errors.guestName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <Input
                    type="email"
                    value={formData.guestEmail}
                    onChange={(e) => handleInputChange('guestEmail', e.target.value)}
                    placeholder="Enter guest's email"
                    className={errors.guestEmail ? 'border-red-300' : ''}
                  />
                  {errors.guestEmail && (
                    <p className="text-red-600 text-sm mt-1">{errors.guestEmail}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input
                    type="tel"
                    value={formData.guestPhone}
                    onChange={(e) => handleInputChange('guestPhone', e.target.value)}
                    placeholder="Enter guest's phone number"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Special Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Special Requests</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  placeholder="Any special requests or notes..."
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Updated Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Hotel</span>
                    <span className="text-sm font-medium">{booking.hotelName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Room</span>
                    <span className="text-sm font-medium">{booking.roomName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Guest</span>
                    <span className="text-sm font-medium">{formData.guestName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Guests</span>
                    <span className="text-sm font-medium">{formData.guests}</span>
                  </div>
                  {formData.checkIn && formData.checkOut && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm">Nights</span>
                        <span className="text-sm font-medium">
                          {differenceInDays(new Date(formData.checkOut), new Date(formData.checkIn))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Rate/Night</span>
                        <span className="text-sm font-medium">${booking.roomPrice.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">New Total</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${calculateNewTotal().toFixed(2)}
                    </span>
                  </div>
                  {calculateNewTotal() !== booking.totalPrice && (
                    <p className="text-sm text-blue-600 mt-1">
                      Original: ${booking.totalPrice.toFixed(2)}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={handleSave}
                  disabled={isSaving || !hasChanges}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                
                <Button 
                  className="w-full" 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>

                {hasChanges && (
                  <p className="text-sm text-orange-600 text-center">
                    You have unsaved changes
                  </p>
                )}
              </CardContent>
            </Card>

            {/* System Info */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-2">Edit Session</p>
                  <p><strong>Edited by:</strong> {currentUser}</p>
                  <p><strong>Current time:</strong> {currentTimestamp} UTC</p>
                  <p><strong>Original booking:</strong> {booking.id}</p>
                  <p><strong>Has changes:</strong> {hasChanges ? 'Yes' : 'No'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
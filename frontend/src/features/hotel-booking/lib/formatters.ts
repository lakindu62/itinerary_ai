import { HOTEL_BOOKING_CONSTANTS } from './constants';

// Currency formatting for hotel booking system
export const formatCurrency = (
  amount: number, 
  currency: string = HOTEL_BOOKING_CONSTANTS.CURRENCY.DEFAULT
): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: HOTEL_BOOKING_CONSTANTS.CURRENCY.DECIMAL_PLACES,
    maximumFractionDigits: HOTEL_BOOKING_CONSTANTS.CURRENCY.DECIMAL_PLACES,
  });
  
  return formatter.format(amount);
};

// Price formatting (alias for formatCurrency)
export const formatPrice = (
  amount: number,
  currency: string = HOTEL_BOOKING_CONSTANTS.CURRENCY.DEFAULT
): string => {
  return formatCurrency(amount, currency);
};

// Date formatting for hotel booking system
export const formatDate = (
  date: string | Date, 
  format: 'display' | 'api' | 'datetime' | 'iso' = 'display'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    console.warn(`⚠️ Invalid date provided: ${date}`);
    return 'Invalid Date';
  }
  
  switch (format) {
    case 'display':
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      });
    
    case 'api':
      return dateObj.toISOString().split('T')[0];
    
    case 'datetime':
      return dateObj.toISOString().replace('T', ' ').substring(0, 19);
    
    case 'iso':
      return dateObj.toISOString();
    
    default:
      return dateObj.toLocaleDateString();
  }
};

// Format room capacity for display
export const formatRoomCapacity = (
  guestCount: number,
  bedCount: number,
  bathroomCount: number
): string => {
  const parts: string[] = [];
  
  if (guestCount) {
    parts.push(`${guestCount} guest${guestCount !== 1 ? 's' : ''}`);
  }
  
  if (bedCount) {
    parts.push(`${bedCount} bed${bedCount !== 1 ? 's' : ''}`);
  }
  
  if (bathroomCount) {
    parts.push(`${bathroomCount} bathroom${bathroomCount !== 1 ? 's' : ''}`);
  }
  
  return parts.join(' • ');
};

// Format room type based on bed configuration
export const formatRoomType = (kingBed: number, queenBed: number, bedCount: number): string => {
  const parts: string[] = [];
  
  if (kingBed > 0) {
    parts.push(`${kingBed} King${kingBed !== 1 ? 's' : ''}`);
  }
  
  if (queenBed > 0) {
    parts.push(`${queenBed} Queen${queenBed !== 1 ? 's' : ''}`);
  }
  
  if (parts.length === 0 && bedCount > 0) {
    parts.push(`${bedCount} Bed${bedCount !== 1 ? 's' : ''}`);
  }
  
  return parts.length > 0 ? parts.join(' + ') : 'Standard Room';
};

// Format hotel address
export const formatHotelAddress = (
  city: string,
  state: string,
  country: string,
  short: boolean = false
): string => {
  if (short) {
    return `${city}, ${country}`;
  }
  
  return `${city}, ${state}, ${country}`;
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format duration (for bookings)
export const formatDuration = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
};

// Format percentage
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

// Format phone number
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phone;
};

// Truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Format hotel booking status
export const formatBookingStatus = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days !== 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  return 'Just now';
};

// Hotel booking formatters utility object
export const hotelFormatters = {
  currency: formatCurrency,
  price: formatPrice,
  date: formatDate,
  roomCapacity: formatRoomCapacity,
  roomType: formatRoomType,
  hotelAddress: formatHotelAddress,
  fileSize: formatFileSize,
  duration: formatDuration,
  percentage: formatPercentage,
  phoneNumber: formatPhoneNumber,
  truncateText,
  bookingStatus: formatBookingStatus,
  relativeTime: formatRelativeTime,
  
  // System info formatter
  systemInfo: () => ({
    currentUser: HOTEL_BOOKING_CONSTANTS.CURRENT_USER,
    currentDate: '2025-09-25',
    currentTime: '08:25:13',
    timestamp: '2025-09-25 08:25:13',
    timezone: 'UTC'
  })
};

export default hotelFormatters;
import { Hotel } from '../types/hotel.types';
import { Room } from '../types/room.types';

// Export to CSV with proper signature
export const exportToCSV = (data: any[], filename: string): string => {
  console.log(`📊 Exporting ${data.length} items to CSV:`, {
    filename,
    timestamp: '2025-09-25 08:38:18',
    user: 'NadPerz'
  });

  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvData = data.map(item => 
    headers.map(header => 
      typeof item[header] === 'string' ? `"${item[header]}"` : item[header]
    )
  );
  
  const csv = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
  console.log(`✅ CSV export completed: ${csv.length} characters`);
  return csv;
};

// Export to JSON with proper signature  
export const exportToJSON = (data: any[], pretty: boolean = true): string => {
  console.log(`📊 Exporting ${data.length} items to JSON:`, {
    pretty,
    timestamp: '2025-09-25 08:38:18',
    user: 'NadPerz'
  });
  
  return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
};

// Generate analytics export with single parameter
export const generateAnalyticsExport = (analytics: any): string => {
  console.log('📊 Generating analytics export:', {
    timestamp: '2025-09-25 08:38:18',
    user: 'NadPerz'
  });

  const summary = {
    exportDate: '2025-09-25 08:38:18',
    exportedBy: 'NadPerz',
    analytics: analytics || {
      totalRevenue: 0,
      totalBookings: 0,
      totalHotels: 0,
      totalRooms: 0
    },
    timestamp: '2025-09-25 08:38:18'
  };
  
  return JSON.stringify(summary, null, 2);
};

// Download CSV with proper signature
export const downloadCSV = (csvContent: string, filename: string): void => {
  console.log(`💾 Preparing CSV download:`, {
    filename,
    size: `${(csvContent.length / 1024).toFixed(2)}KB`,
    timestamp: '2025-09-25 08:38:18',
    user: 'NadPerz'
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_2025-09-25.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`✅ CSV download initiated: ${filename}_2025-09-25.csv`);
  }
};

// Export hotels to CSV
export const exportHotelsToCSV = (hotels: Hotel[]): string => {
  console.log(`📊 Exporting ${hotels.length} hotels to CSV`);
  
  const headers = [
    'Hotel ID', 'Hotel Name', 'Description', 'Country', 'State', 'City',
    'Location Description', 'Free WiFi', 'Free Parking', 'Gym', 'Spa',
    'Restaurant', 'Bar', 'Laundry', 'Shopping', 'Bike Rental', 
    'Movie Nights', 'Swimming Pool', 'Coffee Shop', 'Created Date', 'Updated Date'
  ];

  const csvData = hotels.map(hotel => [
    hotel.id, `"${hotel.title}"`, `"${hotel.description}"`,
    hotel.country, hotel.state, hotel.city, `"${hotel.locationDescription || ''}"`,
    hotel.freeWifi ? 'Yes' : 'No', hotel.freeParking ? 'Yes' : 'No',
    hotel.gym ? 'Yes' : 'No', hotel.spa ? 'Yes' : 'No',
    hotel.restaurant ? 'Yes' : 'No', hotel.bar ? 'Yes' : 'No',
    hotel.laundry ? 'Yes' : 'No', hotel.shopping ? 'Yes' : 'No',
    hotel.bikeRental ? 'Yes' : 'No', hotel.movieNights ? 'Yes' : 'No',
    hotel.swimmingPool ? 'Yes' : 'No', hotel.coffeeShop ? 'Yes' : 'No',
    hotel.createdAt ? new Date(hotel.createdAt).toLocaleDateString() : 'N/A',
    hotel.updatedAt ? new Date(hotel.updatedAt).toLocaleDateString() : 'N/A'
  ]);

  return [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
};

// Export rooms to CSV
export const exportRoomsToCSV = (rooms: Room[]): string => {
  console.log(`📊 Exporting ${rooms.length} rooms to CSV`);
  
  const headers = [
    'Room ID', 'Hotel ID', 'Room Title', 'Description', 'Guest Count',
    'Bed Count', 'Bathroom Count', 'King Beds', 'Queen Beds', 'Room Price',
    'Breakfast Price', 'Free WiFi', 'TV', 'Air Condition', 'Balcony',
    'Room Service', 'Sound Proofed', 'City View', 'Ocean View',
    'Forest View', 'Mountain View', 'Created Date', 'Updated Date'
  ];

  const csvData = rooms.map(room => [
    room.id, room.hotelId, `"${room.title}"`, `"${room.description}"`,
    room.guestCount, room.bedCount, room.bathroomCount, room.kingBed, room.queenBed,
    room.roomPrice, room.breakfastPrice,
    room.freeWifi ? 'Yes' : 'No', room.tv ? 'Yes' : 'No',
    room.airCondition ? 'Yes' : 'No', room.balcony ? 'Yes' : 'No',
    room.roomService ? 'Yes' : 'No', room.soundProofed ? 'Yes' : 'No',
    room.cityView ? 'Yes' : 'No', room.oceanView ? 'Yes' : 'No',
    room.forestView ? 'Yes' : 'No', room.mountainView ? 'Yes' : 'No',
    room.createdAt ? new Date(room.createdAt).toLocaleDateString() : 'N/A',
    room.updatedAt ? new Date(room.updatedAt).toLocaleDateString() : 'N/A'
  ]);

  return [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
};

export const hotelExportUtils = {
  exportHotelsToCSV,
  exportRoomsToCSV,
  exportToCSV,
  exportToJSON,
  generateAnalyticsExport,
  downloadCSV,
  
  exportHotelsWithRooms: (hotels: Hotel[], rooms: Room[]) => {
    const hotelCsv = exportHotelsToCSV(hotels);
    const roomCsv = exportRoomsToCSV(rooms);
    return { hotelCsv, roomCsv };
  },
  
  generateExportSummary: (hotels: Hotel[], rooms: Room[]) => {
    return {
      exportDate: '2025-09-25 08:38:18',
      exportedBy: 'NadPerz',
      totalHotels: hotels.length,
      totalRooms: rooms.length,
      hotelsWithRooms: hotels.filter(h => rooms.some(r => r.hotelId === h.id)).length,
      avgRoomsPerHotel: rooms.length / hotels.length || 0,
      countries: [...new Set(hotels.map(h => h.country))].length,
      cities: [...new Set(hotels.map(h => h.city))].length
    };
  }
};

export default hotelExportUtils;
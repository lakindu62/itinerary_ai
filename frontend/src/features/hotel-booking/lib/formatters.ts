export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatDateRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return `${formatDate(startDate)} - ${formatDate(endDate)} (${nights} nights)`;
};

export const formatBookingId = (id: string): string => {
  return `#${id.slice(-8).toUpperCase()}`;
};

export const formatRoomType = (room: any): string => {
  const beds = [];
  if (room.kingBed > 0) beds.push(`${room.kingBed} King`);
  if (room.queenBed > 0) beds.push(`${room.queenBed} Queen`);
  return beds.join(', ') || 'Standard Bed';
};
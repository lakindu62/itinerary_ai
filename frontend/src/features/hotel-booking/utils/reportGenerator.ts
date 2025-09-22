import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDFReport = async (analytics: any, bookings: any[]) => {
  const pdf = new jsPDF();
  
  // Add title
  pdf.setFontSize(20);
  pdf.text('Hotel Booking Report', 20, 20);
  
  // Add date
  pdf.setFontSize(12);
  pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
  
  // Add statistics
  pdf.setFontSize(14);
  pdf.text('Summary Statistics:', 20, 55);
  
  pdf.setFontSize(12);
  pdf.text(`Total Bookings: ${bookings.length}`, 20, 70);
  pdf.text(`Total Revenue: $${analytics.totalRevenue}`, 20, 80);
  pdf.text(`Occupancy Rate: ${analytics.occupancyRate}%`, 20, 90);
  
  // Add bookings list
  let yPosition = 110;
  pdf.setFontSize(14);
  pdf.text('Recent Bookings:', 20, yPosition);
  
  yPosition += 15;
  pdf.setFontSize(10);
  bookings.slice(0, 10).forEach((booking, index) => {
    pdf.text(
      `${index + 1}. ${booking.id} - $${booking.totalPrice} (${new Date(booking.startDate).toLocaleDateString()})`,
      20,
      yPosition
    );
    yPosition += 10;
  });
  
  // Save the PDF
  pdf.save('hotel-booking-report.pdf');
};

export const generateCSVReport = async (bookings: any[]) => {
  const headers = [
    'Booking ID',
    'Room ID',
    'Hotel ID',
    'Start Date',
    'End Date',
    'Total Price',
    'Payment Status',
    'Booking Date'
  ];
  
  const csvContent = [
    headers.join(','),
    ...bookings.map(booking => [
      booking.id,
      booking.roomId,
      booking.hotelId,
      booking.startDate,
      booking.endDate,
      booking.totalPrice,
      booking.paymentStatus ? 'Paid' : 'Pending',
      booking.bookedAt
    ].join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'hotel-bookings.csv';
  a.click();
  window.URL.revokeObjectURL(url);
};
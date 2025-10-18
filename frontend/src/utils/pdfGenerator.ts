import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface DashboardAnalytics {
  user: string;
  timestamp: string;
  totalHotels: number;
  totalRooms: number;
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  stripeRevenue: number;
  avgRating: number;
  conversionRate: string;
  hotels?: Array<{
    id: string;
    title: string;
    city: string;
    country: string;
  }>;
}

export interface BusinessDashboardAnalytics {
  user: string;
  timestamp: string;
  businessProfile: {
    businessName: string;
    menuItems: number;
    sliderImages: number;
    posts: number;
    reels: number;
    ratings: number;
    reviews: number;
    pendingRatings: number;
  };
  avgRating: number;
}

export class DashboardPDFGenerator {
  private pdf: jsPDF;
  private currentY: number = 20;
  private pageHeight: number;
  private pageWidth: number;
  private margin: number = 20;

  constructor() {
    this.pdf = new jsPDF('portrait', 'mm', 'a4');
    this.pageHeight = this.pdf.internal.pageSize.getHeight();
    this.pageWidth = this.pdf.internal.pageSize.getWidth();
  }

  private addHeader(data: DashboardAnalytics): void {
    // Company logo/title
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(24);
    this.pdf.setTextColor(37, 99, 235); // Blue color
    this.pdf.text('Itinerary AI', this.margin, this.currentY);
    
    this.currentY += 8;
    this.pdf.setFontSize(18);
    this.pdf.setTextColor(75, 85, 99); // Gray color
    this.pdf.text('Hotel Dashboard Analytics Report', this.margin, this.currentY);
    
    // User and date info
    this.currentY += 15;
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(12);
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text(`Generated for: ${data.user}`, this.margin, this.currentY);
    this.currentY += 6;
    this.pdf.text(`Date: ${new Date(data.timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, this.margin, this.currentY);
    
    // Add separator line
    this.currentY += 10;
    this.pdf.setDrawColor(229, 231, 235);
    this.pdf.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.currentY += 15;
  }

  private addAnalyticsOverview(data: DashboardAnalytics): void {
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(16);
    this.pdf.setTextColor(17, 24, 39);
    this.pdf.text('Analytics Overview', this.margin, this.currentY);
    this.currentY += 12;

    // Create metrics grid
    const metrics = [
      { label: 'Total Hotels', value: data.totalHotels.toString(), color: [147, 51, 234] },
      { label: 'Total Rooms', value: data.totalRooms.toString(), color: [37, 99, 235] },
      { label: 'Total Bookings', value: data.totalBookings.toString(), color: [16, 185, 129] },
      { label: 'Stripe Revenue', value: `$${data.stripeRevenue}`, color: [34, 197, 94] }
    ];

    const secondRowMetrics = [
      { label: 'Confirmed Bookings', value: data.confirmedBookings.toString(), color: [34, 197, 94] },
      { label: 'Pending Bookings', value: data.pendingBookings.toString(), color: [251, 146, 60] },
      { label: 'Average Rating', value: `${data.avgRating} ⭐`, color: [251, 191, 36] },
      { label: 'Conversion Rate', value: data.conversionRate, color: [168, 85, 247] }
    ];

    // First row of metrics
    this.addMetricsRow(metrics);
    this.currentY += 25;
    
    // Second row of metrics
    this.addMetricsRow(secondRowMetrics);
    this.currentY += 20;
  }

  private addMetricsRow(metrics: Array<{label: string, value: string, color: number[]}>): void {
    const cardWidth = (this.pageWidth - 2 * this.margin - 15) / 4;
    const cardHeight = 20;

    metrics.forEach((metric, index) => {
      const x = this.margin + index * (cardWidth + 5);
      
      // Draw card background
      this.pdf.setFillColor(248, 250, 252);
      this.pdf.rect(x, this.currentY - 15, cardWidth, cardHeight, 'F');
      
      // Draw border
      this.pdf.setDrawColor(226, 232, 240);
      this.pdf.rect(x, this.currentY - 15, cardWidth, cardHeight);
      
      // Add metric label
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setFontSize(9);
      this.pdf.setTextColor(100, 116, 139);
      this.pdf.text(metric.label, x + 2, this.currentY - 10);
      
      // Add metric value
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setFontSize(14);
      this.pdf.setTextColor(metric.color[0], metric.color[1], metric.color[2]);
      this.pdf.text(metric.value, x + 2, this.currentY - 2);
    });
  }

  private addHotelsSection(data: DashboardAnalytics): void {
    if (!data.hotels || data.hotels.length === 0) {
      return;
    }

    this.currentY += 15;
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(16);
    this.pdf.setTextColor(17, 24, 39);
    this.pdf.text('Hotel Properties', this.margin, this.currentY);
    this.currentY += 12;

    // Table headers
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(10);
    this.pdf.setTextColor(75, 85, 99);
    
    const tableX = this.margin;
    const nameColWidth = 80;
    const locationColWidth = 60;
    const statusColWidth = 30;

    // Header background
    this.pdf.setFillColor(249, 250, 251);
    this.pdf.rect(tableX, this.currentY - 5, nameColWidth + locationColWidth + statusColWidth, 8, 'F');
    
    this.pdf.text('Hotel Name', tableX + 2, this.currentY);
    this.pdf.text('Location', tableX + nameColWidth + 2, this.currentY);
    this.pdf.text('Status', tableX + nameColWidth + locationColWidth + 2, this.currentY);
    
    this.currentY += 10;

    // Table rows
    data.hotels.slice(0, 10).forEach((hotel, index) => {
      if (this.currentY > this.pageHeight - 30) {
        this.pdf.addPage();
        this.currentY = 20;
      }

      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setFontSize(9);
      this.pdf.setTextColor(17, 24, 39);
      
      // Alternate row background
      if (index % 2 === 0) {
        this.pdf.setFillColor(249, 250, 251);
        this.pdf.rect(tableX, this.currentY - 4, nameColWidth + locationColWidth + statusColWidth, 6, 'F');
      }
      
      // Truncate long hotel names
      const hotelName = hotel.title.length > 35 ? hotel.title.substring(0, 32) + '...' : hotel.title;
      this.pdf.text(hotelName, tableX + 2, this.currentY);
      this.pdf.text(`${hotel.city}, ${hotel.country}`, tableX + nameColWidth + 2, this.currentY);
      
      // Status badge
      this.pdf.setFillColor(34, 197, 94);
      this.pdf.rect(tableX + nameColWidth + locationColWidth + 2, this.currentY - 3, 20, 4, 'F');
      this.pdf.setTextColor(255, 255, 255);
      this.pdf.setFontSize(8);
      this.pdf.text('Active', tableX + nameColWidth + locationColWidth + 4, this.currentY);
      
      this.currentY += 8;
    });

    if (data.hotels.length > 10) {
      this.currentY += 5;
      this.pdf.setFont('helvetica', 'italic');
      this.pdf.setFontSize(9);
      this.pdf.setTextColor(107, 114, 128);
      this.pdf.text(`... and ${data.hotels.length - 10} more hotels`, tableX + 2, this.currentY);
    }
  }

  private addSummarySection(data: DashboardAnalytics): void {
    this.currentY += 20;
    
    // Check if we need a new page
    if (this.currentY > this.pageHeight - 60) {
      this.pdf.addPage();
      this.currentY = 20;
    }

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(16);
    this.pdf.setTextColor(17, 24, 39);
    this.pdf.text('Executive Summary', this.margin, this.currentY);
    this.currentY += 12;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(11);
    this.pdf.setTextColor(55, 65, 81);
    
    const summaryText = [
      `• Portfolio consists of ${data.totalHotels} active hotel properties with ${data.totalRooms} total rooms`,
      `• Generated $${data.stripeRevenue} in confirmed Stripe revenue from ${data.confirmedBookings} bookings`,
      `• Maintaining an average rating of ${data.avgRating} stars across all properties`,
      `• Current conversion rate stands at ${data.conversionRate}`,
      `• ${data.pendingBookings} bookings are currently pending payment confirmation`
    ];

    summaryText.forEach(text => {
      this.pdf.text(text, this.margin, this.currentY);
      this.currentY += 7;
    });
  }

  private addFooter(): void {
    const footerY = this.pageHeight - 15;
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(8);
    this.pdf.setTextColor(156, 163, 175);
    
    this.pdf.text('Generated by Itinerary AI Dashboard', this.margin, footerY);
    this.pdf.text(
      `Page ${this.pdf.getNumberOfPages()}`,
      this.pageWidth - this.margin - 20,
      footerY
    );
    
    // Add generation timestamp
    this.pdf.text(
      `Generated on ${new Date().toISOString()}`,
      this.margin,
      footerY + 4
    );
  }

  public async generatePDF(data: DashboardAnalytics): Promise<void> {
    try {
      // Reset position
      this.currentY = 20;
      
      // Add all sections
      this.addHeader(data);
      this.addAnalyticsOverview(data);
      this.addHotelsSection(data);
      this.addSummarySection(data);
      this.addFooter();
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
      const filename = `dashboard-analytics-${data.user}-${timestamp}.pdf`;
      
      // Save the PDF
      this.pdf.save(filename);
      
      console.log(`✅ PDF generated successfully: ${filename}`);
    } catch (error) {
      console.error('❌ Error generating PDF:', error);
      throw new Error('Failed to generate PDF report');
    }
  }

  public async generateWithScreenshot(elementId: string, data: DashboardAnalytics): Promise<void> {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        console.warn('Element not found, generating PDF without screenshot');
        return this.generatePDF(data);
      }

      // Capture screenshot with better CSS handling
      const canvas = await html2canvas(element, {
        scale: 1.5, // Reduced scale to prevent memory issues
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        ignoreElements: (element) => {
          // Ignore elements that might cause CSS parsing issues
          return element.classList.contains('ignore-in-pdf') || 
                 element.tagName === 'SCRIPT' ||
                 element.tagName === 'STYLE';
        },
        onclone: (clonedDoc) => {
          // Add PDF-safe class to body to override problematic colors
          clonedDoc.body.classList.add('pdf-safe');
          
          // Remove problematic CSS that might contain lab() or oklch() functions
          const styles = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
          styles.forEach(style => {
            if (style.textContent) {
              // Replace problematic color functions with safe alternatives
              style.textContent = style.textContent
                .replace(/lab\([^)]*\)/g, '#000000')
                .replace(/oklch\([^)]*\)/g, '#000000')
                .replace(/lch\([^)]*\)/g, '#000000');
            }
          });
        }
      });

      // Reset and add header
      this.currentY = 20;
      this.addHeader(data);

      // Add screenshot section with better layout
      this.currentY += 10;
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setFontSize(14);
      this.pdf.setTextColor(17, 24, 39);
      this.pdf.text('Dashboard Visual Overview', this.margin, this.currentY);
      this.currentY += 8;

      // Add description
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setFontSize(10);
      this.pdf.setTextColor(107, 114, 128);
      this.pdf.text('Screenshot of your live hotel dashboard', this.margin, this.currentY);
      this.currentY += 12;

      const imgData = canvas.toDataURL('image/png');
      const maxImgWidth = this.pageWidth - 2 * this.margin;
      const aspectRatio = canvas.height / canvas.width;
      const imgWidth = Math.min(maxImgWidth, 160); // Limit width
      const imgHeight = imgWidth * aspectRatio;

      // Check if image fits on current page
      if (this.currentY + imgHeight > this.pageHeight - 30) {
        this.pdf.addPage();
        this.currentY = 20;
        // Re-add section header on new page
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setFontSize(14);
        this.pdf.setTextColor(17, 24, 39);
        this.pdf.text('Dashboard Visual Overview', this.margin, this.currentY);
        this.currentY += 12;
      }

      // Add image with border
      this.pdf.setDrawColor(226, 232, 240);
      this.pdf.rect(this.margin - 1, this.currentY - 1, imgWidth + 2, imgHeight + 2);
      this.pdf.addImage(imgData, 'PNG', this.margin, this.currentY, imgWidth, imgHeight);
      this.currentY += imgHeight + 20;

      // Add page break before analytics sections
      this.pdf.addPage();
      this.currentY = 20;

      // Add remaining sections
      this.addAnalyticsOverview(data);
      this.addHotelsSection(data);
      this.addSummarySection(data);
      this.addFooter();

      // Generate filename
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
      const filename = `dashboard-analytics-with-screenshot-${data.user}-${timestamp}.pdf`;
      
      this.pdf.save(filename);
      console.log(`✅ PDF with screenshot generated successfully: ${filename}`);
    } catch (error) {
      console.error('❌ Error generating PDF with screenshot:', error);
      console.warn('Falling back to PDF without screenshot...');
      // Fallback to basic PDF
      return this.generatePDF(data);
    }
  }
}

// Utility function to export dashboard analytics
export const downloadDashboardPDF = async (
  analyticsData: DashboardAnalytics,
  includeScreenshot: boolean = false,
  elementId: string = 'dashboard-overview'
): Promise<void> => {
  const generator = new DashboardPDFGenerator();
  
  if (includeScreenshot) {
    await generator.generateWithScreenshot(elementId, analyticsData);
  } else {
    await generator.generatePDF(analyticsData);
  }
};
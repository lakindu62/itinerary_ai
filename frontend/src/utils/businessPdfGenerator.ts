import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

export class BusinessDashboardPDFGenerator {
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

  private addHeader(data: BusinessDashboardAnalytics): void {
    // Company logo/title
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(24);
    this.pdf.setTextColor(37, 99, 235); // Blue color
    this.pdf.text('Itinerary AI', this.margin, this.currentY);
    
    this.currentY += 8;
    this.pdf.setFontSize(18);
    this.pdf.setTextColor(75, 85, 99); // Gray color
    this.pdf.text('Business Dashboard Analytics Report', this.margin, this.currentY);
    
    // User and date info
    this.currentY += 15;
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(12);
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text(`Generated for: ${data.user}`, this.margin, this.currentY);
    this.currentY += 6;
    this.pdf.text(`Business: ${data.businessProfile.businessName}`, this.margin, this.currentY);
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

  private addBusinessOverview(data: BusinessDashboardAnalytics): void {
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(16);
    this.pdf.setTextColor(17, 24, 39);
    this.pdf.text('Business Overview', this.margin, this.currentY);
    this.currentY += 12;

    // Create business metrics grid
    const businessMetrics = [
      { label: 'Menu Items', value: data.businessProfile.menuItems.toString(), color: [37, 99, 235] },
      { label: 'Slider Images', value: data.businessProfile.sliderImages.toString(), color: [147, 51, 234] },
      { label: 'Posts', value: data.businessProfile.posts.toString(), color: [16, 185, 129] },
      { label: 'Reels', value: data.businessProfile.reels.toString(), color: [251, 146, 60] }
    ];

    const secondRowMetrics = [
      { label: 'Total Ratings', value: data.businessProfile.ratings.toString(), color: [251, 191, 36] },
      { label: 'Pending Ratings', value: data.businessProfile.pendingRatings.toString(), color: [239, 68, 68] },
      { label: 'Reviews', value: data.businessProfile.reviews.toString(), color: [34, 197, 94] },
      { label: 'Average Rating', value: `${data.avgRating.toFixed(1)} ⭐`, color: [251, 191, 36] }
    ];

    // First row of metrics
    this.addMetricsRow(businessMetrics);
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

  private addContentBreakdown(data: BusinessDashboardAnalytics): void {
    this.currentY += 15;
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(16);
    this.pdf.setTextColor(17, 24, 39);
    this.pdf.text('Content Breakdown', this.margin, this.currentY);
    this.currentY += 12;

    // Content details
    const contentItems = [
      { type: 'Menu Items', count: data.businessProfile.menuItems, description: 'Food and beverage options available' },
      { type: 'Slider Images', count: data.businessProfile.sliderImages, description: 'Promotional images showcasing your business' },
      { type: 'Posts', count: data.businessProfile.posts, description: 'Social media posts and updates' },
      { type: 'Reels', count: data.businessProfile.reels, description: 'Video content and promotional reels' },
      { type: 'Customer Reviews', count: data.businessProfile.ratings, description: 'Total customer feedback received' }
    ];

    contentItems.forEach((item, index) => {
      if (this.currentY > this.pageHeight - 30) {
        this.pdf.addPage();
        this.currentY = 20;
      }

      // Content type header
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setFontSize(12);
      this.pdf.setTextColor(17, 24, 39);
      this.pdf.text(`${item.type}: ${item.count}`, this.margin, this.currentY);
      
      // Description
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setFontSize(10);
      this.pdf.setTextColor(107, 114, 128);
      this.pdf.text(item.description, this.margin + 5, this.currentY + 5);
      
      this.currentY += 15;
    });
  }

  private addBusinessSummary(data: BusinessDashboardAnalytics): void {
    this.currentY += 20;
    
    // Check if we need a new page
    if (this.currentY > this.pageHeight - 80) {
      this.pdf.addPage();
      this.currentY = 20;
    }

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(16);
    this.pdf.setTextColor(17, 24, 39);
    this.pdf.text('Business Summary', this.margin, this.currentY);
    this.currentY += 12;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(11);
    this.pdf.setTextColor(55, 65, 81);
    
    const summaryText = [
      `• Business "${data.businessProfile.businessName}" content overview`,
      `• ${data.businessProfile.menuItems} menu items available for customers`,
      `• ${data.businessProfile.sliderImages} promotional images in slider gallery`,
      `• ${data.businessProfile.posts} posts and ${data.businessProfile.reels} reels created`,
      `• Maintaining an average rating of ${data.avgRating.toFixed(1)} stars from ${data.businessProfile.ratings} total ratings`,
      `• ${data.businessProfile.pendingRatings} ratings pending approval`
    ];

    summaryText.forEach(text => {
      this.pdf.text(text, this.margin, this.currentY);
      this.currentY += 7;
    });

    // Performance insights
    this.currentY += 10;
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(14);
    this.pdf.text('Performance Insights', this.margin, this.currentY);
    this.currentY += 8;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(10);
    this.pdf.setTextColor(107, 114, 128);
    
    const insights = [];
    
    if (data.businessProfile.pendingRatings > 0) {
      insights.push(`• You have ${data.businessProfile.pendingRatings} ratings awaiting approval`);
    }
    
    if (data.avgRating >= 4.0) {
      insights.push('• Excellent customer satisfaction with high ratings');
    } else if (data.avgRating >= 3.0) {
      insights.push('• Good customer feedback, room for improvement');
    } else {
      insights.push('• Consider focusing on customer experience improvements');
    }
    
    if (data.businessProfile.posts < 5) {
      insights.push('• Consider creating more posts to increase engagement');
    }
    
    if (data.businessProfile.menuItems < 10) {
      insights.push('• Expand your menu offerings to attract more customers');
    }

    insights.forEach(insight => {
      this.pdf.text(insight, this.margin, this.currentY);
      this.currentY += 6;
    });
  }

  private addFooter(): void {
    const footerY = this.pageHeight - 15;
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(8);
    this.pdf.setTextColor(156, 163, 175);
    
    this.pdf.text('Generated by Itinerary AI Business Dashboard', this.margin, footerY);
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

  public async generatePDF(data: BusinessDashboardAnalytics): Promise<void> {
    try {
      // Reset position
      this.currentY = 20;
      
      // Add all sections
      this.addHeader(data);
      this.addBusinessOverview(data);
      this.addContentBreakdown(data);
      this.addBusinessSummary(data);
      this.addFooter();
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
      const filename = `business-dashboard-${data.user}-${timestamp}.pdf`;
      
      // Save the PDF
      this.pdf.save(filename);
      
      console.log(`✅ Business PDF generated successfully: ${filename}`);
    } catch (error) {
      console.error('❌ Error generating business PDF:', error);
      throw new Error('Failed to generate business PDF report');
    }
  }

  public async generateWithScreenshot(elementId: string, data: BusinessDashboardAnalytics): Promise<void> {
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
      this.pdf.text('Screenshot of your live business dashboard', this.margin, this.currentY);
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
      this.addBusinessOverview(data);
      this.addContentBreakdown(data);
      this.addBusinessSummary(data);
      this.addFooter();

      // Generate filename
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
      const filename = `business-dashboard-with-screenshot-${data.user}-${timestamp}.pdf`;
      
      this.pdf.save(filename);
      console.log(`✅ Business PDF with screenshot generated successfully: ${filename}`);
    } catch (error) {
      console.error('❌ Error generating business PDF with screenshot:', error);
      console.warn('Falling back to PDF without screenshot...');
      // Fallback to basic PDF
      return this.generatePDF(data);
    }
  }
}

// Utility function to export business dashboard analytics
export const downloadBusinessDashboardPDF = async (
  analyticsData: BusinessDashboardAnalytics,
  includeScreenshot: boolean = false,
  elementId: string = 'business-dashboard-overview'
): Promise<void> => {
  const generator = new BusinessDashboardPDFGenerator();
  
  if (includeScreenshot) {
    await generator.generateWithScreenshot(elementId, analyticsData);
  } else {
    await generator.generatePDF(analyticsData);
  }
};
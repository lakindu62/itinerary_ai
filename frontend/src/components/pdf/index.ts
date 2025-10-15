/**
 * PDF Components
 *
 * Reusable UI components for PDF generation and download.
 *
 * @example
 * ```tsx
 * import { PdfDownloadButton, BasePdfTemplate } from '@/components/pdf';
 *
 * const data = { title: 'Report', content: '...' };
 *
 * <PdfDownloadButton
 *   document={<BasePdfTemplate data={data} />}
 *   fileName="my-report"
 * />
 * ```
 */

// Export UI components
export { PdfDownloadButton } from "./PdfDownloadButton";
export { AsyncPdfDownloadButton } from "./AsyncPdfDownloadButton";

// Export templates
export { BasePdfTemplate } from "./templates/BasePdfTemplate";
export { PostPDFTemplate } from "./templates/PostPDFTemplate";
export type { PostPDFData, ProcessedMedia } from "./templates/PostPDFTemplate";

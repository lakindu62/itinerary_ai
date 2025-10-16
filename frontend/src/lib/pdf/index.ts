/**
 * PDF Generation Infrastructure
 *
 * This module provides utilities and services for generating PDFs
 * using @react-pdf/renderer in Next.js applications.
 *
 * @example
 * ```tsx
 * import { generatePdf, commonStyles } from '@/lib/pdf';
 * import { Document, Page, Text } from '@react-pdf/renderer';
 *
 * const MyDoc = () => (
 *   <Document>
 *     <Page style={commonStyles.page}>
 *       <Text style={commonStyles.heading}>Hello PDF!</Text>
 *     </Page>
 *   </Document>
 * );
 *
 * await generatePdf(<MyDoc />, { fileName: 'my-document' });
 * ```
 */

// Export types
export type {
  PdfGenerationOptions,
  PdfDocumentProps,
  PdfGenerationResult,
} from "./pdf.types";

// Export services
export { generatePdf, generatePdfBlob } from "./pdf.service";

// Export styles
export { commonStyles, combineStyles } from "./pdf.styles";

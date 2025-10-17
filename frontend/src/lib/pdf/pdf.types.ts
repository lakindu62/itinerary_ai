import { ReactElement } from "react";

/**
 * Options for PDF generation
 */
export interface PdfGenerationOptions {
  /** The filename for the downloaded PDF (without .pdf extension) */
  fileName: string;

  /** Optional: API endpoint to fetch data before generating PDF */
  apiEndpoint?: string;

  /** Optional: Request options for API call */
  apiOptions?: RequestInit;

  /** Optional: Transform function to process API response data */
  dataTransformer?: (data: any) => any;

  /** Optional: Callback when PDF generation starts */
  onStart?: () => void;

  /** Optional: Callback when PDF generation succeeds */
  onSuccess?: () => void;

  /** Optional: Callback when PDF generation fails */
  onError?: (error: Error) => void;
}

/**
 * Props for PDF document components
 */
export interface PdfDocumentProps<T = any> {
  /** Data to render in the PDF */
  data: T;

  /** Optional: Additional metadata */
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
  };
}

/**
 * PDF generation result
 */
export interface PdfGenerationResult {
  success: boolean;
  blob?: Blob;
  error?: Error;
}

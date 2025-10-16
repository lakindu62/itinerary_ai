import { pdf, DocumentProps } from "@react-pdf/renderer";
import { ReactElement } from "react";
import { PdfGenerationOptions, PdfGenerationResult } from "./pdf.types";

/**
 * Core PDF generation service
 *
 * @example
 * ```tsx
 * import { generatePdf } from '@/lib/pdf';
 * import { MyPdfDocument } from '@/components/pdf/templates/MyPdfDocument';
 *
 * const data = { title: 'My Report', items: [...] };
 *
 * await generatePdf(
 *   <MyPdfDocument data={data} />,
 *   { fileName: 'report' }
 * );
 * ```
 */
export async function generatePdf(
  /** The react-pdf Document component to render */
  documentComponent: ReactElement<DocumentProps>,
  /** Generation options */
  options: PdfGenerationOptions
): Promise<PdfGenerationResult> {
  try {
    options.onStart?.();

    let data = null;

    // Fetch data from API if endpoint provided
    if (options.apiEndpoint) {
      const response = await fetch(options.apiEndpoint, options.apiOptions);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      data = await response.json();

      // Transform data if transformer provided
      if (options.dataTransformer) {
        data = options.dataTransformer(data);
      }
    }

    // Generate PDF blob from the document component
    const blob = await pdf(documentComponent).toBlob();

    // Trigger download
    downloadBlob(blob, `${options.fileName}.pdf`);

    options.onSuccess?.();

    return { success: true, blob };
  } catch (error) {
    const err =
      error instanceof Error ? error : new Error("PDF generation failed");
    options.onError?.(err);
    return { success: false, error: err };
  }
}

/**
 * Helper function to download a blob as a file
 */
function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate PDF and return blob without downloading
 * Useful for preview or custom handling
 */
export async function generatePdfBlob(
  documentComponent: ReactElement<DocumentProps>
): Promise<Blob> {
  return await pdf(documentComponent).toBlob();
}

"use client";

import { useState, ReactNode } from "react";
import { DocumentProps } from "@react-pdf/renderer";
import { ReactElement } from "react";
import { generatePdf } from "@/lib/pdf";
import { Button } from "@/components/ui/button";

interface AsyncPdfDownloadButtonProps {
  /** Function that prepares and returns the PDF document (can be async) */
  preparePdfDocument: () =>
    | Promise<ReactElement<DocumentProps>>
    | ReactElement<DocumentProps>;

  /** Filename for the downloaded PDF (without .pdf extension) */
  fileName: string;

  /** Optional: Button text or icon */
  buttonText?: ReactNode;

  /** Optional: Loading text or icon */
  loadingText?: ReactNode;

  /** Optional: Button variant */
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";

  /** Optional: Button size */
  size?: "default" | "sm" | "lg" | "icon";

  /** Optional: Custom className */
  className?: string;

  /** Optional: Callback when preparation starts */
  onPrepareStart?: () => void;

  /** Optional: Callback when download starts */
  onDownloadStart?: () => void;

  /** Optional: Callback when download succeeds */
  onDownloadSuccess?: () => void;

  /** Optional: Callback when download fails */
  onDownloadError?: (error: Error) => void;
}

/**
 * Async PDF Download Button Component
 *
 * A reusable button that handles async data preparation before PDF generation.
 * Perfect for scenarios where you need to fetch data (e.g., signed URLs) before creating the PDF.
 *
 * @example
 * ```tsx
 * import { AsyncPdfDownloadButton } from '@/components/pdf';
 * import { MyPdfTemplate } from '@/components/pdf/templates/MyPdfTemplate';
 *
 * <AsyncPdfDownloadButton
 *   preparePdfDocument={async () => {
 *     const data = await fetchDataFromAPI();
 *     return <MyPdfTemplate data={data} />;
 *   }}
 *   fileName="my-report"
 *   buttonText={<DownloadIcon />}
 * />
 * ```
 */
export const AsyncPdfDownloadButton: React.FC<AsyncPdfDownloadButtonProps> = ({
  preparePdfDocument,
  fileName,
  buttonText = "Download PDF",
  loadingText = "Preparing...",
  variant = "default",
  size = "default",
  className,
  onPrepareStart,
  onDownloadStart,
  onDownloadSuccess,
  onDownloadError,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Step 1: Prepare the document (async data fetching)
      onPrepareStart?.();
      const document = await preparePdfDocument();

      // Step 2: Generate and download the PDF
      onDownloadStart?.();
      await generatePdf(document, {
        fileName,
        onSuccess: () => {
          setIsProcessing(false);
          onDownloadSuccess?.();
        },
        onError: (err) => {
          setError(err.message);
          setIsProcessing(false);
          onDownloadError?.(err);
        },
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate PDF";
      setError(errorMessage);
      setIsProcessing(false);
      onDownloadError?.(err instanceof Error ? err : new Error(errorMessage));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleDownload}
        disabled={isProcessing}
        variant={variant}
        size={size}
        className={className}
      >
        {isProcessing ? loadingText : buttonText}
      </Button>

      {error && <p className="text-sm text-red-600">Error: {error}</p>}
    </div>
  );
};

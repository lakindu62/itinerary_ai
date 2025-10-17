"use client";

import { ReactNode, useState } from "react";
import { DocumentProps } from "@react-pdf/renderer";
import { ReactElement } from "react";
import { generatePdf } from "@/lib/pdf";
import { Button } from "@/components/ui/button";

interface PdfDownloadButtonProps {
  /** The PDF document component to generate OR a function that returns it */
  document: ReactElement<DocumentProps> | (() => Promise<ReactElement<DocumentProps>>);

  /** Filename for the downloaded PDF (without .pdf extension) */
  fileName: string;

  /** Optional: Button text */
  buttonDisplay?: ReactNode;

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

  /** Optional: Callback when download starts (before document preparation) */
  onDownloadStart?: () => void;

  /** Optional: Callback when download succeeds */
  onDownloadSuccess?: () => void;

  /** Optional: Callback when download fails */
  onDownloadError?: (error: Error) => void;
}

/**
 * PDF Download Button Component
 *
 * A reusable button component that generates and downloads PDFs.
 * Handles loading states and errors automatically.
 * Supports async document preparation for cases where data needs to be fetched first.
 *
 * @example
 * Basic usage:
 * ```tsx
 * import { PdfDownloadButton } from '@/components/pdf';
 * import { MyPdfTemplate } from '@/components/pdf/templates/MyPdfTemplate';
 *
 * <PdfDownloadButton
 *   document={<MyPdfTemplate data={data} />}
 *   fileName="my-report"
 *   buttonText="Download Report"
 * />
 * ```
 * 
 * @example
 * With async data preparation:
 * ```tsx
 * <PdfDownloadButton
 *   document={async () => {
 *     const processedData = await fetchAndProcessData();
 *     return <MyPdfTemplate data={processedData} />;
 *   }}
 *   fileName="my-report"
 *   buttonText="Download Report"
 * />
 * ```
 */
export const PdfDownloadButton: React.FC<PdfDownloadButtonProps> = ({
  document,
  fileName,
  buttonDisplay = "Download PDF",
  variant = "default",
  size = "default",
  className,
  onDownloadStart,
  onDownloadSuccess,
  onDownloadError,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      onDownloadStart?.();

      // Check if document is a function (async preparation needed)
      const documentToGenerate = typeof document === 'function' 
        ? await document() 
        : document;

      await generatePdf(documentToGenerate, {
        fileName,
        onSuccess: () => {
          setIsGenerating(false);
          onDownloadSuccess?.();
        },
        onError: (err) => {
          setError(err.message);
          setIsGenerating(false);
          onDownloadError?.(err);
        },
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate PDF";
      setError(errorMessage);
      setIsGenerating(false);
      onDownloadError?.(err instanceof Error ? err : new Error(errorMessage));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleDownload}
        disabled={isGenerating}
        variant={variant}
        size={size}
        className={className}
      >
        {isGenerating ? "Generating PDF..." : buttonDisplay}
      </Button>

      {error && <p className="text-sm text-red-600">Error: {error}</p>}
    </div>
  );
};

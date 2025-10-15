"use client";

import { useState } from "react";
import { DocumentProps } from "@react-pdf/renderer";
import { ReactElement } from "react";
import { generatePdf } from "@/lib/pdf";
import { Button } from "@/components/ui/button";

interface PdfDownloadButtonProps {
  /** The PDF document component to generate */
  document: ReactElement<DocumentProps>;

  /** Filename for the downloaded PDF (without .pdf extension) */
  fileName: string;

  /** Optional: Button text */
  buttonText?: string;

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

  /** Optional: Callback when download starts */
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
 *
 * @example
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
 */
export const PdfDownloadButton: React.FC<PdfDownloadButtonProps> = ({
  document,
  fileName,
  buttonText = "Download PDF",
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

      await generatePdf(document, {
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
        {isGenerating ? "Generating PDF..." : buttonText}
      </Button>

      {error && <p className="text-sm text-red-600">Error: {error}</p>}
    </div>
  );
};

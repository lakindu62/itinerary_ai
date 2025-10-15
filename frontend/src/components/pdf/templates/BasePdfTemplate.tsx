import { Document, Page, Text, View } from "@react-pdf/renderer";
import { PdfDocumentProps, commonStyles } from "@/lib/pdf";

/**
 * Base PDF Template
 *
 * This is an example template showing how to create PDF documents.
 * Developers can use this as a starting point for their own PDF templates.
 *
 * @example
 * ```tsx
 * import { generatePdf } from '@/lib/pdf';
 * import { BasePdfTemplate } from '@/components/pdf/templates/BasePdfTemplate';
 *
 * const data = {
 *   title: 'My Report',
 *   date: '2025-10-15',
 *   content: 'Report content here...'
 * };
 *
 * await generatePdf(
 *   <BasePdfTemplate data={data} />,
 *   { fileName: 'my-report' }
 * );
 * ```
 */

interface BaseTemplateData {
  title: string;
  date?: string;
  content: string;
  sections?: Array<{
    heading: string;
    text: string;
  }>;
}

export const BasePdfTemplate: React.FC<PdfDocumentProps<BaseTemplateData>> = ({
  data,
  metadata,
}) => {
  return (
    <Document
      title={metadata?.title || data.title}
      author={metadata?.author}
      subject={metadata?.subject}
      keywords={metadata?.keywords}
    >
      <Page size="A4" style={commonStyles.page}>
        {/* Header */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.heading}>{data.title}</Text>
          {data.date && (
            <Text style={commonStyles.small}>Date: {data.date}</Text>
          )}
        </View>

        {/* Main Content */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.paragraph}>{data.content}</Text>
        </View>

        {/* Optional Sections */}
        {data.sections?.map((section, index) => (
          <View key={index} style={commonStyles.section}>
            <Text style={commonStyles.subheading}>{section.heading}</Text>
            <Text style={commonStyles.paragraph}>{section.text}</Text>
          </View>
        ))}

        {/* Footer */}
        <View style={[commonStyles.section, commonStyles.mt20]}>
          <Text style={[commonStyles.small, commonStyles.center]}>
            Generated on {new Date().toLocaleDateString()}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

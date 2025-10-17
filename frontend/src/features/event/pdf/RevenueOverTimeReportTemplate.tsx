'use client';

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { commonStyles } from '@/lib/pdf';

// Define the data shape for the revenue over time report
interface RevenueOverTimeData {
  date: string;
  revenue: number;
}

// Define the props for our PDF template component
interface RevenueOverTimeReportTemplateProps {
  data: RevenueOverTimeData[];
}

// Create specific styles for this template
const styles = StyleSheet.create({
  tableHeader: {
    ...commonStyles.tableHeader,
    flexDirection: 'row',
    borderBottomWidth: 1,
    backgroundColor: '#f0f0f0',
    padding: 5,
  },
  tableRow: {
    ...commonStyles.tableRow,
    flexDirection: 'row',
    borderBottomWidth: 1,
    padding: 5,
  },
  tableCell: {
    ...commonStyles.tableCell,
    fontSize: 10,
    flex: 1,
  },
});

export const RevenueOverTimeReportTemplate: React.FC<RevenueOverTimeReportTemplateProps> = ({ data }) => (
  <Document>
    <Page size="A4" style={commonStyles.page}>
      {/* Report Header */}
      <View style={commonStyles.section}>
        <Text style={commonStyles.heading}>Revenue Over Time Report</Text>
        <Text style={commonStyles.small}>Generated on: {new Date().toLocaleDateString()}</Text>
      </View>

      {/* Report Table */}
      <View style={styles.tableHeader}>
        <Text style={styles.tableCell}>Date</Text>
        <Text style={styles.tableCell}>Revenue</Text>
      </View>

      {data.map((item, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={styles.tableCell}>{new Date(item.date).toLocaleDateString()}</Text>
          <Text style={styles.tableCell}>${item.revenue.toFixed(2)}</Text>
        </View>
      ))}

      {/* Report Footer */}
      <View style={[commonStyles.section, { position: 'absolute', bottom: 30, left: 30, right: 30 }]}>
        <Text style={[commonStyles.small, commonStyles.center]}>
          Page 1
        </Text>
      </View>
    </Page>
  </Document>
);

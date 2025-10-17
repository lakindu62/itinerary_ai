'use client';

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { commonStyles } from '@/lib/pdf';

// Define the data shape for the revenue report
interface RevenueData {
  eventName: string;
  expectedRevenue: number;
  actualRevenue: number;
}

// Define the props for our PDF template component
interface RevenueReportTemplateProps {
  data: RevenueData[];
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
  },
  eventNameCell: {
    flex: 3, // Give more space for the event name
  },
  revenueCell: {
    flex: 2,
  },
});

export const RevenueReportTemplate: React.FC<RevenueReportTemplateProps> = ({ data }) => (
  <Document>
    <Page size="A4" style={commonStyles.page}>
      {/* Report Header */}
      <View style={commonStyles.section}>
        <Text style={commonStyles.heading}>Expected vs. Actual Revenue Report</Text>
        <Text style={commonStyles.small}>Generated on: {new Date().toLocaleDateString()}</Text>
      </View>

      {/* Report Table */}
      <View style={styles.tableHeader}>
        <Text style={[styles.tableCell, styles.eventNameCell]}>Event</Text>
        <Text style={[styles.tableCell, styles.revenueCell]}>Expected Revenue</Text>
        <Text style={[styles.tableCell, styles.revenueCell]}>Actual Revenue</Text>
      </View>

      {data.map((event, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.eventNameCell]}>{event.eventName}</Text>
          <Text style={[styles.tableCell, styles.revenueCell]}>${event.expectedRevenue.toFixed(2)}</Text>
          <Text style={[styles.tableCell, styles.revenueCell]}>${event.actualRevenue.toFixed(2)}</Text>
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

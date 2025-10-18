'use client';

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { commonStyles } from '@/lib/pdf';

// Define the data shape for a single event's performance
interface EventPerformanceData {
  eventName: string;
  capacity: number;
  booked: number;
  sellThrough: number;
  actualRevenue: number;
  expectedRevenue: number;
}

// Define the props for our PDF template component
interface EventReportTemplateProps {
  data: EventPerformanceData[];
}

// Create specific styles for this template by extending commonStyles
const styles = StyleSheet.create({
  tableHeader: {
    ...commonStyles.tableHeader,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#f0f0f0',
    padding: 5,
  },
  tableRow: {
    ...commonStyles.tableRow,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    padding: 5,
  },
  tableCell: {
    ...commonStyles.tableCell,
    fontSize: 9,
    flex: 1,
  },
  eventNameCell: {
    flex: 2, // Give more space for the event name
  },
});

export const EventReportTemplate: React.FC<EventReportTemplateProps> = ({ data }) => (
  <Document>
    <Page size="A4" style={commonStyles.page}>
      {/* Report Header */}
      <View style={commonStyles.section}>
        <Text style={commonStyles.heading}>Event Performance Report</Text>
        <Text style={commonStyles.small}>Generated on: {new Date().toLocaleDateString()}</Text>
      </View>

      {/* Report Table */}
      <View style={styles.tableHeader}>
        <Text style={[styles.tableCell, styles.eventNameCell]}>Event</Text>
        <Text style={styles.tableCell}>Capacity</Text>
        <Text style={styles.tableCell}>Booked</Text>
        <Text style={styles.tableCell}>Sell-Through</Text>
        <Text style={styles.tableCell}>Actual Revenue</Text>
        <Text style={styles.tableCell}>Expected Revenue</Text>
      </View>

      {data.map((event, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.eventNameCell]}>{event.eventName}</Text>
          <Text style={styles.tableCell}>{event.capacity}</Text>
          <Text style={styles.tableCell}>{event.booked}</Text>
          <Text style={styles.tableCell}>{event.sellThrough.toFixed(1)}%</Text>
          <Text style={styles.tableCell}>${event.actualRevenue.toFixed(2)}</Text>
          <Text style={styles.tableCell}>${event.expectedRevenue.toFixed(2)}</Text>
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

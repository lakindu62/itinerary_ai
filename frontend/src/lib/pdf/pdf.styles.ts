import { StyleSheet } from "@react-pdf/renderer";

/**
 * Common styles for PDF documents
 * These can be imported and used across different PDF templates
 */
export const commonStyles = StyleSheet.create({
  // Page styles
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },

  // Text styles
  heading: {
    fontSize: 24,
    marginBottom: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
  },

  subheading: {
    fontSize: 18,
    marginBottom: 8,
    fontFamily: "Helvetica-Bold",
    color: "#333333",
  },

  paragraph: {
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 1.5,
    color: "#4a4a4a",
  },

  small: {
    fontSize: 10,
    color: "#666666",
  },

  // Layout styles
  section: {
    marginBottom: 15,
  },

  row: {
    flexDirection: "row",
    marginBottom: 5,
  },

  column: {
    flexDirection: "column",
    flex: 1,
  },

  // Container styles
  container: {
    padding: 10,
    marginBottom: 10,
  },

  card: {
    border: "1px solid #e0e0e0",
    borderRadius: 4,
    padding: 15,
    marginBottom: 10,
  },

  // Table styles
  table: {
    width: "100%",
    marginBottom: 15,
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 8,
  },

  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#333333",
    paddingVertical: 8,
    fontFamily: "Helvetica-Bold",
    backgroundColor: "#f5f5f5",
  },

  tableCell: {
    flex: 1,
    fontSize: 10,
  },

  // Utility styles
  bold: {
    fontFamily: "Helvetica-Bold",
  },

  italic: {
    fontFamily: "Helvetica-Oblique",
  },

  center: {
    textAlign: "center",
  },

  right: {
    textAlign: "right",
  },

  // Color utilities
  primaryText: {
    color: "#2563eb", // Adjust to your brand color
  },

  secondaryText: {
    color: "#64748b",
  },

  mutedText: {
    color: "#94a3b8",
  },

  // Spacing utilities
  mt10: { marginTop: 10 },
  mt20: { marginTop: 20 },
  mb10: { marginBottom: 10 },
  mb20: { marginBottom: 20 },
  p10: { padding: 10 },
  p20: { padding: 20 },
});

/**
 * Helper function to combine multiple styles
 * Usage: combineStyles(commonStyles.heading, commonStyles.center)
 */
export const combineStyles = (...styles: any[]) => {
  return Object.assign({}, ...styles);
};

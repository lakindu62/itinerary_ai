import { Document, Page, Text, View } from "@react-pdf/renderer";
import { commonStyles } from "@/lib/pdf";
import type {
  ItineraryDto,
  DayDto,
  ActivityDto,
  HotelActivityDto,
  EventActivityDto,
} from "@shared/types/itinerary/chat-itinerary.response.dto";

// Narrowers duplicated here to keep template self-sufficient at runtime
const isHotelActivity = (a: ActivityDto): a is HotelActivityDto => a.type === "hotel";
const isEventActivity = (a: ActivityDto): a is EventActivityDto => a.type === "event";

export interface ItineraryPDFData extends ItineraryDto {}

export const ItineraryPDFTemplate: React.FC<{ data: ItineraryPDFData }> = ({ data }) => (
  <Document>
    <Page size="A4" style={commonStyles.page}>
      {/* Header */}
      <View style={commonStyles.section}>
        <Text style={commonStyles.heading}>{data.title}</Text>
        {data.summary ? (
          <Text style={commonStyles.paragraph}>{data.summary}</Text>
        ) : null}
      </View>

      {/* Accommodation */}
      {data.accommodation ? (
        <View style={commonStyles.section}>
          <Text style={commonStyles.subheading}>Accommodation</Text>
          <Text style={commonStyles.paragraph}>{data.accommodation}</Text>
        </View>
      ) : null}

      {/* Days Overview */}
      {Array.isArray(data.days) && data.days.length > 0 ? (
        <View style={commonStyles.section}>
          <Text style={commonStyles.subheading}>Itinerary</Text>
          {data.days.map((day: DayDto) => (
            <View key={day.dayNumber} style={[commonStyles.card]}> 
              <View style={[commonStyles.row, { justifyContent: "space-between" }]}> 
                <Text style={[commonStyles.bold]}>Day {day.dayNumber}</Text>
                <Text style={commonStyles.small}>{day.date}</Text>
              </View>
              <Text style={[commonStyles.paragraph, commonStyles.primaryText]}>
                Destination: {day.destination}
              </Text>

              {/* Activities Table */}
              {day.activities?.length ? (
                <View style={commonStyles.table}>
                  <View style={commonStyles.tableHeader}>
                    <Text style={[commonStyles.tableCell, { flex: 1.2 }]}>Time</Text>
                    <Text style={[commonStyles.tableCell, { flex: 1 }]}>Type</Text>
                    <Text style={[commonStyles.tableCell, { flex: 1.8 }]}>Name</Text>
                    <Text style={[commonStyles.tableCell, { flex: 2.5 }]}>Details</Text>
                    <Text style={[commonStyles.tableCell, { flex: 2 }]}>Address</Text>
                  </View>

                  {day.activities.map((act: ActivityDto, idx: number) => {
                    const typeLabel = act.type.charAt(0).toUpperCase() + act.type.slice(1);

                    let extra = "";
                    if (isHotelActivity(act)) {
                      const { venueName, id } = act.additionalDetails ?? {};
                      extra = [venueName, id ? `#${id}` : ""].filter(Boolean).join(" ");
                    } else if (isEventActivity(act)) {
                      const { startDate, startTime, venueName } = act.additionalDetails ?? {};
                      const when = [startDate, startTime].filter(Boolean).join(" ");
                      extra = [venueName, when].filter(Boolean).join(" • ");
                    }

                    return (
                      <View key={idx} style={commonStyles.tableRow}>
                        <Text style={[commonStyles.tableCell, { flex: 1.2 }]}>{act.time}</Text>
                        <Text style={[commonStyles.tableCell, { flex: 1 }]}>{typeLabel}</Text>
                        <Text style={[commonStyles.tableCell, { flex: 1.8 }]}>{act.name}</Text>
                        <Text style={[commonStyles.tableCell, { flex: 2.5 }]}>
                          {extra ? `${act.description ? act.description + " — " : ""}${extra}` : act.description}
                        </Text>
                        <Text style={[commonStyles.tableCell, { flex: 2 }]}>{act.address}</Text>
                      </View>
                    );
                  })}
                </View>
              ) : (
                <Text style={commonStyles.small}>No activities listed for this day.</Text>
              )}
            </View>
          ))}
        </View>
      ) : (
        <View style={commonStyles.section}>
          <Text style={commonStyles.paragraph}>No itinerary days available.</Text>
        </View>
      )}

      {/* Tips */}
      {Array.isArray(data.tips) && data.tips.length > 0 ? (
        <View style={commonStyles.section}>
          <Text style={commonStyles.subheading}>Tips</Text>
          {data.tips.map((tip: string, i: number) => (
            <Text key={i} style={commonStyles.paragraph}>• {tip}</Text>
          ))}
        </View>
      ) : null}

      {/* Footer */}
      <View style={[commonStyles.section, commonStyles.mt20]}>
        <Text style={[commonStyles.small, commonStyles.center]}>Generated on {new Date().toLocaleString()}</Text>
      </View>
    </Page>
  </Document>
);



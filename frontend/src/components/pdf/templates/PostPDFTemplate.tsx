import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { commonStyles } from "@/lib/pdf";

// Define the expected data shape for the post
export interface ProcessedMedia {
  type: "image" | "video";
  url: string;
  originalPath: string;
}

export interface PostPDFData {
  user: {
    displayName: string;
    profilePictureUrl: string;
  };
  post: {
    id: string | number;
    content?: string;
    createdAt?: string;
    updatedAt?: string;
    processedMedia: ProcessedMedia[]; // Array of processed media with signed URLs
    likesCount: number;
  };
}

export const PostPDFTemplate: React.FC<{ data: PostPDFData }> = ({ data }) => (
  <Document>
    <Page size="A4" style={commonStyles.page}>
      {/* User Details */}
      <View
        style={[
          commonStyles.section,
          { flexDirection: "row", alignItems: "center" },
        ]}
      >
        <Image
          src={data.user.profilePictureUrl}
          style={{ width: 50, height: 50, borderRadius: 25, marginRight: 16 }}
        />
        <View>
          <Text style={commonStyles.heading}>{data.user.displayName}</Text>
          <Text style={commonStyles.small}>
            {data.post.createdAt
              ? `Posted on: ${new Date(data.post.createdAt).toLocaleString()}`
              : "Posted date not available"}{" "}
            {data.post.updatedAt
              ? `Updated on: ${new Date(data.post.updatedAt).toLocaleString()}`
              : ""}
          </Text>
        </View>
      </View>

      {/* Post Details */}
      <View style={commonStyles.section}>
        <Text style={commonStyles.subheading}>Post Details</Text>
        <Text style={commonStyles.paragraph}>Post ID: {data.post.id}</Text>
        <Text style={commonStyles.paragraph}>
          Caption content: {data.post.content}
        </Text>
      </View>

      {/* Media Files */}
      <View style={commonStyles.section}>
        <Text style={commonStyles.subheading}>Media Files</Text>
        {data.post.processedMedia.length > 0 ? (
          data.post.processedMedia.map((media, idx) => (
            <View key={idx} style={{ marginBottom: 15 }}>
              {media.type === "image" ? (
                <>
                  <Image
                    src={media.url}
                    style={{
                      width: "100%",
                      maxHeight: 300,
                      objectFit: "contain",
                      marginBottom: 5,
                    }}
                  />
                  <Text style={commonStyles.small}>
                    Path: {media.originalPath}
                  </Text>
                </>
              ) : (
                <>
                  <View
                    style={{
                      width: "100%",
                      height: 150,
                      backgroundColor: "#f0f0f0",
                      border: "2px solid #ccc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 5,
                    }}
                  >
                    <Text style={commonStyles.small}>
                      Video (not displayable in PDF)
                    </Text>
                  </View>
                  <Text style={commonStyles.small}>
                    Path: {media.originalPath}
                  </Text>
                </>
              )}
            </View>
          ))
        ) : (
          <Text style={commonStyles.paragraph}>No media files attached.</Text>
        )}
      </View>

      {/* Likes Count */}
      <View style={commonStyles.section}>
        <Text style={commonStyles.subheading}>Likes</Text>
        <Text style={commonStyles.paragraph}>{data.post.likesCount} likes</Text>
      </View>

      {/* Footer */}
      <View style={[commonStyles.section, commonStyles.mt20]}>
        <Text style={[commonStyles.small, commonStyles.center]}>
          Generated on {new Date().toLocaleString()}
        </Text>
      </View>
    </Page>
  </Document>
);

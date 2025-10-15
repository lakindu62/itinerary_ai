import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { commonStyles } from "@/lib/pdf";

// Define the expected data shape for the post
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
    mediaFiles: string[]; // Array of file paths/URLs
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
        {data.post.mediaFiles.length > 0 ? (
          data.post.mediaFiles.map((file, idx) => (
            <Text key={idx} style={commonStyles.paragraph}>
              {file}
            </Text>
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
          Generated on {new Date().toLocaleDateString()}
        </Text>
      </View>
    </Page>
  </Document>
);

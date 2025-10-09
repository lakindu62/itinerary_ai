"use client";

import { AuthSetup } from "@frontend/lib/AuthSetup";
import { useGetPostsQuery } from "../../lib/social.api"; // RTK Query import
import PostCard from "./PostCard";
import PostListSkeleton from "./PostListSkeleton";

const PostList: React.FC = () => {
  // Use RTK Query to fetch posts
  const { data: posts = [], isLoading } = useGetPostsQuery();

  // Optional: remove post from local list after deletion
  // With RTK Query, you can use cache invalidation or refetch instead
  const handleDelete = (id: string) => {
    // Optionally trigger a refetch or use RTK Query's cache update
    // For now, you can just let RTK Query refetch automatically if you set up invalidation in your API slice
  };

  if (isLoading) return <PostListSkeleton count={5} />;

  return (
    <div>
      {/* <AuthSetup /> */}
      {posts.length === 0 ? (
        <div>No posts found.</div>
      ) : (
        posts.map((post) => (
          <PostCard key={post.id} post={post} onDelete={handleDelete} />
        ))
      )}
    </div>
  );
};

export default PostList;

"use client";

import { AuthSetup } from "@frontend/lib/AuthSetup";
import { useGetPostsQuery } from "../../lib/social.api"; // RTK Query import
import PostCard from "./PostCard";
import PostListSkeleton from "./PostListSkeleton";
import { useAuth } from "@clerk/nextjs";

const PostList: React.FC = () => {
  const { isLoaded } = useAuth();

  // Use RTK Query to fetch posts - but only after auth is loaded
  const { data: posts = [], isLoading } = useGetPostsQuery(undefined, {
    skip: !isLoaded, // Skip the query until Clerk auth is loaded
  });

  // Optional: remove post from local list after deletion
  // With RTK Query, you can use cache invalidation or refetch instead
  const handleDelete = (id: string) => {
    // Optionally trigger a refetch or use RTK Query's cache update
    // For now, you can just let RTK Query refetch automatically if you set up invalidation in your API slice
  };

  // Show loading state while auth is loading OR while posts are loading
  if (!isLoaded || isLoading) return <PostListSkeleton count={5} />;

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

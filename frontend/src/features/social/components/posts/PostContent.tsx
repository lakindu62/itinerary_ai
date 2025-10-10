"use client"; //Comet

import { PostContentProps } from "../../types/social.types";

const PostContent: React.FC<PostContentProps> = ({
  content,
  className = "",
}) => {
  if (!content) return null;

  return (
    <div className={`mb-4 ${className}`}>
      <p className="whitespace-pre-wrap">{content}</p>
    </div>
  );
};

export default PostContent;

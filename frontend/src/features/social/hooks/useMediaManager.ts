//useMediaManager.ts /Comet
import { useState, useEffect } from "react";
import { getSignedGetUrl } from "src/lib/media.api";

export const useMediaManager = (mediaFiles?: string[], image?: string) => {
  const [signedMediaUrls, setSignedMediaUrls] = useState<string[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaError, setMediaError] = useState(false);

  useEffect(() => {
    const fetchSignedUrls = async () => {
      const mediaKeys =
        mediaFiles && mediaFiles.length > 0
          ? mediaFiles
          : image
          ? [image] // fallback
          : [];

      if (mediaKeys.length === 0) return;

      setMediaLoading(true);
      setMediaError(false);

      try {
        const urls = await Promise.all(
          mediaKeys.map((k) => getSignedGetUrl(k))
        );
        setSignedMediaUrls(urls);
      } catch (err) {
        console.error("Error fetching signed media URLs", err);
        setMediaError(true);
      } finally {
        setMediaLoading(false);
      }
    };

    fetchSignedUrls();
  }, [mediaFiles, image]);

  return {
    signedMediaUrls,
    mediaLoading,
    mediaError,
  };
};

// // ===== MEDIA HOOKS =====
// // src/features/social/hooks/useMediaManager.ts
// import { useState, useEffect } from "react";
// import { getSignedGetUrl } from "src/lib/media.api";

// const MAX_MEDIA_HEIGHT = 500;

// export const useMediaManager = (post: {
//   mediaFiles?: string[];
//   image?: string;
// }) => {
//   const [signedMediaUrls, setSignedMediaUrls] = useState<string[]>([]);
//   const [mediaLoading, setMediaLoading] = useState(false);
//   const [mediaError, setMediaError] = useState(false);
//   const [mediaContainerHeight, setMediaContainerHeight] = useState<
//     number | null
//   >(null);

//   useEffect(() => {
//     const fetchSignedUrls = async () => {
//       const mediaKeys =
//         post.mediaFiles && post.mediaFiles.length > 0
//           ? post.mediaFiles
//           : post.image
//           ? [post.image]
//           : [];

//       if (mediaKeys.length === 0) return;

//       setMediaLoading(true);
//       setMediaError(false);
//       setMediaContainerHeight(null);
//       try {
//         const urls = await Promise.all(
//           mediaKeys.map((k) => getSignedGetUrl(k))
//         );
//         setSignedMediaUrls(urls);
//       } catch (err) {
//         console.error("Error fetching signed media URLs", err);
//         setMediaError(true);
//       } finally {
//         setMediaLoading(false);
//       }
//     };

//     fetchSignedUrls();
//   }, [post.mediaFiles, post.image]);

//   const handleFirstMediaHeight = (naturalHeight: number, index: number) => {
//     if (index === 0 && mediaContainerHeight === null) {
//       const calculatedHeight = Math.min(naturalHeight, MAX_MEDIA_HEIGHT);
//       setMediaContainerHeight(calculatedHeight);
//     }
//   };

//   return {
//     signedMediaUrls,
//     mediaLoading,
//     mediaError,
//     mediaContainerHeight,
//     handleFirstMediaHeight,
//     MAX_MEDIA_HEIGHT,
//   };
// };

// src/features/social/components/Sidebar.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent } from "@frontend/components/ui/card";
import { Avatar, AvatarImage } from "@frontend/components/ui/avatar";
import { Separator } from "@frontend/components/ui/separator";
import { MapPinIcon, LinkIcon, User as UserIcon } from "lucide-react";
import { Skeleton } from "@frontend/components/ui/skeleton";
import { useGetCurrentUserProfileQuery } from "@frontend/features/social/lib/social.api";

export default function Sidebar() {
  const { data: user, isLoading, error } = useGetCurrentUserProfileQuery();
  // Fallbacks
  const fallbackProfilePic = "/alien-profile-pic-1.jpg";
  const fallbackName = "Amzal Foumi";
  const fallbackUsername = "@username";
  const fallbackBio = "User Bio";

  // Extract profile data
  const profilePic = user?.travelProfile?.profilePicture || fallbackProfilePic;
  const name = user ? `${user.firstName} ${user.lastName}` : fallbackName;
  const bio = user?.travelProfile?.bio || fallbackBio;
  const username = fallbackUsername;

  return (
    <div className="sticky top-20">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            {isLoading ? (
              <Skeleton className="w-20 h-20 rounded-full mb-4" />
            ) : (
              <Avatar className="w-20 h-20 border-2">
                {profilePic ? (
                  <AvatarImage src={profilePic} />
                ) : (
                  <UserIcon className="w-20 h-20 text-muted-foreground" />
                )}
              </Avatar>
            )}

            <div className="mt-4 space-y-1">
              {isLoading ? (
                <Skeleton className="h-6 w-32 mx-auto" />
              ) : (
                <h3 className="font-semibold">{name}</h3>
              )}
              {/* Username placeholder, update if you have username */}
              <p className="text-sm text-muted-foreground">{username}</p>
            </div>

            <div className="mt-3">
              {isLoading ? (
                <Skeleton className="h-4 w-40 mx-auto" />
              ) : (
                <p className="text-sm text-muted-foreground">{bio}</p>
              )}
            </div>

            {/* Other details (Friends, Posts, Location, Website) remain static for now */}
            <div className="w-full">
              <Separator className="my-4" />
              <div className="flex justify-around">
                <div>
                  <p className="font-medium">0</p>
                  <p className="text-xs text-muted-foreground">Friends</p>
                </div>
                <Separator orientation="vertical" />
                <div>
                  <p className="font-medium">0</p>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
              </div>
              <Separator className="my-4" />
            </div>

            <div className="w-full space-y-2 text-sm">
              <div className="flex items-center text-muted-foreground">
                <MapPinIcon className="w-4 h-4 mr-2" />
                <span>Location</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <LinkIcon className="w-4 h-4 mr-2 shrink-0" />
                <a
                  href="https://example.com"
                  className="hover:underline truncate"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  example.com
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// // import { SignInButton, SignUpButton } from "@clerk/nextjs";
// // import { currentUser } from "@clerk/nextjs/server";
// // import React from "react";
// // import { Button } from "./ui/button";
// // import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
// // import { getUserByClerkId } from "@/actions/user.action";
// // import Link from "next/link";
// // import { Avatar, AvatarImage } from "./ui/avatar";
// // import { Separator } from "./ui/separator";
// // import { MapPinIcon, LinkIcon } from "lucide-react";

// import { Card, CardContent } from "@frontend/components/ui/card";
// import { Avatar, AvatarImage } from "@frontend/components/ui/avatar";
// import { Separator } from "@frontend/components/ui/separator";
// import { Link, MapPinIcon, LinkIcon } from "lucide-react";

// async function Sidebar() {
//   // const authUser = await currentUser();
//   // if (!authUser) return <UnAuthenticatedSidebar />;

//   //We need to get the authenticated user's details from the actual postgresql db
//   //Because clerk does not store our other needed data like follower counts, likes, posts etc
//   // const user = await getUserByClerkId(authUser.id);
//   // if (!user) return null; //Dont do this in reality. throw an error

//   // console.log(`${console.log(user)}j
//   //     User details loaded to log with sidebar component from postgre db`);

//   return (
//     <div className="sticky top-20">
//       <Card>
//         <CardContent className="pt-6">
//           <div className="flex flex-col items-center text-center">
//             <Link
//               href={`/profile/add username here`}
//               className="flex flex-col items-center justify-center"
//             >
//               <Avatar className="w-20 h-20 border-2 ">
//                 <AvatarImage src={"/alien-profile-pic-1.jpg"} />
//               </Avatar>

//               <div className="mt-4 space-y-1">
//                 <h3 className="font-semibold">MAmzal Foumi Static</h3>
//                 {/* <p className="text-sm text-muted-foreground">{user.username}</p> */}
//               </div>
//             </Link>

//             {/* {user.bio && (
//               <p className="mt-3 text-sm text-muted-foreground">{user.bio}</p>
//             )} */}

//             {<p className="mt-3 text-sm text-muted-foreground">User Bio</p>}

//             <div className="w-full">
//               <Separator className="my-4" />
//               <div className="flex justify-between">
//                 <div>
//                   {/* <p className="font-medium">{user._count.following}</p> */}
//                   <p className="text-xs text-muted-foreground">Following</p>
//                 </div>
//                 <Separator orientation="vertical" />
//                 <div>
//                   {/* <p className="font-medium">{user._count.followers}</p> */}
//                   <p className="text-xs text-muted-foreground">Followers</p>
//                 </div>
//               </div>
//               <Separator className="my-4" />
//             </div>

//             <div className="w-full space-y-2 text-sm">
//               <div className="flex items-center text-muted-foreground">
//                 <MapPinIcon className="w-4 h-4 mr-2" />
//                 {/* {user.location || "No location"} */}
//               </div>
//               <div className="flex items-center text-muted-foreground">
//                 <LinkIcon className="w-4 h-4 mr-2 shrink-0" />
//                 {/* {user.website ? (
//                   <a
//                     href={`${user.website}`}
//                     className="hover:underline truncate"
//                     target="_blank"
//                   >
//                     {user.website}
//                   </a>
//                 ) : (
//                   "No website"
//                 )} */}
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// export default Sidebar;

// // const UnAuthenticatedSidebar = () => (
// //   <div className="sticky top-20">
// //     <Card>
// //       <CardHeader>
// //         <CardTitle className="text-center text-xl font-semibold">
// //           Welcome Back!
// //         </CardTitle>
// //       </CardHeader>
// //       <CardContent>
// //         <p className="text-center text-muted-foreground mb-4">
// //           Login to access your profile and connect with others.
// //         </p>
// //         <SignInButton mode="modal">
// //           <Button className="w-full" variant="outline">
// //             Login
// //           </Button>
// //         </SignInButton>
// //         <SignUpButton mode="modal">
// //           <Button className="w-full mt-2" variant="default">
// //             Sign Up
// //           </Button>
// //         </SignUpButton>
// //       </CardContent>
// //     </Card>
// //   </div>
// // );

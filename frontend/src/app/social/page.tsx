"use client";
import CreatePost from "@frontend/features/social/components/posts/CreatePost";
import Navbar from "@frontend/features/social/components/Navbar";
import PostList from "@frontend/features/social/components/posts/PostList";
import Sidebar from "@frontend/features/social/components/Sidebar";
import {
  FriendsList,
  FriendRequestsList,
} from "@frontend/features/social/components/friends";
import { BrowseUsersList } from "@frontend/features/social/components/browse";
import React, { useEffect } from "react";
// import { useAuth } from "@clerk/nextjs";
// import { setClerkGetTokenFunc } from "@frontend/store/api/rootApiSlice";
import { AuthSetup } from "@frontend/lib/AuthSetup";

// function AuthSetup() {
//   const { getToken } = useAuth();
//   console.log("🚀 ~ AuthSetup ~ getToken:");
//   useEffect(() => {
//     setClerkGetTokenFunc(() => getToken());
//   }, [getToken]);

//   return null;
// }

type Props = {};

const page = (props: Props) => {
  return (
    <>
      {/* Scoped styles to hide scrollbars only on this page */}
      <style jsx global>{`
        /* Hide scrollbars in the social page container */
        .social-page-container *::-webkit-scrollbar {
          display: none;
        }
        .social-page-container * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Hide scrollbars in ScrollArea components */
        .social-page-container
          [data-radix-scroll-area-viewport]::-webkit-scrollbar {
          display: none;
        }
        .social-page-container [data-radix-scroll-area-viewport] {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Hide the ScrollBar component itself */
        .social-page-container [data-slot="scroll-area-scrollbar"] {
          display: none !important;
        }
      `}</style>

      <div className="h-screen flex flex-col overflow-hidden social-page-container">
        <AuthSetup />

        {/* Main content area - fixed height below navbar */}
        <main className="flex-1 overflow-hidden pt-4">
          <div className="h-full max-w-7xl mx-auto px-4">
            {/* 3-column grid layout */}
            <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* LEFT COLUMN - Fixed, no scroll */}
              <div className="hidden lg:flex lg:col-span-3 flex-col gap-4 h-full overflow-y-auto">
                <Sidebar />
                <BrowseUsersList layout="row" showCard={true} />
              </div>

              {/* CENTER COLUMN - Scrollable feed */}
              <div className="lg:col-span-6 overflow-y-auto">
                <div className="space-y-4">
                  <CreatePost />
                  <PostList />
                </div>
              </div>

              {/* RIGHT COLUMN - Fixed, no scroll */}
              <div className="hidden lg:flex lg:col-span-3 flex-col gap-4 h-full">
                <div className="flex-[3] min-h-0">
                  <FriendsList
                    showSearch={true}
                    showCount={true}
                    showRemoveButton={false}
                  />
                </div>
                <div className="flex-[2] min-h-0">
                  <FriendRequestsList showCount={true} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default page;

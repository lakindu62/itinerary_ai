"use client";
import CreatePost from "@frontend/features/social/components/posts/CreatePost";
import Navbar from "@frontend/features/social/components/Navbar";
import PostList from "@frontend/features/social/components/posts/PostList";
import Sidebar from "@frontend/features/social/components/Sidebar";
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
    <div className="min-h-screen">
      <AuthSetup />

      {/* <Navbar /> */}
      <main className="py-8 mt-12">
        {/*Container to center the content */}
        <div className="max-w-7xl mx-auto px-4">
          {/*Grid container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/*Sidebar on the left */}
            <div className="hidden lg:block lg:col-span-3">
              <Sidebar />
            </div>
            {/*Main content */}
            <div className="lg:col-span-9">
              <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                <div className="lg:col-span-6">
                  {
                    <>
                      <CreatePost />
                      <PostList />
                    </>
                  }
                </div>
                <div className="hidden lg:block lg:col-span-4 stciky top-20">
                  Friend List goes here
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default page;

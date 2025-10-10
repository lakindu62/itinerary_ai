'use client'
import { useAuth } from "@clerk/nextjs";
import TravelChatbot from "@frontend/features/itinerary/components/TravelChatbot";
import { setClerkGetTokenFunc } from "@frontend/store/api/rootApiSlice";
import React, { useEffect } from "react";


function AuthSetup() {
  const { getToken } = useAuth();
  console.log("🚀 ~ AuthSetup ~ getToken:")
  useEffect(() => {
    setClerkGetTokenFunc(() => getToken());
  }, [getToken]);

  return null;
}
export default function Home() {






  return (
    <div>
      <AuthSetup />
      <TravelChatbot />
    </div>

  );
}

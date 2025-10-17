'use client'
import { useAuth } from "@clerk/nextjs";
import HomePage from "@frontend/components/common/traveller/home/HomePage";

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
      <HomePage />
    </div>

  );
}

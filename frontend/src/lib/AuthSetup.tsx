"use client";

import { useAuth } from "@clerk/nextjs";
import { setClerkGetTokenFunc } from "@frontend/store/api/rootApiSlice";
import { useEffect } from "react";

export function AuthSetup() {
  const { getToken, isLoaded, sessionId } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      console.log(
        "🚀 ~ AuthSetup ~ Setting Clerk token function, sessionId:",
        sessionId
      );
      setClerkGetTokenFunc(() => getToken());
    }
  }, [getToken, isLoaded, sessionId]);

  return null;
}

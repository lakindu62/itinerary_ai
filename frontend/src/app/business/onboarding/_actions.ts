"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export const completeOnboarding = async () => {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    return { message: "No Logged In User" };
  }

  const client = await clerkClient();

  try {
    const res = await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboardingComplete: true,
      },
    });
    return { message: res.publicMetadata };
  } catch (err) {
    console.log("🚀 ~ completeOnboarding ~ err:", err);
    return { error: "There was an error updating the user metadata." };
  }
};

// src/lib/providers.tsx
"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store";

export default function Providers({ children }: { children: React.ReactNode }) {
  // React Query client
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <ReduxProvider store={store}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#231212",
                color: "#ffffff",
              },
              duration: 4000,
            }}
          />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </NextThemesProvider>
    </ReduxProvider>
  );
}

// "use client";

// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// import { useState } from 'react';
// import { Toaster } from 'react-hot-toast';

// // Placeholder for Clerk - will be added later
// // import { ClerkProvider } from '@clerk/nextjs'

// export default function Providers({ children }: { children: React.ReactNode }) {
//   const [queryClient] = useState(
//     () =>
//       new QueryClient({
//         defaultOptions: {
//           queries: {
//             staleTime: 60 * 1000, // 1 minute
//             retry: 1,
//             refetchOnWindowFocus: false,
//           },
//           mutations: {
//             retry: 1,
//           },
//         },
//       })
//   );

//   return (
//     // TODO: Wrap with ClerkProvider when auth is ready
//     // <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
//     <QueryClientProvider client={queryClient}>
//       {children}
//       <Toaster
//         position="top-center"
//         toastOptions={{
//           style: {
//             background: '#231212',
//             color: '#ffffff',
//           },
//           duration: 4000,
//         }}
//       />
//       <ReactQueryDevtools initialIsOpen={false} />
//     </QueryClientProvider>
//     // </ClerkProvider>
//   );
// }

// import { AppSidebar } from "@/features/event/components/app-sidebar"
// import { ChartAreaInteractive } from "@/features/event/components/chart-area-interactive"
// import { DataTable } from "@/features/event/components/data-table"
// import { SectionCards } from "@/features/event/components/section-cards"
// import { SiteHeader } from "@/features/event/components/site-header"
// import {
//   SidebarInset,
//   SidebarProvider,
// } from "@/components/ui/sidebar"

// import data from "./data.json"

// export default function Page() {
//   return (
//     <SidebarProvider
//       style={
//         {
//           "--sidebar-width": "calc(var(--spacing) * 72)",
//           "--header-height": "calc(var(--spacing) * 12)",
//         } as React.CSSProperties
//       }
//     >
//       <AppSidebar variant="inset" />
//       <SidebarInset>
//         <SiteHeader />
//         <div className="flex flex-1 flex-col">
//           <div className="@container/main flex flex-1 flex-col gap-2">
//             <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
//               <SectionCards />
//               <div className="px-4 lg:px-6">
//                 <ChartAreaInteractive />
//               </div>
//               <DataTable data={data} />
//             </div>
//           </div>
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   )
// }



// 'use client';
// import { SectionCards } from "@/features/event/components/section-cards";
// import { ChartAreaInteractive } from "@/features/event/components/chart-area-interactive";
// import { DataTable } from "@/features/event/components/data-table";
// import data from "./data.json";

// export default function Page() {
//   return (
//     <div className="flex flex-1 flex-col">
//       <div className="@container/main flex flex-1 flex-col gap-2">
//         <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
//           <SectionCards />
//         <div className="px-4 lg:px-6">
//           <ChartAreaInteractive />
//         </div>
//           <DataTable data={data} />
//         </div>
//       </div>
//     </div>
//   );
// }



'use client';
    
     import React, { useState, useEffect } from 'react';
     import { useAuth } from '@clerk/nextjs';
     import { getBusinessAnalytics } from '@/features/event/lib/event-api';
     import { SectionCards } from '@/features/event/components/section-cards';
     import { ChartAreaInteractive } from '@/features/event/components/chart-area-interactive';
     // We will create/update these components next
     // import { RevenueBarChart } from '@/features/event/components/revenue-bar-chart';
    // import { EventsDataTable } from '@/features/event/components/events-data-table';
    
    // Define a type for your analytics data on the frontend
    interface AnalyticsData {
      totalRevenue: number;
      totalGuests: number;
      eventCount: number;
      averageSellThrough: number;
      eventPerformance: any[];
      revenueOverTime: any[];
    }

    export default function DashboardPage() {
      const { getToken } = useAuth();
      const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        const fetchAnalytics = async () => {
          if (!getToken) return;
          try {
            setLoading(true);
            const data = await getBusinessAnalytics(getToken);
            setAnalytics(data);
          } catch (error) {
            console.error('Failed to fetch analytics:', error);
          } finally {
            setLoading(false);
          }
        };
        fetchAnalytics();
      }, [getToken]);

      if (loading) {
        return <div>Loading Dashboard...</div>;
      }

      if (!analytics) {
        return <div>Failed to load analytics data.</div>;
      }

      return (
        <div className="flex flex-col gap-4">
          {/* Pass real data to your components */}
          <SectionCards
            totalRevenue={analytics.totalRevenue}
            totalGuests={analytics.totalGuests}
            eventCount={analytics.eventCount}
            averageSellThrough={analytics.averageSellThrough}
          />

          {/* You will need to adapt or create new chart components */}
          {/* <RevenueBarChart data={analytics.eventPerformance} /> */}
          <ChartAreaInteractive data={analytics.revenueOverTime} />

          {/* You will need to adapt or create a new data table component */}
          {/* <EventsDataTable data={analytics.eventPerformance} /> */}
        </div>
      );
    }
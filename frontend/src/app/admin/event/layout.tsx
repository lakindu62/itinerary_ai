// import Navbar from "@/components/layout/Navbar";
// import { Sidebar } from "lucide-react";
// export default function EventLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div>
//       {/* You can add unique layout elements here, e.g., sidebars, event-specific header */}
//       <Navbar />
//       {children}
//     </div>
//   );
// }


import { AppSidebar } from "@/features/event/components/app-sidebar"
import { SiteHeader } from "@/features/event/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"


export default function EventLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

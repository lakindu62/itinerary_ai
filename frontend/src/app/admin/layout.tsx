'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

// Import BOTH sets of components
import { AppSidebar as AdminSidebar } from "@/components/common/admin/app-sidebar";
import { SiteHeader as AdminHeader } from "@/components/common/admin/site-header";
import { AppSidebar as EventSidebar } from "@/features/event/components/app-sidebar";
import { SiteHeader as EventHeader } from "@/features/event/components/site-header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if the current path is within the event management section
  const isEventSection = pathname.startsWith('/admin/event');

  const Sidebar = isEventSection ? EventSidebar : AdminSidebar;
  const Header = isEventSection ? EventHeader : AdminHeader;

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <Sidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 flex flex-col overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
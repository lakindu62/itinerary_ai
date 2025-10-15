"use client"

import * as React from "react"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconCalendarEvent,
  IconTicket,
  IconMapPin,
  IconLocation,
  IconUserCircle,
  IconCategory,
  IconTag,
  IconBookmark,
  IconHash,
  IconUserCheck,
  IconCheckbox,
  IconMail,
  IconLogin,
  IconLayoutDashboard
} from "@tabler/icons-react"

import { NavDocuments } from "@/features/event/components/nav-documents"
import { NavMain } from "@/features/event/components/nav-main"
import { NavSecondary } from "@/features/event/components/nav-secondary"
import { NavUser } from "@/features/event/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@frontend/components/ui/button"

const data = {
  // user: {
  //   name: "shadcn",
  //   email: "m@example.com",
  //   avatar: "/avatars/shadcn.jpg",
  // },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/event",
      icon: IconLayoutDashboard,
    },
    {
      title: "Calendar",
      url: "/admin/event/calendar",
      icon: IconCalendarEvent,
    },
    {
      title: "Events",
      url: "/admin/event/allevents",
      icon: IconListDetails,
    },
    {
      title: "Venues",
      url: "/admin/event/venues",
      icon: IconMapPin,
    },
    {
      title: "Organizers",
      url: "/admin/event/organizers",
      icon: IconUsers,
    },
    {
      title: "Categories",
      url: "/admin/event/categories",
      icon: IconCategory,
    },
    {
      title: "HashTags",
      url: "/admin/event/hashtags",
      icon: IconHash,
    },
    {
      title: "RSVPs",
      url: "/admin/event/rsvps",
      icon: IconUserCheck,
    },
    
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Itinerary AI</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="mt-auto border-t p-2">
        {/* <NavUser user={data.user} /> */}
                <SignedIn>
          {/* This is the simple UserButton styled to fit the sidebar */}
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonBox: "w-full", // Makes the container full-width
                userButtonTrigger:
                  "w-full flex items-center justify-start gap-3 p-2 hover:bg-muted rounded-md", // Styles the button itself
                userButtonAvatarBox: "size-9", // Sets the avatar size
                userButtonText: "text-sm font-semibold text-primary", // Styles the name
              },
            }}
          />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="ghost" className="w-full justify-start gap-3 p-2">
              <IconLogin />
              <span className="text-base font-semibold">Sign In</span>
            </Button>
          </SignInButton>
        </SignedOut>
      </SidebarFooter>
    </Sidebar>
  )
}

"use client";

import type React from "react";
import { Home, BriefcaseBusiness, CheckCircle, Code, Plus, CuboidIcon as Cube, Terminal, Cloud, User, Settings } from "lucide-react";

import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  // Navigation items with icons - reduced to 3 tabs
  const navItems = [
    {
      icon: BriefcaseBusiness,
      label: "Apply",
      href: "/apply",
      isActive: pathname === "/apply",
    },
    {
      icon: CheckCircle,
      label: "Applied",
      href: "/applied",
      isActive: pathname === "/applied",
    },
    {
      icon: User,
      label: "Profile",
      href: "/profile",
      isActive: pathname === "/profile",
    },
  ];

  return (
    <Sidebar className="w-16 border-none bg-black" collapsible="none" {...props}>
      <SidebarContent className="p-2 flex flex-col items-center gap-4 bg-black">
        {/* Home icon instead of logo */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/"
                className="w-10 h-10 mb-6 flex items-center justify-center rounded-md bg-black text-white
                  hover:shadow-[0_0_8px_rgba(255,255,255,0.3)] 
                  hover:border hover:border-white/40 
                  transition-all duration-200"
                aria-label="Home"
              >
                <Home className="h-5 w-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-zinc-700 border-zinc-600 text-white font-medium" sideOffset={5}>
              <p>Home</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Navigation items */}
        <TooltipProvider delayDuration={300}>
          {navItems.map((item, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={`flex items-center justify-center w-10 h-10 rounded-md 
                    ${item.isActive ? "bg-indigo-600" : "bg-black"} text-white 
                    hover:shadow-[0_0_8px_rgba(255,255,255,0.3)] 
                    hover:border hover:border-white/40 
                    transition-all duration-200`}
                  aria-label={item.label}
                >
                  <item.icon className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-zinc-700 border-zinc-600 text-white font-medium" sideOffset={5}>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

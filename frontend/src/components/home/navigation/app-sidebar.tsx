import type React from "react";
import { Code, Plus, CuboidIcon as Cube, Terminal, Cloud, User, Settings } from "lucide-react";

import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Navigation items with icons
  const navItems = [
    { icon: Code, label: "Code", color: "bg-indigo-600" },
    { icon: Plus, label: "Add New", color: "bg-black" },
    { icon: Cube, label: "3D Objects", color: "bg-black" },
    { icon: Terminal, label: "Terminal", color: "bg-black" },
    { icon: Cloud, label: "Cloud", color: "bg-black" },
    { icon: User, label: "Profile", color: "bg-black" },
    { icon: Settings, label: "Settings", color: "bg-black" },
  ];

  return (
    <Sidebar className="w-16 border-none bg-black" collapsible="none" {...props}>
      <SidebarContent className="p-2 flex flex-col items-center gap-4 bg-black">
        <TooltipProvider delayDuration={300}>
          {navItems.map((item, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <button
                  className={`flex items-center justify-center w-10 h-10 rounded-md ${item.color} text-white 
                    hover:shadow-[0_0_8px_rgba(255,255,255,0.3)] 
                    hover:border hover:border-white/40 
                    transition-all duration-200`}
                  aria-label={item.label}
                >
                  <item.icon className="h-5 w-5" />
                </button>
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

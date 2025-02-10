"use client";
import { ChevronRight } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SIDEBAR_ITEMS } from "@/utilities/constants";

export function AppSidebar() {
  const [isActive, setIsActive] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    setIsActive(pathname);
  }, [pathname]);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl text-foreground font-bold my-3">
            Robin'z
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-4">
              {SIDEBAR_ITEMS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                      {isActive === item.url && (
                        <ChevronRight className="w-4 h-4 absolute right-2" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

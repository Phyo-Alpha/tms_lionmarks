"use client";

import {
  NavigationSidebar,
  NavigationSidebarList,
  NavigationSidebarItem,
  type NavigationItem,
} from "@/client/components/common/navigation";
import { Home, Users, GraduationCap, ClipboardList, HelpCircle } from "lucide-react";

const ADMIN_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: "Home",
    href: "/admin",
    icon: Home,
  },
  {
    label: "Learners",
    href: "/admin/learners",
    icon: Users,
  },
  {
    label: "Courses",
    href: "/admin/courses",
    icon: GraduationCap,
  },
  {
    label: "Registrations",
    href: "/admin/registrations",
    icon: ClipboardList,
  },
  {
    label: "Get Help",
    href: "/admin/help",
    icon: HelpCircle,
    disabled: true,
  },
];

export function AdminSidebar() {
  return (
    <NavigationSidebar items={ADMIN_NAVIGATION_ITEMS}>
      <NavigationSidebarList>
        {ADMIN_NAVIGATION_ITEMS.map((item) => (
          <NavigationSidebarItem key={item.href} item={item} />
        ))}
      </NavigationSidebarList>
    </NavigationSidebar>
  );
}

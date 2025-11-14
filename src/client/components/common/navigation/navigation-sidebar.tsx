"use client";

import * as React from "react";
import { cn } from "@/client/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  disabled?: boolean;
};

type NavigationSidebarContextValue = {
  activePath: string;
  items: NavigationItem[];
};

const NavigationSidebarContext = React.createContext<NavigationSidebarContextValue | null>(null);

function useNavigationSidebar() {
  const context = React.use(NavigationSidebarContext);
  if (!context) {
    throw new Error("Navigation sidebar components must be used within NavigationSidebar");
  }
  return context;
}

type NavigationSidebarProps = {
  items: NavigationItem[];
  children: React.ReactNode;
  className?: string;
};

function NavigationSidebar({ items, children, className }: NavigationSidebarProps) {
  const pathname = usePathname();

  const contextValue: NavigationSidebarContextValue = {
    activePath: pathname,
    items,
  };

  return (
    <NavigationSidebarContext.Provider value={contextValue}>
      <nav
        className={cn(
          "flex h-full w-64 flex-col border-r bg-white shadow-sm",
          className
        )}
      >
        {children}
      </nav>
    </NavigationSidebarContext.Provider>
  );
}

type NavigationSidebarListProps = {
  children: React.ReactNode;
  className?: string;
};

function NavigationSidebarList({ children, className }: NavigationSidebarListProps) {
  return (
    <ul className={cn("flex flex-col gap-1 p-3", className)}>
      {children}
    </ul>
  );
}

type NavigationSidebarItemProps = {
  item: NavigationItem;
  className?: string;
};

function NavigationSidebarItem({ item, className }: NavigationSidebarItemProps) {
  const { activePath } = useNavigationSidebar();

  const isActive = React.useMemo(() => {
    if (activePath === item.href) return true;

    if (item.href === "/admin") {
      return activePath === "/admin";
    }

    return activePath.startsWith(item.href + "/");
  }, [activePath, item.href]);

  const Icon = item.icon;

  return (
    <li className={cn("relative", className)}>
      <Link
        href={item.disabled ? "#" : item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          isActive
            ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/95"
            : "text-foreground hover:bg-slate-100 hover:text-foreground",
          item.disabled && "pointer-events-none opacity-50 cursor-not-allowed"
        )}
        aria-current={isActive ? "page" : undefined}
        aria-disabled={item.disabled}
        onClick={(e) => {
          if (item.disabled) {
            e.preventDefault();
          }
        }}
      >
        <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-white")} />
        <span className="flex-1 truncate">{item.label}</span>
        {item.badge && (
          <span
            className={cn(
              "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium",
              isActive
                ? "bg-white/25 text-white"
                : "bg-slate-200 text-slate-600"
            )}
          >
            {item.badge}
          </span>
        )}
      </Link>
    </li>
  );
}

type NavigationSidebarHeaderProps = {
  children: React.ReactNode;
  className?: string;
};

function NavigationSidebarHeader({ children, className }: NavigationSidebarHeaderProps) {
  return (
    <div className={cn("border-b p-4", className)}>
      {children}
    </div>
  );
}

type NavigationSidebarFooterProps = {
  children: React.ReactNode;
  className?: string;
};

function NavigationSidebarFooter({ children, className }: NavigationSidebarFooterProps) {
  return (
    <div className={cn("mt-auto border-t p-4", className)}>
      {children}
    </div>
  );
}

export {
  NavigationSidebar,
  NavigationSidebarList,
  NavigationSidebarItem,
  NavigationSidebarHeader,
  NavigationSidebarFooter,
  useNavigationSidebar,
  type NavigationItem,
};

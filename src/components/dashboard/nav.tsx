"use client";

import { FolderKanbanIcon, LayoutDashboardIcon, ShieldIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboardIcon, exact: true },
  {
    href: "/dashboard/projects",
    label: "Projects",
    icon: FolderKanbanIcon,
    exact: false,
  },
  {
    href: "/dashboard/admin",
    label: "Team",
    icon: ShieldIcon,
    exact: false,
    admin: true,
  },
];

export function DashboardNav({
  isAdmin,
  className,
}: {
  isAdmin: boolean;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard" className={cn("flex gap-1 md:flex-col", className)}>
      {links
        .filter((link) => !link.admin || isAdmin)
        .map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                active && "bg-muted text-foreground",
              )}
            >
              <Icon className="size-4" />
              {link.label}
            </Link>
          );
        })}
    </nav>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getClientEnv } from "@/config/env";
import { Badge } from "@/components/ui/badge";

interface AdminNavItem {
  label: string;
  href: string;
}

const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Enquiries", href: "/admin/enquiries" },
  { label: "About", href: "/admin/about" },
  { label: "Products", href: "/admin/products" },
  { label: "Services", href: "/admin/services" },
  { label: "Portfolio", href: "/admin/portfolio" },
  { label: "Home Opening", href: "/admin/home" },
  { label: "Media Library", href: "/admin/media" },
  { label: "Site Settings", href: "/admin/settings" },
  { label: "Audit Logs", href: "/admin/audit-logs" },
  { label: "Users & Roles", href: "/admin/users" },
];

export function AdminNav() {
  const pathname = usePathname();
  const env = getClientEnv();
  const currentEnv = env.NEXT_PUBLIC_APP_ENV || "development";

  if (pathname === "/admin/sign-in") {
    return null;
  }

  return (
    <aside
      aria-label="Admin Navigation"
      className="w-full md:w-64 md:min-h-[calc(100vh-65px)] border-b md:border-b-0 md:border-r border-border-default bg-surface-primary p-4 md:p-6 flex flex-col justify-between"
    >
      <div className="space-y-6">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted block mb-3 font-semibold">
            Modules
          </span>
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {ADMIN_NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? "bg-surface-secondary text-ink-primary font-semibold border-l-2 border-accent-spectral"
                      : "text-ink-secondary hover:text-ink-primary hover:bg-surface-secondary/50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-border-subtle hidden md:block">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">
            Environment
          </span>
          <Badge variant="outline" size="sm" className="font-mono text-[10px]">
            {currentEnv.toUpperCase()}
          </Badge>
        </div>
        <p className="font-mono text-[10px] text-ink-muted leading-tight">
          AAL2 / Server-Guarded
        </p>
      </div>
    </aside>
  );
}

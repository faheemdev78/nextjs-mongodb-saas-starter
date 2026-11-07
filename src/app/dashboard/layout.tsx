import { connection } from "next/server";
import { Suspense } from "react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { Brand } from "@/components/brand";
import { DashboardNav } from "@/components/dashboard/nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { requireActor } from "@/lib/session";

export const instant = false;

async function DashboardChrome({ children }: { children: React.ReactNode }) {
  await connection();
  const actor = await requireActor();

  return (
    <div className="flex min-h-full flex-1 flex-col md:flex-row">
      <aside className="bg-card border-b md:w-60 md:border-r md:border-b-0">
        <div className="flex items-center justify-between gap-3 px-4 py-4 md:block">
          <Brand href="/dashboard" />
          <p className="text-muted-foreground mt-3 hidden text-sm md:block">
            {actor.name}
            <span className="mt-1 block text-xs tracking-wide uppercase">
              {actor.role}
            </span>
          </p>
        </div>
        <DashboardNav isAdmin={actor.role === "admin"} className="px-2 pb-3 md:px-3" />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-end gap-2 border-b px-4 py-3">
          <ThemeToggle />
          <SignOutButton />
        </div>
        <main id="main" className="flex-1 px-4 py-6 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={<div className="bg-muted/40 flex-1 animate-pulse" aria-hidden="true" />}
    >
      <DashboardChrome>{children}</DashboardChrome>
    </Suspense>
  );
}

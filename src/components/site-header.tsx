import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { Brand } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { getActor } from "@/lib/session";
import { cn } from "@/lib/utils";

async function HeaderAuth() {
  await connection();
  const actor = await getActor();
  if (!actor) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }))}>
          Sign in
        </Link>
        <Link href="/register" className={cn(buttonVariants())}>
          Create account
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/dashboard" className={cn(buttonVariants({ variant: "ghost" }))}>
        Dashboard
      </Link>
      <SignOutButton variant="outline" />
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-4">
        <Brand />
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Suspense fallback={<div className="bg-muted h-8 w-28 rounded-lg" />}>
            <HeaderAuth />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

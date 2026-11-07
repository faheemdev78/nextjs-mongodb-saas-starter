import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { GithubSignIn } from "@/components/auth/github-sign-in";
import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { authErrorMessage } from "@/lib/auth-errors";
import { DEMO_ACCOUNTS } from "@/lib/constants";
import { isGithubEnabled } from "@/lib/auth.config";
import { firstParam } from "@/lib/pagination";

export const metadata: Metadata = {
  title: "Sign in",
};

function LoginContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <LoginCard searchParams={searchParams} />;
}

async function LoginCard({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const urlError = authErrorMessage(firstParam(params.error));

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h1 className="font-heading text-base leading-snug font-medium">Sign in</h1>
        <CardDescription>
          Use a seeded demo account or the one you registered. {DEMO_ACCOUNTS[1]?.email} /{" "}
          {DEMO_ACCOUNTS[1]?.password}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <LoginForm urlError={urlError} />
        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-muted-foreground text-xs">or</span>
          <Separator className="flex-1" />
        </div>
        <GithubSignIn enabled={isGithubEnabled()} />
        <p className="text-muted-foreground text-center text-sm">
          No account?{" "}
          <Link
            href="/register"
            className="text-foreground font-medium underline-offset-4 hover:underline"
          >
            Create one
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense
      fallback={
        <div className="bg-muted h-80 w-full max-w-md animate-pulse rounded-xl" />
      }
    >
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
}

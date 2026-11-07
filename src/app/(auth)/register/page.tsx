import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";

import { GithubSignIn } from "@/components/auth/github-sign-in";
import { RegisterForm } from "@/components/auth/register-form";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { isGithubEnabled } from "@/lib/auth.config";

export const metadata: Metadata = {
  title: "Create account",
};

async function RegisterCard() {
  await connection();
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h1 className="font-heading text-base leading-snug font-medium">
          Create your account
        </h1>
        <CardDescription>
          Registration always creates a user. Promote someone from the team page after you
          sign in as an admin.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <RegisterForm />
        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-muted-foreground text-xs">or</span>
          <Separator className="flex-1" />
        </div>
        <GithubSignIn enabled={isGithubEnabled()} />
        <p className="text-muted-foreground text-center text-sm">
          Already registered?{" "}
          <Link
            href="/login"
            className="text-foreground font-medium underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-muted h-96 w-full max-w-md animate-pulse rounded-xl" />
      }
    >
      <RegisterCard />
    </Suspense>
  );
}

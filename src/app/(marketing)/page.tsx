import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME, DEMO_ACCOUNTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Auth.js",
    body: "Email and password plus an optional GitHub provider. Sessions are JWTs so the proxy can check them without MongoDB.",
  },
  {
    title: "Roles",
    body: "Users manage their own projects. Admins see every project and can change roles, except their own.",
  },
  {
    title: "Projects CRUD",
    body: "Server actions drive the forms. Route handlers expose the same rules as JSON for clients and tests.",
  },
  {
    title: "Search and pages",
    body: "Filter by name, description, and status. Page size is fixed so the list stays small and predictable.",
  },
  {
    title: "Dark mode",
    body: "shadcn/ui on Tailwind CSS v4, with a theme toggle that follows the system and then remembers your choice.",
  },
  {
    title: "Checks in CI",
    body: "ESLint, Prettier, TypeScript, Vitest, a Playwright smoke test, and a production build all run on GitHub Actions.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.3fr_0.7fr] md:py-24">
        <div className="grid content-start gap-6">
          <p className="text-primary text-sm font-medium tracking-wide uppercase">
            Next.js · Auth.js · MongoDB
          </p>
          <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            {APP_NAME} is a SaaS starter with sign-in, roles, and a real resource.
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg">
            Clone it, point it at MongoDB, and seed two demo accounts. The dashboard
            already creates, edits, searches, and pages through projects.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/register" className={cn(buttonVariants({ size: "lg" }))}>
              Create account
            </Link>
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Sign in
            </Link>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Demo accounts</CardTitle>
            <CardDescription>
              Created by <code>npm run seed</code>. Change them before any shared
              deployment.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {DEMO_ACCOUNTS.map((account) => (
              <div
                key={account.email}
                className="bg-muted/60 rounded-lg px-3 py-2 text-sm"
              >
                <p className="font-medium capitalize">{account.role}</p>
                <p>{account.email}</p>
                <p className="text-muted-foreground font-mono">{account.password}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="bg-muted/40 border-y">
        <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-14 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} size="sm">
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-14 md:grid-cols-3">
        <div>
          <h2 className="text-lg font-semibold">Proxy</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            <code>src/proxy.ts</code> sends anonymous visitors from the dashboard to
            login, and keeps non-admins out of the team page.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Server</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Actions and route handlers both call the same project service, so a form and a
            JSON client cannot drift apart.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">MongoDB</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Mongoose owns users and projects. The Auth.js adapter stores GitHub accounts
            in the same database.
          </p>
        </div>
      </section>
    </div>
  );
}

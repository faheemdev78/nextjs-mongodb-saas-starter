import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { StatusBadge } from "@/components/status-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { listProjects, projectStats } from "@/lib/projects";
import { requireActor } from "@/lib/session";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Overview",
};

async function Overview() {
  const actor = await requireActor();
  const [stats, recent] = await Promise.all([
    projectStats(actor),
    listProjects(actor, { q: "", page: 1, pageSize: 5 }),
  ]);

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="text-muted-foreground text-sm">
            {actor.role === "admin"
              ? "Counts include every project in the workspace."
              : "Counts include only projects you own."}
          </p>
        </div>
        <Link href="/dashboard/projects/new" className={cn(buttonVariants())}>
          New project
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {(Object.keys(STATUS_LABELS) as Array<keyof typeof STATUS_LABELS>).map(
          (status) => (
            <Card key={status} size="sm">
              <CardHeader>
                <CardDescription>{STATUS_LABELS[status]}</CardDescription>
                <CardTitle className="text-3xl">{stats[status]}</CardTitle>
              </CardHeader>
            </Card>
          ),
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent projects</CardTitle>
          <CardDescription>Newest first.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {recent.projects.length === 0 ? (
            <p className="text-muted-foreground text-sm">No projects yet.</p>
          ) : (
            recent.projects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="hover:bg-muted/50 flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
              >
                <span>
                  <span className="block font-medium">{project.name}</span>
                  <span className="text-muted-foreground text-xs">
                    Updated {formatDate(project.updatedAt)}
                  </span>
                </span>
                <StatusBadge status={project.status} />
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="bg-muted h-64 animate-pulse rounded-xl" />}>
      <Overview />
    </Suspense>
  );
}

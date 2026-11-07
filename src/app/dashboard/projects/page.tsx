import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { PaginationLinks } from "@/components/projects/pagination-links";
import { ProjectsToolbar } from "@/components/projects/projects-toolbar";
import { StatusBadge } from "@/components/status-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import { buildProjectsHref, firstParam, parseProjectListParams } from "@/lib/pagination";
import { listProjects } from "@/lib/projects";
import { requireActor } from "@/lib/session";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Projects",
};

async function ProjectsList({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const actor = await requireActor();
  const raw = await searchParams;
  const query = parseProjectListParams(raw);
  const result = await listProjects(actor, query);
  const notice = firstParam(raw.error);

  if (query.page > result.pageCount) {
    redirect(
      buildProjectsHref({ q: query.q, status: query.status, page: result.pageCount }),
    );
  }

  const hrefFor = (page: number) =>
    buildProjectsHref({ q: query.q, status: query.status, page });

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-muted-foreground text-sm">
            {result.total} {result.total === 1 ? "project" : "projects"}
            {actor.role === "admin" ? " in the workspace" : " you own"}.
          </p>
        </div>
        <Link href="/dashboard/projects/new" className={cn(buttonVariants())}>
          New project
        </Link>
      </div>
      {notice ? (
        <p
          role="alert"
          className="bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-sm"
        >
          That project could not be deleted.
        </p>
      ) : null}
      <ProjectsToolbar q={query.q} status={query.status} />
      {result.projects.length === 0 ? (
        <div className="rounded-xl border border-dashed px-4 py-12 text-center">
          <p className="font-medium">Nothing matches</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Try another search, or create a project.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl border md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  {actor.role === "admin" ? <TableHead>Owner</TableHead> : null}
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="font-medium underline-offset-4 hover:underline"
                      >
                        {project.name}
                      </Link>
                      <p className="text-muted-foreground max-w-md truncate text-xs">
                        {project.description}
                      </p>
                    </TableCell>
                    {actor.role === "admin" ? (
                      <TableCell>{project.ownerName}</TableCell>
                    ) : null}
                    <TableCell>
                      <StatusBadge status={project.status} />
                    </TableCell>
                    <TableCell>{formatDate(project.updatedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="grid gap-3 md:hidden">
            {result.projects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="rounded-xl border p-3"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-medium">{project.name}</span>
                  <StatusBadge status={project.status} />
                </span>
                <span className="text-muted-foreground mt-1 block text-sm">
                  {project.description}
                </span>
              </Link>
            ))}
          </div>
          <PaginationLinks
            page={result.page}
            pageCount={result.pageCount}
            hrefFor={hrefFor}
          />
        </>
      )}
    </div>
  );
}

export default function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<div className="bg-muted h-64 animate-pulse rounded-xl" />}>
      <ProjectsList searchParams={searchParams} />
    </Suspense>
  );
}

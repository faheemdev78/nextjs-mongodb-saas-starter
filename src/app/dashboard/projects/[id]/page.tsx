import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { DeleteProjectButton } from "@/components/projects/delete-project-button";
import { ProjectForm } from "@/components/projects/project-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import { getProjectForActor } from "@/lib/projects";
import { requireActor } from "@/lib/session";

export const metadata: Metadata = {
  title: "Edit project",
};

async function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const actor = await requireActor();
  const { id } = await params;
  const result = await getProjectForActor(actor, id);

  if (result.status === "not_found") notFound();

  if (result.status === "forbidden") {
    return (
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>You cannot open this project</CardTitle>
          <CardDescription>Only the owner and admins can view it.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/dashboard/projects"
            className="text-sm underline-offset-4 hover:underline"
          >
            Back to projects
          </Link>
        </CardContent>
      </Card>
    );
  }

  const project = result.project;

  return (
    <div className="mx-auto grid w-full max-w-2xl gap-4">
      <p className="text-sm">
        <Link
          href="/dashboard/projects"
          className="text-muted-foreground hover:text-foreground"
        >
          Back to projects
        </Link>
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Edit project</CardTitle>
          <CardDescription>
            Owned by {project.ownerName}. Updated {formatDate(project.updatedAt)}.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <ProjectForm project={project} />
          <div className="flex justify-end border-t pt-4">
            <DeleteProjectButton id={project.id} name={project.name} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense
      fallback={
        <div className="bg-muted mx-auto h-80 max-w-2xl animate-pulse rounded-xl" />
      }
    >
      <EditProject params={params} />
    </Suspense>
  );
}

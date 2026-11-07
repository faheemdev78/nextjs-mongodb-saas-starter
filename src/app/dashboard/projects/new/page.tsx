import type { Metadata } from "next";
import Link from "next/link";

import { ProjectForm } from "@/components/projects/project-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "New project",
};

export default function NewProjectPage() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <p className="mb-4 text-sm">
        <Link
          href="/dashboard/projects"
          className="text-muted-foreground hover:text-foreground"
        >
          Back to projects
        </Link>
      </p>
      <Card>
        <CardHeader>
          <CardTitle>New project</CardTitle>
          <CardDescription>
            You become the owner. Admins can edit it later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectForm />
        </CardContent>
      </Card>
    </div>
  );
}

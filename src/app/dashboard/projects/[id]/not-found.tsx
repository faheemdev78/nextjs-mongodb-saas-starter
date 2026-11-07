import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <div className="mx-auto max-w-lg rounded-xl border p-6">
      <h1 className="text-xl font-semibold">Project not found</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        It may have been deleted, or the link is wrong.
      </p>
      <Link
        href="/dashboard/projects"
        className="mt-4 inline-block text-sm underline-offset-4 hover:underline"
      >
        Back to projects
      </Link>
    </div>
  );
}

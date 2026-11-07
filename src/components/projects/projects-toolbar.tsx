import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PROJECT_STATUSES, STATUS_LABELS, type ProjectStatus } from "@/lib/constants";
import { cn } from "@/lib/utils";

const selectClassName =
  "h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export function ProjectsToolbar({ q, status }: { q: string; status?: ProjectStatus }) {
  return (
    <form action="/dashboard/projects" className="flex flex-col gap-2 sm:flex-row">
      <Input
        name="q"
        defaultValue={q}
        placeholder="Search name or description"
        aria-label="Search projects"
        className="sm:max-w-xs"
      />
      <select
        name="status"
        defaultValue={status ?? "all"}
        aria-label="Filter by status"
        className={selectClassName}
      >
        <option value="all">All statuses</option>
        {PROJECT_STATUSES.map((item) => (
          <option key={item} value={item}>
            {STATUS_LABELS[item]}
          </option>
        ))}
      </select>
      <div className="flex gap-2">
        <Button type="submit">Search</Button>
        {q || status ? (
          <Link
            href="/dashboard/projects"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Clear
          </Link>
        ) : null}
      </div>
    </form>
  );
}

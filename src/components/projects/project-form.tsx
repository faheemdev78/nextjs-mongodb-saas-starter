"use client";

import { useActionState } from "react";

import {
  createProjectAction,
  updateProjectAction,
  type ProjectFormState,
} from "@/actions/projects";
import { Field } from "@/components/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PROJECT_STATUSES, STATUS_LABELS, type ProjectStatus } from "@/lib/constants";

const initialState: ProjectFormState = {};

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export function ProjectForm({
  project,
}: {
  project?: {
    id: string;
    name: string;
    description: string;
    status: ProjectStatus;
  };
}) {
  const action = project
    ? updateProjectAction.bind(null, project.id)
    : createProjectAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      {state.message ? (
        <p
          role="alert"
          className="bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-sm"
        >
          {state.message}
        </p>
      ) : null}
      <Field label="Name" htmlFor="name" error={state.errors?.name}>
        <Input
          id="name"
          name="name"
          defaultValue={project?.name}
          required
          maxLength={80}
          aria-invalid={Boolean(state.errors?.name)}
          aria-describedby={state.errors?.name ? "name-error" : undefined}
        />
      </Field>
      <Field label="Description" htmlFor="description" error={state.errors?.description}>
        <Textarea
          id="description"
          name="description"
          defaultValue={project?.description}
          required
          maxLength={500}
          rows={5}
          aria-invalid={Boolean(state.errors?.description)}
          aria-describedby={state.errors?.description ? "description-error" : undefined}
        />
      </Field>
      <Field label="Status" htmlFor="status" error={state.errors?.status}>
        <select
          id="status"
          name="status"
          defaultValue={project?.status ?? "planned"}
          className={selectClassName}
          aria-invalid={Boolean(state.errors?.status)}
        >
          {PROJECT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </Field>
      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : project ? "Save changes" : "Create project"}
        </Button>
      </div>
    </form>
  );
}

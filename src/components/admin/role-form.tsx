"use client";

import { useActionState } from "react";

import { updateRoleAction, type RoleFormState } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/lib/roles";

const initialState: RoleFormState = {};

const selectClassName =
  "h-8 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export function RoleForm({
  userId,
  role,
  disabled,
}: {
  userId: string;
  role: UserRole;
  disabled?: boolean;
}) {
  const [state, formAction, pending] = useActionState(updateRoleAction, initialState);

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="userId" value={userId} />
      <select
        name="role"
        defaultValue={role}
        aria-label="Role"
        disabled={disabled}
        className={selectClassName}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <Button type="submit" size="sm" variant="outline" disabled={disabled || pending}>
        {pending ? "Saving…" : "Save"}
      </Button>
      {state.message ? (
        <span className="text-muted-foreground text-xs">{state.message}</span>
      ) : null}
    </form>
  );
}

import type { UserRole } from "@/lib/roles";

export type Actor = {
  id: string;
  role: UserRole;
  name: string;
  email: string;
};

export function canReadProject(
  actor: Pick<Actor, "id" | "role">,
  ownerId: string,
): boolean {
  return actor.role === "admin" || actor.id === ownerId;
}

export function canManageProject(
  actor: Pick<Actor, "id" | "role">,
  ownerId: string,
): boolean {
  return canReadProject(actor, ownerId);
}

import "server-only";

import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { AppError } from "@/lib/errors";
import type { Actor } from "@/lib/rbac";
import type { UserRole } from "@/lib/roles";

function toActor(user: {
  id: string;
  role?: UserRole;
  name?: string | null;
  email?: string | null;
}): Actor {
  return {
    id: user.id,
    role: user.role === "admin" ? "admin" : "user",
    name: user.name?.trim() || "Account",
    email: user.email ?? "",
  };
}

export async function getActor(): Promise<Actor | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return toActor(session.user);
}

export async function requireActor(): Promise<Actor> {
  const actor = await getActor();
  if (!actor) redirect("/login");
  return actor;
}

export async function requireAdmin(): Promise<Actor> {
  const actor = await requireActor();
  if (actor.role !== "admin") redirect("/dashboard");
  return actor;
}

export async function requireApiActor(): Promise<Actor> {
  const actor = await getActor();
  if (!actor) throw new AppError(401, "Authentication required.");
  return actor;
}

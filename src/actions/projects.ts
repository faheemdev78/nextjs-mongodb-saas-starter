"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { AppError } from "@/lib/errors";
import { createProject, deleteProject, updateProject } from "@/lib/projects";
import { requireActor } from "@/lib/session";
import { updateUserRole } from "@/lib/users";
import {
  fieldErrors,
  projectSchema,
  roleUpdateSchema,
  type ProjectInput,
} from "@/lib/validators";

export type ProjectFormState = {
  message?: string;
  errors?: {
    name?: string[];
    description?: string[];
    status?: string[];
  };
};

function revalidateProjectPaths() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/projects");
}

export async function createProjectAction(
  _previous: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const actor = await requireActor();
  const parsed = projectSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return {
      errors: fieldErrors<ProjectInput>(parsed.error),
      message: parsed.error.flatten().formErrors[0],
    };
  }

  await createProject(actor, parsed.data);
  revalidateProjectPaths();
  redirect("/dashboard/projects");
}

export async function updateProjectAction(
  id: string,
  _previous: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const actor = await requireActor();
  const parsed = projectSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { errors: fieldErrors<ProjectInput>(parsed.error) };
  }

  try {
    await updateProject(actor, id, parsed.data);
  } catch (error) {
    if (error instanceof AppError) return { message: error.message };
    throw error;
  }

  revalidateProjectPaths();
  revalidatePath(`/dashboard/projects/${id}`);
  redirect("/dashboard/projects");
}

export async function deleteProjectAction(id: string) {
  const actor = await requireActor();
  try {
    await deleteProject(actor, id);
  } catch (error) {
    if (error instanceof AppError) {
      redirect("/dashboard/projects?error=delete");
    }
    throw error;
  }
  revalidateProjectPaths();
  redirect("/dashboard/projects");
}

export type RoleFormState = {
  message?: string;
};

export async function updateRoleAction(
  _previous: RoleFormState,
  formData: FormData,
): Promise<RoleFormState> {
  const actor = await requireActor();
  const parsed = roleUpdateSchema.safeParse({
    userId: formData.get("userId"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { message: parsed.error.issues[0]?.message ?? "Invalid role." };
  }

  try {
    await updateUserRole(actor, parsed.data.userId, parsed.data.role);
  } catch (error) {
    if (error instanceof AppError) return { message: error.message };
    throw error;
  }

  revalidatePath("/dashboard/admin");
  return { message: "Role updated. The user must sign in again for it to apply." };
}

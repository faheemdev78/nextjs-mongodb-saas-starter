import { z } from "zod";

import { PROJECT_STATUSES } from "@/lib/constants";
import { USER_ROLES } from "@/lib/roles";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: "Enter a valid email address." }));

export const passwordSchema = z
  .string()
  .min(8, { error: "Use at least 8 characters." })
  .regex(/[A-Za-z]/, { error: "Include at least one letter." })
  .regex(/[0-9]/, { error: "Include at least one number." })
  .regex(/[^A-Za-z0-9]/, { error: "Include at least one symbol." });

export const credentialsSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { error: "Enter your password." }),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Name must be at least 2 characters." })
    .max(80, { error: "Name must be 80 characters or fewer." }),
  email: emailSchema,
  password: passwordSchema,
});

export const projectStatusSchema = z.enum(PROJECT_STATUSES, {
  error: "Choose a valid status.",
});

export const projectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Name must be at least 2 characters." })
    .max(80, { error: "Name must be 80 characters or fewer." }),
  description: z
    .string()
    .trim()
    .min(1, { error: "Add a short description." })
    .max(500, { error: "Description must be 500 characters or fewer." }),
  status: projectStatusSchema,
});

export const projectUpdateSchema = projectSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    error: "Provide at least one field to update.",
  });

export const roleUpdateSchema = z.object({
  userId: z.string().trim().min(1),
  role: z.enum(USER_ROLES, { error: "Choose a valid role." }),
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CredentialsInput = z.infer<typeof credentialsSchema>;

export type FieldErrors<T extends Record<string, unknown>> = {
  [K in keyof T]?: string[];
};

export function fieldErrors<T extends Record<string, unknown>>(error: z.ZodError) {
  return error.flatten().fieldErrors as FieldErrors<T>;
}

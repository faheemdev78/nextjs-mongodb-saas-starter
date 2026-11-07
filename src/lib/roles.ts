export const USER_ROLES = ["admin", "user"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export function isAdmin(role: UserRole | undefined | null): boolean {
  return role === "admin";
}

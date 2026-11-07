import type { UserRole } from "@/lib/roles";

export const APP_NAME = "Harbor";

export const PAGE_SIZE = 8;

export const PROJECT_STATUSES = ["planned", "active", "completed"] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  planned: "Planned",
  active: "Active",
  completed: "Completed",
};

/**
 * Local demo accounts created by `npm run seed`.
 * These are fixture credentials for the starter, not production secrets.
 */
export const DEMO_ACCOUNTS: Array<{
  name: string;
  email: string;
  password: string;
  role: UserRole;
}> = [
  {
    name: "Ada Admin",
    email: "admin@example.com",
    password: "Password123!",
    role: "admin",
  },
  {
    name: "Uma User",
    email: "user@example.com",
    password: "Password123!",
    role: "user",
  },
];

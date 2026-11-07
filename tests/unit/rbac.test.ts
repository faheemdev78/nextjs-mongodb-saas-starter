import { describe, expect, it } from "vitest";

import { canManageProject, canReadProject } from "@/lib/rbac";

const owner = { id: "user-1", role: "user" as const };
const other = { id: "user-2", role: "user" as const };
const admin = { id: "admin-1", role: "admin" as const };

describe("project access", () => {
  it("lets a user read and manage only their own projects", () => {
    expect(canReadProject(owner, "user-1")).toBe(true);
    expect(canManageProject(owner, "user-1")).toBe(true);
    expect(canReadProject(owner, "user-2")).toBe(false);
    expect(canManageProject(other, "user-1")).toBe(false);
  });

  it("lets an admin read and manage every project", () => {
    expect(canReadProject(admin, "user-1")).toBe(true);
    expect(canManageProject(admin, "user-2")).toBe(true);
  });
});

import { describe, expect, it } from "vitest";

import {
  credentialsSchema,
  projectSchema,
  projectUpdateSchema,
  registerSchema,
} from "@/lib/validators";

describe("registerSchema", () => {
  it("normalizes email and accepts a strong password", () => {
    const parsed = registerSchema.parse({
      name: "  Ada  ",
      email: "  Ada@Example.com ",
      password: "Password123!",
      role: "admin",
    });

    expect(parsed).toEqual({
      name: "Ada",
      email: "ada@example.com",
      password: "Password123!",
    });
  });

  it("rejects a short name and a weak password", () => {
    const result = registerSchema.safeParse({
      name: "A",
      email: "ada@example.com",
      password: "password",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.name?.[0]).toMatch(/2 characters/);
      expect(errors.password?.join(" ")).toMatch(/number/);
    }
  });
});

describe("credentialsSchema", () => {
  it("requires a password but does not enforce the registration rules", () => {
    expect(
      credentialsSchema.safeParse({ email: "ada@example.com", password: "x" }).success,
    ).toBe(true);
    expect(
      credentialsSchema.safeParse({ email: "ada@example.com", password: "" }).success,
    ).toBe(false);
  });
});

describe("projectSchema", () => {
  const valid = {
    name: "Harbor",
    description: "A starter project.",
    status: "active",
  };

  it("accepts a complete project", () => {
    expect(projectSchema.parse(valid)).toEqual(valid);
  });

  it("rejects an unknown status and a long name", () => {
    const result = projectSchema.safeParse({
      ...valid,
      name: "n".repeat(81),
      status: "archived",
    });
    expect(result.success).toBe(false);
  });

  it("allows a partial update and rejects an empty one", () => {
    expect(projectUpdateSchema.parse({ name: "Renamed" })).toEqual({ name: "Renamed" });
    expect(projectUpdateSchema.safeParse({}).success).toBe(false);
  });
});

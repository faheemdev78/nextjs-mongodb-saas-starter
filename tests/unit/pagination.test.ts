import { describe, expect, it } from "vitest";

import {
  buildProjectsHref,
  escapeRegex,
  pageCount,
  parsePage,
  parseProjectListParams,
} from "@/lib/pagination";

describe("parsePage", () => {
  it("falls back to the first page for missing or invalid values", () => {
    expect(parsePage(undefined)).toBe(1);
    expect(parsePage("0")).toBe(1);
    expect(parsePage("-3")).toBe(1);
    expect(parsePage("nope")).toBe(1);
    expect(parsePage(["4", "2"])).toBe(4);
  });

  it("caps an extreme page", () => {
    expect(parsePage("999999")).toBe(10_000);
  });
});

describe("pageCount", () => {
  it("returns one page when there are no rows", () => {
    expect(pageCount(0, 8)).toBe(1);
  });

  it("rounds up partial pages", () => {
    expect(pageCount(8, 8)).toBe(1);
    expect(pageCount(9, 8)).toBe(2);
  });
});

describe("escapeRegex", () => {
  it("escapes metacharacters", () => {
    expect(escapeRegex("a+b (c)")).toBe("a\\+b \\(c\\)");
  });
});

describe("project list params", () => {
  it("drops an unknown status and trims the query", () => {
    expect(
      parseProjectListParams({
        q: "  harbor  ",
        status: "archived",
        page: "2",
      }),
    ).toMatchObject({
      q: "harbor",
      status: undefined,
      page: 2,
      pageSize: 8,
    });
  });

  it("builds a href without default values", () => {
    expect(buildProjectsHref({})).toBe("/dashboard/projects");
    expect(buildProjectsHref({ q: "harbor", status: "active", page: 2 })).toBe(
      "/dashboard/projects?q=harbor&status=active&page=2",
    );
    expect(buildProjectsHref({ status: "all", page: 1 })).toBe("/dashboard/projects");
  });
});

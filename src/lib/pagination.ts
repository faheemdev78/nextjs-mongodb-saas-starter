import { PAGE_SIZE, PROJECT_STATUSES, type ProjectStatus } from "@/lib/constants";

export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function parsePage(value: string | string[] | undefined): number {
  const raw = firstParam(value);
  const page = Number.parseInt(raw ?? "1", 10);
  if (!Number.isFinite(page) || page < 1) return 1;
  return Math.min(page, 10_000);
}

export function pageCount(total: number, pageSize = PAGE_SIZE): number {
  if (total <= 0) return 1;
  return Math.ceil(total / pageSize);
}

export type ProjectListQuery = {
  q: string;
  status?: ProjectStatus;
  page: number;
  pageSize: number;
};

export function parseProjectListParams(
  input: Record<string, string | string[] | undefined>,
): ProjectListQuery {
  const q = (firstParam(input.q) ?? "").trim().slice(0, 80);
  const statusRaw = firstParam(input.status);
  const status = PROJECT_STATUSES.find((item) => item === statusRaw);
  return {
    q,
    status,
    page: parsePage(input.page),
    pageSize: PAGE_SIZE,
  };
}

export function buildProjectsHref(input: {
  q?: string;
  status?: ProjectStatus | "all";
  page?: number;
}): string {
  const params = new URLSearchParams();
  const q = input.q?.trim();
  if (q) params.set("q", q);
  if (input.status && input.status !== "all") params.set("status", input.status);
  if (input.page && input.page > 1) params.set("page", String(input.page));
  const query = params.toString();
  return query ? `/dashboard/projects?${query}` : "/dashboard/projects";
}

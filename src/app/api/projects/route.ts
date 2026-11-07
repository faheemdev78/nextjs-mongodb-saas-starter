import { NextResponse } from "next/server";

import { jsonError } from "@/lib/http";
import { parseProjectListParams } from "@/lib/pagination";
import { createProject, listProjects } from "@/lib/projects";
import { requireApiActor } from "@/lib/session";
import { projectSchema } from "@/lib/validators";

export async function GET(request: Request) {
  try {
    const actor = await requireApiActor();
    const url = new URL(request.url);
    const query = parseProjectListParams({
      q: url.searchParams.get("q") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      page: url.searchParams.get("page") ?? undefined,
    });
    const result = await listProjects(actor, query);
    return NextResponse.json(result);
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const actor = await requireApiActor();
    const body: unknown = await request.json().catch(() => null);
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid project.", fieldErrors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    const project = await createProject(actor, parsed.data);
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}

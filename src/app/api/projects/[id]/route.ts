import { NextResponse } from "next/server";

import { jsonError } from "@/lib/http";
import { deleteProject, getProjectForActor, updateProject } from "@/lib/projects";
import { requireApiActor } from "@/lib/session";
import { projectUpdateSchema } from "@/lib/validators";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const actor = await requireApiActor();
    const { id } = await context.params;
    const result = await getProjectForActor(actor, id);
    if (result.status === "not_found") {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }
    if (result.status === "forbidden") {
      return NextResponse.json(
        { error: "You do not have access to this project." },
        { status: 403 },
      );
    }
    return NextResponse.json({ project: result.project });
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const actor = await requireApiActor();
    const { id } = await context.params;
    const body: unknown = await request.json().catch(() => null);
    const parsed = projectUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.flatten().formErrors[0] ?? "Invalid project.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }
    const project = await updateProject(actor, id, parsed.data);
    return NextResponse.json({ project });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const actor = await requireApiActor();
    const { id } = await context.params;
    await deleteProject(actor, id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return jsonError(error);
  }
}

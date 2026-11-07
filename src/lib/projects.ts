import "server-only";

import { Types, isValidObjectId } from "mongoose";

import { connectDB } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { escapeRegex, pageCount, type ProjectListQuery } from "@/lib/pagination";
import { canManageProject, canReadProject, type Actor } from "@/lib/rbac";
import type { ProjectInput, ProjectUpdateInput } from "@/lib/validators";
import { Project } from "@/models/project";
import type { ProjectStatus } from "@/lib/constants";

export type ProjectDTO = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  ownerId: string;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
};

export type ProjectListResult = {
  projects: ProjectDTO[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
};

type PopulatedOwner = {
  _id: Types.ObjectId;
  name?: string | null;
  email?: string | null;
};

function toProjectDTO(input: unknown): ProjectDTO {
  const project = input as {
    _id: { toString(): string };
    name: string;
    description: string;
    status: ProjectStatus;
    owner: Types.ObjectId | PopulatedOwner;
    createdAt: Date;
    updatedAt: Date;
  };
  const owner = project.owner;
  const populated = typeof owner === "object" && owner !== null && "email" in owner;

  return {
    id: project._id.toString(),
    name: project.name,
    description: project.description,
    status: project.status,
    ownerId: populated ? owner._id.toString() : owner.toString(),
    ownerName: populated ? owner.name?.trim() || owner.email || "Unknown" : "Unknown",
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}

async function findProject(id: string) {
  if (!isValidObjectId(id)) return null;
  return Project.findById(id).populate<{ owner: PopulatedOwner }>("owner", "name email");
}

export async function listProjects(
  actor: Actor,
  query: ProjectListQuery,
): Promise<ProjectListResult> {
  await connectDB();
  const filter: Record<string, unknown> = {};
  if (actor.role !== "admin") {
    filter.owner = new Types.ObjectId(actor.id);
  }
  if (query.status) filter.status = query.status;
  if (query.q) {
    const pattern = new RegExp(escapeRegex(query.q), "i");
    filter.$or = [{ name: pattern }, { description: pattern }];
  }

  const total = await Project.countDocuments(filter);
  const pages = pageCount(total, query.pageSize);
  const projects = await Project.find(filter)
    .sort({ createdAt: -1 })
    .skip((query.page - 1) * query.pageSize)
    .limit(query.pageSize)
    .populate<{ owner: PopulatedOwner }>("owner", "name email");

  return {
    projects: projects.map((project) => toProjectDTO(project)),
    page: query.page,
    pageSize: query.pageSize,
    total,
    pageCount: pages,
  };
}

export async function getProjectForActor(actor: Actor, id: string) {
  await connectDB();
  const project = await findProject(id);
  if (!project) return { status: "not_found" as const };
  const dto = toProjectDTO(project);
  if (!canReadProject(actor, dto.ownerId)) return { status: "forbidden" as const };
  return { status: "ok" as const, project: dto };
}

export async function projectStats(actor: Actor) {
  await connectDB();
  const match = actor.role === "admin" ? {} : { owner: new Types.ObjectId(actor.id) };
  const rows = await Project.aggregate<{ _id: ProjectStatus; count: number }>([
    { $match: match },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  const counts: Record<ProjectStatus, number> = {
    planned: 0,
    active: 0,
    completed: 0,
  };
  for (const row of rows) {
    if (row._id in counts) counts[row._id] = row.count;
  }
  return counts;
}

export async function createProject(
  actor: Actor,
  input: ProjectInput,
): Promise<ProjectDTO> {
  await connectDB();
  const project = await Project.create({
    ...input,
    owner: new Types.ObjectId(actor.id),
  });
  await project.populate<{ owner: PopulatedOwner }>("owner", "name email");
  return toProjectDTO(project);
}

async function requireManageable(actor: Actor, id: string) {
  const project = await findProject(id);
  if (!project) throw new AppError(404, "Project not found.");
  const dto = toProjectDTO(project);
  if (!canManageProject(actor, dto.ownerId)) {
    throw new AppError(403, "You do not have access to this project.");
  }
  return project;
}

export async function updateProject(
  actor: Actor,
  id: string,
  input: ProjectUpdateInput,
): Promise<ProjectDTO> {
  await connectDB();
  const existing = await requireManageable(actor, id);
  existing.set(input);
  await existing.save();
  await existing.populate<{ owner: PopulatedOwner }>("owner", "name email");
  return toProjectDTO(existing);
}

export async function deleteProject(actor: Actor, id: string): Promise<void> {
  await connectDB();
  const existing = await requireManageable(actor, id);
  await existing.deleteOne();
}

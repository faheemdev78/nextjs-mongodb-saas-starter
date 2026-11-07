import "server-only";

import { isValidObjectId } from "mongoose";

import { connectDB } from "@/lib/db";
import { AppError } from "@/lib/errors";
import type { Actor } from "@/lib/rbac";
import type { UserRole } from "@/lib/roles";
import { User } from "@/models/user";

export type UserDTO = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export async function listUsers(): Promise<UserDTO[]> {
  await connectDB();
  const users = await User.find().sort({ createdAt: 1 });
  return users.map((user) => ({
    id: user.id,
    name: user.name?.trim() || "Account",
    email: user.email,
    role: user.role === "admin" ? "admin" : "user",
    createdAt: user.createdAt.toISOString(),
  }));
}

export async function updateUserRole(
  actor: Actor,
  userId: string,
  role: UserRole,
): Promise<UserDTO> {
  if (actor.role !== "admin") {
    throw new AppError(403, "Only admins can change roles.");
  }
  if (actor.id === userId) {
    throw new AppError(400, "You cannot change your own role.");
  }
  if (!isValidObjectId(userId)) throw new AppError(404, "User not found.");

  await connectDB();
  const target = await User.findById(userId);
  if (!target) throw new AppError(404, "User not found.");

  if (target.role === "admin" && role === "user") {
    const admins = await User.countDocuments({ role: "admin" });
    if (admins <= 1) {
      throw new AppError(400, "At least one admin is required.");
    }
  }

  target.role = role;
  await target.save();

  return {
    id: target.id,
    name: target.name?.trim() || "Account",
    email: target.email,
    role: target.role,
    createdAt: target.createdAt.toISOString(),
  };
}

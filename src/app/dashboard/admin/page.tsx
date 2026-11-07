import type { Metadata } from "next";
import { Suspense } from "react";

import { RoleForm } from "@/components/admin/role-form";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import { requireAdmin } from "@/lib/session";
import { listUsers } from "@/lib/users";

export const metadata: Metadata = {
  title: "Team",
};

async function Team() {
  const actor = await requireAdmin();
  const users = await listUsers();

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Team</h1>
        <p className="text-muted-foreground text-sm">
          Admins can change roles. A role sticks on the next sign-in, because it lives in
          the session token. You cannot remove your own admin role.
        </p>
      </div>
      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.name}
                  {user.id === actor.id ? (
                    <Badge variant="outline" className="ml-2">
                      You
                    </Badge>
                  ) : null}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell>
                  <RoleForm
                    userId={user.id}
                    role={user.role}
                    disabled={user.id === actor.id}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="bg-muted h-64 animate-pulse rounded-xl" />}>
      <Team />
    </Suspense>
  );
}

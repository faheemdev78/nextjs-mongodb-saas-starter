import { hash } from "bcryptjs";
import { config as loadEnv } from "dotenv";

import { DEMO_ACCOUNTS, type ProjectStatus } from "../src/lib/constants";
import { connectDB } from "../src/lib/db";
import { Project } from "../src/models/project";
import { User } from "../src/models/user";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

const SAMPLE_PROJECTS: Array<{
  name: string;
  description: string;
  status: ProjectStatus;
  ownerEmail: string;
}> = [
  {
    name: "Harbor launch site",
    description: "Marketing page and waitlist for the public launch.",
    status: "active",
    ownerEmail: "user@example.com",
  },
  {
    name: "Billing portal",
    description: "Customer invoices, plans, and payment method updates.",
    status: "planned",
    ownerEmail: "user@example.com",
  },
  {
    name: "Onboarding checklist",
    description: "First-run tasks that turn a signup into an active workspace.",
    status: "active",
    ownerEmail: "user@example.com",
  },
  {
    name: "Audit log",
    description: "Record role changes and project edits for admins.",
    status: "planned",
    ownerEmail: "user@example.com",
  },
  {
    name: "Status page",
    description: "Public uptime view backed by the health endpoint.",
    status: "completed",
    ownerEmail: "user@example.com",
  },
  {
    name: "Search relevance",
    description: "Tune project search so names rank above descriptions.",
    status: "active",
    ownerEmail: "user@example.com",
  },
  {
    name: "Mobile nav",
    description: "Collapse the dashboard sidebar on small screens.",
    status: "completed",
    ownerEmail: "user@example.com",
  },
  {
    name: "Email digests",
    description: "Weekly summary of projects that changed status.",
    status: "planned",
    ownerEmail: "user@example.com",
  },
  {
    name: "Import CSV",
    description: "Let a user bring an existing project list into Harbor.",
    status: "planned",
    ownerEmail: "user@example.com",
  },
  {
    name: "Admin review queue",
    description: "A queue of projects flagged for an admin to look at.",
    status: "active",
    ownerEmail: "admin@example.com",
  },
  {
    name: "Role policy",
    description: "Document which actions require the admin role.",
    status: "completed",
    ownerEmail: "admin@example.com",
  },
  {
    name: "Seed fixtures",
    description: "Keep the demo dataset idempotent and safe to rerun.",
    status: "completed",
    ownerEmail: "admin@example.com",
  },
];

async function main() {
  if (process.env.NODE_ENV === "production" && process.env.SEED_DEMO_DATA !== "true") {
    console.error(
      "Refusing to seed demo data in production. Set SEED_DEMO_DATA=true to override.",
    );
    process.exit(1);
  }

  await connectDB();

  for (const account of DEMO_ACCOUNTS) {
    const passwordHash = await hash(account.password, 12);
    await User.findOneAndUpdate(
      { email: account.email },
      {
        name: account.name,
        email: account.email,
        passwordHash,
        role: account.role,
        emailVerified: new Date(),
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    );
  }

  const users = await User.find({
    email: { $in: DEMO_ACCOUNTS.map((account) => account.email) },
  });
  const byEmail = new Map(users.map((user) => [user.email, user]));

  await Project.deleteMany({ owner: { $in: users.map((user) => user._id) } });

  await Project.insertMany(
    SAMPLE_PROJECTS.map((project) => {
      const owner = byEmail.get(project.ownerEmail);
      if (!owner) {
        throw new Error(`Missing demo user ${project.ownerEmail}`);
      }
      return {
        name: project.name,
        description: project.description,
        status: project.status,
        owner: owner._id,
      };
    }),
  );

  console.log(`Seeded ${users.length} users and ${SAMPLE_PROJECTS.length} projects.`);
  for (const account of DEMO_ACCOUNTS) {
    console.log(`  ${account.role.padEnd(5)}  ${account.email}  ${account.password}`);
  }
}

main()
  .then(async () => {
    const mongoose = await import("mongoose");
    await mongoose.default.disconnect();
    process.exit(0);
  })
  .catch(async (error: unknown) => {
    console.error(error);
    const mongoose = await import("mongoose");
    await mongoose.default.disconnect().catch(() => undefined);
    process.exit(1);
  });

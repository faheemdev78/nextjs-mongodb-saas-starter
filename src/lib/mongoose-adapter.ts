import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken as AuthVerificationToken,
} from "@auth/core/adapters";
import { Types, isValidObjectId } from "mongoose";

import { connectDB } from "@/lib/db";
import type { UserRole } from "@/lib/roles";
import { Account } from "@/models/account";
import { AuthSession } from "@/models/session";
import { User } from "@/models/user";
import { VerificationToken } from "@/models/verification-token";

type UserRecord = {
  _id: Types.ObjectId;
  name?: string | null;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  role?: UserRole;
};

function toAdapterUser(user: UserRecord): AdapterUser & { role: UserRole } {
  return {
    id: user._id.toString(),
    name: user.name ?? null,
    email: user.email,
    emailVerified: user.emailVerified ?? null,
    image: user.image ?? null,
    role: user.role ?? "user",
  };
}

function toObjectId(id: string): Types.ObjectId | null {
  if (!isValidObjectId(id)) return null;
  return new Types.ObjectId(id);
}

/**
 * Auth.js adapter backed by the same Mongoose models as the rest of the app.
 * Credentials sign-in still uses JWT sessions; this adapter persists OAuth
 * users, linked accounts, and optional database sessions.
 */
export function mongooseAdapter(): Adapter {
  return {
    async createUser(user) {
      await connectDB();
      const created = await User.create({
        name: user.name,
        email: user.email.toLowerCase(),
        emailVerified: user.emailVerified,
        image: user.image,
        role: "user",
      });
      return toAdapterUser(created);
    },
    async getUser(id) {
      await connectDB();
      const objectId = toObjectId(id);
      if (!objectId) return null;
      const user = await User.findById(objectId);
      return user ? toAdapterUser(user) : null;
    },
    async getUserByEmail(email) {
      await connectDB();
      const user = await User.findOne({ email: email.toLowerCase() });
      return user ? toAdapterUser(user) : null;
    },
    async getUserByAccount({ provider, providerAccountId }) {
      await connectDB();
      const account = await Account.findOne({ provider, providerAccountId });
      if (!account) return null;
      const user = await User.findById(account.userId);
      return user ? toAdapterUser(user) : null;
    },
    async updateUser(user) {
      await connectDB();
      const objectId = toObjectId(user.id);
      if (!objectId) throw new Error("Invalid user id.");
      const update: Record<string, unknown> = {};
      if (user.name !== undefined) update.name = user.name;
      if (user.email !== undefined) update.email = user.email.toLowerCase();
      if (user.emailVerified !== undefined) update.emailVerified = user.emailVerified;
      if (user.image !== undefined) update.image = user.image;
      const updated = await User.findByIdAndUpdate(objectId, update, { new: true });
      if (!updated) throw new Error("User not found.");
      return toAdapterUser(updated);
    },
    async deleteUser(userId) {
      await connectDB();
      const objectId = toObjectId(userId);
      if (!objectId) return;
      await Promise.all([
        Account.deleteMany({ userId: objectId }),
        AuthSession.deleteMany({ userId: objectId }),
        User.deleteOne({ _id: objectId }),
      ]);
    },
    async linkAccount(account: AdapterAccount) {
      await connectDB();
      const userId = toObjectId(account.userId);
      if (!userId) throw new Error("Invalid user id.");
      await Account.create({
        userId,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refresh_token: account.refresh_token,
        access_token: account.access_token,
        expires_at: account.expires_at,
        token_type: account.token_type,
        scope: account.scope,
        id_token: account.id_token,
        session_state: account.session_state,
      });
    },
    async unlinkAccount({ provider, providerAccountId }) {
      await connectDB();
      await Account.deleteOne({ provider, providerAccountId });
    },
    async getAccount(providerAccountId, provider) {
      await connectDB();
      const account = await Account.findOne({ provider, providerAccountId }).lean();
      if (!account) return null;
      const adapterAccount = {
        userId: account.userId.toString(),
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refresh_token: account.refresh_token ?? undefined,
        access_token: account.access_token ?? undefined,
        expires_at: account.expires_at ?? undefined,
        token_type: account.token_type ?? undefined,
        scope: account.scope ?? undefined,
        id_token: account.id_token ?? undefined,
        session_state: account.session_state ?? undefined,
      };
      return adapterAccount as AdapterAccount;
    },
    async createSession(session) {
      await connectDB();
      const userId = toObjectId(session.userId);
      if (!userId) throw new Error("Invalid user id.");
      await AuthSession.create({
        sessionToken: session.sessionToken,
        userId,
        expires: session.expires,
      });
      return session;
    },
    async getSessionAndUser(sessionToken) {
      await connectDB();
      const session = await AuthSession.findOne({ sessionToken });
      if (!session) return null;
      if (session.expires < new Date()) {
        await AuthSession.deleteOne({ sessionToken });
        return null;
      }
      const user = await User.findById(session.userId);
      if (!user) return null;
      const adapterSession: AdapterSession = {
        sessionToken: session.sessionToken,
        userId: session.userId.toString(),
        expires: session.expires,
      };
      return { session: adapterSession, user: toAdapterUser(user) };
    },
    async updateSession(session) {
      await connectDB();
      const update: Record<string, unknown> = {};
      if (session.expires !== undefined) update.expires = session.expires;
      if (session.userId !== undefined) {
        const userId = toObjectId(session.userId);
        if (!userId) return null;
        update.userId = userId;
      }
      const updated = await AuthSession.findOneAndUpdate(
        { sessionToken: session.sessionToken },
        update,
        { new: true },
      );
      if (!updated) return null;
      return {
        sessionToken: updated.sessionToken,
        userId: updated.userId.toString(),
        expires: updated.expires,
      };
    },
    async deleteSession(sessionToken) {
      await connectDB();
      const session = await AuthSession.findOneAndDelete({ sessionToken });
      if (!session) return null;
      return {
        sessionToken: session.sessionToken,
        userId: session.userId.toString(),
        expires: session.expires,
      };
    },
    async createVerificationToken(verificationToken) {
      await connectDB();
      await VerificationToken.create(verificationToken);
      return verificationToken;
    },
    async useVerificationToken({ identifier, token }) {
      await connectDB();
      const existing = await VerificationToken.findOneAndDelete({ identifier, token });
      if (!existing) return null;
      const result: AuthVerificationToken = {
        identifier: existing.identifier,
        token: existing.token,
        expires: existing.expires,
      };
      return result;
    },
  };
}

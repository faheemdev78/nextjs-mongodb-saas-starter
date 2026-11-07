import { Schema, Types, type InferSchemaType } from "mongoose";

import { registerModel } from "@/models/register";

const sessionSchema = new Schema(
  {
    sessionToken: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    expires: { type: Date, required: true },
  },
  { timestamps: true },
);

export type SessionDocument = InferSchemaType<typeof sessionSchema> & {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
};

export const AuthSession = registerModel<SessionDocument>("AuthSession", sessionSchema);

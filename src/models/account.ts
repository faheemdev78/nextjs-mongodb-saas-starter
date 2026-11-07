import { Schema, Types, type InferSchemaType } from "mongoose";

import { registerModel } from "@/models/register";

const accountSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, required: true },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
    refresh_token: { type: String },
    access_token: { type: String },
    expires_at: { type: Number },
    token_type: { type: String },
    scope: { type: String },
    id_token: { type: String },
    session_state: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

accountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

export type AccountDocument = InferSchemaType<typeof accountSchema> & {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
};

export const Account = registerModel<AccountDocument>("Account", accountSchema);

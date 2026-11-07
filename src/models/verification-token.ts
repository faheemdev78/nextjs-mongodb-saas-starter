import { Schema, Types, type InferSchemaType } from "mongoose";

import { registerModel } from "@/models/register";

const verificationTokenSchema = new Schema({
  identifier: { type: String, required: true },
  token: { type: String, required: true },
  expires: { type: Date, required: true },
});

verificationTokenSchema.index({ identifier: 1, token: 1 }, { unique: true });

export type VerificationTokenDocument = InferSchemaType<
  typeof verificationTokenSchema
> & {
  _id: Types.ObjectId;
};

export const VerificationToken = registerModel<VerificationTokenDocument>(
  "VerificationToken",
  verificationTokenSchema,
);

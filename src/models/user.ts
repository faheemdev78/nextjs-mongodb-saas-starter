import { Schema, type InferSchemaType, type Types } from "mongoose";

import { USER_ROLES } from "@/lib/roles";
import { registerModel } from "@/models/register";

const userSchema = new Schema(
  {
    name: { type: String, trim: true, default: null },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    emailVerified: { type: Date, default: null },
    image: { type: String, default: null },
    passwordHash: { type: String, select: false, default: null },
    role: { type: String, enum: USER_ROLES, default: "user", required: true },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: Types.ObjectId;
  role: (typeof USER_ROLES)[number];
};

export const User = registerModel<UserDocument>("User", userSchema);

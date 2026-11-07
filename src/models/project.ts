import { Schema, Types, type InferSchemaType } from "mongoose";

import { PROJECT_STATUSES } from "@/lib/constants";
import { registerModel } from "@/models/register";

const projectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    status: {
      type: String,
      enum: PROJECT_STATUSES,
      default: "planned",
      required: true,
      index: true,
    },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true },
);

projectSchema.index({ owner: 1, createdAt: -1 });
projectSchema.index({ createdAt: -1 });

export type ProjectDocument = InferSchemaType<typeof projectSchema> & {
  _id: Types.ObjectId;
  owner: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const Project = registerModel<ProjectDocument>("Project", projectSchema);

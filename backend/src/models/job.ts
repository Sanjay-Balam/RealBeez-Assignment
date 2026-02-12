import mongoose, { Schema, Document, type InferSchemaType } from "mongoose";

const JobSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    location: { type: String, required: true, trim: true },
    fixedSalary: { type: String, required: true, trim: true },
    jobRoleType: { type: String, trim: true, default: null },
    employmentType: {
      type: String,
      required: true,
      enum: ["full-time", "part-time"],
    },
    educationalQualification: { type: String, trim: true, default: null },
    experienceRequired: { type: String, required: true, trim: true },
    requiredSkills: { type: [String], default: null },
    languageRequirements: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "At least one language is required",
      },
    },
    propertyTypes: { type: [String], default: null },
    description: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

type JobSchemaType = InferSchemaType<typeof JobSchema>;
interface IJob extends JobSchemaType, Document {}

JobSchema.index({ createdAt: -1 });
JobSchema.index({ employmentType: 1 });
JobSchema.index({ title: "text", description: "text" });

export default mongoose.model<IJob>("Jobs", JobSchema);

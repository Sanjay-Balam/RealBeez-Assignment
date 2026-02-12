import { Elysia, t } from "elysia";
import { createJob } from "../controllers/jobController";

export const createJobRoute = new Elysia({ prefix: "/create" }).post(
  "/job",
  async ({ body }) => {
    return createJob(body);
  },
  {
    body: t.Object({
      title: t.String({ minLength: 1 }),
      location: t.String({ minLength: 1 }),
      fixedSalary: t.String({ minLength: 1 }),
      jobRoleType: t.Optional(t.String()),
      employmentType: t.Union([
        t.Literal("full-time"),
        t.Literal("part-time"),
      ]),
      educationalQualification: t.Optional(t.String()),
      experienceRequired: t.String({ minLength: 1 }),
      requiredSkills: t.Optional(t.Array(t.String())),
      languageRequirements: t.Array(t.String({ minLength: 1 }), {
        minItems: 1,
      }),
      propertyTypes: t.Optional(t.Array(t.String())),
      description: t.String({ minLength: 1 }),
    }),
  }
);

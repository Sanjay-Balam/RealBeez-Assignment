export interface Job {
  _id: string;
  title: string;
  location: string;
  fixedSalary: string;
  jobRoleType: string | null;
  employmentType: "full-time" | "part-time";
  educationalQualification: string | null;
  experienceRequired: string;
  requiredSkills: string[] | null;
  languageRequirements: string[];
  propertyTypes: string[] | null;
  description: string;
  createdAt: string;
}

export type CreateJobInput = Omit<Job, "_id" | "createdAt">;

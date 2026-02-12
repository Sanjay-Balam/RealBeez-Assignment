import Job from "../models/job";

export async function getAllJobs() {
  return Job.find().sort({ createdAt: -1 }).lean();
}

export async function createJob(body: Record<string, unknown>) {
  const job = await Job.create({ ...body });
  return job.toObject();
}

export async function deleteJob(id: string) {
  await Job.findByIdAndDelete(id);
  return { success: true };
}

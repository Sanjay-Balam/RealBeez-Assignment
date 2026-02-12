import type { Job, CreateJobInput } from "./types";

const API_URL = "http://localhost:3001";

export async function getJobs(): Promise<Job[]> {
  const res = await fetch(`${API_URL}/jobs`);
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
}

export async function createJob(data: CreateJobInput): Promise<Job> {
  const res = await fetch(`${API_URL}/create/job`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create job");
  return res.json();
}

export async function deleteJob(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/jobs/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete job");
}

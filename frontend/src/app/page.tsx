"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import type { CreateJobInput } from "@/lib/types";
import { getJobs, createJob, deleteJob } from "@/lib/api";
import { jobsAtom, jobsLoadedAtom } from "@/lib/atoms";
import JobForm from "@/components/JobForm";
import JobList from "@/components/JobList";

export default function Home() {
  const [jobs, setJobs] = useAtom(jobsAtom);
  const [jobsLoaded, setJobsLoaded] = useAtom(jobsLoadedAtom);

  useEffect(() => {
    if (jobsLoaded) return;
    getJobs()
      .then((data) => {
        setJobs(data);
        setJobsLoaded(true);
      })
      .catch(console.error);
  }, [jobsLoaded, setJobs, setJobsLoaded]);

  async function handleCreate(data: CreateJobInput) {
    const newJob = await createJob(data);
    setJobs((prev) => [newJob, ...prev]);
  }

  async function handleDelete(id: string) {
    setJobs((prev) => prev.filter((j) => j._id !== id));
    try {
      await deleteJob(id);
    } catch {
      const refreshed = await getJobs();
      setJobs(refreshed);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Post a Job Section */}
      <section>
        <JobForm onSubmit={handleCreate} />
      </section>

      {/* Divider */}
      <div className="relative">
        <hr className="border-gray-200" />
        <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50 px-4 text-sm text-gray-400">
          Posted Positions
        </span>
      </div>

      {/* Job Listings Section */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-gray-900">Job Listings</h2>
          {jobsLoaded && jobs.length > 0 && (
            <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
              {jobs.length} {jobs.length === 1 ? "position" : "positions"}
            </span>
          )}
        </div>
        <JobList jobs={jobs} loading={!jobsLoaded} onDelete={handleDelete} />
      </section>
    </div>
  );
}

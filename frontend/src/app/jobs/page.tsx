"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import { getJobs, deleteJob } from "@/lib/api";
import { jobsAtom, jobsLoadedAtom } from "@/lib/atoms";
import JobList from "@/components/JobList";

export default function JobsPage() {
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">All Job Listings</h2>
        {jobsLoaded && jobs.length > 0 && (
          <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
            {jobs.length} {jobs.length === 1 ? "position" : "positions"}
          </span>
        )}
      </div>
      <JobList jobs={jobs} loading={!jobsLoaded} onDelete={handleDelete} />
    </div>
  );
}

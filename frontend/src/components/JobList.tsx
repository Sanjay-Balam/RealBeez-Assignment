"use client";

import type { Job } from "@/lib/types";
import JobCard from "./JobCard";

interface JobListProps {
  jobs: Job[];
  loading: boolean;
  onDelete: (id: string) => void;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      <div className="h-1 bg-gray-200" />
      <div className="p-5">
        <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="flex gap-2 mb-4">
          <div className="h-6 bg-gray-200 rounded-full w-20" />
          <div className="h-6 bg-gray-200 rounded-full w-28" />
          <div className="h-6 bg-gray-200 rounded-full w-24" />
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-4/5" />
        </div>
        <div className="border-t border-gray-100 pt-4">
          <div className="flex gap-2">
            <div className="h-5 bg-gray-100 rounded w-16" />
            <div className="h-5 bg-gray-100 rounded w-20" />
            <div className="h-5 bg-gray-100 rounded w-14" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JobList({ jobs, loading, onDelete }: JobListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-10 h-10 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-500 mb-1">
          No job postings yet
        </h3>
        <p className="text-sm text-gray-400">
          Create your first real estate job listing above to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} onDelete={onDelete} />
      ))}
    </div>
  );
}

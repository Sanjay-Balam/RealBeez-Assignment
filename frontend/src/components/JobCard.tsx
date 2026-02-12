"use client";

import type { Job } from "@/lib/types";

interface JobCardProps {
  job: Job;
  onDelete: (id: string) => void;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export default function JobCard({ job, onDelete }: JobCardProps) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Top colored bar */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate">
              {job.title}
            </h3>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
              {/* Location */}
              <span className="inline-flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {job.location}
              </span>
              {/* Time */}
              <span className="text-gray-400">{timeAgo(job.createdAt)}</span>
            </div>
          </div>
          {/* Delete button */}
          <button
            onClick={() => onDelete(job._id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 cursor-pointer"
            title="Delete job"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {/* Employment Type */}
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
              job.employmentType === "full-time"
                ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
            }`}
          >
            {job.employmentType === "full-time" ? "Full-time" : "Part-time"}
          </span>

          {/* Job Role */}
          {job.jobRoleType && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 ring-1 ring-purple-200">
              {job.jobRoleType}
            </span>
          )}

          {/* Salary */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
            {job.fixedSalary}
          </span>

          {/* Experience */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 ring-1 ring-blue-200">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            {job.experienceRequired}
          </span>
        </div>

        {/* Description */}
        <div className="mb-4">
          <span className="text-sm font-medium text-gray-900">Job Description</span>
          <div
            className="rich-text text-sm text-gray-500 leading-relaxed max-w-none mt-1"
            dangerouslySetInnerHTML={{ __html: job.description }}
          />
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm border-t border-gray-100 pt-4">
          {job.educationalQualification && (
            <div className="flex items-start gap-2">
              <span className="text-gray-400 shrink-0">
                <svg
                  className="w-4 h-4 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                  />
                </svg>
              </span>
              <span className="text-gray-600">
                {job.educationalQualification}
              </span>
            </div>
          )}

          {job.languageRequirements.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="text-gray-400 shrink-0">
                <svg
                  className="w-4 h-4 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                  />
                </svg>
              </span>
              <span className="text-gray-600">
                {job.languageRequirements.join(", ")}
              </span>
            </div>
          )}
        </div>

        {/* Skills + Property Types tags */}
        {(job.requiredSkills || job.propertyTypes) && (
          <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
            {job.requiredSkills && (
              <div>
                <span className="text-sm font-medium text-gray-900">Required Skills</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {job.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {job.propertyTypes && (
              <div>
                <span className="text-sm font-medium text-gray-900">Property Types</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {job.propertyTypes.map((pt) => (
                    <span
                      key={pt}
                      className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-xs"
                    >
                      {pt}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import type { CreateJobInput } from "@/lib/types";
import RichTextEditor from "./RichTextEditor";

interface JobFormProps {
  onSubmit: (data: CreateJobInput) => Promise<void>;
}

const JOB_ROLE_OPTIONS = [
  "Real Estate Agent",
  "Broker",
  "Property Manager",
  "Leasing Consultant",
  "Real Estate Analyst",
  "Appraiser",
  "Mortgage Advisor",
  "Construction Manager",
  "Interior Designer",
  "Maintenance Technician",
];

const PROPERTY_TYPE_OPTIONS = [
  "Residential",
  "Commercial",
  "Industrial",
  "Plots/Land",
  "Luxury Properties",
  "Affordable Housing",
];

const SKILL_OPTIONS = [
  "Negotiation",
  "Sales & Marketing",
  "Property Valuation",
  "CRM Software",
  "Market Analysis",
  "Client Relations",
  "Contract Management",
  "Financial Analysis",
  "Lead Generation",
  "MLS / Listing Platforms",
];

const LANGUAGE_OPTIONS = [
  "English",
  "Hindi",
  "Spanish",
  "Mandarin",
  "Arabic",
  "French",
  "Tamil",
  "Telugu",
  "Kannada",
  "Bengali",
];

function TagInput({
  options,
  selected,
  onChange,
  placeholder,
  allowCustom = false,
}: {
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
  placeholder: string;
  allowCustom?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function toggle(option: string) {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  }

  function addCustom() {
    const trimmed = customValue.trim();
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
    }
    setCustomValue("");
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full min-h-[38px] px-3 py-2 border border-gray-300 rounded-lg text-sm text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white flex flex-wrap items-center gap-1.5"
      >
        {selected.length === 0 ? (
          <span className="text-gray-400">{placeholder}</span>
        ) : (
          selected.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-md"
            >
              {s}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(s);
                }}
                className="hover:text-indigo-900"
              >
                &times;
              </button>
            </span>
          ))
        )}
      </button>
      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {allowCustom && (
            <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
              <input
                type="text"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustom();
                  }
                }}
                placeholder="Type & press Enter to add"
                className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={addCustom}
                disabled={!customValue.trim()}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 disabled:text-gray-300"
              >
                Add
              </button>
            </div>
          )}
          {options.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggle(opt)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function JobForm({ onSubmit }: JobFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [languageRequirements, setLanguageRequirements] = useState<string[]>(
    []
  );
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [fixedSalary, setFixedSalary] = useState("");
  const [employmentType, setEmploymentType] = useState("full-time");
  const [jobRoleType, setJobRoleType] = useState("");
  const [experienceRequired, setExperienceRequired] = useState("");
  const [educationalQualification, setEducationalQualification] = useState("");
  const [description, setDescription] = useState("");

  const [showPreview, setShowPreview] = useState(false);

  const previewReady =
    title.trim() !== "" &&
    location.trim() !== "" &&
    fixedSalary.trim() !== "" &&
    experienceRequired.trim() !== "" &&
    languageRequirements.length > 0 &&
    description.trim() !== "" &&
    description !== "<p></p>";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (languageRequirements.length === 0) {
      setError("Please select at least one language requirement.");
      return;
    }

    setLoading(true);

    const data: CreateJobInput = {
      title,
      location,
      fixedSalary,
      jobRoleType: jobRoleType || null,
      employmentType: employmentType as "full-time" | "part-time",
      educationalQualification: educationalQualification || null,
      experienceRequired,
      requiredSkills: requiredSkills.length ? requiredSkills : null,
      languageRequirements,
      propertyTypes: propertyTypes.length ? propertyTypes : null,
      description,
    };

    try {
      await onSubmit(data);
      formRef.current?.reset();
      setRequiredSkills([]);
      setLanguageRequirements([]);
      setPropertyTypes([]);
      setTitle("");
      setLocation("");
      setFixedSalary("");
      setEmploymentType("full-time");
      setJobRoleType("");
      setExperienceRequired("");
      setEducationalQualification("");
      setDescription("");
      setShowPreview(false);
    } catch {
      setError("Failed to create job posting. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
    >
      {/* Form Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
        <h3 className="text-white font-semibold text-lg">
          Create Job Posting
        </h3>
        <p className="text-indigo-200 text-sm mt-0.5">
          Fill in the details to post a new real estate position
        </p>
      </div>

      <div className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <svg
              className="w-4 h-4 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        {/* Section: Basic Info */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            Basic Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="title"
                className="flex items-center gap-1.5 text-base font-medium text-gray-700 mb-1"
              >
                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Real Estate Agent"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
              />
            </div>
            <div>
              <label
                htmlFor="location"
                className="flex items-center gap-1.5 text-base font-medium text-gray-700 mb-1"
              >
                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                Job Location <span className="text-red-500">*</span>
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Mumbai, Maharashtra"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
              />
            </div>
          </div>
        </div>

        {/* Section: Employment Details */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            Employment Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="fixedSalary"
                className="flex items-center gap-1.5 text-base font-medium text-gray-700 mb-1"
              >
                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                Fixed Salary <span className="text-red-500">*</span>
              </label>
              <input
                id="fixedSalary"
                name="fixedSalary"
                type="text"
                required
                value={fixedSalary}
                onChange={(e) => setFixedSalary(e.target.value)}
                placeholder="e.g. ₹6,00,000 / year"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
              />
            </div>
            <div>
              <label
                htmlFor="employmentType"
                className="flex items-center gap-1.5 text-base font-medium text-gray-700 mb-1"
              >
                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                Employment Type <span className="text-red-500">*</span>
              </label>
              <select
                id="employmentType"
                name="employmentType"
                required
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-shadow"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="jobRoleType"
                className="flex items-center gap-1.5 text-base font-medium text-gray-700 mb-1"
              >
                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
                Job Role Type
              </label>
              <select
                id="jobRoleType"
                name="jobRoleType"
                value={jobRoleType}
                onChange={(e) => setJobRoleType(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-shadow"
              >
                <option value="">Select a role...</option>
                {JOB_ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section: Requirements */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            Requirements
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="experienceRequired"
                className="flex items-center gap-1.5 text-base font-medium text-gray-700 mb-1"
              >
                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                Experience Required <span className="text-red-500">*</span>
              </label>
              <input
                id="experienceRequired"
                name="experienceRequired"
                type="text"
                required
                value={experienceRequired}
                onChange={(e) => setExperienceRequired(e.target.value)}
                placeholder="e.g. 2-4 years"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
              />
            </div>
            <div>
              <label
                htmlFor="educationalQualification"
                className="flex items-center gap-1.5 text-base font-medium text-gray-700 mb-1"
              >
                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" /></svg>
                Educational Qualification
              </label>
              <input
                id="educationalQualification"
                name="educationalQualification"
                type="text"
                value={educationalQualification}
                onChange={(e) => setEducationalQualification(e.target.value)}
                placeholder="e.g. Bachelor's in Business"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-base font-medium text-gray-700 mb-1">
                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" /></svg>
                Required Skills
              </label>
              <TagInput
                options={SKILL_OPTIONS}
                selected={requiredSkills}
                onChange={setRequiredSkills}
                placeholder="Select skills..."
                allowCustom
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-base font-medium text-gray-700 mb-1">
                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg>
                Language Requirements{" "}
                <span className="text-red-500">*</span>
              </label>
              <TagInput
                options={LANGUAGE_OPTIONS}
                selected={languageRequirements}
                onChange={setLanguageRequirements}
                placeholder="Select languages..."
              />
            </div>
          </div>
        </div>

        {/* Section: Property & Description */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            Property & Description
          </h4>
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-1.5 text-base font-medium text-gray-700 mb-1">
                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                Property Types
              </label>
              <TagInput
                options={PROPERTY_TYPE_OPTIONS}
                selected={propertyTypes}
                onChange={setPropertyTypes}
                placeholder="Select property types..."
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="flex items-center gap-1.5 text-base font-medium text-gray-700 mb-1"
              >
                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                Job Description <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={description}
                onChange={setDescription}
                placeholder="Describe the role, responsibilities, key requirements, and what makes this opportunity unique..."
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        {showPreview && previewReady && (
          <div className="border border-indigo-200 bg-indigo-50/50 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
              <h4 className="text-base font-semibold text-indigo-900">Preview</h4>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h5 className="text-xl font-bold text-gray-900">{title}</h5>
                  <p className="text-base text-gray-500 mt-0.5">{location}</p>
                </div>
                <span className="shrink-0 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700 capitalize">
                  {employmentType}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 text-base">
                <div>
                  <span className="text-gray-900 font-medium">Salary</span>
                  <p className="text-gray-500">{fixedSalary}</p>
                </div>
                <div>
                  <span className="text-gray-900 font-medium">Experience</span>
                  <p className="text-gray-500">{experienceRequired}</p>
                </div>
                {jobRoleType && (
                  <div>
                    <span className="text-gray-900 font-medium">Role Type</span>
                    <p className="text-gray-500">{jobRoleType}</p>
                  </div>
                )}
                {educationalQualification && (
                  <div>
                    <span className="text-gray-900 font-medium">Qualification</span>
                    <p className="text-gray-500">{educationalQualification}</p>
                  </div>
                )}
              </div>

              {languageRequirements.length > 0 && (
                <div>
                  <span className="text-gray-900 font-medium text-base">Language Requirements</span>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {languageRequirements.map((l) => (
                      <span key={l} className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {requiredSkills.length > 0 && (
                <div>
                  <span className="text-gray-900 font-medium text-base">Required Skills</span>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {requiredSkills.map((s) => (
                      <span key={s} className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {propertyTypes.length > 0 && (
                <div>
                  <span className="text-gray-900 font-medium text-base">Property Types</span>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {propertyTypes.map((p) => (
                      <span key={p} className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="text-gray-900 font-medium text-base">Job Description</span>
                <div className="rich-text text-base text-gray-500 mt-1 max-w-none" dangerouslySetInnerHTML={{ __html: description }} />
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="pt-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Publishing...
              </span>
            ) : (
              "Publish Job Posting"
            )}
          </button>
          <button
            type="button"
            disabled={!previewReady}
            onClick={() => setShowPreview(!showPreview)}
            className="w-full sm:w-auto px-8 py-3 border border-indigo-300 text-indigo-600 text-sm font-semibold rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
            {showPreview ? "Hide Preview" : "Preview"}
          </button>
        </div>
      </div>
    </form>
  );
}

"use client";

import { useState, FormEvent } from "react";
import { CareerTrack } from "@/components/admin/careerTrack";

interface Props {
  initialData?: Partial<CareerTrack>;
  onSubmit: (data: Partial<CareerTrack>) => Promise<void>;
  submitting?: boolean;
  submitLabel?: string;
}

const emptyForm: Partial<CareerTrack> = {
  title: "",
  subtitle: "",
  slug: "",
  badge: "CAREER ACCELERATOR",
  shortDescription: "",
  description: "",
  thumbnail: "",
  color: "#4F46E5",
  price: 14999,
  discountPrice: 9999,
  totalHours: "450+ Hours",
  totalProjects: 8,
  salaryRange: "₹8 LPA - ₹24 LPA",
  level: "Beginner",
  duration: "6 Months",
  language: "Hindi",
  certificate: true,
  internship: false,
  placementSupport: true,
  mentorSupport: true,
  status: "published",
  skills: [],
  tools: [],
  tags: [],
};

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:ring-indigo-950";

const labelClass =
  "mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200";

const cardClass =
  "rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4";

export default function CareerTrackForm({
  initialData,
  onSubmit,
  submitting = false,
  submitLabel = "Save career track",
}: Props) {
  const [form, setForm] = useState<Partial<CareerTrack>>({
    ...emptyForm,
    ...initialData,
  });

  const [skillsInput, setSkillsInput] = useState(
    (initialData?.skills || []).join(", ")
  );
  const [toolsInput, setToolsInput] = useState(
    (initialData?.tools || []).join(", ")
  );
  const [tagsInput, setTagsInput] = useState(
    (initialData?.tags || []).join(", ")
  );
  const [hiringInput, setHiringInput] = useState(
    (initialData?.hiringPartners || []).join(", ")
  );
  const [perksInput, setPerksInput] = useState(
    (initialData?.perks || []).join("\n")
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? value === ""
            ? undefined
            : Number(value)
          : value,
    }));
  };

  const generateSlug = () => {
    if (!form.title) return;
    const slug = form.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setForm((prev) => ({ ...prev, slug: prev.slug || slug }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload: Partial<CareerTrack> = {
      ...form,
      skills: skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tools: toolsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tags: tagsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      hiringPartners: hiringInput
        .split(",")
        .map((h) => h.trim())
        .filter(Boolean),
      perks: perksInput
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean),
    };
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <section className={cardClass}>
        <h2 className="text-sm font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Title *</label>
            <input
              name="title"
              value={form.title || ""}
              onChange={handleChange}
              onBlur={generateSlug}
              placeholder="e.g. Full Stack Web Developer Track"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Badge Tag</label>
            <input
              name="badge"
              value={form.badge || ""}
              onChange={handleChange}
              placeholder="CAREER ACCELERATOR"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Slug *</label>
            <input
              name="slug"
              value={form.slug || ""}
              onChange={handleChange}
              placeholder="full-stack-web-developer"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Subtitle</label>
            <input
              name="subtitle"
              value={form.subtitle || ""}
              onChange={handleChange}
              placeholder="Master frontend & backend development from scratch"
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Short Description *</label>
            <textarea
              name="shortDescription"
              value={form.shortDescription || ""}
              onChange={handleChange}
              rows={2}
              required
              placeholder="Brief summary of what students will learn..."
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Full Description</label>
            <textarea
              name="description"
              value={form.description || ""}
              onChange={handleChange}
              rows={4}
              placeholder="Detailed track description..."
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Thumbnail Image URL</label>
            <input
              name="thumbnail"
              value={form.thumbnail || ""}
              onChange={handleChange}
              placeholder="https://..."
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Accent Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                name="color"
                value={form.color || "#4F46E5"}
                onChange={handleChange}
                className="h-10 w-14 cursor-pointer rounded-lg border border-slate-300 bg-white p-1 dark:border-slate-700 dark:bg-slate-800"
              />
              <input
                type="text"
                name="color"
                value={form.color || "#4F46E5"}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Pricing & Salary Stats */}
      <section className={cardClass}>
        <h2 className="text-sm font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
          Pricing, Duration & Salary Stats
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label className={labelClass}>Discount Price (₹)</label>
            <input
              type="number"
              name="discountPrice"
              value={form.discountPrice ?? ""}
              onChange={handleChange}
              placeholder="9999"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Original Price (₹)</label>
            <input
              type="number"
              name="price"
              value={form.price ?? ""}
              onChange={handleChange}
              placeholder="14999"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Total Hours</label>
            <input
              name="totalHours"
              value={form.totalHours || ""}
              onChange={handleChange}
              placeholder="450+ Hours"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Total Real Projects</label>
            <input
              type="number"
              name="totalProjects"
              value={form.totalProjects ?? 8}
              onChange={handleChange}
              placeholder="8"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Expected Salary Range</label>
            <input
              name="salaryRange"
              value={form.salaryRange || ""}
              onChange={handleChange}
              placeholder="₹8 LPA - ₹24 LPA"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Duration</label>
            <input
              name="duration"
              placeholder="e.g. 6 Months"
              value={form.duration || ""}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Level</label>
            <select
              name="level"
              value={form.level}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="pt-2">
          <label className={labelClass}>Hiring Companies / Partners (Comma separated)</label>
          <input
            value={hiringInput}
            onChange={(e) => setHiringInput(e.target.value)}
            placeholder="Amazon, Microsoft, Adobe, Flipkart, Swiggy"
            className={inputClass}
          />
        </div>
      </section>

      {/* Skills & Perks */}
      <section className={cardClass}>
        <h2 className="text-sm font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
          Skills, Tools & Highlights
        </h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Skills Covered (Comma separated)</label>
            <input
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="React, Node.js, System Design, Data Structures"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Tools Mastered (Comma separated)</label>
            <input
              value={toolsInput}
              onChange={(e) => setToolsInput(e.target.value)}
              placeholder="VS Code, Docker, AWS, Postman, Git"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Track Key Highlights & Perks (One per line)</label>
            <textarea
              value={perksInput}
              onChange={(e) => setPerksInput(e.target.value)}
              rows={3}
              placeholder={"1:1 Mentor Code Reviews\nDirect Placement Referrals\nLive Mock Technical Interviews"}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Tags (Comma separated)</label>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="web-development, full-stack, mern, placement"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Perks Checkboxes */}
      <section className={cardClass}>
        <h2 className="text-sm font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
          Inclusions & Features
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(
            [
              ["certificate", "Certificate"],
              ["internship", "Internship"],
              ["placementSupport", "Placement Assistance"],
              ["mentorSupport", "1:1 Mentor Support"],
            ] as const
          ).map(([name, label]) => (
            <label
              key={name}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-800 transition hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-500"
            >
              <input
                type="checkbox"
                name={name}
                checked={Boolean(form[name])}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-medium">{label}</span>
            </label>
          ))}
        </div>
      </section>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Saving Track..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
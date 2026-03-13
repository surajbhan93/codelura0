"use client";

import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

/* ===============================
   TYPES
=============================== */

type AccessType = "public_preview" | "login_required" | "paid_only";

type FormState = {
  title: string;
  description: string;
  price: number;
  category: "notes" | "course";
  level: "beginner" | "intermediate" | "advanced";
  language: string;
  tags: string;
  previewPages: number;
  accessType: AccessType;
  showAdsForFreeUsers: boolean;
  allowDownloadAfterPurchase: boolean;
};

/* ===============================
   PAGE
=============================== */

export default function AddCoursePage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    price: 0,
    category: "notes",
    level: "beginner",
    language: "Hindi",
    tags: "",
    previewPages: 3,
    accessType: "login_required",
    showAdsForFreeUsers: true,
    allowDownloadAfterPurchase: true,
  });

  const [pdf, setPdf] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  /* ===============================
     HANDLERS
  =============================== */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "price" || name === "previewPages"
          ? Number(value)
          : value,
    }));
  };

  const submit = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!pdf) {
      toast.error("PDF file is required");
      return;
    }
    if (form.accessType === "paid_only" && form.price <= 0) {
      toast.error("Paid-only course must have a price");
      return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    fd.append("pdf", pdf);
    if (banner) fd.append("banner", banner);

    try {
      setLoading(true);
      await api.post("/admin/courses", fd);
      toast.success("Course created successfully 🚀");
      router.push("/admin/courses");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     UI
  =============================== */

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Add Course</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in the details to publish a new course or notes.</p>
        </div>

        <div className="space-y-6">

          {/* Section: Basic Info */}
          <Section title="Basic Information" icon="📘">
            <Input label="Title" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Class 12 Physics Notes" />
            <Textarea label="Description" name="description" value={form.description} onChange={handleChange} placeholder="Briefly describe what this course covers..." />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Level"
                name="level"
                value={form.level}
                onChange={handleChange}
                options={[
                  { value: "beginner", label: "Beginner" },
                  { value: "intermediate", label: "Intermediate" },
                  { value: "advanced", label: "Advanced" },
                ]}
              />
              <Input label="Language" name="language" value={form.language} onChange={handleChange} placeholder="e.g. Hindi" />
            </div>
            <Input label="Tags" name="tags" value={form.tags} onChange={handleChange} placeholder="e.g. physics, class12, ncert" />
          </Section>

          {/* Section: Access & Pricing */}
          <Section title="Access & Pricing" icon="🔐">
            <Select
              label="Access Type"
              name="accessType"
              value={form.accessType}
              onChange={handleChange}
              options={[
                { value: "public_preview", label: "Public Preview" },
                { value: "login_required", label: "Login Required" },
                { value: "paid_only", label: "Paid Only" },
              ]}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price (₹)"
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="0"
              />
              {form.accessType !== "paid_only" && (
                <Input
                  label="Preview Pages"
                  type="number"
                  name="previewPages"
                  value={form.previewPages}
                  onChange={handleChange}
                />
              )}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3 mt-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Permissions</p>
              <Checkbox
                label="Show ads for free users"
                name="showAdsForFreeUsers"
                checked={form.showAdsForFreeUsers}
                onChange={handleChange}
              />
              <Checkbox
                label="Allow download after purchase"
                name="allowDownloadAfterPurchase"
                checked={form.allowDownloadAfterPurchase}
                onChange={handleChange}
              />
            </div>
          </Section>

          {/* Section: Files */}
          <Section title="Upload Files" icon="📎">
            <FileInput
              label="PDF File"
              sublabel="Required"
              accept="application/pdf"
              file={pdf}
              onChange={(e) => setPdf(e.target.files?.[0] || null)}
            />
            <FileInput
              label="Banner Image"
              sublabel="Optional"
              accept="image/*"
              file={banner}
              onChange={(e) => setBanner(e.target.files?.[0] || null)}
            />
          </Section>

          {/* Submit */}
          <button
            onClick={submit}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl shadow-sm transition-colors duration-150"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Saving...
              </>
            ) : (
              "Create Course"
            )}
          </button>

        </div>
      </div>
    </div>
  );
}

/* ===============================
   SECTION WRAPPER
=============================== */

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2.5">
        <span className="text-lg">{icon}</span>
        <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
      </div>
      <div className="px-5 py-5 space-y-4">{children}</div>
    </div>
  );
}

/* ===============================
   REUSABLE COMPONENTS
=============================== */

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; sublabel?: string }) {
  const { label, sublabel, ...rest } = props;
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
        {label}
        {sublabel && <span className="text-xs text-gray-400 font-normal">({sublabel})</span>}
      </label>
      <input
        {...rest}
        className="w-full border border-gray-200 bg-gray-50 focus:bg-white rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
      />
    </div>
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <textarea
        {...rest}
        rows={3}
        className="w-full border border-gray-200 bg-gray-50 focus:bg-white rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
      />
    </div>
  );
}

function Select({
  label,
  options,
  ...rest
}: {
  label: string;
  options: { value: string; label: string }[];
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        {...rest}
        className="w-full border border-gray-200 bg-gray-50 focus:bg-white rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition appearance-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function FileInput({
  label,
  sublabel,
  file,
  onChange,
  accept,
}: {
  label: string;
  sublabel?: string;
  file: File | null;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  accept?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
        {label}
        {sublabel && (
          <span className={`text-xs font-normal px-1.5 py-0.5 rounded-full ${sublabel === "Required" ? "bg-red-50 text-red-500" : "bg-gray-100 text-gray-400"}`}>
            {sublabel}
          </span>
        )}
      </label>
      <label className="flex items-center gap-3 w-full border-2 border-dashed border-gray-200 hover:border-indigo-400 bg-gray-50 hover:bg-indigo-50 rounded-xl px-4 py-3 cursor-pointer transition-all duration-150 group">
        <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-indigo-500 shrink-0 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4" />
          </svg>
        </div>
        <div className="min-w-0">
          {file ? (
            <p className="text-sm text-indigo-600 font-medium truncate">{file.name}</p>
          ) : (
            <p className="text-sm text-gray-400">Click to upload</p>
          )}
        </div>
        <input type="file" accept={accept} onChange={onChange} className="hidden" />
      </label>
    </div>
  );
}

function Checkbox(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative">
        <input type="checkbox" {...rest} className="sr-only peer" />
        <div className="w-9 h-5 bg-gray-200 peer-checked:bg-indigo-500 rounded-full transition-colors duration-200" />
        <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-4" />
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}
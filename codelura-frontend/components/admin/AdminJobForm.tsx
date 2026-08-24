"use client";

import { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
// ─── FIX: Only ONE import statement ───
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import sanitizeHtml from "sanitize-html";
import { motion, AnimatePresence } from "framer-motion";
import { TextInput, Textarea, ToggleSwitch } from "flowbite-react";
import {
  Briefcase, 
  ImagePlus, Loader2, X, CheckCircle2,
  Upload,
} from "lucide-react";
import type Quill from "quill";

// ─── Lazy Load ReactQuill ───
const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false,
  loading: () => (
    <div className="h-[300px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
      <span className="text-gray-400">Loading Editor...</span>
    </div>
  )
});

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
interface JobFormData {
  title:        string;
  slug:         string;
  company:      string;
  bannerImage:  string;
  location:     string;
  type:
  | "internship"
  | "full-time"
  | "part-time"
  | "contract"
  | "off-campus"
  | "walk-in"
  | "codelura"
  | "";
  salary:       string;
  description:  string;
  content:      string;
  tags:         string;
  careerPageUrl:string;
   // SEO
  seoMetaTitle: string;
  seoMetaDescription: string;
  seoKeywords: string;
  seoCanonicalUrl: string;
  seoOgImage: string;
  seoNoIndex: boolean;
  isFeatured:   boolean;
  isExpired:    boolean;
  postedAt:     string;
  deadline:     string;
}

interface AdminJobFormProps {
  initialData?: Partial<JobFormData>;
  isEdit?:      boolean;
  jobId?:       string;
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function AdminJobForm({
  initialData = {},
  isEdit = false,
  jobId,
}: AdminJobFormProps) {
  const [loading,   setLoading]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver,  setDragOver]  = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  /* ─────────────────────────────────────────
   CLOUDINARY UPLOAD (Memoized)
───────────────────────────────────────── */
const uploadToCloudinary = useCallback(async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "ml_default");
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) throw new Error("Cloudinary cloud name not configured");
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST", body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message ?? "Upload failed");
  }
  return (await res.json()).secure_url as string;
}, []);

// ─── Quill Modules (Memoized) ───
const quillModules = useMemo(() => ({
  toolbar: {
    container: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["link", "image"],
      ["clean"],
    ],
    handlers: {
      link: function (this: { quill: Quill }) {
        const quill = this.quill;
        const range = quill.getSelection();
        if (!range) return;
        const selectedText = quill.getText(range.index, range.length);
        const text = window.prompt("Enter display text:", selectedText || "");
        if (!text) return;
        const url = window.prompt("Enter URL (https://...)");
        if (!url) return;
        if (range.length > 0) quill.deleteText(range.index, range.length);
        quill.insertText(range.index, text, "link", url);
        quill.setSelection(range.index + text.length);
      },
    },
  },
  syntax: false,
}), []);

const quillFormats = useMemo(() => [
  "header","bold","italic","underline","strike",
  "color","background","script","list","indent",
  "align","blockquote","code-block","link","image",
], []);

// ─── Job Type Options (Memoized) ───
const JOB_TYPES = useMemo(() => [
  { value: "internship", label: "🎓 Internship", cls: "sel-intern" },
  { value: "full-time", label: "💼 Full-Time", cls: "sel-full" },
  { value: "part-time", label: "⏰ Part-Time", cls: "sel-part" },
  { value: "contract", label: "📋 Contract", cls: "sel-contract" },
  { value: "off-campus", label: "🏫 Off Campus", cls: "sel-offcampus" },
  { value: "walk-in", label: "🚶 Walk-In", cls: "sel-walkin" },
  { value: "codelura", label: "🚀 Codelura", cls: "sel-codelura" },
], []);

const TOGGLE_ITEMS = useMemo(() => [
  { key: "isFeatured" as const, label: "⭐ Featured Job", desc: "Pin to top of listings" },
  { key: "isExpired" as const, label: "⏰ Mark as Expired", desc: "Move to expired section" },
], []);

  // ─── LocalStorage Keys ───
  const STORAGE_KEY = useMemo(() => isEdit ? `job_draft_${jobId}` : "job_draft_new", [isEdit, jobId]);
  const FORM_KEY = useMemo(() => isEdit ? `job_form_${jobId}` : "job_form_new", [isEdit, jobId]);

  // ─── Load from LocalStorage ───
  const loadFromStorage = useCallback(() => {
    try {
      const savedForm = localStorage.getItem(FORM_KEY);
      if (savedForm) {
        const parsed = JSON.parse(savedForm);
        return parsed;
      }
      return null;
    } catch (error) {
      console.error("Failed to load from storage:", error);
      return null;
    }
  }, [FORM_KEY]);

  // ─── Initialize Form State ───
  const [form, setForm] = useState<JobFormData>(() => {
    if (isEdit && initialData && Object.keys(initialData).length > 0) {
      return {
        title: "", slug: "", company: "", bannerImage: "",
        location: "", type: "", salary: "",
        description: "", content: "", tags: "",
        careerPageUrl: "",
        seoMetaTitle: "",
seoMetaDescription: "",
seoKeywords: "",
seoCanonicalUrl: "",
seoOgImage: "",
seoNoIndex: false,
        isFeatured: false, isExpired: false,
        postedAt: today, deadline: "",
        ...initialData,
      };
    }

    const saved = loadFromStorage();
    if (saved) {
      return {
        title: "", slug: "", company: "", bannerImage: "",
        location: "", type: "", salary: "",
        description: "", content: "", tags: "",
        careerPageUrl: "", 
        seoMetaTitle: "",
seoMetaDescription: "",
seoKeywords: "",
seoCanonicalUrl: "",
seoOgImage: "",
seoNoIndex: false,
isFeatured: false, isExpired: false,
        postedAt: today, deadline: "",
        ...saved,
      };
    }

    return {
      title: "", slug: "", company: "", bannerImage: "",
      location: "", type: "", salary: "",
      description: "", content: "", tags: "",
      careerPageUrl: "", 
      seoMetaTitle: "",
seoMetaDescription: "",
seoKeywords: "",
seoCanonicalUrl: "",
seoOgImage: "",
seoNoIndex: false,
      isFeatured: false, isExpired: false,
      postedAt: today, deadline: "",
    };
  });

  // ─── Auto-Save Function (Debounced) ───
  const autoSave = useCallback((data: JobFormData) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setSaveStatus("saving");

    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(FORM_KEY, JSON.stringify(data));
        if (data.content) {
          localStorage.setItem(STORAGE_KEY, data.content);
        }
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 1500);
      } catch (error) {
        console.error("Auto-save failed:", error);
        setSaveStatus("error");
        toast.error("Failed to auto-save draft");
      }
    }, 800);
  }, [FORM_KEY, STORAGE_KEY]);

  // ─── Handle Form Change with Auto-Save ───
  const handleFormChange = useCallback((key: keyof JobFormData, value: any) => {
    setForm((prev) => {
      const newForm = { ...prev, [key]: value };
      autoSave(newForm);
      return newForm;
    });
  }, [autoSave]);

  // ─── Auto slug ──
  const handleTitleChange = useCallback((value: string) => {
    const slug = value.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
    setForm((f) => {
      const newForm = { ...f, title: value, slug: f.slug || slug };
      autoSave(newForm);
      return newForm;
    });
  }, [autoSave]);

  /* ── Live code preview highlight ── */
  // ─── FIX: Use proper hljs import ───
  useEffect(() => {
    if (!previewRef.current) return;
    
    // Highlight all code blocks
    const blocks = previewRef.current.querySelectorAll("pre code");
    blocks.forEach((block) => {
      // Check if hljs is available
      if (typeof hljs !== 'undefined' && hljs.highlightElement) {
        hljs.highlightElement(block as HTMLElement);
      }
    });
  }, [form.content]);

  /* ── Banner upload ── */
  const handleBannerUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return toast.error("Only images allowed");
    if (file.size > 5 * 1024 * 1024)     return toast.error("Max 5MB");
    try {
      setUploading(true);
      const url = await uploadToCloudinary(file);
      handleFormChange("bannerImage", url);
      toast.success("Banner uploaded ✅");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }, [handleFormChange, uploadToCloudinary]);

  /* ── Sanitize content for save (Memoized) ── */
  const sanitize = useCallback((html: string) =>
    sanitizeHtml(html, {
      allowedTags: ["p","h1","h2","h3","h4","h5","h6","strong","em","u","s",
        "ul","ol","li","blockquote","code","pre","a","img","br","hr"],
      allowedAttributes: { a: ["href","target"], img: ["src","alt"] },
      allowedSchemes: ["http","https","mailto"],
    })
    .replace(/<span[^>]*>/g, "").replace(/<\/span>/g, "")
    .replace(/ style="[^"]*"/g, "").replace(/&nbsp;/g, " ")
    .replace(/<p>\s*<\/p>/g, "").trim()
  , []);

  /* ── Preview (Memoized) ── */
  const previewHtml = useMemo(() => sanitize(form.content), [form.content, sanitize]);

  /* ── Submit ── */
  const handleSubmit = useCallback(async () => {
    if (!form.title.trim())         return toast.error("Job title is required");
    if (!form.company.trim())       return toast.error("Company name is required");
    if (!form.location.trim())      return toast.error("Location is required");
    if (!form.type)                 return toast.error("Job type is required");
    if (!form.description.trim())   return toast.error("Short description is required");
    if (!form.careerPageUrl.trim()) return toast.error("Career page URL is required");

    try {
      setLoading(true);
      const payload = {
  title: form.title,
  slug: form.slug,
  company: form.company,
  bannerImage: form.bannerImage,

  location: form.location,
  type: form.type,
  salary: form.salary,

  description: form.description,

  content: sanitize(form.content),

  tags: form.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean),

  careerPageUrl: form.careerPageUrl,

  /* SEO */
  seo: {
    metaTitle: form.seoMetaTitle.trim(),

    metaDescription:
      form.seoMetaDescription.trim(),

    keywords: form.seoKeywords
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean),

    canonicalUrl:
      form.seoCanonicalUrl.trim(),

    ogImage:
      form.seoOgImage.trim(),

    noIndex:
      form.seoNoIndex,
  },

  isFeatured: form.isFeatured,
  isExpired: form.isExpired,

  deadline:
    form.deadline || null,

  postedAt:
    form.postedAt || new Date().toISOString(),
};
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

      if (isEdit && jobId) {
        await api.patch(`/jobs/${jobId}`, payload, { headers });
        toast.success("Job updated ✅");
      } else {
        await api.post("/jobs", payload, { headers });
        toast.success("Job posted 🚀");
        localStorage.removeItem(FORM_KEY);
        localStorage.removeItem(STORAGE_KEY);
        setForm({
          title: "", slug: "", company: "", bannerImage: "",
          location: "", type: "", salary: "",
          description: "", content: "", tags: "",
          careerPageUrl: "", 
          seoMetaTitle: "",
seoMetaDescription: "",
seoKeywords: "",
seoCanonicalUrl: "",
seoOgImage: "",
seoNoIndex: false,
isFeatured: false, isExpired: false,
          postedAt: today, deadline: "",
        });
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    } finally {
      setLoading(false);
    }
  }, [form, isEdit, jobId, sanitize, FORM_KEY, STORAGE_KEY, today]);

  // ─── Save Indicator (Memoized) ───
  const SaveIndicator = useMemo(() => {
    const statusMap = {
      idle: { label: "All changes saved", dot: "saved", className: "saved" },
      saving: { label: "Saving...", dot: "saving", className: "saving" },
      saved: { label: "✓ Saved", dot: "saved", className: "saved" },
      error: { label: "⚠️ Save failed", dot: "error", className: "error" }
    };
    const current = statusMap[saveStatus];
    return (
      <span className={`ajf-save-indicator ${current.className}`}>
        <span className={`ajf-save-dot ${current.dot}`} />
        {current.label}
      </span>
    );
  }, [saveStatus]);

  /* ═══════════════════════════════════ RENDER ═══════════════════════════════════ */
  return (
    <>
      <style>{styles}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="ajf-root"
      >
        <div className="ajf-wrap">

          {/* ── Header ── */}
          <div className="ajf-header">
            <div>
              <h1 className="ajf-title">{isEdit ? "Edit" : "Post a New"} <span>Job</span></h1>
              <p className="ajf-sub">{isEdit ? "Update listing details" : "Fill in the details — published instantly"}</p>
            </div>
            <div className="ajf-header-right">
              {SaveIndicator}
              <div className="ajf-chip">
                <span className="ajf-dot" />{isEdit ? "Editing" : "New Listing"}
              </div>
            </div>
          </div>

          {/* ══ SECTION 1 — BASIC INFO ══ */}
          <Card title="📌 Basic Information" delay={0.05}>
            <div className="ajf-grid-2" style={{ marginBottom: 14 }}>
              <Field label="Job Title *">
                <TextInput placeholder="e.g. Frontend Developer" value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)} />
              </Field>
              <Field label="Slug (auto-generated)">
                <TextInput placeholder="frontend-developer" value={form.slug}
                  onChange={(e) => handleFormChange("slug", e.target.value)} />
              </Field>
            </div>
            <div className="ajf-grid-2" style={{ marginBottom: 14 }}>
              <Field label="Company Name *">
                <TextInput placeholder="e.g. Google" value={form.company}
                  onChange={(e) => handleFormChange("company", e.target.value)} />
              </Field>
              <Field label="Location *">
                <TextInput placeholder="e.g. Bangalore / Remote" value={form.location}
                  onChange={(e) => handleFormChange("location", e.target.value)} />
              </Field>
            </div>
            <Field label="Short Description * (shown on card)">
              <Textarea rows={3} placeholder="One-liner about the role" value={form.description}
                onChange={(e) => handleFormChange("description", e.target.value)} />
              <p className={`ajf-hint ${form.description.length > 200 ? "warn" : ""}`}>
                {form.description.length} / 200
              </p>
            </Field>
          </Card>

          {/* ══ SECTION 2 — BANNER IMAGE ══ */}
          <Card title="🖼 Banner Image" delay={0.1}>
            <input ref={fileInputRef} type="file" accept="image/*"
              style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleBannerUpload(f); }} />

            <div
              className={`ajf-upload ${dragOver ? "drag" : ""} ${form.bannerImage ? "has" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleBannerUpload(f); }}
              onClick={() => !form.bannerImage && fileInputRef.current?.click()}
            >
              <AnimatePresence mode="wait">
                {uploading ? (
                  <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ padding: 24, textAlign: "center" }}>
                    <Loader2 size={32} className="animate-spin" style={{ color: "#a78bfa", margin: "0 auto 10px" }} />
                    <p style={{ color: "#64748b", fontSize: 13 }}>Uploading to Cloudinary…</p>
                  </motion.div>
                ) : form.bannerImage ? (
                  <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ position: "relative" }}>
                    <button className="ajf-rm"
                      onClick={(e) => { e.stopPropagation(); handleFormChange("bannerImage", ""); }}>
                      <X size={12} />
                    </button>
                    <img src={form.bannerImage} alt="Banner preview" className="ajf-banner-preview" loading="lazy" />
                    <div style={{ textAlign: "center", marginTop: 10 }}>
                      <p style={{ color: "#6ee7b7", fontSize: 12, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        <CheckCircle2 size={12} /> Banner uploaded
                      </p>
                      <button className="ajf-upload-btn" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                        <Upload size={12} /> Replace
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ textAlign: "center", padding: "28px 16px" }}>
                    <div className="ajf-upload-icon"><ImagePlus size={22} style={{ color: "#a78bfa" }} /></div>
                    <p style={{ color: "#64748b", fontSize: 14, marginBottom: 4 }}>Drag & drop banner image</p>
                    <p style={{ color: "#334155", fontSize: 12, marginBottom: 12 }}>PNG, JPG, WEBP — max 5MB · Recommended: 1200×400px</p>
                    <button className="ajf-upload-btn"><Upload size={12} /> Choose File</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div style={{ marginTop: 14 }}>
              <label className="ajf-label">Or paste URL directly</label>
              <TextInput placeholder="https://res.cloudinary.com/..." value={form.bannerImage}
                onChange={(e) => handleFormChange("bannerImage", e.target.value)} />
            </div>
          </Card>

          {/* ══ SECTION 3 — JOB TYPE ══ */}
          <Card title="🏷 Job Type *" delay={0.15}>
            <div className="ajf-type-grid">
              {JOB_TYPES.map((t) => (
                <div key={t.value}
                  className={`ajf-chip-type ${form.type === t.value ? t.cls : ""}`}
                  onClick={() => handleFormChange("type", t.value as JobFormData["type"])}>
                  {t.label}
                </div>
              ))}
            </div>
          </Card>

          {/* ══ SECTION 4 — COMPENSATION & LINK ══ */}
          <Card title="💰 Compensation & Apply Link" delay={0.2}>
            <div className="ajf-grid-2">
              <Field label="Salary / Stipend">
                <TextInput placeholder="e.g. ₹8–12 LPA" value={form.salary}
                  onChange={(e) => handleFormChange("salary", e.target.value)} />
              </Field>
              <Field label="Career Page URL *">
                <TextInput placeholder="https://careers.company.com/..." value={form.careerPageUrl}
                  onChange={(e) => handleFormChange("careerPageUrl", e.target.value)} />
              </Field>
            </div>
          </Card>

          {/* ══ SECTION 5 — FULL CONTENT (ReactQuill) ══ */}
          <Card title="📝 Full Job Description (Rich Content)" delay={0.25} light>
            <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 14 }}>
              Write detailed job requirements, responsibilities, perks etc. This shows on the job detail page.
            </p>
            <ReactQuill
              theme="snow"
              value={form.content}
              onChange={(v) => handleFormChange("content", v)}
              modules={quillModules}
              formats={quillFormats}
              style={{ background: "#fff", borderRadius: 8 }}
            />
            {/* Live preview */}
            {form.content && previewHtml && (
              <div className="ajf-preview-wrap">
                <p className="ajf-preview-label">📖 Live Preview</p>
                <div ref={previewRef} className="ajf-preview"
                  dangerouslySetInnerHTML={{ __html: previewHtml }} />
              </div>
            )}
          </Card>

          {/* ══ SECTION 6 — TAGS & DATES ══ */}
          <Card title="🔖 Tags & Dates" delay={0.3}>
            <Field label="Skill Tags (comma separated)" style={{ marginBottom: 14 }}>
              <TextInput placeholder="React, Node.js, TypeScript" value={form.tags}
                onChange={(e) => handleFormChange("tags", e.target.value)} />
              {form.tags && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                  {form.tags.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => (
                    <span key={tag} className="ajf-tag-preview">{tag}</span>
                  ))}
                </div>
              )}
            </Field>
            <div className="ajf-grid-2">
              <Field label="Posted Date">
                <TextInput type="date" value={form.postedAt}
                  onChange={(e) => handleFormChange("postedAt", e.target.value)} />
              </Field>
              <Field label="Application Deadline">
                <TextInput type="date" value={form.deadline}
                  onChange={(e) => handleFormChange("deadline", e.target.value)} />
              </Field>
            </div>
          </Card>

{/* ══ SEO SETTINGS ══ */}

<Card title="🔍 SEO Settings" delay={0.33}>

  {/* Meta Title */}
  <Field label="SEO Meta Title">
    <TextInput
      placeholder="e.g. Software Engineer Internship at Google | Codelura"
      value={form.seoMetaTitle}
      onChange={(e) =>
        handleFormChange("seoMetaTitle", e.target.value)
      }
    />

    <p
      className={`ajf-hint ${
        form.seoMetaTitle.length > 60 ? "warn" : ""
      }`}
    >
      {form.seoMetaTitle.length} / 60 recommended
    </p>
  </Field>


  {/* Meta Description */}

  <div style={{ marginTop: 16 }}>

    <Field label="SEO Meta Description">

      <Textarea
        rows={3}
        placeholder="Write a concise description for Google search results..."
        value={form.seoMetaDescription}
        onChange={(e) =>
          handleFormChange(
            "seoMetaDescription",
            e.target.value
          )
        }
      />

      <p
        className={`ajf-hint ${
          form.seoMetaDescription.length > 160
            ? "warn"
            : ""
        }`}
      >
        {form.seoMetaDescription.length} / 160 recommended
      </p>

    </Field>

  </div>


  {/* Keywords */}

  <div style={{ marginTop: 16 }}>

    <Field label="SEO Keywords">

      <TextInput
        placeholder="software engineer internship, google jobs, fresher jobs"
        value={form.seoKeywords}
        onChange={(e) =>
          handleFormChange("seoKeywords", e.target.value)
        }
      />

      <p className="ajf-hint">
        Comma separated. Mainly for internal SEO/content organization.
      </p>

    </Field>

  </div>


  {/* Canonical */}

  <div style={{ marginTop: 16 }}>

    <Field label="Canonical URL (Optional)">

      <TextInput
        placeholder={`https://codelura.com/jobs-Alerts/${form.slug || "job-slug"}`}
        value={form.seoCanonicalUrl}
        onChange={(e) =>
          handleFormChange(
            "seoCanonicalUrl",
            e.target.value
          )
        }
      />

      <p className="ajf-hint">
        Leave empty to automatically use the current job URL.
      </p>

    </Field>

  </div>


  {/* OG Image */}

  <div style={{ marginTop: 16 }}>

    <Field label="Social / OG Image URL">

      <TextInput
        placeholder="Leave empty to use banner image"
        value={form.seoOgImage}
        onChange={(e) =>
          handleFormChange("seoOgImage", e.target.value)
        }
      />

      <p className="ajf-hint">
        Used when the job is shared on social platforms.
      </p>

    </Field>

  </div>


  {/* No Index */}

  <div className="ajf-toggle-row" style={{ marginTop: 18 }}>

    <div>

      <div className="ajf-toggle-label">
        🚫 Prevent Google Indexing
      </div>

      <div className="ajf-toggle-desc">
        Keep OFF for normal public job listings.
      </div>

    </div>

    <ToggleSwitch
      checked={form.seoNoIndex}
      label=""
      onChange={(value) =>
        handleFormChange("seoNoIndex", value)
      }
    />

  </div>

</Card>
          {/* ══ SECTION 7 — SETTINGS ══ */}
          <Card title="⚙️ Settings" delay={0.35}>
            {TOGGLE_ITEMS.map((item) => (
              <div className="ajf-toggle-row" key={item.key}>
                <div>
                  <div className="ajf-toggle-label">{item.label}</div>
                  <div className="ajf-toggle-desc">{item.desc}</div>
                </div>
                <ToggleSwitch checked={form[item.key]} label=""
                  onChange={(v) => handleFormChange(item.key, v)} />
              </div>
            ))}
          </Card>

        </div>{/* /wrap */}

        {/* ── STICKY FOOTER ── */}
        <div className="ajf-footer">
          <div className="ajf-footer-info">
            {form.title
              ? <><strong>&quot;{form.title}&quot;</strong> — {form.company || "Unknown company"}</>
              : "Fill in the form above"}
          </div>
          <div className="ajf-footer-btns">
            <button className="ajf-btn-cancel" onClick={() => {
              if (confirm("Discard draft?")) {
                localStorage.removeItem(FORM_KEY);
                localStorage.removeItem(STORAGE_KEY);
                window.history.back();
              }
            }}>Cancel</button>
            <button className="ajf-btn-submit" onClick={handleSubmit} disabled={loading || uploading}>
              {loading
                ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
                : isEdit
                  ? <><CheckCircle2 size={14} /> Update Job</>
                  : <><Briefcase size={14} /> Post Job</>
              }
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

/* ── Memoized Helper Components ── */
const Card = memo(({ title, children, delay = 0, light = false }: {
  title: string; children: React.ReactNode; delay?: number; light?: boolean;
}) => (
  <motion.div className={`ajf-card${light ? " ajf-card-light" : ""}`}
    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}>
    <p className="ajf-card-title">{title}</p>
    {children}
  </motion.div>
));
Card.displayName = "Card";

const Field = memo(({ label, children, style }: {
  label: string; children: React.ReactNode; style?: React.CSSProperties;
}) => (
  <div style={style}>
    <label className="ajf-label">{label}</label>
    {children}
  </div>
));
Field.displayName = "Field";

/* ─────────────────────────────────────────
   STYLES - COMPLETE
───────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  .ajf-root * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
  .ajf-root h1,.ajf-root h2,.ajf-root h3 { font-family: 'Syne', sans-serif; }

  .ajf-root {
    min-height: 100vh;
    background: #07080f;
    background-image:
      radial-gradient(ellipse 80% 50% at 20% 0%, rgba(109,40,217,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 100%, rgba(16,185,129,0.05) 0%, transparent 60%);
    padding: 32px 16px 130px;
  }

  .ajf-wrap { max-width: 860px; margin: 0 auto; }

  /* Header */
  .ajf-header {
    display: flex; align-items: flex-start;
    justify-content: space-between; gap: 16px;
    flex-wrap: wrap; margin-bottom: 28px;
  }
  .ajf-header-right {
    display: flex; align-items: center; gap: 12px;
    flex-wrap: wrap;
  }
  .ajf-title { font-size: clamp(22px, 4vw, 30px); font-weight: 900; color: #f1f5f9; }
  .ajf-title span { color: #a78bfa; }
  .ajf-sub { font-size: 13px; color: #475569; margin-top: 4px; }
  .ajf-chip {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; padding: 5px 12px; border-radius: 20px;
    background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.3); color: #a78bfa;
  }
  .ajf-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #a78bfa;
    animation: dot-pulse 2s ease-in-out infinite;
  }
  @keyframes dot-pulse { 0%,100%{opacity:1;}50%{opacity:0.3;} }

  /* ── Save Indicator ── */
  .ajf-save-indicator {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 12px; border-radius: 20px;
    font-size: 11px; font-weight: 600;
    transition: all 0.3s ease;
  }
  .ajf-save-indicator.saving {
    background: rgba(251,191,36,0.15); color: #fbbf24;
  }
  .ajf-save-indicator.saved {
    background: rgba(52,211,153,0.15); color: #34d399;
  }
  .ajf-save-indicator.error {
    background: rgba(248,113,113,0.15); color: #f87171;
  }
  .ajf-save-dot {
    width: 6px; height: 6px; border-radius: 50%; display: inline-block;
  }
  .ajf-save-dot.saving {
    background: #fbbf24; animation: pulse-dot 1s ease-in-out infinite;
  }
  .ajf-save-dot.saved { background: #34d399; }
  .ajf-save-dot.error { background: #f87171; }
  @keyframes pulse-dot {
    0%,100%{opacity:1;transform:scale(1);}
    50%{opacity:0.4;transform:scale(0.8);}
  }

  /* Cards */
  .ajf-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px; padding: 24px 22px;
    margin-bottom: 20px;
    transition: border-color 0.2s;
  }
  .ajf-card:hover { border-color: rgba(255,255,255,0.11); }
  .ajf-card-light { background: rgba(255,255,255,0.96) !important; border-color: #e2e8f0 !important; }
  .ajf-card-title {
    font-family: 'Syne', sans-serif;
    font-size: 13px; font-weight: 700;
    letter-spacing: 0.07em; text-transform: uppercase;
    color: #64748b; margin-bottom: 18px;
  }
  .ajf-card-light .ajf-card-title { color: #475569; }

  /* Inputs */
  .ajf-card:not(.ajf-card-light) input,
  .ajf-card:not(.ajf-card-light) textarea,
  .ajf-card:not(.ajf-card-light) select {
    background: rgba(255,255,255,0.04) !important;
    border: 1px solid rgba(255,255,255,0.1) !important;
    color: #e2e8f0 !important;
    border-radius: 10px !important;
    font-size: 14px !important;
  }
  .ajf-card:not(.ajf-card-light) input:focus,
  .ajf-card:not(.ajf-card-light) textarea:focus {
    border-color: rgba(139,92,246,0.6) !important;
    box-shadow: 0 0 0 3px rgba(139,92,246,0.15) !important;
    outline: none !important;
  }
  .ajf-card:not(.ajf-card-light) input::placeholder,
  .ajf-card:not(.ajf-card-light) textarea::placeholder { color: #475569 !important; }

  .ajf-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  @media(max-width:640px) { .ajf-grid-2 { grid-template-columns: 1fr; } }

  .ajf-label {
    display: block; font-size: 11px; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: #475569; margin-bottom: 6px;
  }
  .ajf-card-light .ajf-label { color: #64748b; }
  .ajf-hint { font-size: 11px; color: #334155; text-align: right; margin-top: 4px; }
  .ajf-hint.warn { color: #f59e0b; }

  /* Banner upload */
  .ajf-upload {
    border: 2px dashed rgba(255,255,255,0.1);
    border-radius: 14px; cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    overflow: hidden; position: relative;
  }
  .ajf-upload:hover,.ajf-upload.drag {
    border-color: rgba(139,92,246,0.5);
    background: rgba(139,92,246,0.03);
  }
  .ajf-upload.has { border-style: solid; border-color: rgba(139,92,246,0.3); cursor: default; }
  .ajf-banner-preview {
    width: 100%; max-height: 240px;
    object-fit: cover; border-radius: 10px; display: block;
  }
  .ajf-upload-icon {
    width: 56px; height: 56px; border-radius: 14px;
    background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.2);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 14px;
  }
  .ajf-upload-btn {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(139,92,246,0.15); border: 1px solid rgba(139,92,246,0.3);
    color: #a78bfa; font-size: 12px; font-weight: 600;
    padding: 7px 16px; border-radius: 8px; cursor: pointer;
    transition: background 0.18s; font-family: 'DM Sans', sans-serif;
  }
  .ajf-upload-btn:hover { background: rgba(139,92,246,0.25); }
  .ajf-rm {
    position: absolute; top: 10px; right: 10px;
    width: 26px; height: 26px; border-radius: 6px;
    background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3);
    color: #f87171; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background 0.15s;
  }
  .ajf-rm:hover { background: rgba(239,68,68,0.3); }

  /* Job type chips */
  .ajf-type-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; }
  @media(max-width:560px) { .ajf-type-grid { grid-template-columns: repeat(2,1fr); } }
  .ajf-chip-type {
    padding: 11px 6px; border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    text-align: center; font-size: 13px; font-weight: 600;
    color: #64748b; cursor: pointer; transition: all 0.18s;
  }
  .ajf-chip-type:hover { border-color: rgba(139,92,246,0.4); color: #a78bfa; }
  .sel-intern   { background:rgba(59,130,246,0.1);  border-color:rgba(59,130,246,0.4);  color:#93c5fd; }
  .sel-full     { background:rgba(16,185,129,0.1);  border-color:rgba(16,185,129,0.4);  color:#6ee7b7; }
  .sel-part     { background:rgba(245,158,11,0.1);  border-color:rgba(245,158,11,0.4);  color:#fcd34d; }
  .sel-contract { background:rgba(168,85,247,0.1);  border-color:rgba(168,85,247,0.4);  color:#d8b4fe; }
  .sel-offcampus { background:rgba(6,182,212,0.1); border-color:rgba(6,182,212,0.4); color:#67e8f9; }
  .sel-walkin { background:rgba(239,68,68,0.1); border-color:rgba(239,68,68,0.4); color:#fca5a5; }
  .sel-codelura { background:rgba(139,92,246,0.1); border-color:rgba(139,92,246,0.4); color:#c4b5fd; }

  /* Quill overrides */
  .ajf-card-light .ql-toolbar { border-color: #e2e8f0 !important; border-radius: 8px 8px 0 0 !important; }
  .ajf-card-light .ql-container { border-color: #e2e8f0 !important; border-radius: 0 0 8px 8px !important; min-height: 240px; }
  .ajf-card-light .ql-editor { min-height: 240px; font-size: 15px; line-height: 1.7; }

  /* Preview */
  .ajf-preview-wrap {
    margin-top: 20px; padding: 16px 18px;
    background: #f8fafc; border: 1px solid #e2e8f0;
    border-radius: 10px;
  }
  .ajf-preview-label {
    font-size: 11px; font-weight: 700; color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;
  }
  .ajf-preview {
    font-size: 14px; color: #374151; line-height: 1.7;
  }
  .ajf-preview h1,.ajf-preview h2,.ajf-preview h3 {
    font-family:'Syne',sans-serif; color:#111827; margin:16px 0 8px;
  }
  .ajf-preview p { margin-bottom: 12px; }
  .ajf-preview ul { list-style:disc; padding-left:20px; margin-bottom:12px; }
  .ajf-preview ol { list-style:decimal; padding-left:20px; margin-bottom:12px; }
  .ajf-preview li { margin-bottom: 4px; }
  .ajf-preview blockquote {
    border-left:3px solid #6366f1; padding:8px 16px;
    color:#6b7280; font-style:italic; margin:12px 0;
  }
  .ajf-preview pre {
    background:#1e1e2e; color:#cdd6f4; padding:12px;
    border-radius:8px; overflow-x:auto; font-size:13px;
  }
  .ajf-preview code {
    background:#f3f4f6; color:#6366f1; padding:1px 5px;
    border-radius:4px; font-size:13px;
  }
  .ajf-preview pre code {
    background:transparent; color:inherit; padding:0;
  }
  .ajf-preview img {
    max-width:100%; border-radius:8px; margin:10px 0;
  }
  .ajf-preview strong { color:#111827; font-weight:700; }
  .ajf-preview a { color:#6366f1; text-decoration:underline; }

  /* Tags preview */
  .ajf-tag-preview {
    font-size: 11px; font-weight: 600;
    background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.25);
    color: #a78bfa; padding: 2px 10px; border-radius: 20px;
  }

  /* Toggles */
  .ajf-toggle-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 16px; background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 11px; margin-bottom: 10px;
  }
  .ajf-toggle-label { font-size: 14px; font-weight: 500; color: #94a3b8; }
  .ajf-toggle-desc  { font-size: 12px; color: #475569; margin-top: 2px; }

  /* Footer */
  .ajf-footer {
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
    background: rgba(7,8,15,0.88); backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255,255,255,0.07);
    padding: 13px 24px;
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
  }
  .ajf-footer-info { font-size: 12px; color: #475569; }
  .ajf-footer-info strong { color: #94a3b8; }
  .ajf-footer-btns { display: flex; gap: 10px; }
  .ajf-btn-cancel {
    padding: 9px 20px; border-radius: 10px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
    color: #64748b; font-size: 13px; font-weight: 600; cursor: pointer;
    transition: all 0.18s; font-family: 'DM Sans', sans-serif;
  }
  .ajf-btn-cancel:hover { color: #94a3b8; background: rgba(255,255,255,0.07); }
  .ajf-btn-submit {
    padding: 9px 22px; border-radius: 10px;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    border: none; color: #fff; font-size: 13px; font-weight: 700;
    cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
    box-shadow: 0 4px 14px rgba(124,58,237,0.3);
    transition: opacity 0.18s, transform 0.18s;
    font-family: 'DM Sans', sans-serif;
  }
  .ajf-btn-submit:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
  .ajf-btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

  .animate-spin { animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;
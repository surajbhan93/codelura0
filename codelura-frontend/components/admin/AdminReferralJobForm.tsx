"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import sanitizeHtml from "sanitize-html";
import {
  Sparkles,
  Coins,
  Mail,
  Phone,
  Link as LinkIcon,
  FileText,
  Building2,
  MapPin,
  DollarSign,
  Tag,
  Upload,
  Loader2,
  CheckCircle2,
  Zap,
  ArrowLeft,
  Briefcase,
  HelpCircle,
  Clock
} from "lucide-react";
import type Quill from "quill";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Lazy load ReactQuill editor for full content description
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-[250px] bg-slate-900 border border-slate-800 rounded-xl animate-pulse flex items-center justify-center">
      <span className="text-slate-500 text-xs">Loading Rich Text Editor...</span>
    </div>
  ),
});

interface ReferralFormData {
  title: string;
  slug: string;
  company: string;
  bannerImage: string;
  location: string;
  type: "premium-referral";
  salary: string;
  description: string;
  content: string;
  tags: string;
  careerPageUrl: string;
  creditCost: number;
  recruiterEmail: string;
  recruiterPhone: string;
  referralLink: string;
  applyInstructions: string;
  seoMetaTitle: string;
  seoMetaDescription: string;
  seoKeywords: string;
  seoCanonicalUrl: string;
  isFeatured: boolean;
  isExpired: boolean;
  postedAt: string;
  deadline: string;
}

interface AdminReferralJobFormProps {
  initialData?: Partial<ReferralFormData>;
  isEdit?: boolean;
  jobId?: string;
}

export default function AdminReferralJobForm({
  initialData = {},
  isEdit = false,
  jobId,
}: AdminReferralJobFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Grok AI Auto-Fill States
  const [aiJobUrl, setAiJobUrl] = useState("");
  const [aiJobDescription, setAiJobDescription] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuccess, setAiSuccess] = useState(false);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const [form, setForm] = useState<ReferralFormData>({
    title: initialData.title || "",
    slug: initialData.slug || "",
    company: initialData.company || "",
    bannerImage: initialData.bannerImage || "",
    location: initialData.location || "Remote",
    type: "premium-referral",
    salary: initialData.salary || "",
    description: initialData.description || "",
    content: initialData.content || "",
    tags: Array.isArray(initialData.tags)
      ? (initialData.tags as any).join(", ")
      : initialData.tags || "",
    careerPageUrl: initialData.careerPageUrl || "",
    creditCost: initialData.creditCost ?? 10,
    recruiterEmail: initialData.recruiterEmail || "",
    recruiterPhone: initialData.recruiterPhone || "",
    referralLink: initialData.referralLink || "",
    applyInstructions: initialData.applyInstructions || "",
    seoMetaTitle: initialData.seoMetaTitle || "",
    seoMetaDescription: initialData.seoMetaDescription || "",
    seoKeywords: initialData.seoKeywords || "",
    seoCanonicalUrl: initialData.seoCanonicalUrl || "",
    isFeatured: initialData.isFeatured ?? false,
    isExpired: initialData.isExpired ?? false,
    postedAt: initialData.postedAt || today,
    deadline: initialData.deadline || "",
  });

  const handleTitleChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    setForm((f) => ({ ...f, title: val, slug: f.slug || slug }));
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "ml_default"
    );
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) throw new Error("Cloudinary cloud name not configured");
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formData }
    );
    if (!res.ok) throw new Error("Banner upload failed");
    const data = await res.json();
    return data.secure_url;
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadToCloudinary(file);
      setForm((f) => ({ ...f, bannerImage: url }));
      toast.success("Banner image uploaded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ── Grok AI Referral Auto-Fill Handler ── */
  const handleGrokAiAutoFill = async () => {
    if (!aiJobUrl.trim() && !aiJobDescription.trim()) {
      toast.error("Please enter either a Job Posting URL or paste Job / Recruiter Details");
      return;
    }

    try {
      setAiLoading(true);
      setAiSuccess(false);

      const res = await api.post("/jobs/auto-fill", {
        jobUrl: aiJobUrl.trim(),
        jobDescription: aiJobDescription.trim(),
      });

      if (!res.data || !res.data.success || !res.data.job) {
        throw new Error(res.data?.message || "Unable to extract referral job data.");
      }

      const job = res.data.job;

      setForm((prev) => ({
        ...prev,
        title: job.jobTitle || prev.title,
        slug: job.slug || prev.slug,
        company: job.companyName || prev.company,
        bannerImage: job.bannerImageUrl || prev.bannerImage,
        location: job.location || prev.location,
        salary: job.salary || prev.salary,
        description: job.shortDescription || prev.description,
        content: job.fullDescription || prev.content,
        tags: Array.isArray(job.skillTags) ? job.skillTags.join(", ") : job.skillTags || prev.tags,
        careerPageUrl: job.careerUrl || job.referralLink || prev.careerPageUrl,
        referralLink: job.referralLink || job.careerUrl || prev.referralLink,
        recruiterEmail: job.recruiterEmail || prev.recruiterEmail,
        recruiterPhone: job.recruiterPhone || prev.recruiterPhone,
        applyInstructions: job.applyInstructions || prev.applyInstructions,
        creditCost: job.creditCost ? Number(job.creditCost) : prev.creditCost || 10,
        seoMetaTitle: job.seoMetaTitle || prev.seoMetaTitle,
        seoMetaDescription: job.seoMetaDescription || prev.seoMetaDescription,
        seoKeywords: job.seoKeywords || prev.seoKeywords,
      }));

      setAiSuccess(true);
      toast.success("⚡ Grok AI auto-filled referral job & recruiter details!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Grok AI extraction failed.");
    } finally {
      setAiLoading(false);
    }
  };

  const sanitize = useCallback(
    (html: string) =>
      sanitizeHtml(html, {
        allowedTags: [
          "p", "h1", "h2", "h3", "h4", "h5", "h6", "strong", "em", "u",
          "ul", "ol", "li", "blockquote", "code", "pre", "a", "img", "br"
        ],
        allowedAttributes: { a: ["href", "target"], img: ["src", "alt"] },
      }),
    []
  );

  /* ── Form Submission Handler ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) return toast.error("Job title is required");
    if (!form.company.trim()) return toast.error("Company name is required");
    if (!form.description.trim()) return toast.error("Short description is required");

    const finalApplyLink = form.referralLink?.trim() || form.careerPageUrl?.trim();
    if (!finalApplyLink) {
      return toast.error("Referral apply link or recruiter contact link is required");
    }

    try {
      setLoading(true);

      const payload = {
        title: form.title,
        slug: form.slug,
        company: form.company,
        bannerImage: form.bannerImage,
        location: form.location,
        type: "premium-referral",
        salary: form.salary,
        description: form.description,
        content: sanitize(form.content),
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        careerPageUrl: finalApplyLink,
        creditCost: Number(form.creditCost) || 10,
        recruiterEmail: form.recruiterEmail.trim(),
        recruiterPhone: form.recruiterPhone.trim(),
        referralLink: finalApplyLink,
        applyInstructions: form.applyInstructions,
        seo: {
          metaTitle: form.seoMetaTitle.trim(),
          metaDescription: form.seoMetaDescription.trim(),
          keywords: form.seoKeywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean),
          canonicalUrl: form.seoCanonicalUrl.trim(),
        },
        isFeatured: form.isFeatured,
        isExpired: form.isExpired,
        postedAt: form.postedAt || new Date().toISOString(),
        deadline: form.deadline || null,
      };

      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      if (isEdit && jobId) {
        await api.patch(`/jobs/${jobId}`, payload, { headers });
        toast.success("Premium Referral job updated successfully! ⚡");
      } else {
        await api.post("/jobs", payload, { headers });
        toast.success("Premium Referral job posted successfully! 🚀");
      }

      router.push("/admin/premium-referrals");
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to save referral job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── 1. GROK AI REFERRAL AUTO-FILL BOX ── */}
      <div className="bg-gradient-to-r from-violet-950/70 via-slate-900 to-indigo-950/70 border border-violet-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-violet-600/20 border border-violet-500/40 rounded-xl text-violet-400">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              ⚡ Grok AI Referral Auto-Fill
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-semibold border border-violet-500/30">
                Exclusive for Referrals
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Paste a Job Posting URL or Recruiter / Referral text to automatically extract job details, recruiter emails, and apply instructions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Option A: Job / LinkedIn / Career URL
            </label>
            <div className="relative">
              <input
                type="url"
                value={aiJobUrl}
                onChange={(e) => setAiJobUrl(e.target.value)}
                placeholder="https://linkedin.com/jobs/view/... or career URL"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Option B: Paste Job Description / Recruiter Note
            </label>
            <textarea
              rows={2}
              value={aiJobDescription}
              onChange={(e) => setAiJobDescription(e.target.value)}
              placeholder="Paste raw referral text, recruiter contact email, phone, and requirements..."
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          {aiSuccess ? (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-4 h-4" /> Grok AI extracted referral details cleanly!
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">
              💡 Grok AI automatically parses recruiter email, phone, and direct referral apply links.
            </span>
          )}

          <button
            type="button"
            onClick={handleGrokAiAutoFill}
            disabled={aiLoading}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-lg shadow-violet-600/20 disabled:opacity-50 cursor-pointer"
          >
            {aiLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Grok AI Parsing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                Auto-Fill with Grok AI
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── 2. MAIN FORM ── */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* REFERRAL LOCK & CREDIT SETTINGS CARD */}
        <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Coins className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              🔒 Premium Referral Unlock & Credit Settings
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Credit Cost */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                Unlock Credit Cost
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={form.creditCost}
                onChange={(e) =>
                  setForm((f) => ({ ...f, creditCost: Number(e.target.value) }))
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                required
              />
              <div className="flex gap-1.5 mt-2">
                {[10, 20, 50, 100].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, creditCost: preset }))}
                    className={`text-[10px] px-2 py-1 rounded-md border font-semibold transition ${
                      form.creditCost === preset
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                        : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                    }`}
                  >
                    {preset} Credits
                  </button>
                ))}
              </div>
            </div>

            {/* Recruiter Email */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                Recruiter / Contact Email (Protected)
              </label>
              <input
                type="email"
                value={form.recruiterEmail}
                onChange={(e) =>
                  setForm((f) => ({ ...f, recruiterEmail: e.target.value }))
                }
                placeholder="e.g. referral.tech@company.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Visible ONLY after user unlocks with credits.
              </p>
            </div>

            {/* Recruiter Phone */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                Recruiter Phone / WhatsApp (Protected)
              </label>
              <input
                type="text"
                value={form.recruiterPhone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, recruiterPhone: e.target.value }))
                }
                placeholder="e.g. +91 9876543210"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Visible ONLY after user unlocks with credits.
              </p>
            </div>
          </div>

          {/* Referral Apply Link */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-violet-400" />
              Direct Referral Apply Link (Protected)
            </label>
            <input
              type="url"
              value={form.referralLink}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  referralLink: e.target.value,
                  careerPageUrl: e.target.value,
                }))
              }
              placeholder="https://company.referrals.com/apply/xyz123"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              required
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Direct job portal / employee referral portal link. Redacted for non-unlocked users.
            </p>
          </div>

          {/* Apply Instructions */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-300" />
              Special Referral Apply Instructions
            </label>
            <textarea
              rows={2}
              value={form.applyInstructions}
              onChange={(e) =>
                setForm((f) => ({ ...f, applyInstructions: e.target.value }))
              }
              placeholder="e.g. Subject format: 'Referral Request - [Job ID] - [Your Name]'. Attach your resume and LinkedIn profile."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none"
            />
          </div>
        </div>

        {/* BASIC JOB INFORMATION CARD */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Briefcase className="w-5 h-5 text-violet-400" />
            <h3 className="text-sm font-bold text-white">💼 Job Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Job Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Senior Software Engineer (SDE-2)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                required
              />
            </div>

            {/* Company */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Company Name *
              </label>
              <input
                type="text"
                value={form.company}
                onChange={(e) =>
                  setForm((f) => ({ ...f, company: e.target.value }))
                }
                placeholder="e.g. Google, Microsoft, Uber"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Location *
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) =>
                  setForm((f) => ({ ...f, location: e.target.value }))
                }
                placeholder="e.g. Bangalore / Remote / Hybrid"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                required
              />
            </div>

            {/* Salary */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Salary / CTC Range
              </label>
              <input
                type="text"
                value={form.salary}
                onChange={(e) =>
                  setForm((f) => ({ ...f, salary: e.target.value }))
                }
                placeholder="e.g. ₹25 – ₹45 LPA or ₹80k / month"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Skill Tags */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Skill Tags (Comma separated)
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              placeholder="e.g. Java, System Design, Microservices, React, AWS"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Short Description (Card Summary) *
            </label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Brief summary of role, team, and eligibility..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none"
              required
            />
          </div>

          {/* Full Job Description (Quill Editor) */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Full Job Description & Requirements
            </label>
            <div className="bg-slate-950 border border-slate-700 rounded-xl overflow-hidden text-white">
              <ReactQuill
                theme="snow"
                value={form.content}
                onChange={(val) => setForm((f) => ({ ...f, content: val }))}
                className="text-white"
              />
            </div>
          </div>
        </div>

        {/* BANNER & PUBLISH SETTINGS */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-800">
            🖼️ Banner & Visibility
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Company Banner Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={form.bannerImage}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, bannerImage: e.target.value }))
                  }
                  placeholder="https://..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                />
                <label className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-xl text-xs font-medium cursor-pointer border border-slate-700 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isFeatured: e.target.checked }))
                  }
                  className="w-4 h-4 accent-amber-500 rounded"
                />
                ⭐ Mark as Featured Referral
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isExpired}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isExpired: e.target.checked }))
                  }
                  className="w-4 h-4 accent-red-500 rounded"
                />
                ⏰ Mark as Expired
              </label>
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex items-center justify-between pt-4">
          <Link
            href="/admin/premium-referrals"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" /> Cancel & Return
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold px-6 py-3 rounded-xl text-sm transition shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving Referral Job...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {isEdit ? "Update Premium Referral" : "Publish Premium Referral"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

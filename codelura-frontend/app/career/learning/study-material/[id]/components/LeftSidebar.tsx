"use client";

import { memo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Link2, Twitter, Linkedin, Facebook, Send, MessageCircle } from "lucide-react";
import api from "@/lib/api";
import { Course } from "../types";

export const LeftSidebar = memo(function LeftSidebar({
  course,
  rating,
  totalPages,
}: {
  course: Course;
  rating: number;
  totalPages: number | null;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Check out this course: ${course.title}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied!");
  };

  const shareWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`, "_blank");
  const shareTwitter = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "_blank");
  const shareLinkedIn = () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank");
  const shareFacebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
  const shareTelegram = () => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, "_blank");

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post("/user/save-course", { courseId: course._id });
      toast.success("Saved to dashboard ✅");
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error("Login required");
        router.push(`/auth/login?redirect=/courses/${course._id}`);
      } else {
        toast.error("Failed to save");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <aside className="flex flex-col gap-4">
      {/* Title & Badge Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900 leading-snug tracking-tight">
          {course.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-0.5 text-amber-400">
            {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
          </div>
          <span className="text-sm font-bold text-slate-900">{rating.toFixed(1)}</span>
          <span className="text-xs text-slate-400 font-medium">(1.2k reviews)</span>
          <span className="ml-auto text-xl font-black text-indigo-600">
            {course.isPaid ? `₹${course.price}` : "Free"}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {course.category && (
            <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
              {course.category}
            </span>
          )}
          {course.language && (
            <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              {course.language}
            </span>
          )}
          {course.level && (
            <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-bold text-rose-700 uppercase tracking-wider">
              {course.level}
            </span>
          )}
        </div>
      </div>

      {/* Save Button */}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="w-full rounded-2xl border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100/80 text-indigo-700 py-3.5 px-4 text-sm font-bold shadow-sm transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
      >
        <span>📥</span>
        {saving ? "Saving..." : "Save to Dashboard"}
      </button>

      {/* Course Description */}
      {course.description && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-indigo-600">
            About this course
          </p>
          <p className="text-sm leading-relaxed text-slate-600">
            {course.description}
          </p>
        </div>
      )}

      {/* Course Metadata Grid */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: "📚", label: "Level", val: course.level },
          { icon: "🗣", label: "Language", val: course.language },
          { icon: "⏱", label: "Duration", val: course.duration },
          { icon: "📄", label: "Pages", val: totalPages ? `${totalPages} pg` : null },
        ]
          .filter((m) => m.val)
          .map((m) => (
            <div key={m.label} className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                {m.icon} {m.label}
              </p>
              <p className="mt-1 text-sm font-bold text-slate-800">{m.val}</p>
            </div>
          ))}
      </div>

      {/* Included Highlights */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
          What is included
        </p>
        <div className="space-y-2 text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px]">✓</span>
            {totalPages ?? "–"} Pages of Structed Notes
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px]">✓</span>
            Exam & Interview Ready Material
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[10px]">✓</span>
            Printable High Quality PDF
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px]">✓</span>
            Free Lifetime Future Updates
          </div>
        </div>
      </div>

      {/* Attachments */}
      {course.attachments && course.attachments.length > 0 && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-indigo-600">
            Attachments
          </p>
          <div className="space-y-2">
            {course.attachments.map((f, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700">
                📎 {f.fileName}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* External Links */}
      {course.externalLinks && course.externalLinks.length > 0 && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-indigo-600">
            Extra Resources
          </p>
          <div className="space-y-2">
            {course.externalLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50/50 px-3 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-100 transition-colors"
              >
                🔗 {link.title}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Meta Box */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-2 text-xs">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
          Course Summary
        </p>
        <div className="flex justify-between py-1.5 border-b border-slate-100">
          <span className="text-slate-500 font-medium">Category</span>
          <span className="font-bold text-slate-800">{course.category || "N/A"}</span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-slate-100">
          <span className="text-slate-500 font-medium">Language</span>
          <span className="font-bold text-slate-800">{course.language || "English"}</span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-slate-100">
          <span className="text-slate-500 font-medium">Level</span>
          <span className="font-bold text-slate-800">{course.level || "All Levels"}</span>
        </div>
        <div className="flex justify-between py-1.5">
          <span className="text-slate-500 font-medium">Total Pages</span>
          <span className="font-bold text-slate-800">{totalPages ? `${totalPages} Pages` : "N/A"}</span>
        </div>
      </div>
      {/* Social Share Bar */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-indigo-600">
          Share Course
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { icon: <Link2 size={16} />, action: copyLink, label: "Copy Link" },
            { icon: <MessageCircle size={16} />, action: shareWhatsApp, label: "WhatsApp" },
            { icon: <Twitter size={16} />, action: shareTwitter, label: "Twitter" },
            { icon: <Linkedin size={16} />, action: shareLinkedIn, label: "LinkedIn" },
            { icon: <Facebook size={16} />, action: shareFacebook, label: "Facebook" },
            { icon: <Send size={16} />, action: shareTelegram, label: "Telegram" },
          ].map((btn, i) => (
            <button
              key={i}
              type="button"
              onClick={btn.action}
              title={btn.label}
              className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all active:scale-95"
            >
              {btn.icon}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
});
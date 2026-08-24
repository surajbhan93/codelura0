"use client";

import { memo, useState } from "react";
import { useRouter } from "next/navigation";
import { Course } from "../types";

export const PDFViewer = memo(function PDFViewer({
  course,
  pdfSrc,
  accessLevel,
  totalPages,
  FREE_PAGES,
  onBuy,
}: {
  course: Course;
  pdfSrc: string;
  accessLevel: "preview" | "full_read" | "full_access" | "locked";
  totalPages: number | null;
  FREE_PAGES: number;
  onBuy: () => void;
}) {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);

  return (
    <main className="flex flex-col gap-4">
      <div id="preview" className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-lg">
        {/* PDF Header Toolbar */}
        <div className="border-b border-slate-200 px-6 py-4 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600">
              Document Preview
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Free Sample Pages — {FREE_PAGES} / {totalPages ?? "…"} pages
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Scroll down to explore course content
          </span>
        </div>

        {/* Iframe Loading Skeleton & Container */}
        <div className="relative bg-slate-100 min-h-[700px]">
          {!loaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 gap-3">
              <div className="w-8 h-8 rounded-full border-3 border-slate-200 border-t-indigo-600 animate-spin" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Loading Document Viewer...
              </p>
            </div>
          )}

          <iframe
            key={accessLevel}
            src={pdfSrc}
            onLoad={() => setLoaded(true)}
            className="w-full h-[750px] border-0"
            title="Course preview document"
          />

          {/* Preview Locked Overlay */}
          {accessLevel === "preview" && (
            <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent flex flex-col items-center justify-end p-8 text-center backdrop-blur-sm">
              <p className="text-white font-bold text-base mb-3">
                End of free preview pages
              </p>
              <button
                type="button"
                onClick={() => router.push(`/auth/login?redirect=/courses/${course._id}`)}
                className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
              >
                Login to Continue Reading
              </button>
            </div>
          )}

          {/* Full Locked Overlay */}
          {accessLevel === "locked" && (
            <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent flex flex-col items-center justify-end p-8 text-center backdrop-blur-sm">
              <p className="text-white font-bold text-base mb-3">
                Full course material is locked
              </p>
              <button
                type="button"
                onClick={onBuy}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-lg shadow-amber-500/30 transition-all active:scale-95"
              >
                Unlock Full Access for ₹{course.price}
              </button>
            </div>
          )}
        </div>

        {/* Access State Status Banners */}
        {accessLevel === "full_read" && (
          <div className="border-t border-indigo-100 bg-indigo-50 px-4 py-3 text-center text-xs font-bold text-indigo-700">
            👀 Logged In — Full study notes unlocked for inline viewing
          </div>
        )}

        {accessLevel === "full_access" && (
          <div className="border-t border-emerald-100 bg-emerald-50 px-4 py-3 text-center text-xs font-bold text-emerald-700">
            ✅ Purchased — Lifetime PDF Download Enabled
          </div>
        )}
      </div>
      {/* FAQs / Common Questions */}
<section className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
  <div className="mb-6">
    <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-indigo-600">
      Common Questions
    </span>

    <h2 className="mt-1 text-xl md:text-2xl font-extrabold text-slate-900">
      Frequently Asked Questions
    </h2>

    <p className="mt-2 text-sm text-slate-500">
      Everything you need to know about this study material.
    </p>
  </div>

  <div className="space-y-3">
    <details className="group rounded-xl border border-slate-200 bg-slate-50/60 open:bg-white transition-colors">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-bold text-slate-800">
        Is this study material suitable for placement preparation?

        <span className="text-xl font-medium text-indigo-600 transition-transform group-open:rotate-45">
          +
        </span>
      </summary>

      <div className="px-5 pb-4 text-sm leading-6 text-slate-600">
        Yes. This material is designed to help students prepare important
        concepts for placements, coding interviews, technical rounds, and
        revision.
      </div>
    </details>

    <details className="group rounded-xl border border-slate-200 bg-slate-50/60 open:bg-white transition-colors">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-bold text-slate-800">
        Can I read the notes online?

        <span className="text-xl font-medium text-indigo-600 transition-transform group-open:rotate-45">
          +
        </span>
      </summary>

      <div className="px-5 pb-4 text-sm leading-6 text-slate-600">
        Yes. Depending on your access level, you can preview or read the
        available study material directly on Codelura.
      </div>
    </details>

    <details className="group rounded-xl border border-slate-200 bg-slate-50/60 open:bg-white transition-colors">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-bold text-slate-800">
        Do I need to purchase the notes to download the PDF?

        <span className="text-xl font-medium text-indigo-600 transition-transform group-open:rotate-45">
          +
        </span>
      </summary>

      <div className="px-5 pb-4 text-sm leading-6 text-slate-600">
        If this is premium material, PDF downloading is available after
        purchase when download access is enabled for the course.
      </div>
    </details>

    <details className="group rounded-xl border border-slate-200 bg-slate-50/60 open:bg-white transition-colors">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-bold text-slate-800">
        Will I get lifetime access after purchasing?

        <span className="text-xl font-medium text-indigo-600 transition-transform group-open:rotate-45">
          +
        </span>
      </summary>

      <div className="px-5 pb-4 text-sm leading-6 text-slate-600">
        Access depends on the validity configured for this study material.
        If lifetime access is provided, you can continue accessing it from
        your dashboard.
      </div>
    </details>

    <details className="group rounded-xl border border-slate-200 bg-slate-50/60 open:bg-white transition-colors">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-bold text-slate-800">
        Who is this study material for?

        <span className="text-xl font-medium text-indigo-600 transition-transform group-open:rotate-45">
          +
        </span>
      </summary>

      <div className="px-5 pb-4 text-sm leading-6 text-slate-600">
        It is useful for college students, freshers, placement candidates,
        internship seekers, and learners preparing for technical interviews.
      </div>
    </details>

    <details className="group rounded-xl border border-slate-200 bg-slate-50/60 open:bg-white transition-colors">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-bold text-slate-800">
        Where can I access purchased study materials?

        <span className="text-xl font-medium text-indigo-600 transition-transform group-open:rotate-45">
          +
        </span>
      </summary>

      <div className="px-5 pb-4 text-sm leading-6 text-slate-600">
        Purchased and saved study materials can be accessed from your
        Codelura dashboard after signing in to your account.
      </div>
    </details>
  </div>
</section>

      {/* Google AdSense Free User Block */}
      {accessLevel === "preview" && course.showAdsForFreeUsers && (
        <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center bg-white">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Advertisement
          </p>
          <div className="h-24 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Google AdSense Ad Frame
          </div>
        </div>
      )}
    </main>
  );
});
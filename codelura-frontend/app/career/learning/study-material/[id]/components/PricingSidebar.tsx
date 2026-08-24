"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import PaymentIcons from "@/components/shared/PaymentIcons";
import { Course } from "../types";
const RelatedCourses = dynamic(
  () => import("../RelatedCourses"),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
    ),
  }
);
export const PricingSidebar = memo(function PricingSidebar({
  course,
  accessLevel,
  totalPages,
  onBuy,
}: {
  course: Course;
  accessLevel: "preview" | "full_read" | "full_access" | "locked";
  totalPages: number | null;
  onBuy: () => void;
}) {
  const router = useRouter();

  return (
    <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
      {/* Main Pricing Box */}
      <div id="pricing" className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-lg space-y-5">
        <div className="border-b border-slate-100 pb-4">
          <div className="text-3xl font-black text-slate-900">
            {course.isPaid ? `₹${course.price}` : "Free"}
          </div>
          <p className="mt-1 text-xs font-semibold text-slate-400">
            One-time payment · Lifetime access
          </p>
        </div>

        {/* Perks Checklist */}
        <div className="space-y-2 text-xs font-bold text-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[9px]">✓</span>
            Full PDF Material Access
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[9px]">✓</span>
            {totalPages ?? "–"} Printable High Res Pages
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[9px]">✓</span>
            Free Future Curriculum Updates
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[9px]">✓</span>
            Instant Delivery to Account
          </div>
          {course.allowDownloadAfterPurchase && (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[9px]">✓</span>
              Offline PDF Download Enabled
            </div>
          )}
        </div>

        {/* Action Buttons Based On Access */}
        {accessLevel === "full_access" && course.allowDownloadAfterPurchase && (
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/courses/${course._id}/pdf`}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all active:scale-95"
          >
            ⬇ Download Full PDF
          </a>
        )}

        {accessLevel === "full_read" && course.isPaid && (
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 text-center space-y-3">
            <p className="text-xs font-bold text-indigo-700">
              Full notes unlocked for inline reading
            </p>
            <button
              type="button"
              onClick={() => router.push(`/courses/${course._id}/checkout`)}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all active:scale-95"
            >
              🛒 Pay ₹{course.price} & Enable PDF Download
            </button>
          </div>
        )}

        {accessLevel === "locked" && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={onBuy}
              className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-lg shadow-indigo-600/25 transition-all active:scale-95"
            >
              🛒 Buy Now — ₹{course.price}
            </button>
            <p className="text-center text-[11px] font-semibold text-slate-400">
              🔒 256-Bit SSL Encrypted Payment via Razorpay
            </p>
          </div>
        )}

        <PaymentIcons />
     
      </div>
       

        <RelatedCourses
  currentId={course._id}
  tags={course.tags}
  category={course.category}
  limit={3}
/>
    </aside>
  );
});
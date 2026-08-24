"use client";

import { memo } from "react";

export const StickyMobileCTA = memo(function StickyMobileCTA({
  price,
  isPaid,
  show,
}: {
  price: number;
  isPaid: boolean;
  show: boolean;
}) {
  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-xl p-4 md:hidden shadow-2xl flex items-center justify-between">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Price</span>
        <div className="text-xl font-black text-slate-900">{isPaid ? `₹${price}` : "Free"}</div>
      </div>
      <button
        type="button"
        onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
        className="px-7 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-sm shadow-md active:scale-95"
      >
        Buy Now
      </button>
    </div>
  );
});
"use client";

import { memo } from "react";

export const Pagination = memo(function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
      >
        ‹ Prev
      </button>

      {Array.from({ length: totalPages }).map((_, i) => {
        const pNum = i + 1;
        return (
          <button
            key={pNum}
            type="button"
            onClick={() => onPageChange(pNum)}
            className={`w-10 h-10 rounded-xl text-xs font-extrabold transition-all ${
              page === pNum
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm"
            }`}
          >
            {pNum}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
      >
        Next ›
      </button>
    </div>
  );
});
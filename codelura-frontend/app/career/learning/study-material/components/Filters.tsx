"use client";

import { memo } from "react";
import { FilterType, SortType } from "../types";

const FILTERS: FilterType[] = ["all", "free", "paid"];
const SORTS: SortType[] = ["popular", "newest"];

export const Filters = memo(function Filters({
  filter,
  sort,
  onFilterChange,
  onSortChange,
}: {
  filter: FilterType;
  sort: SortType;
  onFilterChange: (f: FilterType) => void;
  onSortChange: (s: SortType) => void;
}) {
  return (
    <section className="mb-10">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/80 p-3 rounded-2xl border border-slate-200/80 shadow-md shadow-slate-200/30">
        <div className="flex items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => onFilterChange(f)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 ${
                filter === f
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]"
                  : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80 shadow-sm"
              }`}
            >
              {f === "all" ? "All Tracks" : f === "free" ? "Free Resources" : "Premium Courses"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-4 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 hidden lg:inline">Sort By:</span>
          {SORTS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSortChange(s)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 ${
                sort === s
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]"
                  : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80 shadow-sm"
              }`}
            >
              {s === "popular" ? "🔥 Popular" : "🆕 Newest"}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
});
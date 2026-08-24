"use client";

import { memo } from "react";

export const SearchBar = memo(function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="relative group">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search DSA notes, System Design, Java, Web Dev..."
          aria-label="Search study materials"
          className="w-full px-7 py-5 pl-14 rounded-full bg-white/90 border border-slate-200/90 text-slate-900 placeholder:text-slate-400 text-base md:text-lg shadow-xl shadow-slate-200/60 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
        />
        <svg
          className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
});
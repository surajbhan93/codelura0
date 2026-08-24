"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import ProgramCard from "@/components/career/ProgramCard";
import { Program, ProgramListResponse, Pagination } from "@/components/admin/program";

const CATEGORIES = ["DSA", "Web Development", "Backend", "Other"];

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<ProgramListResponse>("/programs", {
        params: {
          page,
          limit: 9,
          search: search || undefined,
          category: category || undefined,
          level: level || undefined,
        },
      });
      setPrograms(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, level]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Explore our courses
          </h1>
          <p className="mt-3 max-w-xl text-indigo-100">
            Hands-on courses with projects, mentor support, and certificates
            to help you build real skills.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search courses..."
            className="w-full max-w-sm rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />

          <select
            value={category}
            onChange={(e) => {
              setPage(1);
              setCategory(e.target.value);
            }}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={level}
            onChange={(e) => {
              setPage(1);
              setLevel(e.target.value);
            }}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">All levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            Loading courses...
          </div>
        ) : programs.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            No courses match your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((program) => (
              <ProgramCard key={program._id} program={program} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Prev
            </button>
            <span className="text-sm text-slate-500">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={page === pagination.totalPages}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
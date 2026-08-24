
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Program, ProgramListResponse, Pagination } from "@/components/admin/program";

const CATEGORIES = ["DSA", "Web Development", "Backend", "Other"];
const STATUSES = ["draft", "published", "archived"];

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<ProgramListResponse>("/programs/admin", {
        params: {
          page,
          limit: 10,
          search: search || undefined,
          category: category || undefined,
          status: status || undefined,
        },
      });
      setPrograms(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, status]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === programs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(programs.map((p) => p._id));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this program?")) return;
    try {
      await api.delete(`/programs/admin/${id}`);
      fetchPrograms();
    } catch (err) {
      alert("Failed to delete program");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} selected program(s)?`)) return;
    try {
      await api.post("/programs/admin/bulk-delete", { ids: selectedIds });
      setSelectedIds([]);
      fetchPrograms();
    } catch (err) {
      alert("Failed to bulk delete");
    }
  };

  const handleToggleFlag = async (id: string, flag: string) => {
    try {
      await api.patch(`/programs/admin/${id}/toggle-flag`, { flag });
      fetchPrograms();
    } catch (err) {
      alert("Failed to toggle flag");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/programs/admin/${id}/status`, { status: newStatus });
      fetchPrograms();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Programs</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage all courses / programs
            </p>
          </div>
          <Link
            href="/admin/programs/new"
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            + Add Program
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search programs..."
            className="w-full max-w-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
          <select
            value={category}
            onChange={(e) => {
              setPage(1);
              setCategory(e.target.value);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="ml-auto rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Delete Selected ({selectedIds.length})
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={
                      programs.length > 0 &&
                      selectedIds.length === programs.length
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Flags</th>
                <th className="px-4 py-3">Views</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-slate-400">
                    Loading...
                  </td>
                </tr>
              ) : programs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-slate-400">
                    No programs found.
                  </td>
                </tr>
              ) : (
                programs.map((program) => (
                  <tr
                    key={program._id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(program._id)}
                        onChange={() => toggleSelect(program._id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">
                        {program.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        /{program.slug}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {program.category}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {program.level}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {program.discountPrice ? (
                        <>
                          <span className="font-medium">
                            ₹{program.discountPrice}
                          </span>{" "}
                          <span className="text-xs text-slate-400 line-through">
                            ₹{program.price}
                          </span>
                        </>
                      ) : program.price ? (
                        `₹${program.price}`
                      ) : (
                        "Free"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={program.status}
                        onChange={(e) =>
                          handleStatusChange(program._id, e.target.value)
                        }
                        className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium ${
                          program.status === "published"
                            ? "bg-emerald-100 text-emerald-700"
                            : program.status === "draft"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {["featured", "trending", "popular"].map((flag) => (
                          <button
                            key={flag}
                            onClick={() => handleToggleFlag(program._id, flag)}
                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                              (program as any)[flag]
                                ? "bg-indigo-600 text-white"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {flag}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {program.views ?? 0}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/programs/${program._id}`}
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(program._id)}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
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
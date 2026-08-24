"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { CareerTrack, CareerTrackListResponse, Pagination } from "@/components/admin/careerTrack";

const statusStyles: Record<string, string> = {
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  draft: "bg-amber-50 text-amber-700 border-amber-200",
  archived: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function AdminCareerTracksPage() {
  const [tracks, setTracks] = useState<CareerTrack[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTracks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get<CareerTrackListResponse>(
        "/admin/career-tracks",
        {
          params: { page, limit: 10, search: search || undefined, status: status || undefined },
        }
      );
      setTracks(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError("Couldn't load career tracks. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this career track? This can't be undone.")) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/career-tracks/${id}`);
      setTracks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert("Failed to delete career track.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Career tracks</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage all career tracks shown on the website.
          </p>
        </div>
        <Link
          href="/admin/career-tracks/new"
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          + New career track
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          placeholder="Search by title or slug..."
          className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Level</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Views</th>
              <th className="px-4 py-3">Enrollments</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  Loading career tracks...
                </td>
              </tr>
            ) : tracks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  No career tracks found.
                </td>
              </tr>
            ) : (
              tracks.map((track) => (
                <tr key={track._id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{track.title}</div>
                    <div className="text-xs text-slate-400">/{track.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{track.level}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                        statusStyles[track.status]
                      }`}
                    >
                      {track.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{track.views ?? 0}</td>
                  <td className="px-4 py-3 text-slate-600">{track.enrollments ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3 text-sm">
                      <Link
                        href={`/admin/career-tracks/${track._id}/edit`}
                        className="font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(track._id)}
                        disabled={deletingId === track._id}
                        className="font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        {deletingId === track._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-sm text-slate-500">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
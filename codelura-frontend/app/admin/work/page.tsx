"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

interface Work {
  _id: string;
  title: string;
  isPublished: boolean;
}

interface WorkResponse {
  data: Work[];
}

export default function AdminWorkPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadWorks = async () => {
    try {
      const res = await api.get<WorkResponse>("/work");
      setWorks(res.data.data);
    } catch (error) {
      console.error("Failed to load works", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorks();
  }, []);

  const published = works.filter((w) => w.isPublished).length;
  const drafts = works.filter((w) => !w.isPublished).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Work</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your portfolio works</p>
          </div>
          <Link
            href="/admin/work/add"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg shadow-sm transition-colors duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Work
          </Link>
        </div>

        {/* ── Stat Pills ── */}
        {!loading && works.length > 0 && (
          <div className="flex items-center gap-3 mb-6">
            <StatPill label="Total" value={works.length} color="gray" />
            <StatPill label="Published" value={published} color="green" />
            <StatPill label="Drafts" value={drafts} color="amber" />
          </div>
        )}

        {/* ── Table Card ── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-400">
              <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Loading works...
            </div>
          ) : works.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="font-medium text-gray-500">No work found</p>
              <p className="text-sm mt-1">Add your first work to get started.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-left">
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {works.map((work) => (
                  <tr key={work._id} className="hover:bg-gray-50 transition-colors duration-100">
                    <td className="px-5 py-4 font-medium text-gray-900">{work.title}</td>
                    <td className="px-5 py-4">
                      {work.isPublished ? (
                        <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-medium px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/work/edit/${work._id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-400 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-all duration-150"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z" />
                        </svg>
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Footer ── */}
        {!loading && works.length > 0 && (
          <p className="text-xs text-gray-400 mt-4 text-right">
            Showing {works.length} work{works.length !== 1 ? "s" : ""}
          </p>
        )}

      </div>
    </div>
  );
}

/* ── Stat Pill ── */
const pillColors = {
  gray:  "bg-gray-100 text-gray-600",
  green: "bg-green-50 text-green-700",
  amber: "bg-amber-50 text-amber-700",
};

function StatPill({ label, value, color }: { label: string; value: number; color: keyof typeof pillColors }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${pillColors[color]}`}>
      {label}
      <span className="font-bold">{value}</span>
    </span>
  );
}
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  HiOutlineBookOpen,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineTrash,
  HiOutlinePencilAlt,
  HiOutlineRefresh,
  HiOutlineTag,
} from "react-icons/hi";

interface Course {
  _id: string;
  title: string;
  price?: number;
  category?: string;
  level?: string;
  accessType?: string;
  isPublished?: boolean;
  createdAt?: string;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/courses");
      setCourses(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const deleteCourse = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      await api.delete(`/admin/courses/${id}`);
      toast.success("Course deleted successfully");
      fetchCourses();
    } catch {
      toast.error("Delete failed");
    }
  };

  const filteredCourses = courses.filter((c) => {
    const title = c.title || "";
    const cat = c.category || "";
    const q = search.toLowerCase();
    const matchesSearch = title.toLowerCase().includes(q) || cat.toLowerCase().includes(q);
    const matchesCat = filterCategory === "all" || cat.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[#07080f] text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <HiOutlineBookOpen size={16} />
              ADMIN MANAGEMENT
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Manage <span className="text-indigo-400">Courses</span> & Notes
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Total {courses.length} course{courses.length !== 1 ? "s" : ""} available on Codelura.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchCourses}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-gray-300 hover:bg-white/10 transition"
            >
              <HiOutlineRefresh size={15} />
              Refresh
            </button>

            <Link
              href="/admin/courses/add"
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition"
            >
              <HiOutlinePlus size={16} />
              Add Course
            </Link>
          </div>
        </div>

        {/* Toolbar & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-[#111428] p-3">
          <div className="relative flex items-center">
            <HiOutlineSearch size={16} className="absolute left-3.5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses by title or category..."
              className="w-full rounded-xl bg-[#0a0c17] pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 border border-white/10 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-xl bg-[#0a0c17] px-4 py-2.5 text-xs text-gray-200 border border-white/10 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="notes">Notes</option>
            <option value="course">Course</option>
          </select>
        </div>

        {/* Courses Table */}
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#111428] shadow-xl">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#0e1124] text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="px-5 py-4">Title</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Level</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-400">
                    Loading courses...
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-400">
                    No courses found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredCourses.map((c) => (
                  <tr key={c._id} className="hover:bg-white/[0.02] transition">
                    <td className="px-5 py-4">
                      <div className="font-bold text-white text-sm">{c.title}</div>
                      {c.createdAt && (
                        <div className="text-[11px] text-gray-500">
                          Added: {new Date(c.createdAt).toLocaleDateString("en-IN")}
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-extrabold text-emerald-400 text-sm">
                        {!c.price || c.price === 0 ? "FREE" : `₹${c.price.toLocaleString("en-IN")}`}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-500/30">
                        <HiOutlineTag size={12} />
                        {c.category || "General"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="capitalize text-gray-400 font-medium">
                        {c.level || "Beginner"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/courses/edit/${c._id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-blue-500/30 bg-blue-950/50 px-3 py-1.5 text-xs font-bold text-blue-400 hover:bg-blue-900/50 transition"
                        >
                          <HiOutlinePencilAlt size={14} /> Edit
                        </Link>

                        <button
                          onClick={() => deleteCourse(c._id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-950/50 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-900/50 transition"
                        >
                          <HiOutlineTrash size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
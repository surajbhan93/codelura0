"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { HiOutlineArrowLeft, HiOutlineCheck } from "react-icons/hi";

export default function EditCoursePage() {
  const { id } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [pdf, setPdf] = useState<File | null>(null);

  useEffect(() => {
    setLoading(true);
    api.get(`/courses/${id}`)
      .then((res) => {
        setCourse(res.data.course || res.data);
      })
      .catch(() => {
        toast.error("Failed to load course details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const update = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;

    setUpdating(true);
    const fd = new FormData();
    Object.entries(course).forEach(([k, v]) => {
      if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
        fd.append(k, String(v));
      }
    });

    if (pdf) fd.append("pdf", pdf);

    try {
      await api.put(`/admin/courses/${id}`, fd);
      toast.success("Course updated successfully");
      router.push("/admin/courses");
    } catch {
      toast.error("Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07080f] text-gray-400 flex items-center justify-center text-sm">
        Loading course details...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#07080f] text-white p-6">
        <p className="text-red-400 text-sm">Course not found.</p>
        <Link href="/admin/courses" className="text-xs text-indigo-400 underline mt-2 inline-block">
          ← Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080f] text-white p-6 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <Link
              href="/admin/courses"
              className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-bold mb-2 transition"
            >
              <HiOutlineArrowLeft size={14} /> Back to Courses
            </Link>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Edit Course</h1>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={update} className="rounded-2xl border border-white/10 bg-[#111428] p-6 space-y-5 shadow-2xl">
          
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5">Title</label>
            <input
              type="text"
              required
              value={course.title || ""}
              onChange={(e) => setCourse({ ...course, title: e.target.value })}
              className="w-full rounded-xl bg-[#0a0c17] px-4 py-2.5 text-xs text-white border border-white/10 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5">Description</label>
            <textarea
              rows={4}
              value={course.description || ""}
              onChange={(e) => setCourse({ ...course, description: e.target.value })}
              className="w-full rounded-xl bg-[#0a0c17] px-4 py-2.5 text-xs text-white border border-white/10 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Price (₹)</label>
              <input
                type="number"
                value={course.price ?? 0}
                onChange={(e) => setCourse({ ...course, price: Number(e.target.value) })}
                className="w-full rounded-xl bg-[#0a0c17] px-4 py-2.5 text-xs text-white border border-white/10 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">Category</label>
              <select
                value={course.category || "notes"}
                onChange={(e) => setCourse({ ...course, category: e.target.value })}
                className="w-full rounded-xl bg-[#0a0c17] px-4 py-2.5 text-xs text-white border border-white/10 focus:outline-none"
              >
                <option value="notes">Notes</option>
                <option value="course">Course</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5">
              Update PDF File (Optional)
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdf(e.target.files?.[0] || null)}
              className="w-full rounded-xl bg-[#0a0c17] px-4 py-2 text-xs text-gray-300 border border-white/10 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <Link
              href="/admin/courses"
              className="rounded-xl px-5 py-2.5 text-xs font-bold text-gray-400 hover:text-white transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={updating}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition disabled:opacity-50"
            >
              <HiOutlineCheck size={16} />
              {updating ? "Saving..." : "Update Course"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

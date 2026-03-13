"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AdminCoursesPage() {

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/courses");
      setCourses(res.data);
    } catch {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  // run on mount
  useEffect(() => {
    const init = async () => {
      await fetchCourses();
    };

    init();
  }, []);

  // delete course
  const deleteCourse = async (id: string) => {
    if (!confirm("Delete this course?")) return;

    try {
      await api.delete(`/admin/courses/${id}`);
      toast.success("Course deleted");
      fetchCourses();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
            <p className="text-sm text-gray-500 mt-1">
              {courses.length} course{courses.length !== 1 ? "s" : ""} total
            </p>
          </div>

          <Link
            href="/admin/courses/add"
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
          >
            Add Course
          </Link>

        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border overflow-hidden">

          {loading ? (
            <div className="p-20 text-center text-gray-400">
              Loading courses...
            </div>
          ) : (

            <table className="w-full text-sm">

              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left">Title</th>
                  <th className="p-4 text-left">Price</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>

                {courses.map((c) => (

                  <tr key={c._id} className="border-t">

                    <td className="p-4 font-medium">
                      {c.title}
                    </td>

                    <td className="p-4">
                      ₹{c.price?.toLocaleString("en-IN")}
                    </td>

                    <td className="p-4">
                      {c.category}
                    </td>

                    <td className="p-4 text-right space-x-3">

                      <Link
                        href={`/admin/courses/edit/${c._id}`}
                        className="text-blue-600"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => deleteCourse(c._id)}
                        className="text-red-600"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </div>
  );
}
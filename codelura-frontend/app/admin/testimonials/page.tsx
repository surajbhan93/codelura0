"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import EditModal from "./components/EditModal";

interface Testimonial {
  _id: string;
  name: string;
  email: string;
  message: string;
  rating: number;
  category: string;
  isApproved: boolean;
  createdAt: string;
}

export default function AdminTestimonials() {
  const [data, setData] = useState<Testimonial[]>([]);
  const [selected, setSelected] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await api.get("/testimonial/admin/all");
        setData(res.data.data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // ✅ Approve testimonial
  const approve = async (id: string) => {
    try {
      await api.put(`/testimonial/admin/${id}/approve`);

      // Optimistic update (no refetch needed)
      setData((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isApproved: true } : item
        )
      );
    } catch (err) {
      console.error("Approve failed:", err);
    }
  };

  // ✅ Delete testimonial
  const deleteTestimonial = async (id: string) => {
    try {
      await api.delete(`/testimonial/delete/${id}`);

      // Remove from UI
      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  if (loading) {
    return <div className="p-10 text-white">Loading testimonials...</div>;
  }

  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl font-bold mb-8">Testimonials</h1>

      {data.length === 0 && (
        <p className="text-gray-400">No testimonials found.</p>
      )}

      <div className="space-y-6">
        {data.map((item) => (
          <div
            key={item._id}
            className="bg-gray-900 p-6 rounded-xl border border-gray-700"
          >
            <div className="flex justify-between">
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-400">{item.email}</p>
                <p className="text-sm text-yellow-400">⭐ {item.rating}</p>
                <p className="text-sm text-indigo-400">{item.category}</p>

                <p
                  className={`text-xs mt-1 ${
                    item.isApproved ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {item.isApproved ? "Approved" : "Pending"}
                </p>
              </div>

              <div className="flex gap-3">
                {!item.isApproved && (
                  <button
                    onClick={() => approve(item._id)}
                    className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                )}

                <button
                  onClick={() => setSelected(item)}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteTestimonial(item._id)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>

            <p className="mt-4 text-gray-300">{item.message}</p>
          </div>
        ))}
      </div>

      {selected && (
        <EditModal
          testimonial={selected}
          onClose={() => setSelected(null)}
          onUpdated={() => {
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}
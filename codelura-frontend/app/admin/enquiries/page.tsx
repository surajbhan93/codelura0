"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;        // ✅ add
  budget?: string;      // ✅ add
  message: string;
  status: string;
  createdAt: string;
  service: {
    title: string;
  };
}

export default function AdminEnquiries() {
  const [data, setData] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    try {
      const res = await api.get("/admin/services/getEnquiries");
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await api.put(`/admin/services/${id}/status`, { status });
    fetchEnquiries();
  };

  const deleteEnquiry = async (id: string) => {
  const confirmDelete = confirm("Are you sure you want to delete this enquiry?");

  if (!confirmDelete) return;

  try {
    await api.delete(`/admin/services/delete/${id}`);
    fetchEnquiries(); // refresh list
  } catch (error) {
    console.error(error);
    alert("Failed to delete enquiry");
  }
};

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-10 text-white bg-[#080B14] min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Enquiries</h1>

      <div className="space-y-6">
        {data.map((item) => (
          <div
            key={item._id}
            className="bg-[#111827] p-6 rounded-xl border border-gray-700"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-400">{item.email}</p>
                <p className="text-sm text-gray-400">
  📱 {item.phone}
</p>

{item.budget && (
  <p className="text-sm text-green-400 mt-1">
    💰 Budget: {item.budget}
  </p>
)}
                <p className="text-sm text-orange-400 mt-1">
                  Service: {item.service?.title}
                </p>
              </div>

              <select
                value={item.status}
                onChange={(e) =>
                  updateStatus(item._id, e.target.value)
                }
                className="bg-gray-800 px-3 py-2 rounded-md"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </select>
              <button
  onClick={() => deleteEnquiry(item._id)}
  className="ml-3 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm"
>
  Delete
</button>
            </div>

            <p className="mt-4 text-gray-300">{item.message}</p>

            <p className="text-xs text-gray-500 mt-3">
              {new Date(item.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
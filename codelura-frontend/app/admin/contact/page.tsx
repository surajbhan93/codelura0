"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import axios from "axios";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function AdminContactPage() {
  const [data, setData] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await api.get("/contact/admin/all");
      setData(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await api.put(`/contact/admin/${id}/status`, { status });
    fetchMessages();
  };

  const deleteMessage = async (id: string) => {
    const confirmDelete = confirm("Delete this message?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/contact/admin/${id}`);
      fetchMessages();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message);
      }
    }
  };

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#080B14] text-white p-10">
      <h1 className="text-3xl font-bold mb-8">
        General Contact Queries
      </h1>

      <div className="space-y-6">
        {data.map((item) => (
          <div
            key={item._id}
            className="bg-[#111827] p-6 rounded-xl border border-gray-700"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">
                  {item.name}
                </h2>
                <p className="text-sm text-gray-400">
                  {item.email}
                </p>
                {item.phone && (
                  <p className="text-sm text-gray-400">
                    📱 {item.phone}
                  </p>
                )}
                <p className="text-sm text-orange-400 mt-1">
                  Subject: {item.subject}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={item.status}
                  onChange={(e) =>
                    updateStatus(item._id, e.target.value)
                  }
                  className="bg-gray-800 px-3 py-2 rounded-md"
                >
                  <option value="new">New</option>
                  <option value="replied">Replied</option>
                  <option value="closed">Closed</option>
                </select>

                <button
                  onClick={() => deleteMessage(item._id)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm"
                >
                  Delete
                </button>
              </div>
            </div>

            <p className="mt-4 text-gray-300">
              {item.message}
            </p>

            <p className="text-xs text-gray-500 mt-3">
              {new Date(item.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
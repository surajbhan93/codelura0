"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const deleteService = async (id) => {
    if (!confirm("Delete this service?")) return;
    await api.delete(`/admin/services/${id}`);
    fetchServices();
  };

  const fetchServices = async () => {
    const res = await api.get("/admin/services");
    setServices(res.data.data);
  };

  useEffect(() => {
    let ignore = false;

    (async () => {
      const res = await api.get("/admin/services");
      if (!ignore) {
        setServices(res.data.data);
        setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Services</h1>
            <p className="text-sm text-gray-500 mt-1">
              {services.length} service{services.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <Link
            href="/admin/services/add"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg shadow-sm transition-colors duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Service
          </Link>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-400">
              <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Loading services...
            </div>
          ) : services.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="font-medium text-gray-500">No services yet</p>
              <p className="text-sm mt-1">Add your first service to get started.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-left">
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {services.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50 transition-colors duration-100">
                    <td className="px-5 py-4 font-medium text-gray-900">{s.title}</td>
                    <td className="px-5 py-4">
                      <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                        {s.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {s.isActive ? (
                        <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 text-xs font-medium px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/admin/services/edit/${s._id}`}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-400 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-all duration-150"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z" />
                          </svg>
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteService(s._id)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-800 border border-red-200 hover:border-red-400 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all duration-150"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a2 2 0 00-2-2H9a2 2 0 00-2 2m10 0H5" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        {!loading && services.length > 0 && (
          <p className="text-xs text-gray-400 mt-4 text-right">
            Showing {services.length} service{services.length !== 1 ? "s" : ""}
          </p>
        )}

      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  HiOutlineShoppingBag,
  HiOutlineUser,
  HiOutlineAcademicCap,
  HiOutlineTrendingUp,
  HiOutlineSearch,
  HiOutlineRefresh,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineXCircle,
  HiOutlinePlusCircle,
} from "react-icons/hi";

type EnrollmentRecord = {
  _id: string;
  user?: { _id: string; name?: string; email?: string };
  itemType: "Course" | "Program" | "CareerTrack";
  itemTitle: string;
  amount: number;
  paymentStatus: "completed" | "pending" | "failed";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  unlockedViaCareerTrack?: boolean;
  createdAt: string;
};

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<EnrollmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  // Manual Enroll Modal State
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [userIdInput, setUserIdInput] = useState("");
  const [manualItemType, setManualItemType] = useState<"Program" | "CareerTrack">("Program");
  const [manualItemIdInput, setManualItemIdInput] = useState("");
  const [manualLoading, setManualLoading] = useState(false);
  const [manualMessage, setManualMessage] = useState("");

  const getHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/enrollments/admin/all", {
        headers: getHeaders(),
        params: {
          limit: "all",
          itemType: filterType || undefined,
          paymentStatus: filterStatus || undefined,
        },
      });

      if (data.success) {
        setEnrollments(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch admin enrollments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, [filterType, filterStatus]);

  const handleManualEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualLoading(true);
    setManualMessage("");

    try {
      const { data } = await api.post(
        "/enrollments/admin/manual-enroll",
        {
          userId: userIdInput.trim(),
          itemType: manualItemType,
          itemId: manualItemIdInput.trim(),
        },
        { headers: getHeaders() }
      );

      if (data.success) {
        setManualMessage(`✓ ${data.message}`);
        fetchEnrollments();
        setTimeout(() => {
          setManualModalOpen(false);
          setManualMessage("");
        }, 2000);
      } else {
        setManualMessage(`✕ ${data.message}`);
      }
    } catch (err: any) {
      setManualMessage(`✕ ${err?.response?.data?.message || "Manual enrollment failed."}`);
    } finally {
      setManualLoading(false);
    }
  };

  const filteredEnrollments = enrollments.filter((en) => {
    const name = en.user?.name || "";
    const email = en.user?.email || "";
    const title = en.itemTitle || "";
    const q = search.toLowerCase();
    return name.toLowerCase().includes(q) || email.toLowerCase().includes(q) || title.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-[#0a0c17] text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <HiOutlineShoppingBag size={16} />
              ADMIN MANAGEMENT
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Student Enrollments &amp; Purchases
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              View all student payments, program purchases, and career track enrollments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchEnrollments()}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-gray-300 hover:bg-white/10 transition"
            >
              <HiOutlineRefresh size={15} />
              Refresh
            </button>

            <button
              onClick={() => setManualModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition"
            >
              <HiOutlinePlusCircle size={16} />
              Manual Enroll Student
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-2xl border border-white/10 bg-[#111428] p-3">
          <div className="relative flex items-center">
            <HiOutlineSearch size={16} className="absolute left-3.5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, email or title..."
              className="w-full rounded-xl bg-[#0a0c17] pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 border border-white/10 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-xl bg-[#0a0c17] px-4 py-2.5 text-xs text-gray-200 border border-white/10 focus:outline-none"
          >
            <option value="">All Types (Career Tracks &amp; Programs)</option>
            <option value="CareerTrack">Career Tracks Only</option>
            <option value="Program">Programs Only</option>
            <option value="Course">Courses Only</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl bg-[#0a0c17] px-4 py-2.5 text-xs text-gray-200 border border-white/10 focus:outline-none"
          >
            <option value="">All Payment Statuses</option>
            <option value="completed">Completed / Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Enrollments Table */}
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#111428] shadow-xl">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#0e1124] text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="px-5 py-4">Student</th>
                <th className="px-5 py-4">Enrolled Item</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Razorpay Details</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                    Loading enrollments...
                  </td>
                </tr>
              ) : filteredEnrollments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                    No enrollment records found.
                  </td>
                </tr>
              ) : (
                filteredEnrollments.map((en) => (
                  <tr key={en._id} className="hover:bg-white/[0.02] transition">
                    <td className="px-5 py-4">
                      <div className="font-bold text-white">{en.user?.name || "Anonymous Student"}</div>
                      <div className="text-[11px] text-gray-400">{en.user?.email || "No email"}</div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            en.itemType === "CareerTrack"
                              ? "bg-purple-950/80 text-purple-300 border-purple-500/30"
                              : en.unlockedViaCareerTrack
                              ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/30"
                              : "bg-indigo-950/80 text-indigo-300 border-indigo-500/30"
                          }`}
                        >
                          {en.itemType === "CareerTrack"
                            ? "🎯 Career Track"
                            : en.unlockedViaCareerTrack
                            ? "✨ Unlocked via Career Track"
                            : "🚀 Program"}
                        </span>
                      </div>
                      <div className="font-semibold text-white">{en.itemTitle}</div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-extrabold text-white">
                        {en.amount === 0 ? "FREE" : `₹${en.amount.toLocaleString("en-IN")}`}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-mono text-[11px] text-gray-400">
                      <div>Order: {en.razorpayOrderId || "N/A"}</div>
                      {en.razorpayPaymentId && <div>Pay: {en.razorpayPaymentId}</div>}
                    </td>

                    <td className="px-5 py-4">
                      {en.paymentStatus === "completed" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[10px]">
                          <HiOutlineCheckCircle size={13} /> Paid
                        </span>
                      ) : en.paymentStatus === "pending" ? (
                        <span className="inline-flex items-center gap-1 text-amber-400 font-bold bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded-full text-[10px]">
                          <HiOutlineClock size={13} /> Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-400 font-bold bg-red-950/60 border border-red-500/30 px-2.5 py-1 rounded-full text-[10px]">
                          <HiOutlineXCircle size={13} /> Failed
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-gray-400 text-[11px]">
                      {new Date(en.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Enroll Modal */}
      {manualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111428] p-6 text-white shadow-2xl">
            <h3 className="text-lg font-bold mb-1">Manual Student Enrollment</h3>
            <p className="text-xs text-gray-400 mb-4">
              Manually grant a student full access to a Program or Career Track.
            </p>

            <form onSubmit={handleManualEnroll} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">User ID</label>
                <input
                  type="text"
                  required
                  value={userIdInput}
                  onChange={(e) => setUserIdInput(e.target.value)}
                  placeholder="Enter User Mongoose ObjectId"
                  className="w-full rounded-xl bg-[#0a0c17] px-4 py-2.5 text-xs text-white border border-white/10 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Item Type</label>
                <select
                  value={manualItemType}
                  onChange={(e) => setManualItemType(e.target.value as any)}
                  className="w-full rounded-xl bg-[#0a0c17] px-4 py-2.5 text-xs text-white border border-white/10 focus:outline-none"
                >
                  <option value="Program">Program</option>
                  <option value="CareerTrack">Career Track</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Item ObjectId</label>
                <input
                  type="text"
                  required
                  value={manualItemIdInput}
                  onChange={(e) => setManualItemIdInput(e.target.value)}
                  placeholder="Enter Program or CareerTrack ObjectId"
                  className="w-full rounded-xl bg-[#0a0c17] px-4 py-2.5 text-xs text-white border border-white/10 focus:outline-none"
                />
              </div>

              {manualMessage && (
                <div className="text-xs p-3 rounded-xl bg-white/5 border border-white/10 font-bold">
                  {manualMessage}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setManualModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={manualLoading}
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition disabled:opacity-50"
                >
                  {manualLoading ? "Enrolling..." : "Enroll Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

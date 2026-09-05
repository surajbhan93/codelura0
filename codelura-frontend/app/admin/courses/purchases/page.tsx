"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { HiOutlineShoppingBag, HiOutlineRefresh } from "react-icons/hi";

type Purchase = {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  course: {
    title: string;
    price: number;
  };
  amount: number;
  razorpay_payment_id: string;
  createdAt: string;
};

export default function AdminPurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPurchases = () => {
    setLoading(true);
    api.get("/payment/purchases")
      .then((res) => {
        setPurchases(res.data.purchases || []);
      })
      .catch(() => {
        setPurchases([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  return (
    <div className="min-h-screen bg-[#07080f] text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <HiOutlineShoppingBag size={16} />
              ADMIN MANAGEMENT
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Course <span className="text-indigo-400">Purchases</span> History
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Direct student course purchases and Razorpay transaction records.
            </p>
          </div>

          <button
            onClick={fetchPurchases}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-gray-300 hover:bg-white/10 transition"
          >
            <HiOutlineRefresh size={15} />
            Refresh
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#111428] shadow-xl">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#0e1124] text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Course</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Payment ID</th>
                <th className="px-5 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                    Loading purchases...
                  </td>
                </tr>
              ) : purchases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                    No purchase records found.
                  </td>
                </tr>
              ) : (
                purchases.map((p) => (
                  <tr key={p._id} className="hover:bg-white/[0.02] transition">
                    <td className="px-5 py-4 font-bold text-white">
                      {p.user?.name || "Student"}
                    </td>

                    <td className="px-5 py-4 text-gray-400">
                      {p.user?.email || "N/A"}
                    </td>

                    <td className="px-5 py-4 font-semibold text-white">
                      {p.course?.title || "Untitled Course"}
                    </td>

                    <td className="px-5 py-4 font-extrabold text-emerald-400 text-sm">
                      ₹{p.amount?.toLocaleString("en-IN") || 0}
                    </td>

                    <td className="px-5 py-4 font-mono text-[11px] text-gray-400">
                      {p.razorpay_payment_id || "N/A"}
                    </td>

                    <td className="px-5 py-4 text-gray-400">
                      {new Date(p.createdAt).toLocaleDateString("en-IN")}
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
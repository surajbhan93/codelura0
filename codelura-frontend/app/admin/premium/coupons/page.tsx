"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

type Coupon = {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  isActive: boolean;
  usedCount?: number;
  maxUsage?: number;
  expiryDate?: string;
};

export default function CouponsListPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/premium/admin/coupons");
        setCoupons(res.data.coupons || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin/premium" className="text-xs text-gray-400 hover:text-gray-600">
              ← Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">Coupons</h1>
          </div>
          <Link
            href="/admin/premium/coupons/new"
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Coupon
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm divide-y divide-gray-100 overflow-hidden">
          {loading ? (
            <div className="py-14 text-center text-gray-400 text-sm">Loading coupons...</div>
          ) : coupons.length === 0 ? (
            <div className="py-14 text-center text-gray-400 text-sm">No coupons yet — create your first one.</div>
          ) : (
            coupons.map((c) => (
              <div key={c._id} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-sm font-semibold tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg uppercase shrink-0">
                    {c.code}
                  </span>
                  <span className="text-xs text-gray-400 truncate">
                    Used {c.usedCount || 0}
                    {c.maxUsage ? ` / ${c.maxUsage}` : ""}
                    {c.expiryDate ? ` · expires ${new Date(c.expiryDate).toLocaleDateString("en-IN")}` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-semibold text-gray-700">
                    {c.discountType === "percentage" ? `${c.discountValue}% off` : `₹${c.discountValue} off`}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      c.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {c.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

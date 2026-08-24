"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

type Plan = {
  _id: string;
  title: string;
  category?: string;
  price?: number;
  discountedPrice?: number;
  isActive: boolean;
};

export default function PlansListPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await api.get("/premium/admin/plans");
      setPlans(res.data.plans || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin/premium" className="text-xs text-gray-400 hover:text-gray-600">
              ← Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">Plans</h1>
          </div>
          <Link
            href="/admin/premium/plans/new"
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Plan
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm divide-y divide-gray-100 overflow-hidden">
          {loading ? (
            <div className="py-14 text-center text-gray-400 text-sm">Loading plans...</div>
          ) : plans.length === 0 ? (
            <div className="py-14 text-center text-gray-400 text-sm">No plans yet — create your first one.</div>
          ) : (
            plans.map((plan) => (
              <Link
                key={plan._id}
                href={`/admin/premium/plans/${plan._id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{plan.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{plan.category || "other"}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      plan.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {plan.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="text-sm font-semibold text-gray-700">
                    ₹{plan.discountedPrice ?? plan.price ?? "—"}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

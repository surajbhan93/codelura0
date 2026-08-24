"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface PremiumService {
  title?: string;
}

interface UserRef {
  email?: string;
}

interface Subscription {
  _id: string;
  status: string;
  name?: string;
  email?: string;
  user?: UserRef;
  premiumService?: PremiumService;
  selectedPlan?: string;
  finalAmount?: number;
  discountAmount?: number;
  createdAt?: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  payment_verified: "bg-blue-100 text-blue-700",
  assigned: "bg-purple-100 text-purple-700",
  in_progress: "bg-indigo-100 text-indigo-700",
  revision_requested: "bg-orange-100 text-orange-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  rejected: "bg-red-100 text-red-700",
  approved: "bg-green-100 text-green-700",
  suspended: "bg-gray-100 text-gray-700",
  expired: "bg-gray-100 text-gray-700",
};

function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof AxiosError) {
    return err.response?.data?.message || fallback;
  }
  return fallback;
}

export default function SubscriptionsListPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/premium/admin/subscriptions");
      setSubscriptions(res.data.subs || []);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load subscriptions"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
            <p className="text-sm text-gray-500 mt-1">Manage all premium subscriptions</p>
          </div>
          <button
            onClick={fetchSubscriptions}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582M20 20v-5h-.581M5.635 15A8 8 0 1118.364 9"
              />
            </svg>
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No subscriptions yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                      User
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                      Plan
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                      Amount
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                      Status
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                      Date
                    </th>
                    <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {subscriptions.map((sub) => (
                    <tr key={sub._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{sub.name || "—"}</p>
                          <p className="text-xs text-gray-500">{sub.email || sub.user?.email || "—"}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-900">{sub.premiumService?.title || "—"}</p>
                        <p className="text-xs text-gray-500">{sub.selectedPlan || "Basic"}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-gray-900">₹{sub.finalAmount ?? 0}</p>
                        {!!sub.discountAmount && sub.discountAmount > 0 && (
                          <p className="text-xs text-green-600">-₹{sub.discountAmount}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            statusColors[sub.status] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/premium/subscriptions/${sub._id}`}
                          className="text-xs font-medium text-gray-600 hover:text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
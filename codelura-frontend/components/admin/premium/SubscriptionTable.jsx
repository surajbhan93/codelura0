"use client";

import api from "@/lib/api";
import toast from "react-hot-toast";
import { useState } from "react";

export default function SubscriptionTable({ subscriptions, refresh, loading }) {
  const [openRow, setOpenRow] = useState(null);

  const action = async (url, msg) => {
    try {
      await api.put(url);
      toast.success(msg);
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  const extend = async (id) => {
    const months = prompt("Extend by how many months?");
    if (!months) return;
    try {
      await api.put(`/premium/admin/extend/${id}`, { months: Number(months) });
      toast.success(`Extended by ${months} months`);
      refresh();
    } catch {
      toast.error("Extend failed");
    }
  };

  const changePlan = async (id) => {
    const newPlanId = prompt("Enter new plan ID");
    if (!newPlanId) return;
    try {
      await api.put(`/premium/admin/change-plan/${id}`, { newPlanId });
      toast.success("Plan changed");
      refresh();
    } catch {
      toast.error("Error changing plan");
    }
  };

  /* ── States ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400">
        <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        Loading subscriptions...
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="font-medium text-gray-500">No subscriptions found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-left">
            <th className="px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
            <th className="px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
            <th className="px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
            <th className="px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {subscriptions.map((sub) => (
            <>
              {/* ── MAIN ROW ── */}
              <tr key={sub._id} className="hover:bg-gray-50 transition-colors duration-100">

                {/* User */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0 uppercase">
                      {sub.user?.email?.[0] || "?"}
                    </div>
                    <span className="text-gray-700 text-xs truncate max-w-[140px]">
                      {sub.user?.email || "-"}
                    </span>
                  </div>
                </td>

                {/* Plan */}
                <td className="px-4 py-3.5">
                  <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    {sub.premiumService?.title || "-"}
                  </span>
                </td>

                {/* Status */}
                <td className="px-4 py-3.5">
                  <StatusBadge status={sub.status} />
                </td>

                {/* Amount */}
                <td className="px-4 py-3.5 text-gray-700 font-medium">
                  ₹{sub.finalAmount || sub.premiumService?.price || "—"}
                </td>

                {/* Details toggle */}
                <td className="px-4 py-3.5">
                  <button
                    onClick={() => setOpenRow(openRow === sub._id ? null : sub._id)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    {openRow === sub._id ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                        Hide
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                        View
                      </>
                    )}
                  </button>
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {sub.status === "pending" && (
                      <>
                        <ActionBtn
                          label="Approve"
                          color="green"
                          icon="✓"
                          onClick={() => action(`/premium/admin/approve/${sub._id}`, "Approved")}
                        />
                        <ActionBtn
                          label="Reject"
                          color="red"
                          icon="✕"
                          onClick={() => action(`/premium/admin/reject/${sub._id}`, "Rejected")}
                        />
                      </>
                    )}

                    {sub.status === "approved" && (
                      <>
                        <ActionBtn
                          label="Suspend"
                          color="amber"
                          icon="⏸"
                          onClick={() => action(`/premium/admin/suspend/${sub._id}`, "Suspended")}
                        />
                        <ActionBtn
                          label="Expire"
                          color="red"
                          icon="⌛"
                          onClick={() => action(`/premium/admin/expire/${sub._id}`, "Expired")}
                        />
                        <ActionBtn
                          label="Extend"
                          color="blue"
                          icon="+"
                          onClick={() => extend(sub._id)}
                        />
                        <ActionBtn
                          label="Change Plan"
                          color="blue"
                          icon="↔"
                          onClick={() => changePlan(sub._id)}
                        />
                      </>
                    )}

                    <ActionBtn
                      label="Delete"
                      color="red"
                      icon="🗑"
                      onClick={() => action(`/premium/admin/delete/${sub._id}`, "Deleted")}
                    />
                  </div>
                </td>
              </tr>

              {/* ── DETAILS ROW ── */}
              {openRow === sub._id && (
                <tr>
                  <td colSpan={6} className="px-4 pb-4 pt-0 bg-gray-50">
                    <div className="border border-gray-200 rounded-xl bg-white p-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Subscription Details</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <DetailItem label="Name" value={sub.name} />
                        <DetailItem label="Mobile" value={sub.mobile} />
                        <DetailItem label="Email (Filled)" value={sub.email} />
                        <DetailItem label="Telegram" value={sub.telegramUsername} />
                        <DetailItem label="Transaction ID" value={sub.transactionId} mono />
                        <DetailItem label="Coupon" value={sub.coupon?.code} />
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Status Badge ── */
const statusConfig = {
  pending:  { bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-400",  label: "Pending"  },
  approved: { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500",  label: "Approved" },
  rejected: { bg: "bg-red-50",    text: "text-red-600",    dot: "bg-red-500",    label: "Rejected" },
  suspended:{ bg: "bg-orange-50", text: "text-orange-600", dot: "bg-orange-400", label: "Suspended"},
  expired:  { bg: "bg-gray-100",  text: "text-gray-500",   dot: "bg-gray-400",   label: "Expired"  },
};

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || { bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400", label: status };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

/* ── Action Button ── */
const actionColorMap = {
  green: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-400",
  red:   "bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:border-red-400",
  amber: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:border-amber-400",
  blue:  "bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-400",
};

function ActionBtn({ label, color, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 text-xs font-medium border px-2.5 py-1.5 rounded-lg transition-all duration-150 ${actionColorMap[color]}`}
    >
      <span className="text-[10px]">{icon}</span>
      {label}
    </button>
  );
}

/* ── Detail Item ── */
function DetailItem({ label, value, mono = false }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      <p className={`text-sm text-gray-800 ${mono ? "font-mono text-xs" : ""}`}>
        {value || <span className="text-gray-300">—</span>}
      </p>
    </div>
  );
}
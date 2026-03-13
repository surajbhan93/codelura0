"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

import SubscriptionTable from "@/components/admin/premium/SubscriptionTable";
import PlanForm from "@/components/admin/premium/PlanForm";
import CouponForm from "@/components/admin/premium/CouponForm";

/* ================= TYPES ================= */
type Subscription = {
  _id: string;
  status: string;
  user?: { email?: string };
  premiumService?: { title?: string };
};

export default function AdminPremiumPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"plan" | "coupon">("plan");

  const fetchSubs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/premium/admin/subscriptions");
      setSubscriptions(res.data.subs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubs();
  }, []);

  const activeCount = subscriptions.filter((s) => s.status === "active").length;
  const totalCount = subscriptions.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

        {/* ── Page Header ── */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Premium Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Manage plans, coupons, and subscriptions</p>
          </div>
          <button
            onClick={fetchSubs}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 bg-white px-4 py-2 rounded-lg shadow-sm transition-all duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M5.635 15A8 8 0 1118.364 9" />
            </svg>
            Refresh
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            label="Total Subscriptions"
            value={loading ? "—" : totalCount}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            color="indigo"
          />
          <StatCard
            label="Active"
            value={loading ? "—" : activeCount}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color="green"
          />
          <StatCard
            label="Inactive"
            value={loading ? "—" : totalCount - activeCount}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M12 3a9 9 0 100 18A9 9 0 0012 3z" />
              </svg>
            }
            color="red"
          />
          <StatCard
            label="Activation Rate"
            value={loading || totalCount === 0 ? "—" : `${Math.round((activeCount / totalCount) * 100)}%`}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            color="amber"
          />
        </div>

        {/* ── Plan & Coupon Forms (Tabbed on mobile, side-by-side on md+) ── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

          {/* Tab bar (visible on small screens) */}
          <div className="flex md:hidden border-b border-gray-200">
            <TabBtn active={activeTab === "plan"} onClick={() => setActiveTab("plan")} label="Create Plan" />
            <TabBtn active={activeTab === "coupon"} onClick={() => setActiveTab("coupon")} label="Create Coupon" />
          </div>

          {/* Desktop: both side by side; Mobile: only active tab */}
          <div className="hidden md:grid md:grid-cols-2 divide-x divide-gray-200">
            <FormPanel title="Create Plan" icon="💎">
              <PlanForm />
            </FormPanel>
            <FormPanel title="Create Coupon" icon="🎟️">
              <CouponForm />
            </FormPanel>
          </div>

          <div className="md:hidden">
            {activeTab === "plan" ? (
              <FormPanel title="Create Plan" icon="💎">
                <PlanForm />
              </FormPanel>
            ) : (
              <FormPanel title="Create Coupon" icon="🎟️">
                <CouponForm />
              </FormPanel>
            )}
          </div>
        </div>

        {/* ── Subscriptions Table ── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">📋</span>
              <h2 className="text-sm font-semibold text-gray-700">All Subscriptions</h2>
            </div>
            {!loading && (
              <span className="text-xs text-gray-400">{totalCount} total</span>
            )}
          </div>
          <div className="p-1">
            <SubscriptionTable
              subscriptions={subscriptions}
              refresh={fetchSubs}
              loading={loading}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── Stat Card ── */
const colorMap = {
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600", icon: "text-indigo-400" },
  green:  { bg: "bg-green-50",  text: "text-green-700",  icon: "text-green-400"  },
  red:    { bg: "bg-red-50",    text: "text-red-600",    icon: "text-red-400"    },
  amber:  { bg: "bg-amber-50",  text: "text-amber-700",  icon: "text-amber-400"  },
};

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: keyof typeof colorMap;
}) {
  const c = colorMap[color];
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-4 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.icon} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className={`text-2xl font-bold ${c.text} leading-tight`}>{value}</p>
        <p className="text-xs text-gray-500 mt-0.5 truncate">{label}</p>
      </div>
    </div>
  );
}

/* ── Form Panel ── */
function FormPanel({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-base">{icon}</span>
        <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
      </div>
      {children}
    </div>
  );
}

/* ── Tab Button ── */
function TabBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 text-sm font-medium transition-colors duration-150 ${
        active
          ? "text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50/50"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
    </button>
  );
}
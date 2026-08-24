"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import toast from "react-hot-toast";

type TabType = "plans" | "coupons" | "subscriptions";

interface Plan {
  _id: string;
  title: string;
  shortDescription?: string;
  bannerImage?: string;
  price: number;
  discountedPrice?: number;
  durationInMonths?: number;
  isActive: boolean;
}

interface Coupon {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  usedCount: number;
  maxUsage?: number;
  expiryDate?: string;
  isActive: boolean;
}

interface Subscription {
  _id: string;
  name?: string;
  email?: string;
  user?: { email: string };
  premiumService?: { title: string };
  selectedPlan?: string;
  finalAmount: number;
  discountAmount: number;
  status: string;
  createdAt: string;
}

export default function AdminPremiumPage() {
  const [activeTab, setActiveTab] = useState<TabType>("plans");
  const [loading, setLoading] = useState(true);
  
  const [totalCount, setTotalCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  
  const [plans, setPlans] = useState<Plan[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [plansRes, couponsRes, subsRes] = await Promise.all([
        api.get("/premium/admin/plans"),
        api.get("/premium/admin/coupons"),
        api.get("/premium/admin/subscriptions"),
      ]);
      
      setPlans(plansRes.data.plans || []);
      setCoupons(couponsRes.data.coupons || []);
      setSubscriptions(subsRes.data.subs || []);
      
      const subs = subsRes.data.subs || [];
      setTotalCount(subs.length);
      setActiveCount(subs.filter((s: Subscription) => s.status === "approved").length);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const togglePlanStatus = async (id: string) => {
    try {
      await api.patch(`/premium/admin/plan/${id}/toggle-status`);
      toast.success("Plan status updated");
      loadAllData();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const deletePlan = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    try {
      await api.delete(`/premium/admin/plan/${id}`);
      toast.success("Plan deleted");
      loadAllData();
    } catch {
      toast.error("Failed to delete plan");
    }
  };

  const toggleCouponStatus = async (id: string) => {
    try {
      await api.patch(`/premium/admin/coupon/${id}/toggle-status`);
      toast.success("Coupon status updated");
      loadAllData();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await api.delete(`/premium/admin/coupon/${id}`);
      toast.success("Coupon deleted");
      loadAllData();
    } catch {
      toast.error("Failed to delete coupon");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Premium Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage plans, coupons, and subscriptions</p>
          </div>
          <button
            onClick={loadAllData}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M5.635 15A8 8 0 1118.364 9" />
            </svg>
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Subscriptions" value={loading ? "—" : totalCount} color="indigo" />
          <StatCard label="Active" value={loading ? "—" : activeCount} color="green" />
          <StatCard label="Inactive" value={loading ? "—" : totalCount - activeCount} color="red" />
          <StatCard
            label="Activation Rate"
            value={loading || totalCount === 0 ? "—" : `${Math.round((activeCount / totalCount) * 100)}%`}
            color="amber"
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200">
            <TabButton 
              active={activeTab === "plans"} 
              onClick={() => setActiveTab("plans")} 
              label="Plans" 
              count={plans.length}
              icon="💎"
            />
            <TabButton 
              active={activeTab === "coupons"} 
              onClick={() => setActiveTab("coupons")} 
              label="Coupons" 
              count={coupons.length}
              icon="🎟️"
            />
            <TabButton 
              active={activeTab === "subscriptions"} 
              onClick={() => setActiveTab("subscriptions")} 
              label="Subscriptions" 
              count={subscriptions.length}
              icon="📋"
            />
          </div>

          <div className="p-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {activeTab === "plans" && (
                  <PlansTab 
                    plans={plans} 
                    onToggle={togglePlanStatus} 
                    onDelete={deletePlan} 
                  />
                )}

                {activeTab === "coupons" && (
                  <CouponsTab 
                    coupons={coupons} 
                    onToggle={toggleCouponStatus} 
                    onDelete={deleteCoupon} 
                  />
                )}

                {activeTab === "subscriptions" && (
                  <SubscriptionsTab subscriptions={subscriptions} />
                )}
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  color: "indigo" | "green" | "red" | "amber";
}

const colorMap = {
  indigo: "text-indigo-600",
  green: "text-green-700",
  red: "text-red-600",
  amber: "text-amber-700",
};

function StatCard({ label, value, color }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-4">
      <p className={`text-2xl font-bold ${colorMap[color]} leading-tight`}>{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  icon: string;
}

function TabButton({ active, onClick, label, count, icon }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
        active
          ? "text-indigo-600 border-indigo-600 bg-indigo-50/50"
          : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
      }`}
    >
      <span>{icon}</span>
      {label}
      <span className={`text-xs px-2 py-0.5 rounded-full ${
        active ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-500"
      }`}>
        {count}
      </span>
    </button>
  );
}

interface PlansTabProps {
  plans: Plan[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

function PlansTab({ plans, onToggle, onDelete }: PlansTabProps) {
  if (plans.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No plans created yet</p>
        <Link href="/admin/premium/plans/new" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
          Create your first plan →
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Link
          href="/admin/premium/plans/new"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Plan
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Title</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Price</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Duration</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {plans.map((plan) => (
              <tr key={plan._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {plan.bannerImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={plan.bannerImage} alt={plan.title} className="w-10 h-10 rounded-lg object-cover" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{plan.title}</p>
                      {plan.shortDescription && (
                        <p className="text-xs text-gray-500 truncate max-w-xs">{plan.shortDescription}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900">₹{plan.price}</p>
                  {plan.discountedPrice && (
                    <p className="text-xs text-green-600">₹{plan.discountedPrice}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {plan.durationInMonths ? `${plan.durationInMonths} mo` : "—"}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    plan.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {plan.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onToggle(plan._id)}
                      className={`text-xs font-medium px-2 py-1 rounded-lg transition-colors ${
                        plan.isActive
                          ? "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                          : "text-green-600 hover:text-green-700 hover:bg-green-50"
                      }`}
                    >
                      {plan.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <Link
                      href={`/admin/premium/plans/${plan._id}`}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => onDelete(plan._id)}
                      className="text-xs font-medium text-red-500 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface CouponsTabProps {
  coupons: Coupon[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

function CouponsTab({ coupons, onToggle, onDelete }: CouponsTabProps) {
  if (coupons.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No coupons created yet</p>
        <Link href="/admin/premium/coupons/new" className="mt-4 inline-block text-emerald-600 hover:text-emerald-800">
          Create your first coupon →
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Link
          href="/admin/premium/coupons/new"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Coupon
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Code</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Discount</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Used</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Expiry</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {coupons.map((coupon) => {
              const isExpired = coupon.expiryDate && new Date(coupon.expiryDate) < new Date();
              const isActive = coupon.isActive && !isExpired;
              
              return (
                <tr key={coupon._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-mono font-semibold text-gray-900">{coupon.code}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">
                      {coupon.discountType === "percentage" 
                        ? `${coupon.discountValue}%` 
                        : `₹${coupon.discountValue}`}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {coupon.usedCount || 0}{coupon.maxUsage ? ` / ${coupon.maxUsage}` : ""}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {coupon.expiryDate 
                      ? new Date(coupon.expiryDate).toLocaleDateString() 
                      : "Never"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {isActive ? "Active" : isExpired ? "Expired" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onToggle(coupon._id)}
                        className={`text-xs font-medium px-2 py-1 rounded-lg transition-colors ${
                          isActive
                            ? "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                            : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                        }`}
                      >
                        {isActive ? "Deactivate" : "Activate"}
                      </button>
                      <Link
                        href={`/admin/premium/coupons/${coupon._id}`}
                        className="text-xs font-medium text-emerald-600 hover:text-emerald-800 px-2 py-1 rounded-lg hover:bg-emerald-50 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => onDelete(coupon._id)}
                        className="text-xs font-medium text-red-500 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface SubscriptionsTabProps {
  subscriptions: Subscription[];
}

function SubscriptionsTab({ subscriptions }: SubscriptionsTabProps) {
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

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No subscriptions yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">User</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Plan</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Amount</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Date</th>
            <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Action</th>
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
                <p className="text-sm font-semibold text-gray-900">₹{sub.finalAmount}</p>
                {sub.discountAmount > 0 && (
                  <p className="text-xs text-green-600">-₹{sub.discountAmount}</p>
                )}
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[sub.status] || "bg-gray-100 text-gray-700"}`}>
                  {sub.status}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {new Date(sub.createdAt).toLocaleDateString()}
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
  );
}
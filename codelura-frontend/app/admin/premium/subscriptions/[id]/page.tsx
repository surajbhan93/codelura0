"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface PremiumService {
  title?: string;
  durationInMonths?: number;
}

interface Subscription {
  _id: string;
  status: string;
  name?: string;
  email?: string;
  mobile?: string;
  telegramUsername?: string;
  premiumService?: PremiumService;
  selectedPlan?: string;
  startDate?: string;
  endDate?: string;
  finalAmount?: number;
  discountAmount?: number;
  referralCommission?: number;
  transactionId?: string;
  paymentStatus?: string;
  adminNote?: string;
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

export default function EditSubscriptionPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchSubscription = async () => {
      try {
        const res = await api.get(`/premium/admin/subscription/${id}`);
        setSubscription(res.data.subscription);
      } catch (err) {
        toast.error(getErrorMessage(err, "Failed to load subscription"));
        router.push("/admin/premium/subscriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [id, router]);

  const refetch = async () => {
    const res = await api.get(`/premium/admin/subscription/${id}`);
    setSubscription(res.data.subscription);
  };

const handleStatusChange = async (newStatus: string) => {
  if (
    !confirm(`Are you sure you want to change status to "${newStatus}"?`)
  ) {
    return;
  }

  try {
    setUpdating(true);

    if (newStatus === "approved") {
      await api.put(`/premium/admin/approve/${id}`);
    } 
    
    else if (newStatus === "rejected") {
      await api.put(`/premium/admin/reject/${id}`, {
        adminNote: subscription?.adminNote || "",
      });
    } 
    
    else if (newStatus === "suspended") {
      await api.put(`/premium/admin/suspend/${id}`);
    } 
    
    else if (newStatus === "expired") {
      await api.put(`/premium/admin/expire/${id}`);
    }

    toast.success(`Subscription ${newStatus} successfully`);

    await refetch();

  } catch (err) {
    console.error("Status update error:", err);

    toast.error(
      getErrorMessage(err, `Failed to ${newStatus} subscription`)
    );
  } finally {
    setUpdating(false);
  }
};
  const handleExtend = async () => {
    const monthsInput = prompt("Enter number of months to extend:", "1");
    if (!monthsInput) return;

    const months = Number(monthsInput);
    if (Number.isNaN(months) || months <= 0) {
      toast.error("Please enter a valid number of months");
      return;
    }

    try {
      setUpdating(true);
      await api.put(`/premium/admin/extend/${id}`, {
  months,
});
      toast.success(`Extended by ${months} months`);
      await refetch();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to extend"));
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveNote = async () => {
    if (!subscription) return;
    try {
      await api.patch(`/premium/admin/subscription/${id}/note`, { adminNote: subscription.adminNote });
      toast.success("Note updated");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update note"));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscription...</p>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Subscription not found</p>
        <button
          onClick={() => router.push("/admin/premium/subscriptions")}
          className="mt-4 text-gray-600 hover:text-gray-800"
        >
          ← Back to Subscriptions
        </button>
      </div>
    );
  }

  return (
    // <div className="min-h-screen bg-gray-50 py-8">
    <div className="min-h-screen bg-gray-50 py-8 text-black">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push("/admin/premium/subscriptions")}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Subscription Details</h1>
          <span className="ml-auto text-sm text-gray-500">ID: {subscription._id}</span>
        </div>

        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Current Status</p>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                    statusColors[subscription.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {subscription.status}
                </span>
              </div>
              <div className="flex gap-2">
                {subscription.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleStatusChange("approved")}
                      disabled={updating}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange("rejected")}
                      disabled={updating}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </>
                )}
                {subscription.status === "approved" && (
                  <>
                    <button
                      onClick={() => handleStatusChange("suspended")}
                      disabled={updating}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      Suspend
                    </button>
                    <button
                      onClick={handleExtend}
                      disabled={updating}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      Extend
                    </button>
                  </>
                )}
                {subscription.status === "suspended" && (
                  <button
                    onClick={() => handleStatusChange("approved")}
                    disabled={updating}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    Reactivate
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Details Grid */}
   {/* Details Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

  {/* User Details */}
  <div className="bg-white rounded-2xl border border-gray-200 p-6 text-black">
    <h3 className="text-sm font-semibold text-black mb-4">
      User Details
    </h3>

    <div className="space-y-2 text-sm text-black">
      <p><span className="font-medium">Name:</span> {subscription.name || "—"}</p>
      <p><span className="font-medium">Email:</span> {subscription.email || "—"}</p>
      <p><span className="font-medium">Mobile:</span> {subscription.mobile || "—"}</p>
      <p><span className="font-medium">Telegram:</span> {subscription.telegramUsername || "—"}</p>
    </div>
  </div>

  {/* Plan Details */}
  <div className="bg-white rounded-2xl border border-gray-200 p-6 text-black">
    <h3 className="text-sm font-semibold text-black mb-4">
      Plan Details
    </h3>

    <div className="space-y-2 text-sm text-black">
      <p>
        <span className="font-medium">Plan:</span>{" "}
        {subscription.premiumService?.title || "—"}
      </p>

      <p>
        <span className="font-medium">Selected Plan:</span>{" "}
        {subscription.selectedPlan || "Basic"}
      </p>

      <p>
        <span className="font-medium">Duration:</span>{" "}
        {subscription.premiumService?.durationInMonths ?? "—"} months
      </p>

      {subscription.startDate && (
        <p>
          <span className="font-medium">Start:</span>{" "}
          {new Date(subscription.startDate).toLocaleDateString()}
        </p>
      )}

      {subscription.endDate && (
        <p>
          <span className="font-medium">End:</span>{" "}
          {new Date(subscription.endDate).toLocaleDateString()}
        </p>
      )}
    </div>
  </div>
</div>

          {/* Payment & Pricing */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Payment & Pricing</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500">Final Amount</p>
                <p className="text-lg font-bold text-gray-900">₹{subscription.finalAmount}</p>
              </div>
              {!!subscription.discountAmount && subscription.discountAmount > 0 && (
                <div>
                  <p className="text-xs text-gray-500">Discount</p>
                  <p className="text-sm font-medium text-green-600">-₹{subscription.discountAmount}</p>
                </div>
              )}
              {!!subscription.referralCommission && subscription.referralCommission > 0 && (
                <div>
                  <p className="text-xs text-gray-500">Referral Commission</p>
                  <p className="text-sm font-medium text-blue-600">₹{subscription.referralCommission}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500">Transaction ID</p>
                <p className="text-sm font-mono text-black">{subscription.transactionId || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Payment Status</p>
                <p className="text-sm font-medium">{subscription.paymentStatus || "pending"}</p>
              </div>
            </div>
          </div>

          {/* Admin Note */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Admin Note</h3>
            <textarea
              value={subscription.adminNote || ""}
              onChange={(e) => setSubscription({ ...subscription, adminNote: e.target.value })}
              placeholder="Add admin notes here..."
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-500"
            />
            <button
              onClick={handleSaveNote}
              className="mt-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
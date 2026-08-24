"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import CouponForm, { CouponFormValues } from "@/components/admin/premium/CouponForm";
import { AxiosError } from "axios";

interface CouponData {
  code: string;
  discountType: string;
  discountValue: number;
  expiryDate?: string;
  maxUsage?: number;
  isActive: boolean;
  usedCount?: number;
  createdAt?: string;
}

export default function EditCouponPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  const router = useRouter();
  const [coupon, setCoupon] = useState<CouponData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchCoupon = async () => {
      try {
        const res = await api.get(`/premium/admin/coupon/${id}`);
        setCoupon(res.data.coupon);
      } catch (err) {
        if (err instanceof AxiosError) {
          toast.error(err.response?.data?.message || "Failed to load coupon");
        } else {
          toast.error("An unexpected error occurred");
        }
        console.error("Error fetching coupon:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupon();
  }, [id]);

  const handleUpdate = async (formData: CouponFormValues) => {
    try {
      await api.put(`/premium/admin/coupon/${id}`, formData);
      toast.success("Coupon updated successfully!");
      router.push("/admin/premium/coupons");
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message || "Update failed");
      } else {
        toast.error("An unexpected error occurred");
      }
      // Re-throw so CouponForm knows the submit failed and can stop loading state correctly
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading coupon...</p>
        </div>
      </div>
    );
  }

  if (!coupon) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Coupon not found</p>
        <button
          onClick={() => router.push("/admin/premium/coupons")}
          className="mt-4 text-emerald-600 hover:text-emerald-800"
        >
          ← Back to Coupons
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push("/admin/premium/coupons")}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Coupon</h1>
          <span className="ml-auto text-sm text-gray-500">Code: {coupon.code}</span>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <CouponForm
            initialData={coupon}
            onSubmit={handleUpdate}
            submitLabel="Update Coupon"
          />
        </div>
      </div>
    </div>
  );
}
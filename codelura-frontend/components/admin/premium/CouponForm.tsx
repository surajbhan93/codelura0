"use client";

import { useState, useEffect, ChangeEvent } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export interface CouponFormValues {
  code: string;
  discountType: string;
  discountValue: number;
  expiryDate?: string;
  maxUsage?: number | null;
  isActive: boolean;
}

interface CouponInitialData {
  code?: string;
  discountType?: string;
  discountValue?: number;
  expiryDate?: string;
  maxUsage?: number;
  isActive?: boolean;
  createdAt?: string;
  usedCount?: number;
}

interface CouponFormProps {
  initialData?: CouponInitialData | null;
  onSubmit?: (data: CouponFormValues) => Promise<void>;
  submitLabel?: string;
}

interface FormState {
  code: string;
  discountType: string;
  discountValue: string;
  expiryDate: string;
  maxUsage: string;
  isActive: boolean;
}

export default function CouponForm({
  initialData = null,
  onSubmit,
  submitLabel = "Create Coupon",
}: CouponFormProps) {
  const [form, setForm] = useState<FormState>({
    code: "",
    discountType: "percentage",
    discountValue: "",
    expiryDate: "",
    maxUsage: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        code: initialData.code || "",
        discountType: initialData.discountType || "percentage",
        discountValue: initialData.discountValue?.toString() || "",
        expiryDate: initialData.expiryDate
          ? new Date(initialData.expiryDate).toISOString().split("T")[0]
          : "",
        maxUsage: initialData.maxUsage?.toString() || "",
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
      });
    }
  }, [initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.code || !form.discountValue) {
      toast.error("Code and discount value are required");
      return;
    }

    if (form.discountType === "percentage" && Number(form.discountValue) > 100) {
      toast.error("Percentage discount cannot exceed 100%");
      return;
    }

    const payload: CouponFormValues = {
      code: form.code,
      discountType: form.discountType,
      isActive: form.isActive,
      expiryDate: form.expiryDate || undefined,
      discountValue: Number(form.discountValue),
      maxUsage: form.maxUsage ? Number(form.maxUsage) : null,
    };

    setLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(payload);
      } else {
        const res = await api.post("/premium/admin/coupon", payload);
        toast.success(res.data.message || "Coupon created successfully!");
        setForm({
          code: "",
          discountType: "percentage",
          discountValue: "",
          expiryDate: "",
          maxUsage: "",
          isActive: true,
        });
      }
    } catch (err) {
      // Only show a toast here for the "create" (no onSubmit) path.
      // When onSubmit is provided, the parent page already shows its own toast.
      if (!onSubmit) {
        if (err instanceof AxiosError) {
          toast.error(err.response?.data?.message || "Error creating coupon");
        } else {
          toast.error("Error creating coupon");
        }
      }
      // No re-throw here — this is the final handler, nothing above is listening.
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Coupon Code *
          </label>
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="e.g., SUMMER20"
            className="w-full border border-gray-200 bg-gray-50 focus:bg-white rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition uppercase"
            disabled={!!initialData}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Discount Type
          </label>
          <select
            name="discountType"
            value={form.discountType}
            onChange={handleChange}
            className="w-full border border-gray-200 bg-gray-50 focus:bg-white rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed (₹)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {form.discountType === "percentage" ? "Discount % *" : "Discount Amount (₹) *"}
          </label>
          <input
            name="discountValue"
            type="number"
            value={form.discountValue}
            onChange={handleChange}
            placeholder={form.discountType === "percentage" ? "20" : "100"}
            className="w-full border border-gray-200 bg-gray-50 focus:bg-white rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Expiry Date
          </label>
          <input
            name="expiryDate"
            type="date"
            value={form.expiryDate}
            onChange={handleChange}
            className="w-full border border-gray-200 bg-gray-50 focus:bg-white rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Max Usage
          </label>
          <input
            name="maxUsage"
            type="number"
            value={form.maxUsage}
            onChange={handleChange}
            placeholder="Unlimited"
            className="w-full border border-gray-200 bg-gray-50 focus:bg-white rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
          />
        </div>
        <div className="space-y-1 flex items-end">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            Active
          </label>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 rounded-xl shadow-sm transition-colors duration-150 mt-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            {submitLabel === "Update Coupon" ? "Updating..." : "Creating..."}
          </>
        ) : (
          submitLabel
        )}
      </button>

      {initialData?.createdAt && (
        <p className="text-xs text-gray-400 text-center mt-2">
          Created: {new Date(initialData.createdAt).toLocaleDateString()} • Used: {initialData.usedCount || 0} times
        </p>
      )}
    </div>
  );
}
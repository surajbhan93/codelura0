"use client";

import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function CouponForm() {
  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    expiryDate: "",
    maxUsage: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await api.post("/premium/admin/coupon", {
        ...form,
        discountValue: Number(form.discountValue),
        maxUsage: Number(form.maxUsage),
      });
      toast.success("Coupon Created");
      setForm({ code: "", discountType: "percentage", discountValue: "", expiryDate: "", maxUsage: "" });
    } catch (err) {
      toast.error("Error creating coupon");
    } finally {
      setLoading(false);
    }
  };

  const isPercentage = form.discountType === "percentage";

  return (
    <div className="space-y-4">

      {/* Coupon Code */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Coupon Code</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.53 0 1.04.21 1.41.59l7 7a2 2 0 010 2.82l-5 5a2 2 0 01-2.82 0l-7-7A2 2 0 013 10V5a2 2 0 012-2z" />
            </svg>
          </span>
          <input
            name="code"
            value={form.code}
            placeholder="e.g. SAVE20"
            onChange={handleChange}
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 bg-gray-50 focus:bg-white rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition font-mono uppercase tracking-widest"
          />
        </div>
      </div>

      {/* Discount Type + Value */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</label>
          <select
            name="discountType"
            value={form.discountType}
            onChange={handleChange}
            className="w-full border border-gray-200 bg-gray-50 focus:bg-white rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition appearance-none"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed (₹)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Value {isPercentage ? "(%)" : "(₹)"}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold">
              {isPercentage ? "%" : "₹"}
            </span>
            <input
              name="discountValue"
              value={form.discountValue}
              placeholder={isPercentage ? "20" : "100"}
              onChange={handleChange}
              type="number"
              className="w-full pl-7 pr-3 py-2.5 border border-gray-200 bg-gray-50 focus:bg-white rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Expiry + Max Usage */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Expiry Date</label>
          <input
            type="date"
            name="expiryDate"
            value={form.expiryDate}
            onChange={handleChange}
            className="w-full border border-gray-200 bg-gray-50 focus:bg-white rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Max Usage</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </span>
            <input
              name="maxUsage"
              value={form.maxUsage}
              placeholder="100"
              onChange={handleChange}
              type="number"
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 bg-gray-50 focus:bg-white rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Preview chip */}
      {form.code && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.53 0 1.04.21 1.41.59l7 7a2 2 0 010 2.82l-5 5a2 2 0 01-2.82 0l-7-7A2 2 0 013 10V5a2 2 0 012-2z" />
          </svg>
          <span className="text-xs text-emerald-700 font-mono font-semibold tracking-widest uppercase">{form.code}</span>
          {form.discountValue && (
            <span className="ml-auto text-xs text-emerald-600 font-medium">
              {isPercentage ? `${form.discountValue}% off` : `₹${form.discountValue} off`}
            </span>
          )}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg shadow-sm transition-colors duration-150"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Creating...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create Coupon
          </>
        )}
      </button>
    </div>
  );
}
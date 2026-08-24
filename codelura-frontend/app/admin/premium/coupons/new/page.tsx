"use client";

import Link from "next/link";
import CouponForm from "@/components/admin/premium/CouponForm";

export default function NewCouponPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-6 py-10 space-y-6">
        <div>
          <Link href="/admin/premium/coupons" className="text-xs text-gray-400 hover:text-gray-600">
            ← Coupons
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Create Coupon</h1>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <CouponForm />
        </div>
      </div>
    </div>
  );
}

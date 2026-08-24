"use client";

import Link from "next/link";
import PlanForm from "@/components/admin/premium/PlanForm";

export default function NewPlanPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        <div>
          <Link href="/admin/premium/plans" className="text-xs text-gray-400 hover:text-gray-600">
            ← Plans
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Create Plan</h1>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <PlanForm />
        </div>
      </div>
    </div>
  );
}

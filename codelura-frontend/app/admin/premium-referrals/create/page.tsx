"use client";

import AdminReferralJobForm from "@/components/admin/AdminReferralJobForm";
import { Sparkles, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function CreateReferralJobPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/premium-referrals"
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Referral Jobs
          </Link>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" /> Post New Premium Referral Job
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create a credit-locked referral job opportunity with Grok AI extraction. Protected recruiter email, phone, and direct referral apply links will only be visible to users who unlock them with credits.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          Credit Unlock System Active
        </div>
      </div>

      <AdminReferralJobForm />
    </div>
  );
}

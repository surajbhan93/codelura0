"use client";

import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";
import { Zap, ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react";

type DecisionResult = {
  use_ai: boolean;
  reason: string;
  recommended_pipeline: string;
};

export default function AIUsageDecisionPage() {
  const [form, setForm] = useState({
    submissionCount: 45,
    budgetLimit: 50,
    hasStrictTimeline: true,
    complexity: "MEDIUM"
  });

  const [result, setResult] = useState<DecisionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/hackathons/ai/usage-decision", form);
      setResult(res.data);
      toast.success("AI decision logic executed!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to make decision");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Back Link */}
        <Link href="/admin/hackathons" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Hackathons
        </Link>

        {/* Header */}
        <div className="border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-emerald-400" /> AI Usage Decision Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">Automated decision engine evaluating whether human judging vs AI automated evaluation is optimal</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400">Event Parameters</h2>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Total Submissions</label>
              <input
                type="number"
                value={form.submissionCount}
                onChange={(e) => setForm({ ...form, submissionCount: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Project Complexity</label>
              <select
                value={form.complexity}
                onChange={(e) => setForm({ ...form, complexity: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
              >
                <option value="LOW">Low Complexity</option>
                <option value="MEDIUM">Medium Complexity</option>
                <option value="HIGH">High Complexity</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Evaluating Decision..." : "⚡ Execute Decision Logic"}
            </button>
          </form>

          {/* Results */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Decision Outcome</h2>

              {!result ? (
                <div className="py-16 text-center text-slate-500 text-xs">
                  Run decision logic to view recommended evaluation pipeline.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-1">
                    <span className="text-xs text-slate-400 block uppercase font-semibold">Recommended AI Usage</span>
                    <span className={`text-base font-extrabold px-3 py-1 rounded-lg inline-block ${
                      result.use_ai
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    }`}>
                      {result.use_ai ? "✅ ENABLE AI EVALUATION" : "⚠️ MANUAL JURY REVIEW"}
                    </span>
                  </div>

                  {result.reason && (
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-1">
                      <span className="text-xs text-slate-400 block uppercase font-semibold">Reasoning</span>
                      <p className="text-xs text-slate-300 leading-relaxed">{result.reason}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
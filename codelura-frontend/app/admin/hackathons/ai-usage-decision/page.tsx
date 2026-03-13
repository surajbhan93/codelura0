"use client";

import { useState } from "react";
import api from "@/lib/api";

type Result = {
  allowAiCall: boolean;
  decision: string;
  reason: string;
  fallbackStrategy?: string;
};

const LEVEL_OPTIONS = ["HIGH", "MEDIUM", "LOW"];

export default function AIUsageDecisionPage() {
  const [form, setForm] = useState({
    requestType: "SCORING",
    submissionId: "",
    ruleScore: "",
    classificationLevel: "HIGH",
    plagiarismLevel: "LOW",
    currentAiCallsUsed: "",
    maxAiCallsAllowed: "100",
  });

  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await api.post("/hackathons/ai/usage-decision", {
        ...form,
        ruleScore: Number(form.ruleScore),
        currentAiCallsUsed: Number(form.currentAiCallsUsed),
        maxAiCallsAllowed: Number(form.maxAiCallsAllowed),
      });
      setResult(res.data);
    } catch (error) {
      console.error("Usage Decision API Error:", error);
      alert("API Error");
    }
    setLoading(false);
  };

  // Live usage bar
  const usagePct =
    form.currentAiCallsUsed && form.maxAiCallsAllowed
      ? Math.min(
          (Number(form.currentAiCallsUsed) / Number(form.maxAiCallsAllowed)) * 100,
          100
        )
      : 0;

  const usageColor =
    usagePct >= 90 ? "bg-red-500" : usagePct >= 60 ? "bg-yellow-400" : "bg-emerald-500";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Usage Decision</h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details below to check if an AI call should be allowed
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border p-5 shadow-sm space-y-3">

          <input
            name="submissionId"
            value={form.submissionId}
            placeholder="Submission ID"
            className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 bg-gray-50"
            onChange={handleChange}
          />

          <input
            name="ruleScore"
            value={form.ruleScore}
            placeholder="Rule Score"
            type="number"
            className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
            onChange={handleChange}
          />

          {/* Classification + Plagiarism */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">
                Classification Level
              </label>
              <select
                name="classificationLevel"
                value={form.classificationLevel}
                className="w-full border rounded-lg p-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-200"
                onChange={handleChange}
              >
                {LEVEL_OPTIONS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">
                Plagiarism Level
              </label>
              <select
                name="plagiarismLevel"
                value={form.plagiarismLevel}
                className="w-full border rounded-lg p-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-200"
                onChange={handleChange}
              >
                {LEVEL_OPTIONS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          {/* AI Calls */}
          <div className="grid grid-cols-2 gap-3">
            <input
              name="currentAiCallsUsed"
              value={form.currentAiCallsUsed}
              placeholder="Current AI Calls Used"
              type="number"
              className="border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
              onChange={handleChange}
            />
            <input
              name="maxAiCallsAllowed"
              value={form.maxAiCallsAllowed}
              placeholder="Max AI Calls Allowed"
              type="number"
              className="border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
              onChange={handleChange}
            />
          </div>

          {/* Live usage bar */}
          {form.currentAiCallsUsed && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>AI Calls Usage</span>
                <span className="font-semibold">{usagePct.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${usageColor}`}
                  style={{ width: `${usagePct}%` }}
                />
              </div>
              <div className="text-xs text-gray-400 text-right">
                {form.currentAiCallsUsed} / {form.maxAiCallsAllowed} calls
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !form.submissionId}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold p-3 rounded-lg transition text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Processing...
              </span>
            ) : (
              "Check AI Usage Decision"
            )}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="bg-white rounded-xl border p-5 shadow-sm space-y-3">

            {/* Allow / Deny banner */}
            <div className={`flex items-center justify-between p-4 rounded-lg border ${
              result.allowAiCall
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide opacity-60">AI Call</div>
                <div className={`text-2xl font-bold ${result.allowAiCall ? "text-green-700" : "text-red-700"}`}>
                  {result.allowAiCall ? "✅ ALLOWED" : "❌ DENIED"}
                </div>
              </div>
              <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${
                result.allowAiCall
                  ? "bg-green-100 text-green-700 border-green-200"
                  : "bg-red-100 text-red-700 border-red-200"
              }`}>
                {result.decision}
              </span>
            </div>

            {/* Reason */}
            <div className="p-4 bg-gray-50 border rounded-lg">
              <div className="text-xs font-semibold text-gray-400 uppercase mb-1">Reason</div>
              <p className="text-sm text-gray-700 leading-relaxed">{result.reason}</p>
            </div>

            {/* Fallback */}
            {result.fallbackStrategy && (
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="text-xs font-semibold text-blue-500 uppercase mb-1">💡 Fallback Strategy</div>
                <p className="text-sm text-blue-700 leading-relaxed">{result.fallbackStrategy}</p>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
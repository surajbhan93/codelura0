"use client";

import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Search, CheckCircle2, AlertOctagon } from "lucide-react";

type PlagiarismResult = {
  plagiarism_level: "LOW" | "MEDIUM" | "HIGH";
  similarity_score: number;
  flags: string[];
  reason: string;
};

export default function AIPlagiarismPage() {
  const [form, setForm] = useState({
    submissionId: "",
    projectTitle: "AI Code Synthesizer",
    projectDescription: "Generates production ready code snippets from voice prompts.",
    problemStatement: "Developer fatigue during boilerplate writing.",
    solution: "Voice activated LLM code generation pipeline.",
    techStack: "React, Node.js, OpenAI Whisper, Express",
    githubRepo: "https://github.com/example/code-synth"
  });

  const [result, setResult] = useState<PlagiarismResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/hackathons/ai/plagiarism-check", {
        ...form,
        techStack: form.techStack.split(",").map((t) => t.trim())
      });

      setResult(res.data);
      toast.success("Plagiarism check completed!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to check plagiarism");
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
            <ShieldCheck className="w-6 h-6 text-rose-400" /> AI Code Originality & Plagiarism Detector
          </h1>
          <p className="text-xs text-slate-400 mt-1">Cross-check code repository and project text against known databases for similarity</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold uppercase tracking-wider text-rose-400">Submission Code & Text Audit</h2>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Project Title *</label>
              <input
                name="projectTitle"
                required
                value={form.projectTitle}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">GitHub Repository Link *</label>
              <input
                name="githubRepo"
                required
                value={form.githubRepo}
                onChange={handleChange}
                placeholder="https://github.com/username/repository"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Project Description</label>
              <textarea
                name="projectDescription"
                value={form.projectDescription}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white outline-none h-20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Tech Stack</label>
              <input
                name="techStack"
                value={form.techStack}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Scanning Repository..." : "🔍 Run Plagiarism Scan"}
            </button>
          </form>

          {/* Results Panel */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Plagiarism Audit Report</h2>

              {!result ? (
                <div className="py-16 text-center text-slate-500 text-xs">
                  Enter project details and repository link to initiate similarity check.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                    <span className="text-xs text-slate-400 block uppercase font-semibold">Similarity Score</span>
                    <p className="text-3xl font-black text-white">
                      {Math.round(result.similarity_score * 100)}%
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-1">
                    <span className="text-xs text-slate-400 block uppercase font-semibold">Plagiarism Risk Level</span>
                    <span className={`text-base font-extrabold px-3 py-1 rounded-lg inline-block ${
                      result.plagiarism_level === "LOW"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : result.plagiarism_level === "MEDIUM"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    }`}>
                      {result.plagiarism_level} RISK
                    </span>
                  </div>

                  {result.reason && (
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-1">
                      <span className="text-xs text-slate-400 block uppercase font-semibold">Detailed Reason</span>
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
"use client";

import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";
import { Award, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";

type JudgeResult = {
  rule_score: number;
  final_score: number;
  evaluation_type: string;
  remarks: string;
};

export default function AIJudgePage() {
  const [form, setForm] = useState({
    submissionId: "",
    hackathonId: "",
    projectTitle: "Automated MedAssistant AI",
    projectDescription: "An AI system analyzing patient symptoms and providing preliminary triaging advice.",
    techStack: "Python, PyTorch, LangChain, Next.js",
    githubRepo: "https://github.com/example/med-ai"
  });

  const [result, setResult] = useState<JudgeResult | null>(null);
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
      const res = await api.post("/hackathons/ai/judge", {
        ...form,
        techStack: form.techStack.split(",").map((t) => t.trim())
      });

      setResult(res.data);
      toast.success("AI Judging evaluation complete!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to judge project");
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
            <Award className="w-6 h-6 text-amber-400" /> AI Automated Project Judge
          </h1>
          <p className="text-xs text-slate-400 mt-1">Evaluates projects against hackathon criteria rules and computes automated scores</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400">Project Evaluation Parameters</h2>

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
              <label className="block text-xs font-semibold text-slate-400 mb-1">Project Description *</label>
              <textarea
                name="projectDescription"
                required
                value={form.projectDescription}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white outline-none h-20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Tech Stack (comma separated)</label>
              <input
                name="techStack"
                value={form.techStack}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">GitHub Repo</label>
              <input
                name="githubRepo"
                value={form.githubRepo}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-amber-600/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Evaluating Project..." : "⚖️ Compute AI Scores"}
            </button>
          </form>

          {/* Results Panel */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">AI Judge Scorecard</h2>

              {!result ? (
                <div className="py-16 text-center text-slate-500 text-xs">
                  Fill details and click <span className="text-amber-400 font-bold">Compute AI Scores</span> to view recommendations.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                      <span className="text-xs text-slate-400 block font-semibold">Rule Score</span>
                      <span className="text-2xl font-black text-amber-400">{result.rule_score}</span>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                      <span className="text-xs text-slate-400 block font-semibold">Final Score</span>
                      <span className="text-2xl font-black text-indigo-400">{result.final_score}</span>
                    </div>
                  </div>

                  {result.evaluation_type && (
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                      <span className="text-xs text-slate-400 block uppercase font-semibold">Evaluation Mode</span>
                      <span className="text-xs font-bold text-slate-200">{result.evaluation_type}</span>
                    </div>
                  )}

                  {result.remarks && (
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-1">
                      <span className="text-xs text-slate-400 block uppercase font-semibold">Jury Remarks</span>
                      <p className="text-xs text-slate-300 italic leading-relaxed">{result.remarks}</p>
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
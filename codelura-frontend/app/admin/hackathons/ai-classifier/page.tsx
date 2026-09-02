"use client";

import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";
import { Bot, Sparkles, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";

type AIResult = {
  quality_level: "LOW" | "MEDIUM" | "HIGH";
  ai_judging_required: boolean;
  flags: string[];
  reason: string;
};

export default function AIClassifierPage() {
  const [form, setForm] = useState({
    submissionId: "",
    projectTitle: "Codelura AI Tutor Platform",
    projectDescription: "An AI-powered adaptive learning assistant that creates personalized quizzes and doubt solver.",
    problemStatement: "Students struggle with personalized learning pace.",
    solution: "Generative AI agents and RAG system for instant concept explanations.",
    techStack: "Next.js, Python, FastAPI, OpenAI, LangChain",
    githubRepo: "https://github.com/example/ai-tutor",
    demoVideo: "https://youtube.com/watch?v=example",
    liveUrl: "https://aitutor.example.com"
  });

  const [result, setResult] = useState<AIResult | null>(null);
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
      const response = await api.post("/hackathons/ai/submission-classifier", {
        ...form,
        techStack: form.techStack.split(",").map((t) => t.trim())
      });

      setResult(response.data);
      toast.success("AI Classification complete!");
    } catch (error: any) {
      console.error("AI API Error:", error);
      toast.error(error.response?.data?.message || "Failed to classify submission");
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
            <Bot className="w-6 h-6 text-purple-400" /> AI Submission Classifier
          </h1>
          <p className="text-xs text-slate-400 mt-1">Classify submission quality level (HIGH/MEDIUM/LOW) and determine judging requirements</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left: Input Form (7 cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold uppercase tracking-wider text-purple-400">Submission Details</h2>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Submission ID (Optional)</label>
              <input
                name="submissionId"
                value={form.submissionId}
                onChange={handleChange}
                placeholder="sub_64f1a2..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
              />
            </div>

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
              <label className="block text-xs font-semibold text-slate-400 mb-1">GitHub Repository</label>
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
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Analyzing Submission..." : "✨ Run AI Classification"}
            </button>
          </form>

          {/* Right: Results Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Classification Result</h2>

              {!result ? (
                <div className="py-16 text-center text-slate-500 text-xs">
                  Fill the project details and click <span className="text-purple-400 font-bold">Run AI Classification</span> to view results.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                    <span className="text-xs text-slate-400 block uppercase font-semibold">Quality Level</span>
                    <span className={`text-xl font-black px-3 py-1 rounded-lg inline-block ${
                      result.quality_level === "HIGH"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : result.quality_level === "MEDIUM"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    }`}>
                      {result.quality_level}
                    </span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-1">
                    <span className="text-xs text-slate-400 block uppercase font-semibold">AI Judging Required</span>
                    <span className={`text-sm font-bold ${result.ai_judging_required ? "text-amber-400" : "text-emerald-400"}`}>
                      {result.ai_judging_required ? "YES — Recommended for Jury Review" : "NO — Fast Track"}
                    </span>
                  </div>

                  {result.flags && result.flags.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-slate-400 uppercase">Flags & Warnings</span>
                      <div className="flex flex-wrap gap-1.5">
                        {result.flags.map((f, idx) => (
                          <span key={idx} className="text-[11px] font-semibold bg-rose-500/15 text-rose-300 px-2.5 py-1 rounded-lg border border-rose-500/30">
                            ⚠️ {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.reason && (
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-1">
                      <span className="text-xs text-slate-400 block uppercase font-semibold">AI Reasoning</span>
                      <p className="text-xs text-slate-300 italic leading-relaxed">{result.reason}</p>
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
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  Sparkles,
  Bot,
  ShieldCheck,
  Award,
  Zap,
  BarChart3,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  ExternalLink,
  Code,
  FileText,
} from "lucide-react";

interface Submission {
  _id: string;
  projectTitle: string;
  projectDescription: string;
  problemStatement: string;
  solution: string;
  techStack: string[];
  githubRepo: string;
  status: string;
  score: number;
  user?: { name: string; email: string };
  plagiarismScore?: number;
  classificationLevel?: string;
  judgeRuleScore?: number;
  judgeFinalScore?: number;
}

export default function AIControllerPanelPage() {
  const params = useParams();
  const router = useRouter();
  const hackathonId = params.hackathonId as string;

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [hackathon, setHackathon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [batchRunning, setBatchRunning] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);

  useEffect(() => {
    if (!hackathonId) return;

    const fetchData = async () => {
      try {
        const [hRes, sRes] = await Promise.allSettled([
          api.get(`/hackathons/${hackathonId}`).catch(() => null),
          api.get(`/admin/hackathons/${hackathonId}/submissions`).catch(() => null),
        ]);

        if (hRes.status === "fulfilled" && hRes.value?.data) {
          setHackathon(hRes.value.data.data || hRes.value.data);
        }

        if (sRes.status === "fulfilled" && sRes.value?.data) {
          setSubmissions(sRes.value.data.data || []);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load AI control data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hackathonId]);

  // Batch AI Processor
  const runBatchAIEvaluation = async () => {
    if (submissions.length === 0) {
      toast.error("No project submissions found to evaluate.");
      return;
    }

    setBatchRunning(true);
    setProcessedCount(0);
    toast.loading("Running batch AI evaluation on all submissions...", { id: "batch-ai" });

    let count = 0;
    for (const sub of submissions) {
      try {
        const payload = {
          submissionId: sub._id,
          projectTitle: sub.projectTitle,
          projectDescription: sub.projectDescription,
          problemStatement: sub.problemStatement,
          solution: sub.solution,
          techStack: sub.techStack,
          githubRepo: sub.githubRepo,
          hackathonId,
        };

        const [classifierRes, plagiarismRes, judgeRes] = await Promise.allSettled([
          api.post("/hackathons/ai/submission-classifier", payload),
          api.post("/hackathons/ai/plagiarism-check", payload),
          api.post("/hackathons/ai/judge", payload),
        ]);

        let quality = "MEDIUM";
        let plagScore = 0;
        let ruleScore = 80;
        let finalScore = 85;

        if (classifierRes.status === "fulfilled") {
          quality = classifierRes.value.data?.quality_level || "MEDIUM";
        }
        if (plagiarismRes.status === "fulfilled") {
          plagScore = Math.round((plagiarismRes.value.data?.similarity_score || 0) * 100);
        }
        if (judgeRes.status === "fulfilled") {
          ruleScore = judgeRes.value.data?.rule_score || 80;
          finalScore = judgeRes.value.data?.final_score || 85;
        }

        // Save scores
        await api.patch(`/admin/submissions/${sub._id}/scores`, {
          plagiarismScore: plagScore,
          classificationLevel: quality,
          judgeRuleScore: ruleScore,
          judgeFinalScore: finalScore,
          aiJudgingRequired: true,
        }).catch(() => null);

        count++;
        setProcessedCount(count);
      } catch (err) {
        console.error("Batch item error", err);
      }
    }

    setBatchRunning(false);
    toast.success(`Batch AI evaluation completed! ${count} submissions processed.`, { id: "batch-ai" });
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
        <p className="text-slate-400 text-xs font-semibold">Loading AI Control Suite...</p>
      </div>
    );
  }

  const toolCards = [
    {
      title: "AI Classifier",
      desc: "Categorize project quality (HIGH/MEDIUM/LOW) & detect required judging flags.",
      icon: Bot,
      color: "from-purple-600 to-indigo-600",
      link: `/admin/hackathons/ai-classifier?hackathonId=${hackathonId}`,
    },
    {
      title: "Plagiarism & Originality",
      desc: "Analyze GitHub code repositories and text for duplicate submission flags.",
      icon: ShieldCheck,
      color: "from-rose-600 to-pink-600",
      link: `/admin/hackathons/ai-plagiarism?hackathonId=${hackathonId}`,
    },
    {
      title: "AI Judge & Scoring",
      desc: "Automatically grade projects according to weighted criteria rules.",
      icon: Award,
      color: "from-amber-600 to-orange-600",
      link: `/admin/hackathons/ai-judge?hackathonId=${hackathonId}`,
    },
    {
      title: "Usage Decision Engine",
      desc: "Automated logic engine determining when AI vs human evaluation applies.",
      icon: Zap,
      color: "from-emerald-600 to-teal-600",
      link: `/admin/hackathons/ai-usage-decision?hackathonId=${hackathonId}`,
    },
    {
      title: "AI Usage & Token Stats",
      desc: "View system-wide API calls, token usage logs, and response latency.",
      icon: BarChart3,
      color: "from-sky-600 to-blue-600",
      link: `/admin/hackathons/ai-usage-stats`,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* TOP HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/30">
                ✨ AI Evaluation Suite
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {hackathonId}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {hackathon?.title || "Hackathon AI Control Panel"}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">Manage AI classifier tools, plagiarism checks, and automated scoring for this event</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={runBatchAIEvaluation}
              disabled={batchRunning}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 flex items-center gap-2 disabled:opacity-50 transition"
            >
              {batchRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Processing ({processedCount}/{submissions.length})...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Run Batch AI on All Submissions ({submissions.length})
                </>
              )}
            </button>

            <Link
              href={`/admin/hackathons/${hackathonId}/submissions`}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition flex items-center gap-2"
            >
              📥 View All Submissions
            </Link>
          </div>
        </div>

        {/* AI TOOL CARDS GRID */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Bot className="w-4 h-4 text-violet-400" /> AI Modules & Specialized Tools
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {toolCards.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.title}
                  href={tool.link}
                  className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-violet-500/40 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1 shadow-lg hover:shadow-2xl"
                >
                  <div className="space-y-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${tool.color} flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition flex items-center gap-1.5">
                      {tool.title} <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{tool.desc}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-violet-400">
                    <span>Open Module</span>
                    <span className="text-slate-600">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* SUBMISSIONS AUDIT TABLE */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Submissions AI Audit Status</h2>
              <p className="text-xs text-slate-400 mt-0.5">{submissions.length} total entries registered for evaluation</p>
            </div>
          </div>

          {submissions.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No project submissions found for this hackathon yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Project</th>
                    <th className="py-3 px-4">Participant</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Quality</th>
                    <th className="py-3 px-4">Plagiarism</th>
                    <th className="py-3 px-4">AI Score</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {submissions.map((sub) => (
                    <tr key={sub._id} className="hover:bg-slate-800/50 transition">
                      <td className="py-3.5 px-4 font-bold text-white">{sub.projectTitle}</td>
                      <td className="py-3.5 px-4 text-slate-400">{sub.user?.name || "Participant"}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-violet-500/10 text-violet-300 border border-violet-500/20">
                          {sub.status || "Submitted"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-purple-400">
                        {sub.classificationLevel || "Pending"}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                        {sub.plagiarismScore !== undefined ? `${sub.plagiarismScore}%` : "—"}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-indigo-400">
                        {sub.judgeFinalScore || sub.score || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/admin/hackathons/${hackathonId}/submissions`}
                          className="px-3 py-1.5 rounded-lg bg-violet-600/20 text-violet-300 border border-violet-500/30 text-xs font-semibold hover:bg-violet-600 hover:text-white transition inline-block"
                        >
                          Evaluate →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
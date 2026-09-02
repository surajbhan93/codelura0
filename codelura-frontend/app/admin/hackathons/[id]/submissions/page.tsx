"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";

type AIScores = {
  plagiarismScore?: number;
  plagiarismLevel?: string;
  classificationLevel?: string;
  qualityLevel?: string;
  aiJudgingRequired?: boolean;
  judgeRuleScore?: number;
  judgeFinalScore?: number;
  judgeRemarks?: string;
  aiProcessed?: boolean;
};

type Submission = {
  _id: string;
  projectTitle: string;
  projectDescription: string;
  problemStatement: string;
  solution: string;
  techStack: string[];
  githubRepo: string;
  demoVideo: string;
  liveUrl: string;
  pitchDeck: string;
  screenshots: string[];
  plagiarismScore: number;
  innovationScore: number;
  technicalScore: number;
  impactScore: number;
  score: number;
  status: string;
  createdAt: string;
  user?: { _id: string; name: string; email: string };
  hackathon?: { _id: string; title: string };
};

function ScoreBadge({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center bg-gray-50 border rounded p-2 min-w-[70px]">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-lg font-bold text-gray-800">{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    submitted: "bg-blue-100 text-blue-700 border-blue-200",
    approved: "bg-green-100 text-green-700 border-green-200",
    winner: "bg-amber-100 text-amber-800 border-amber-300 font-bold",
    shortlisted: "bg-purple-100 text-purple-700 border-purple-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${colors[status.toLowerCase()] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
      {status.toUpperCase()}
    </span>
  );
}

function LevelBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    HIGH: "bg-red-100 text-red-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    LOW: "bg-green-100 text-green-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[level] ?? "bg-gray-100 text-gray-600"}`}>
      {level}
    </span>
  );
}

export default function HackathonSubmissionsPage() {
  const params = useParams();
  const hackathonId = params.id;

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  // Per-submission AI state
  const [aiScores, setAiScores] = useState<Record<string, AIScores>>({});
  const [aiRunning, setAiRunning] = useState<Record<string, boolean>>({});
  const [aiSaving, setAiSaving] = useState<Record<string, boolean>>({});
  const [aiSaved, setAiSaved] = useState<Record<string, boolean>>({});
  const [aiError, setAiError] = useState<Record<string, string>>({});
  const [statusUpdating, setStatusUpdating] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!hackathonId) return;
    const fetchSubmissions = async () => {
      try {
        const res = await api.get(`/admin/hackathons/${hackathonId}/submissions`);
        setSubmissions(res.data.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load submissions");
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [hackathonId]);

  const updateStatus = async (subId: string, newStatus: string) => {
    setStatusUpdating((prev) => ({ ...prev, [subId]: true }));
    try {
      await api.patch(`/admin/submissions/${subId}/status`, { status: newStatus }).catch(async () => {
        // Fallback endpoint if patch admin isn't registered
        await api.put(`/admin/submissions/${subId}`, { status: newStatus });
      });

      setSubmissions((prev) =>
        prev.map((s) => (s._id === subId ? { ...s, status: newStatus } : s))
      );
      toast.success(`Status updated to ${newStatus.toUpperCase()}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setStatusUpdating((prev) => ({ ...prev, [subId]: false }));
    }
  };

  const runAllAI = async (sub: Submission) => {
    setAiRunning((prev) => ({ ...prev, [sub._id]: true }));
    setAiError((prev) => ({ ...prev, [sub._id]: "" }));
    setAiSaved((prev) => ({ ...prev, [sub._id]: false }));

    const payload = {
      submissionId: sub._id,
      projectTitle: sub.projectTitle,
      projectDescription: sub.projectDescription,
      problemStatement: sub.problemStatement,
      solution: sub.solution,
      techStack: sub.techStack,
      githubRepo: sub.githubRepo,
    };

    try {
      const [classifierRes, plagiarismRes, judgeRes] = await Promise.allSettled([
        api.post("/hackathons/ai/submission-classifier", payload),
        api.post("/hackathons/ai/plagiarism-check", payload),
        api.post("/hackathons/ai/judge", {
          ...payload,
          hackathonId: sub.hackathon?._id,
        }),
      ]);

      const scores: AIScores = {};

      if (classifierRes.status === "fulfilled") {
        const d = classifierRes.value.data;
        scores.qualityLevel = d.quality_level;
        scores.classificationLevel = d.quality_level;
        scores.aiJudgingRequired = d.ai_judging_required;
      }

      if (plagiarismRes.status === "fulfilled") {
        const d = plagiarismRes.value.data;
        scores.plagiarismLevel = d.plagiarism_level;
        scores.plagiarismScore = Math.round(d.similarity_score * 100);
      }

      if (judgeRes.status === "fulfilled") {
        const d = judgeRes.value.data;
        scores.judgeRuleScore = d.rule_score;
        scores.judgeFinalScore = d.final_score;
        scores.judgeRemarks = d.remarks;
      }

      scores.aiProcessed = true;
      setAiScores((prev) => ({ ...prev, [sub._id]: scores }));
    } catch (err) {
      console.error(err);
      setAiError((prev) => ({ ...prev, [sub._id]: "One or more AI calls failed." }));
    }

    setAiRunning((prev) => ({ ...prev, [sub._id]: false }));
  };

  const saveAIScores = async (sub: Submission) => {
    const scores = aiScores[sub._id];
    if (!scores) return;

    setAiSaving((prev) => ({ ...prev, [sub._id]: true }));
    try {
      await api.patch(`/admin/submissions/${sub._id}/scores`, {
        plagiarismScore: scores.plagiarismScore,
        classificationLevel: scores.classificationLevel,
        judgeRuleScore: scores.judgeRuleScore,
        judgeFinalScore: scores.judgeFinalScore,
        judgeRemarks: scores.judgeRemarks,
        aiJudgingRequired: scores.aiJudgingRequired,
      });
      setAiSaved((prev) => ({ ...prev, [sub._id]: true }));
      toast.success("AI Scores saved!");
    } catch (err) {
      console.error(err);
      setAiError((prev) => ({ ...prev, [sub._id]: "Failed to save scores." }));
    }
    setAiSaving((prev) => ({ ...prev, [sub._id]: false }));
  };

  if (loading) {
    return <div className="p-10 text-center text-lg font-medium text-gray-500">Loading submissions...</div>;
  }

  const filteredSubmissions = submissions.filter((s) => {
    if (statusFilter === "all") return true;
    return s.status.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hackathon Submissions & Round Review</h1>
          <p className="text-gray-500 text-sm mt-0.5">{submissions.length} total project submission(s)</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
          {["all", "submitted", "approved", "winner", "rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                statusFilter === f
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredSubmissions.map((sub) => {
          const ai = aiScores[sub._id];
          const isRunning = aiRunning[sub._id];
          const isSaving = aiSaving[sub._id];
          const isSaved = aiSaved[sub._id];
          const error = aiError[sub._id];
          const isUpdating = statusUpdating[sub._id];

          return (
            <div key={sub._id} className="border border-gray-200 rounded-2xl shadow-sm bg-white overflow-hidden transition hover:border-gray-300">

              {/* Header Row */}
              <div
                className="flex flex-wrap items-center justify-between gap-3 p-4 cursor-pointer hover:bg-gray-50/80 transition"
                onClick={() => setExpanded(expanded === sub._id ? null : sub._id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    {sub.user?.name?.[0] ?? "P"}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-base">{sub.projectTitle}</div>
                    <div className="text-xs text-gray-500">{sub.user?.name} · {sub.user?.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {sub.hackathon?.title && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg font-medium">
                      {sub.hackathon.title}
                    </span>
                  )}
                  <StatusBadge status={sub.status} />
                  <span className="text-sm font-extrabold text-indigo-600">Score: {sub.score}</span>
                  {ai?.aiProcessed && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                      ✨ AI Evaluated
                    </span>
                  )}

                  {/* Status Action Buttons */}
                  <div className="flex items-center gap-1.5 border-l pl-3 ml-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => updateStatus(sub._id, "approved")}
                      disabled={isUpdating || sub.status === "approved"}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 disabled:opacity-40"
                      title="Approve / Shortlist for Next Round"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => updateStatus(sub._id, "winner")}
                      disabled={isUpdating || sub.status === "winner"}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300 disabled:opacity-40"
                      title="Mark as Winner"
                    >
                      🏆 Winner
                    </button>
                    <button
                      onClick={() => updateStatus(sub._id, "rejected")}
                      disabled={isUpdating || sub.status === "rejected"}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 disabled:opacity-40"
                      title="Reject Submission"
                    >
                      ✕ Reject
                    </button>
                  </div>

                  <span className="text-gray-400 text-xs ml-1">{expanded === sub._id ? "▲" : "▼"}</span>
                </div>
              </div>

              {/* Expanded Detail */}
              {expanded === sub._id && (
                <div className="border-t bg-gray-50/50">

                  {/* AI Tools Bar */}
                  <div className="px-5 pt-4 pb-3 border-b bg-white flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">AI Evaluation Suite</span>

                    <button
                      onClick={(e) => { e.stopPropagation(); runAllAI(sub); }}
                      disabled={isRunning}
                      className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white shadow-sm transition"
                    >
                      {isRunning ? (
                        <>
                          <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                          </svg>
                          Running AI Evaluation...
                        </>
                      ) : (
                        <>{ai?.aiProcessed ? "🔄 Re-run AI Evaluation" : "✨ Run AI Evaluation"}</>
                      )}
                    </button>

                    {ai?.aiProcessed && !isSaved && (
                      <button
                        onClick={(e) => { e.stopPropagation(); saveAIScores(sub); }}
                        disabled={isSaving}
                        className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white shadow-sm transition"
                      >
                        {isSaving ? "Saving..." : "💾 Save AI Scores"}
                      </button>
                    )}

                    {isSaved && (
                      <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                        ✅ Scores Saved
                      </span>
                    )}

                    {error && (
                      <span className="text-xs text-red-600 font-medium">{error}</span>
                    )}
                  </div>

                  {/* AI Results Panel */}
                  {ai?.aiProcessed && (
                    <div className="px-5 py-4 border-b bg-purple-50/30 grid grid-cols-1 sm:grid-cols-3 gap-4">

                      {/* Classifier */}
                      <div className="bg-white rounded-xl border p-4 space-y-2 shadow-sm">
                        <div className="text-xs font-bold text-purple-900 uppercase">🤖 Classifier</div>
                        {ai.qualityLevel && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Quality</span>
                            <LevelBadge level={ai.qualityLevel} />
                          </div>
                        )}
                        {ai.aiJudgingRequired !== undefined && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">AI Judge Needed</span>
                            <span className={`text-xs font-semibold ${ai.aiJudgingRequired ? "text-orange-600" : "text-emerald-600"}`}>
                              {ai.aiJudgingRequired ? "Yes" : "No"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Plagiarism */}
                      <div className="bg-white rounded-xl border p-4 space-y-2 shadow-sm">
                        <div className="text-xs font-bold text-purple-900 uppercase">🔍 Plagiarism & Code Originality</div>
                        {ai.plagiarismLevel && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Level</span>
                            <LevelBadge level={ai.plagiarismLevel} />
                          </div>
                        )}
                        {ai.plagiarismScore !== undefined && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Similarity</span>
                            <span className="text-sm font-bold text-gray-800">{ai.plagiarismScore}%</span>
                          </div>
                        )}
                      </div>

                      {/* Judge */}
                      <div className="bg-white rounded-xl border p-4 space-y-2 shadow-sm">
                        <div className="text-xs font-bold text-purple-900 uppercase">⚖️ AI Judge Recommendation</div>
                        {ai.judgeRuleScore !== undefined && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Rule Score</span>
                            <span className="text-sm font-bold text-purple-700">{ai.judgeRuleScore}</span>
                          </div>
                        )}
                        {ai.judgeFinalScore !== undefined && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Final Score</span>
                            <span className="text-sm font-bold text-indigo-700">{ai.judgeFinalScore}</span>
                          </div>
                        )}
                        {ai.judgeRemarks && (
                          <p className="text-xs text-gray-600 italic border-t pt-2 mt-1">{ai.judgeRemarks}</p>
                        )}
                      </div>

                    </div>
                  )}

                  {/* Detail Grid */}
                  <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Project Description</h3>
                        <p className="text-sm text-gray-700 leading-relaxed">{sub.projectDescription || "—"}</p>
                      </div>
                      {sub.problemStatement && (
                        <div>
                          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Problem Statement</h3>
                          <p className="text-sm text-gray-700">{sub.problemStatement}</p>
                        </div>
                      )}
                      {sub.solution && (
                        <div>
                          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Proposed Solution</h3>
                          <p className="text-sm text-gray-700">{sub.solution}</p>
                        </div>
                      )}
                      <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tech Stack</h3>
                        <div className="flex flex-wrap gap-2">
                          {sub.techStack?.map((tech) => (
                            <span key={tech} className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-lg border border-indigo-100 font-semibold">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Project Links</h3>
                        <div className="flex flex-wrap gap-3 text-sm font-semibold">
                          {sub.githubRepo && <a href={sub.githubRepo} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">🔗 GitHub Repo</a>}
                          {sub.demoVideo && <a href={sub.demoVideo} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">🎥 Demo Video</a>}
                          {sub.liveUrl && <a href={sub.liveUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">🌐 Live Website</a>}
                          {sub.pitchDeck && <a href={sub.pitchDeck} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">📊 Pitch Deck</a>}
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Evaluation Scores</h3>
                        <div className="flex gap-3 flex-wrap">
                          <ScoreBadge label="Plagiarism" value={sub.plagiarismScore} />
                          <ScoreBadge label="Innovation" value={sub.innovationScore} />
                          <ScoreBadge label="Technical" value={sub.technicalScore} />
                          <ScoreBadge label="Impact" value={sub.impactScore} />
                          <div className="flex flex-col items-center bg-indigo-600 text-white rounded-lg p-2 min-w-[70px] shadow-sm">
                            <span className="text-xs opacity-80">Total</span>
                            <span className="text-lg font-extrabold">{sub.score}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Submitted Date</h3>
                        <p className="text-sm text-gray-600 font-mono">{new Date(sub.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="pt-2">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Update Status</h3>
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => updateStatus(sub._id, "approved")}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateStatus(sub._id, "shortlisted")}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 transition"
                          >
                            Shortlist
                          </button>
                          <button
                            onClick={() => updateStatus(sub._id, "winner")}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 transition"
                          >
                            🏆 Set Winner
                          </button>
                          <button
                            onClick={() => updateStatus(sub._id, "rejected")}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredSubmissions.length === 0 && (
          <div className="text-center py-16 text-gray-400 font-medium">No submissions found matching this status.</div>
        )}
      </div>
    </div>
  );
}
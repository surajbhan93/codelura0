"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";

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
    submitted: "bg-blue-100 text-blue-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    pending: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
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

  // Per-submission AI state
  const [aiScores, setAiScores] = useState<Record<string, AIScores>>({});
  const [aiRunning, setAiRunning] = useState<Record<string, boolean>>({});
  const [aiSaving, setAiSaving] = useState<Record<string, boolean>>({});
  const [aiSaved, setAiSaved] = useState<Record<string, boolean>>({});
  const [aiError, setAiError] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!hackathonId) return;
    const fetchSubmissions = async () => {
      try {
        const res = await api.get(`/admin/hackathons/${hackathonId}/submissions`);
        setSubmissions(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [hackathonId]);

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
      // Run all 3 AI APIs in parallel
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
      // ⚠️ Apne save endpoint ke hisaab se change karo
      await api.patch(`/admin/submissions/${sub._id}/scores`, {
        plagiarismScore: scores.plagiarismScore,
        classificationLevel: scores.classificationLevel,
        judgeRuleScore: scores.judgeRuleScore,
        judgeFinalScore: scores.judgeFinalScore,
        judgeRemarks: scores.judgeRemarks,
        aiJudgingRequired: scores.aiJudgingRequired,
      });
      setAiSaved((prev) => ({ ...prev, [sub._id]: true }));
    } catch (err) {
      console.error(err);
      setAiError((prev) => ({ ...prev, [sub._id]: "Failed to save scores." }));
    }
    setAiSaving((prev) => ({ ...prev, [sub._id]: false }));
  };

  if (loading) {
    return <div className="p-10 text-center text-lg">Loading submissions...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Hackathon Submissions</h1>
      <p className="text-gray-500 mb-6 text-sm">{submissions.length} submission(s) found</p>

      <div className="space-y-4">
        {submissions.map((sub) => {
          const ai = aiScores[sub._id];
          const isRunning = aiRunning[sub._id];
          const isSaving = aiSaving[sub._id];
          const isSaved = aiSaved[sub._id];
          const error = aiError[sub._id];

          return (
            <div key={sub._id} className="border rounded-xl shadow-sm bg-white overflow-hidden">

              {/* Header Row */}
              <div
                className="flex flex-wrap items-center justify-between gap-3 p-4 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => setExpanded(expanded === sub._id ? null : sub._id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                    {sub.user?.name?.[0] ?? "?"}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{sub.projectTitle}</div>
                    <div className="text-sm text-gray-500">{sub.user?.name} · {sub.user?.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    {sub.hackathon?.title}
                  </span>
                  <StatusBadge status={sub.status} />
                  <span className="text-sm font-bold text-indigo-600">Total: {sub.score}</span>
                  {ai?.aiProcessed && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                      ✨ AI Done
                    </span>
                  )}
                  <span className="text-gray-400 text-xs">{expanded === sub._id ? "▲ Collapse" : "▼ Expand"}</span>
                </div>
              </div>

              {/* Expanded Detail */}
              {expanded === sub._id && (
                <div className="border-t bg-gray-50">

                  {/* AI Tools Bar */}
                  <div className="px-5 pt-4 pb-3 border-b bg-white flex flex-wrap items-center gap-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase">AI Tools</span>

                    <button
                      onClick={(e) => { e.stopPropagation(); runAllAI(sub); }}
                      disabled={isRunning}
                      className="flex items-center gap-2 text-sm px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-medium transition"
                    >
                      {isRunning ? (
                        <>
                          <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                          </svg>
                          Running AI...
                        </>
                      ) : (
                        <>{ai?.aiProcessed ? "🔄 Re-run All AI" : "✨ Run All AI"}</>
                      )}
                    </button>

                    {ai?.aiProcessed && !isSaved && (
                      <button
                        onClick={(e) => { e.stopPropagation(); saveAIScores(sub); }}
                        disabled={isSaving}
                        className="flex items-center gap-2 text-sm px-4 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-medium transition"
                      >
                        {isSaving ? "Saving..." : "💾 Save AI Scores"}
                      </button>
                    )}

                    {isSaved && (
                      <span className="text-xs text-green-600 font-semibold bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                        ✅ Scores Saved
                      </span>
                    )}

                    {error && (
                      <span className="text-xs text-red-600 font-medium">{error}</span>
                    )}
                  </div>

                  {/* AI Results Panel */}
                  {ai?.aiProcessed && (
                    <div className="px-5 py-4 border-b grid grid-cols-1 sm:grid-cols-3 gap-4">

                      {/* Classifier */}
                      <div className="bg-white rounded-lg border p-4 space-y-2">
                        <div className="text-xs font-semibold text-gray-400 uppercase">🤖 Classifier</div>
                        {ai.qualityLevel && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Quality</span>
                            <LevelBadge level={ai.qualityLevel} />
                          </div>
                        )}
                        {ai.aiJudgingRequired !== undefined && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">AI Judge Needed</span>
                            <span className={`text-xs font-semibold ${ai.aiJudgingRequired ? "text-orange-600" : "text-green-600"}`}>
                              {ai.aiJudgingRequired ? "Yes" : "No"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Plagiarism */}
                      <div className="bg-white rounded-lg border p-4 space-y-2">
                        <div className="text-xs font-semibold text-gray-400 uppercase">🔍 Plagiarism</div>
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
                      <div className="bg-white rounded-lg border p-4 space-y-2">
                        <div className="text-xs font-semibold text-gray-400 uppercase">⚖️ Judge</div>
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
                          <p className="text-xs text-gray-500 italic border-t pt-2 mt-1 line-clamp-2">{ai.judgeRemarks}</p>
                        )}
                      </div>

                    </div>
                  )}

                  {/* Original Detail Grid */}
                  <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase mb-1">Project Description</h3>
                        <p className="text-sm text-gray-700">{sub.projectDescription || "—"}</p>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase mb-1">Tech Stack</h3>
                        <div className="flex flex-wrap gap-2">
                          {sub.techStack?.map((tech) => (
                            <span key={tech} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full border border-indigo-100">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase mb-1">Links</h3>
                        <div className="flex flex-wrap gap-3 text-sm">
                          {sub.githubRepo && <a href={sub.githubRepo} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">🔗 GitHub</a>}
                          {sub.demoVideo && <a href={sub.demoVideo} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">🎥 Demo</a>}
                          {sub.liveUrl && <a href={sub.liveUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">🌐 Live</a>}
                          {sub.pitchDeck && <a href={sub.pitchDeck} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">📊 Pitch</a>}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase mb-1">Submitted</h3>
                        <p className="text-sm text-gray-600">{new Date(sub.createdAt).toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Existing Scores</h3>
                        <div className="flex gap-3 flex-wrap">
                          <ScoreBadge label="Plagiarism" value={sub.plagiarismScore} />
                          <ScoreBadge label="Innovation" value={sub.innovationScore} />
                          <ScoreBadge label="Technical" value={sub.technicalScore} />
                          <ScoreBadge label="Impact" value={sub.impactScore} />
                          <div className="flex flex-col items-center bg-indigo-600 text-white rounded p-2 min-w-[70px]">
                            <span className="text-xs opacity-80">Total</span>
                            <span className="text-lg font-bold">{sub.score}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase mb-1">Submission ID</h3>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 break-all">{sub._id}</code>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase mb-1">User ID</h3>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 break-all">{sub.user?._id}</code>
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase mb-1">Hackathon ID</h3>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 break-all">{sub.hackathon?._id}</code>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          );
        })}

        {submissions.length === 0 && (
          <div className="text-center py-16 text-gray-400">No submissions found.</div>
        )}
      </div>
    </div>
  );
}
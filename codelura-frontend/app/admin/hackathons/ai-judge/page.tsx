// "use client";

// import { useState } from "react";
// import api from "@/lib/api";

// type JudgeResult = {
//   rule_score: number;
//   final_score: number;
//   evaluation_type: string;
//   remarks: string;
// };

// export default function AIJudgePage() {

//   const [form, setForm] = useState({
//     submissionId: "",
//     hackathonId: "",
//     projectTitle: "",
//     projectDescription: "",
//     techStack: "",
//     githubRepo: ""
//   });

//   const [result, setResult] = useState<JudgeResult | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {

//     setForm({
//       ...form,
//       [e.target.name]: e.target.value
//     });

//   };

//   const handleSubmit = async () => {

//     setLoading(true);

//     try {

//       const res = await api.post(
//         "/api/hackathons/ai/judge",
//         {
//           ...form,
//           techStack: form.techStack.split(",").map((t) => t.trim())
//         }
//       );

//       setResult(res.data);

//     } catch (error) {

//       console.error("Judge API Error:", error);
//       alert("API Error");

//     }

//     setLoading(false);

//   };

//   return (

//     <div className="min-h-screen bg-gray-100 p-10">

//       <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">

//         <h1 className="text-2xl font-bold mb-6">
//           AI Project Judge
//         </h1>

//         <div className="space-y-4">

//           <input
//             name="submissionId"
//             placeholder="Submission ID"
//             className="w-full border p-3 rounded"
//             onChange={handleChange}
//           />

//           <input
//             name="hackathonId"
//             placeholder="Hackathon ID"
//             className="w-full border p-3 rounded"
//             onChange={handleChange}
//           />

//           <input
//             name="projectTitle"
//             placeholder="Project Title"
//             className="w-full border p-3 rounded"
//             onChange={handleChange}
//           />

//           <textarea
//             name="projectDescription"
//             placeholder="Project Description"
//             className="w-full border p-3 rounded"
//             onChange={handleChange}
//           />

//           <input
//             name="techStack"
//             placeholder="Tech Stack (React,Node,AI)"
//             className="w-full border p-3 rounded"
//             onChange={handleChange}
//           />

//           <input
//             name="githubRepo"
//             placeholder="GitHub Repo"
//             className="w-full border p-3 rounded"
//             onChange={handleChange}
//           />

//           <button
//             onClick={handleSubmit}
//             className="w-full bg-black text-white p-3 rounded"
//           >
//             {loading ? "Judging..." : "Run AI Judge"}
//           </button>

//         </div>

//         {result && (

//           <div className="mt-8 bg-gray-50 p-6 rounded">

//             <h2 className="text-xl font-semibold mb-4">
//               Judge Result
//             </h2>

//             <p>
//               <strong>Rule Score:</strong> {result.rule_score}
//             </p>

//             <p>
//               <strong>Final Score:</strong> {result.final_score}
//             </p>

//             <p>
//               <strong>Evaluation Type:</strong> {result.evaluation_type}
//             </p>

//             <p>
//               <strong>Remarks:</strong> {result.remarks}
//             </p>

//           </div>

//         )}

//       </div>

//     </div>

//   );
// }


"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

type Submission = {
  _id: string;
  projectTitle: string;
  projectDescription: string;
  techStack: string[];
  githubRepo: string;
  user?: { name: string; email: string };
  hackathon?: { _id: string; title: string };
};

type JudgeResult = {
  rule_score: number;
  final_score: number;
  evaluation_type: string;
  remarks: string;
};

function ScoreCircle({ label, value, max = 100, color }: { label: string; value: number; max?: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#e5e7eb" strokeWidth="6" />
        <circle
          cx="36" cy="36" r={r} fill="none"
          stroke={color} strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
        <text x="36" y="40" textAnchor="middle" fontSize="13" fontWeight="700" fill="#111">{value}</text>
      </svg>
      <span className="text-xs text-gray-500 font-medium">{label}</span>
    </div>
  );
}

export default function AIJudgePage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [fetchingSubmissions, setFetchingSubmissions] = useState(true);
  const [autoFilled, setAutoFilled] = useState(false);

  const [form, setForm] = useState({
    submissionId: "",
    hackathonId: "",
    projectTitle: "",
    projectDescription: "",
    techStack: "",
    githubRepo: "",
  });

  const [result, setResult] = useState<JudgeResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        // ⚠️ Apne endpoint ke hisaab se change karo
        const res = await api.get("/admin/submissions");
        setSubmissions(res.data.data);
      } catch (err) {
        console.error("Failed to load submissions", err);
      } finally {
        setFetchingSubmissions(false);
      }
    };
    loadSubmissions();
  }, []);

  const handleSelectSubmission = (id: string) => {
    setSelectedId(id);
    setResult(null);
    setAutoFilled(false);

    const sub = submissions.find((s) => s._id === id);
    if (!sub) return;

    setForm({
      submissionId: sub._id,
      hackathonId: sub.hackathon?._id ?? "",
      projectTitle: sub.projectTitle ?? "",
      projectDescription: sub.projectDescription ?? "",
      techStack: Array.isArray(sub.techStack) ? sub.techStack.join(", ") : "",
      githubRepo: sub.githubRepo ?? "",
    });

    setAutoFilled(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await api.post("/hackathons/ai/judge", {
        ...form,
        techStack: form.techStack.split(",").map((t) => t.trim()),
      });
      setResult(res.data);
    } catch (error) {
      console.error("Judge API Error:", error);
      alert("API Error");
    }
    setLoading(false);
  };

  const selectedSub = submissions.find((s) => s._id === selectedId);

  // Determine verdict color
  const verdictColor =
    result
      ? result.final_score >= 75
        ? { bg: "bg-green-50 border-green-200", text: "text-green-700", accent: "#22c55e" }
        : result.final_score >= 40
        ? { bg: "bg-yellow-50 border-yellow-200", text: "text-yellow-700", accent: "#eab308" }
        : { bg: "bg-red-50 border-red-200", text: "text-red-700", accent: "#ef4444" }
      : null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Project Judge</h1>
          <p className="text-sm text-gray-500 mt-1">
            Select a submission to auto-fill, then run AI judging
          </p>
        </div>

        {/* Step 1 */}
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center font-bold">1</span>
            <h2 className="font-semibold text-gray-800">Select Submission</h2>
          </div>

          {fetchingSubmissions ? (
            <div className="text-sm text-gray-400 animate-pulse">Loading submissions...</div>
          ) : (
            <select
              className="w-full border rounded-lg p-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-300"
              value={selectedId}
              onChange={(e) => handleSelectSubmission(e.target.value)}
            >
              <option value="">— Choose a submission —</option>
              {submissions.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.projectTitle} · {sub.user?.name ?? "Unknown"} ({sub.hackathon?.title ?? "N/A"})
                </option>
              ))}
            </select>
          )}

          {selectedSub && (
            <div className="mt-3 flex items-center gap-3 p-3 bg-violet-50 rounded-lg border border-violet-100">
              <div className="w-8 h-8 rounded-full bg-violet-200 text-violet-700 font-bold text-sm flex items-center justify-center">
                {selectedSub.user?.name?.[0] ?? "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">{selectedSub.projectTitle}</div>
                <div className="text-xs text-gray-500">{selectedSub.user?.email} · {selectedSub.hackathon?.title}</div>
              </div>
              {autoFilled && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium whitespace-nowrap">
                  ✓ Auto-filled
                </span>
              )}
            </div>
          )}
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center font-bold">2</span>
            <h2 className="font-semibold text-gray-800">Review & Edit Fields</h2>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                name="submissionId"
                value={form.submissionId}
                placeholder="Submission ID"
                className="border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 bg-gray-50"
                onChange={handleChange}
              />
              <input
                name="hackathonId"
                value={form.hackathonId}
                placeholder="Hackathon ID"
                className="border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 bg-gray-50"
                onChange={handleChange}
              />
            </div>
            <input
              name="projectTitle"
              value={form.projectTitle}
              placeholder="Project Title"
              className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
              onChange={handleChange}
            />
            <textarea
              name="projectDescription"
              value={form.projectDescription}
              placeholder="Project Description"
              rows={3}
              className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
              onChange={handleChange}
            />
            <input
              name="techStack"
              value={form.techStack}
              placeholder="Tech Stack (React, Node, AI)"
              className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
              onChange={handleChange}
            />
            <input
              name="githubRepo"
              value={form.githubRepo}
              placeholder="GitHub Repo URL"
              className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center font-bold">3</span>
            <h2 className="font-semibold text-gray-800">Run AI Judge</h2>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !form.projectTitle}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold p-3 rounded-lg transition text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Judging...
              </span>
            ) : (
              "Run AI Judge"
            )}
          </button>

          {/* Result */}
          {result && verdictColor && (
            <div className="mt-5 space-y-3">

              {/* Score Circles */}
              <div className={`p-5 rounded-lg border ${verdictColor.bg}`}>
                <div className="flex justify-around">
                  <ScoreCircle label="Rule Score" value={result.rule_score} color="#8b5cf6" />
                  <ScoreCircle label="Final Score" value={result.final_score} color={verdictColor.accent} />
                </div>
              </div>

              {/* Evaluation Type */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 border rounded-lg">
                <span className="text-xs font-semibold text-gray-400 uppercase">Evaluation Type</span>
                <span className={`ml-auto text-sm font-bold px-3 py-1 rounded-full border ${verdictColor.bg} ${verdictColor.text}`}>
                  {result.evaluation_type}
                </span>
              </div>

              {/* Remarks */}
              <div className="p-4 bg-gray-50 border rounded-lg">
                <div className="text-xs font-semibold text-gray-400 uppercase mb-1">Remarks</div>
                <p className="text-sm text-gray-700 leading-relaxed">{result.remarks}</p>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
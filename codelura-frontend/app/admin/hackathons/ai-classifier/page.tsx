// "use client";

// import { useState } from "react";
// import api from "@/lib/api";
// type AIResult = {
//   quality_level: "LOW" | "MEDIUM" | "HIGH";
//   ai_judging_required: boolean;
//   flags: string[];
//   reason: string;
// };
// export default function AIClassifierPage() {

//   const [form, setForm] = useState({
//     submissionId: "",
//     projectTitle: "",
//     projectDescription: "",
//     problemStatement: "",
//     solution: "",
//     techStack: "",
//     githubRepo: "",
//     demoVideo: "",
//     liveUrl: ""
//   });

// const [result, setResult] = useState<AIResult | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async () => {

//     setLoading(true);

//     try {

//       const response = await api.post(
//         "/hackathons/ai/submission-classifier",
//         {
//           ...form,
//           techStack: form.techStack.split(",").map((t) => t.trim())
//         }
//       );

//       setResult(response.data);

//     } catch (error) {
//       console.error("AI API Error:", error);
//       alert("Error calling AI API");
//     }

//     setLoading(false);

//   };

//   return (

//     <div className="min-h-screen bg-gray-100 p-10">

//       <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">

//         <h1 className="text-2xl font-bold mb-6">
//           AI Submission Classifier
//         </h1>

//         <div className="space-y-4">

//           <input
//             name="submissionId"
//             placeholder="Submission ID"
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

//           <textarea
//             name="problemStatement"
//             placeholder="Problem Statement"
//             className="w-full border p-3 rounded"
//             onChange={handleChange}
//           />

//           <textarea
//             name="solution"
//             placeholder="Solution"
//             className="w-full border p-3 rounded"
//             onChange={handleChange}
//           />

//           <input
//             name="techStack"
//             placeholder="Tech Stack (React, Node, AI)"
//             className="w-full border p-3 rounded"
//             onChange={handleChange}
//           />

//           <input
//             name="githubRepo"
//             placeholder="GitHub Repo"
//             className="w-full border p-3 rounded"
//             onChange={handleChange}
//           />

//           <input
//             name="demoVideo"
//             placeholder="Demo Video URL"
//             className="w-full border p-3 rounded"
//             onChange={handleChange}
//           />

//           <input
//             name="liveUrl"
//             placeholder="Live URL"
//             className="w-full border p-3 rounded"
//             onChange={handleChange}
//           />

//           <button
//             onClick={handleSubmit}
//             className="w-full bg-black text-white p-3 rounded"
//           >
//             {loading ? "Processing..." : "Run AI Classification"}
//           </button>

//         </div>

//         {result && (

//           <div className="mt-8 bg-gray-50 p-6 rounded">

//             <h2 className="text-xl font-semibold mb-4">
//               AI Result
//             </h2>

//             <p>
//               <strong>Quality Level:</strong> {result.quality_level}
//             </p>

//             <p>
//               <strong>AI Judging Required:</strong> {result.ai_judging_required ? "Yes" : "No"}
//             </p>

//             <p>
//               <strong>Flags:</strong> {result.flags?.join(", ")}
//             </p>

//             <p>
//               <strong>Reason:</strong> {result.reason}
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
  problemStatement: string;
  solution: string;
  techStack: string[];
  githubRepo: string;
  demoVideo: string;
  liveUrl: string;
  user?: { name: string; email: string };
  hackathon?: { title: string };
  status?: string;
};

type AIResult = {
  quality_level: "LOW" | "MEDIUM" | "HIGH";
  ai_judging_required: boolean;
  flags: string[];
  reason: string;
};

const QUALITY_COLORS = {
  HIGH: "bg-green-100 text-green-700 border-green-200",
  MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200",
  LOW: "bg-red-100 text-red-700 border-red-200",
};

export default function AIClassifierPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState({
    submissionId: "",
    projectTitle: "",
    projectDescription: "",
    problemStatement: "",
    solution: "",
    techStack: "",
    githubRepo: "",
    demoVideo: "",
    liveUrl: "",
  });

  const [result, setResult] = useState<AIResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingSubmissions, setFetchingSubmissions] = useState(true);
  const [autoFilled, setAutoFilled] = useState(false);

  // Load all submissions on mount
  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        // ⚠️ Change this endpoint as per your API
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

  // Auto-fill form when a submission is selected from dropdown
  const handleSelectSubmission = (id: string) => {
    setSelectedId(id);
    setResult(null);
    setAutoFilled(false);

    const sub = submissions.find((s) => s._id === id);
    if (!sub) return;

    setForm({
      submissionId: sub._id,
      projectTitle: sub.projectTitle ?? "",
      projectDescription: sub.projectDescription ?? "",
      problemStatement: sub.problemStatement ?? "",
      solution: sub.solution ?? "",
      techStack: Array.isArray(sub.techStack) ? sub.techStack.join(", ") : "",
      githubRepo: sub.githubRepo ?? "",
      demoVideo: sub.demoVideo ?? "",
      liveUrl: sub.liveUrl ?? "",
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
      const response = await api.post("/hackathons/ai/submission-classifier", {
        ...form,
        techStack: form.techStack.split(",").map((t) => t.trim()),
      });
      setResult(response.data);
    } catch (error) {
      console.error("AI API Error:", error);
      alert("Error calling AI API");
    }
    setLoading(false);
  };

  const selectedSub = submissions.find((s) => s._id === selectedId);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Submission Classifier</h1>
          <p className="text-sm text-gray-500 mt-1">
            Select a submission to auto-fill, then run AI classification
          </p>
        </div>

        {/* Step 1: Select Submission */}
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">1</span>
            <h2 className="font-semibold text-gray-800">Select Submission</h2>
          </div>

          {fetchingSubmissions ? (
            <div className="text-sm text-gray-400 animate-pulse">Loading submissions...</div>
          ) : (
            <select
              className="w-full border rounded-lg p-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
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

          {/* Selected submission preview */}
          {selectedSub && (
            <div className="mt-3 flex items-center gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
              <div className="w-8 h-8 rounded-full bg-indigo-200 text-indigo-700 font-bold text-sm flex items-center justify-center">
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

        {/* Step 2: Review / Edit Fields */}
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">2</span>
            <h2 className="font-semibold text-gray-800">Review & Edit Fields</h2>
          </div>

          <div className="space-y-3">
            <input
              name="submissionId"
              value={form.submissionId}
              placeholder="Submission ID"
              className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-gray-50"
              onChange={handleChange}
            />
            <input
              name="projectTitle"
              value={form.projectTitle}
              placeholder="Project Title"
              className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              onChange={handleChange}
            />
            <textarea
              name="projectDescription"
              value={form.projectDescription}
              placeholder="Project Description"
              rows={3}
              className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              onChange={handleChange}
            />
            <textarea
              name="problemStatement"
              value={form.problemStatement}
              placeholder="Problem Statement"
              rows={3}
              className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              onChange={handleChange}
            />
            <textarea
              name="solution"
              value={form.solution}
              placeholder="Solution"
              rows={3}
              className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              onChange={handleChange}
            />
            <input
              name="techStack"
              value={form.techStack}
              placeholder="Tech Stack (React, Node, AI)"
              className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              onChange={handleChange}
            />
            <input
              name="githubRepo"
              value={form.githubRepo}
              placeholder="GitHub Repo URL"
              className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              onChange={handleChange}
            />
            <input
              name="demoVideo"
              value={form.demoVideo}
              placeholder="Demo Video URL"
              className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              onChange={handleChange}
            />
            <input
              name="liveUrl"
              value={form.liveUrl}
              placeholder="Live URL"
              className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Step 3: Run Classification */}
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">3</span>
            <h2 className="font-semibold text-gray-800">Run AI Classification</h2>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !form.projectTitle}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold p-3 rounded-lg transition text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Processing...
              </span>
            ) : (
              "Run AI Classification"
            )}
          </button>

          {/* Result */}
          {result && (
            <div className="mt-5 space-y-3">
              <div className={`flex items-center justify-between p-4 rounded-lg border ${QUALITY_COLORS[result.quality_level]}`}>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide opacity-60">Quality Level</div>
                  <div className="text-2xl font-bold">{result.quality_level}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold uppercase tracking-wide opacity-60">AI Judging Required</div>
                  <div className="text-lg font-bold">{result.ai_judging_required ? "✅ Yes" : "❌ No"}</div>
                </div>
              </div>

              {result.flags?.length > 0 && (
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
                  <div className="text-xs font-semibold text-orange-600 uppercase mb-2">🚩 Flags</div>
                  <div className="flex flex-wrap gap-2">
                    {result.flags.map((flag, i) => (
                      <span key={i} className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full border border-orange-200">
                        {flag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 bg-gray-50 border rounded-lg">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Reason</div>
                <p className="text-sm text-gray-700 leading-relaxed">{result.reason}</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
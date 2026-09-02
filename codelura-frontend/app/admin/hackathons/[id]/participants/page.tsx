"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";
import { Users, ArrowLeft, Download, ShieldCheck, Mail, Calendar, Search } from "lucide-react";

interface Participant {
  _id: string;
  name: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  joinedAt: string;
  submissionStatus: string;
  projectTitle?: string;
}

export default function AdminHackathonParticipantsPage() {
  const params = useParams();
  const hackathonId = params.id as string;

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [hackathonTitle, setHackathonTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!hackathonId) return;

    const fetchParticipants = async () => {
      try {
        const res = await api.get(`/admin/hackathons/${hackathonId}/participants`).catch(async () => {
          // Fallback to fetching hackathon object directly
          return await api.get(`/hackathons/${hackathonId}`);
        });

        if (res.data?.success || res.data) {
          const list = res.data.data?.participants || res.data.data || res.data.participants || [];
          setHackathonTitle(res.data.hackathonTitle || res.data.title || "Hackathon Event");

          setParticipants(
            list.map((p: any) => ({
              _id: p._id || p.id,
              name: p.name || "Participant",
              email: p.email || "No email",
              role: p.role || "Student",
              isEmailVerified: p.isEmailVerified || false,
              joinedAt: p.joinedAt || p.createdAt || Date.now(),
              submissionStatus: p.submissionStatus || "Registered",
              projectTitle: p.projectTitle || null,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching participants", err);
        toast.error("Failed to load participants list");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [hackathonId]);

  // Export CSV
  const exportToCSV = () => {
    if (participants.length === 0) {
      toast.error("No participants to export.");
      return;
    }

    const headers = ["Name", "Email", "Role", "Submission Status", "Project Title", "Joined Date"];
    const rows = participants.map((p) => [
      `"${p.name}"`,
      `"${p.email}"`,
      `"${p.role}"`,
      `"${p.submissionStatus}"`,
      `"${p.projectTitle || "N/A"}"`,
      `"${new Date(p.joinedAt).toLocaleDateString()}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `participants_${hackathonId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Participants list exported to CSV!");
  };

  const filtered = participants.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      (p.projectTitle && p.projectTitle.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
        <p className="text-slate-400 text-xs font-semibold">Loading participants list...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Back Link */}
        <Link href="/admin/hackathons" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to All Hackathons
        </Link>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Users className="w-7 h-7 text-violet-400" /> Registered Participants
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Event: <span className="text-slate-200 font-bold">{hackathonTitle}</span> · Total Registered: {participants.length}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={exportToCSV}
              className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition shadow-lg shadow-violet-600/30 flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export CSV Data
            </button>
            <Link
              href={`/admin/hackathons/${hackathonId}/submissions`}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
            >
              📥 View Project Submissions
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search participants by name, email, or project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-100 outline-none focus:border-violet-500 transition"
          />
        </div>

        {/* Participants Table Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-2">
              <Users className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-base font-semibold text-slate-300">No registered participants found</p>
              <p className="text-xs text-slate-500">Participants who join this hackathon will appear here in real-time.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Participant Name</th>
                    <th className="py-3.5 px-4">Email Contact</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Submission Status</th>
                    <th className="py-3.5 px-4">Project</th>
                    <th className="py-3.5 px-4 text-right">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filtered.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-800/50 transition">
                      <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-violet-600/20 text-violet-300 font-bold flex items-center justify-center text-xs border border-violet-500/30">
                          {p.name[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <span>{p.name}</span>
                          {p.isEmailVerified && (
                            <span className="text-[10px] text-emerald-400 ml-1.5 font-semibold">✓ Verified</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono text-slate-400">{p.email}</td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 capitalize">
                          {p.role}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          p.submissionStatus === "No Submission"
                            ? "bg-slate-800 text-slate-400 border border-slate-700"
                            : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        }`}>
                          {p.submissionStatus}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-medium text-slate-200">
                        {p.projectTitle || "—"}
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-slate-500">
                        {new Date(p.joinedAt).toLocaleDateString()}
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

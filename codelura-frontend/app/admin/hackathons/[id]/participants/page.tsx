"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";
import { Users, ArrowLeft, Download, Search, Phone, Mail, Sparkles, Layers } from "lucide-react";

interface Participant {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  teamName: string;
  track: string;
  projectIdea: string;
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
              mobile: p.mobile || p.phone || "—",
              teamName: p.teamName || "Solo Innovator",
              track: p.track || "General",
              projectIdea: p.projectIdea || "—",
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

    const headers = ["Name", "Team Name", "Track", "Mobile", "Email", "Role", "Project Idea", "Submission Status", "Project Title", "Joined Date"];
    const rows = participants.map((p) => [
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.teamName.replace(/"/g, '""')}"`,
      `"${p.track.replace(/"/g, '""')}"`,
      `"${p.mobile.replace(/"/g, '""')}"`,
      `"${p.email.replace(/"/g, '""')}"`,
      `"${p.role.replace(/"/g, '""')}"`,
      `"${p.projectIdea.replace(/"/g, '""')}"`,
      `"${p.submissionStatus.replace(/"/g, '""')}"`,
      `"${(p.projectTitle || "N/A").replace(/"/g, '""')}"`,
      `"${new Date(p.joinedAt).toLocaleDateString()}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hackathon_participants_${hackathonId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Participants list exported to CSV!");
  };

  const filtered = participants.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.mobile.toLowerCase().includes(search.toLowerCase()) ||
      p.teamName.toLowerCase().includes(search.toLowerCase()) ||
      p.track.toLowerCase().includes(search.toLowerCase()) ||
      p.projectIdea.toLowerCase().includes(search.toLowerCase()) ||
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
      <div className="max-w-7xl mx-auto space-y-6">

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
            placeholder="Search by participant name, team, track, mobile, email, or project idea..."
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
                    <th className="py-3.5 px-4">Team Name</th>
                    <th className="py-3.5 px-4">Track</th>
                    <th className="py-3.5 px-4">Contact Info</th>
                    <th className="py-3.5 px-4">Project Idea / Proposal</th>
                    <th className="py-3.5 px-4">Submission Status</th>
                    <th className="py-3.5 px-4 text-right">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filtered.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-800/50 transition">
                      {/* Name & Role */}
                      <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-violet-600/20 text-violet-300 font-bold flex items-center justify-center text-xs border border-violet-500/30 shrink-0">
                          {p.name[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span>{p.name}</span>
                            {p.isEmailVerified && (
                              <span className="text-[10px] text-emerald-400 font-semibold">✓</span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 font-normal capitalize">{p.role}</span>
                        </div>
                      </td>

                      {/* Team Name */}
                      <td className="py-4 px-4 font-semibold text-slate-200">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/80 text-violet-300 text-[11px] inline-flex items-center gap-1">
                          <Users className="w-3 h-3 text-violet-400" />
                          {p.teamName}
                        </span>
                      </td>

                      {/* Track */}
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium text-[11px] inline-flex items-center gap-1">
                          <Layers className="w-3 h-3 text-indigo-400" />
                          {p.track}
                        </span>
                      </td>

                      {/* Contact Info (Mobile & Email) */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
                            <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                            {p.mobile}
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                            <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                            {p.email}
                          </div>
                        </div>
                      </td>

                      {/* Project Idea / Proposal */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="text-slate-300 line-clamp-2 text-[11px]" title={p.projectIdea}>
                          {p.projectIdea}
                        </div>
                        {p.projectTitle && (
                          <div className="mt-1 text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Submitted: {p.projectTitle}
                          </div>
                        )}
                      </td>

                      {/* Submission Status */}
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          p.submissionStatus === "No Submission" || p.submissionStatus === "Registered"
                            ? "bg-slate-800 text-slate-400 border border-slate-700"
                            : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        }`}>
                          {p.submissionStatus}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="py-4 px-4 text-right font-mono text-slate-400">
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

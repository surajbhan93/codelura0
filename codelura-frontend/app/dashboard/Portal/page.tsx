"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  GraduationCap,
  Flame,
  Wallet,
  CheckCircle2,
  Clock,
  ExternalLink,
  Send,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Code,
  FileText,
  Activity,
  ArrowUpRight,
  Briefcase,
  Zap,
  Layers,
  ChevronRight,
  Crown,
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: "hackathon" | "enrollment" | "submission" | "enquiry" | "campus";
  title: string;
  subtitle: string;
  status?: string;
  date: string;
  link?: string;
  badgeColor?: string;
  icon: any;
}

export default function DashboardPortalPage() {
  const [user, setUser] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [campusStats, setCampusStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "hackathons" | "learning" | "enquiries">("all");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch User profile
        const userRes = await api.get("/auth/me").catch(() => null);
        if (userRes?.data?.user) {
          setUser(userRes.data.user);
        }

        // Fetch Enrollments
        const enrollRes = await api.get("/enrollments/my-enrollments").catch(() => null);
        if (enrollRes?.data?.success) {
          setEnrollments(enrollRes.data.data || []);
        }

        // Fetch My Participations / Registered Hackathons
        const hackathonRes = await api.get("/participation/my-participations").catch(async () => {
          return await api.get("/hackathons").catch(() => null);
        });
        if (hackathonRes?.data?.data) {
          setHackathons(Array.isArray(hackathonRes.data.data) ? hackathonRes.data.data : []);
        }

        // Fetch My Submissions
        const subRes = await api.get("/participation/my-submissions").catch(() => null);
        if (subRes?.data?.data) {
          setSubmissions(Array.isArray(subRes.data.data) ? subRes.data.data : []);
        }

        // Fetch My Enquiries
        const enquiryRes = await api.get("/enquiries/my-enquiries").catch(() => null);
        if (enquiryRes?.data?.data) {
          setEnquiries(Array.isArray(enquiryRes.data.data) ? enquiryRes.data.data : []);
        }

        // Fetch Campus Program profile if participant
        const campusRes = await api.get("/campus/profile").catch(() => null);
        if (campusRes?.data?.isParticipant) {
          setCampusStats(campusRes.data.participant);
        }
      } catch (err) {
        console.error("Error loading user portal activity", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070814] text-white flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
        <p className="text-slate-400 text-xs sm:text-sm font-medium">Loading your portal dashboard...</p>
      </div>
    );
  }

  const initials =
    user?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  // Build unified chronological activity feed items
  const activityList: ActivityItem[] = [];

  // Add Enrollments to activity
  enrollments.forEach((e) => {
    activityList.push({
      id: `enr-${e._id}`,
      type: "enrollment",
      title: e.itemTitle || e.itemRef?.title || e.itemRef?.name || "Program Enrollment",
      subtitle: e.itemType === "CareerTrack" ? "Career Track Program" : "Course Track",
      status: "Active Learning",
      date: new Date(e.createdAt || Date.now()).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      link:
        e.itemType === "CareerTrack"
          ? `/career/learning/career-tracks/${e.itemRef?.slug || ""}`
          : `/career/learning/programs/${e.itemRef?.slug || ""}`,
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      icon: GraduationCap,
    });
  });

  // Add Hackathons to activity
  hackathons.forEach((h) => {
    const slugOrId = h.slug || h.hackathon?.slug || h._id || h.id || h.hackathon?._id;
    activityList.push({
      id: `hack-${h._id || h.id}`,
      type: "hackathon",
      title: h.title || h.hackathon?.title || "Hackathon Event",
      subtitle: `Registered · Team: ${h.teamName || "Participant"}`,
      status: h.status || "Registered",
      date: h.createdAt
        ? new Date(h.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
        : "Recent",
      link: `/hackathons/${slugOrId}`,
      badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      icon: Trophy,
    });
  });

  // Add Submissions to activity
  submissions.forEach((s) => {
    activityList.push({
      id: `sub-${s._id}`,
      type: "submission",
      title: `Submitted Project: ${s.projectTitle}`,
      subtitle: s.hackathon?.title ? `Hackathon: ${s.hackathon.title}` : "Project Submission",
      status: s.status?.toUpperCase() || "SUBMITTED",
      date: new Date(s.createdAt || Date.now()).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      link: `/hackathons/${s.hackathon?._id || s.hackathon}/submission`,
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      icon: Code,
    });
  });

  // Add Enquiries to activity
  enquiries.forEach((q) => {
    activityList.push({
      id: `enq-${q._id}`,
      type: "enquiry",
      title: `Service Enquiry: ${q.serviceName || q.subject || "Contact Request"}`,
      subtitle: q.message ? `"${q.message.slice(0, 50)}..."` : "Inquiry submitted",
      status: q.status || "Received",
      date: new Date(q.createdAt || Date.now()).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      link: `/contact`,
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      icon: Send,
    });
  });

  const stats = [
    {
      label: "Wallet Balance",
      value: `₹${user?.walletBalance || 0}`,
      icon: Wallet,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      sub: "Available balance",
    },
    {
      label: "Role & Account",
      value: user?.role === "admin" ? "Admin" : "Student Member",
      icon: GraduationCap,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/20",
      sub: user?.isEmailVerified ? "Verified User" : "Account Active",
    },
    {
      label: "Programs Enrolled",
      value: `${enrollments.length} Active`,
      icon: BookOpen,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
      sub: "Courses & Tracks",
    },
    {
      label: "Learning Streak",
      value: user?.streak ? `${user.streak}d 🔥` : "1d 🔥",
      icon: Flame,
      color: "text-orange-400",
      bg: "bg-orange-500/10 border-orange-500/20",
      sub: "Active consistency",
    },
  ];

  const filteredActivity = activityList.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "hackathons") return item.type === "hackathon" || item.type === "submission";
    if (activeTab === "learning") return item.type === "enrollment";
    if (activeTab === "enquiries") return item.type === "enquiry";
    return true;
  });

  return (
    <div className="relative min-h-screen bg-[#070814] text-white p-4 sm:p-6 lg:p-8 font-sans overflow-hidden">
      {/* ── AMBIENT AURORA BLUR GLOWS ── */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-violet-600/15 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute top-1/3 -right-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[140px]" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* ── PROFILE HERO HEADER CARD ── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121428] via-[#0E1022] to-[#070814] border border-white/[0.09] p-6 sm:p-8 shadow-2xl">
          {/* Subtle Accent Glow Ring */}
          <div className="pointer-events-none absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Avatar with Ring */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 flex items-center justify-center text-2xl sm:text-3xl font-black text-white shadow-xl shadow-violet-600/30 ring-4 ring-white/10">
                  {initials}
                </div>
                {user?.isEmailVerified && (
                  <span className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-1 border-2 border-[#070814] shadow-md">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              {/* Identity & Status */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {user?.name || "Student"}
                  </h1>
                  {user?.isEmailVerified && (
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  )}
                  <span className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30 uppercase">
                    {user?.role || "User"}
                  </span>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm">{user?.email || "student@codelura.com"}</p>
              </div>
            </div>

            {/* Quick Action Hub */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <Link
                href="/hackathons"
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-violet-600/30 hover:scale-[1.02]"
              >
                <Trophy className="w-4 h-4" /> Explore Hackathons
              </Link>
              <Link
                href="/dashboard/campus"
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-950/50 hover:bg-purple-900/60 text-purple-200 text-xs font-bold border border-purple-500/30 transition hover:scale-[1.02]"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Campus Program
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition"
              >
                Edit Profile
              </Link>
            </div>
          </div>

          {/* ── 4 STAT CARDS ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-8 pt-6 border-t border-white/[0.08]">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="rounded-2xl p-4 bg-white/[0.02] border border-white/[0.06] backdrop-blur-md transition hover:border-violet-500/40 hover:bg-white/[0.04]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-slate-400 font-semibold">{s.label}</span>
                    <div className={`p-1.5 rounded-lg ${s.bg}`}>
                      <Icon className={`w-4 h-4 ${s.color}`} />
                    </div>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-white tracking-tight">{s.value}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{s.sub}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── QUICK LAUNCHPAD CARDS (4 CHANNELS) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/hackathons"
            className="group rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#101224] to-[#0A0C18] p-5 transition hover:border-violet-500/40 hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-600/10"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:scale-110 transition">
                <Trophy size={18} />
              </div>
              <ArrowUpRight size={16} className="text-slate-500 group-hover:text-white transition" />
            </div>
            <h3 className="text-sm font-bold text-white">Hackathons &amp; Challenges</h3>
            <p className="text-xs text-slate-400 mt-1">
              Participate in live coding hackathons, build innovative projects &amp; win cash prizes.
            </p>
          </Link>

          <Link
            href="/dashboard/campus"
            className="group rounded-2xl border border-purple-500/20 bg-gradient-to-br from-[#140F28] to-[#0A0C18] p-5 transition hover:border-purple-500/50 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-600/10"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 group-hover:scale-110 transition">
                <GraduationCap size={18} />
              </div>
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-yellow-300 border border-purple-500/40">
                10% Comm.
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">Campus Ambassador</h3>
            <p className="text-xs text-slate-400 mt-1">
              Earn 10% course commissions, ₹1-2 job sharing rewards, and climb college leaderboards.
            </p>
          </Link>

          <Link
            href="/career/learning/career-tracks"
            className="group rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#101224] to-[#0A0C18] p-5 transition hover:border-indigo-500/40 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-600/10"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition">
                <BookOpen size={18} />
              </div>
              <ArrowUpRight size={16} className="text-slate-500 group-hover:text-white transition" />
            </div>
            <h3 className="text-sm font-bold text-white">Career Tracks</h3>
            <p className="text-xs text-slate-400 mt-1">
              Structured roadmaps in Fullstack, AI, Backend &amp; Cloud to level up your engineering career.
            </p>
          </Link>

          <Link
            href="/dashboard/material"
            className="group rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#101224] to-[#0A0C18] p-5 transition hover:border-cyan-500/40 hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-600/10"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                <FileText size={18} />
              </div>
              <ArrowUpRight size={16} className="text-slate-500 group-hover:text-white transition" />
            </div>
            <h3 className="text-sm font-bold text-white">Study Material &amp; Notes</h3>
            <p className="text-xs text-slate-400 mt-1">
              Access curated DSA cheatsheets, interview preparation guides, and resume templates.
            </p>
          </Link>
        </div>

        {/* ── ACTIVITY TIMELINE SECTION ── */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Activity className="text-violet-400" size={18} />
              Recent User Activity Timeline
            </h2>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.08] p-1 rounded-2xl overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab("all")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === "all"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All Activity ({activityList.length})
              </button>
              <button
                onClick={() => setActiveTab("hackathons")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === "hackathons"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Trophy size={13} />
                Hackathons ({hackathons.length + submissions.length})
              </button>
              <button
                onClick={() => setActiveTab("learning")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === "learning"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <GraduationCap size={13} />
                Learning ({enrollments.length})
              </button>
              <button
                onClick={() => setActiveTab("enquiries")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === "enquiries"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Send size={13} />
                Enquiries ({enquiries.length})
              </button>
            </div>
          </div>

          {/* Activity Feed Grid */}
          {filteredActivity.length === 0 ? (
            <div className="rounded-3xl border border-white/[0.08] bg-[#0A0C1B] p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mx-auto text-violet-400">
                <Activity size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">No activity recorded yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Apply for hackathons, complete campus tasks, or enroll in learning tracks to build your activity history.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/hackathons"
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-violet-600/20 transition"
                >
                  <Trophy size={14} /> Explore Live Hackathons
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredActivity.map((act) => {
                const Icon = act.icon;
                return (
                  <div
                    key={act.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-violet-500/30 hover:bg-white/[0.04] transition duration-200"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                        <Icon size={18} />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-bold text-white">{act.title}</h4>
                        <p className="text-xs text-slate-400">{act.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="text-[11px] text-slate-500">{act.date}</span>
                      {act.status && (
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${act.badgeColor || "bg-violet-500/10 text-violet-300 border-violet-500/20"}`}
                        >
                          {act.status}
                        </span>
                      )}
                      {act.link && (
                        <Link
                          href={act.link}
                          className="inline-flex items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
                        >
                          <ChevronRight size={14} />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

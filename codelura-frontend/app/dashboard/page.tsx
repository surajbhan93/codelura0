"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
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
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: "hackathon" | "enrollment" | "submission" | "enquiry" | "profile";
  title: string;
  subtitle: string;
  status?: string;
  date: string;
  link?: string;
  badgeColor?: string;
  icon: any;
}

export default function DashboardAllActivityPage() {
  const [user, setUser] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "hackathons" | "learning" | "enquiries">("all");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
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

      } catch (err) {
        console.error("Error loading user activity", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0d17] text-white flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading your activity dashboard...</p>
      </div>
    );
  }

  const initials = user?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() || "U";

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
      date: new Date(e.createdAt || Date.now()).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      link: e.itemType === "CareerTrack" ? `/career/learning/career-tracks/${e.itemRef?.slug || ""}` : `/career/learning/programs/${e.itemRef?.slug || ""}`,
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
      date: h.createdAt ? new Date(h.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Recent",
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
      date: new Date(s.createdAt || Date.now()).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
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
      date: new Date(q.createdAt || Date.now()).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      link: `/contact`,
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      icon: Send,
    });
  });

  const stats = [
    { label: "Wallet Balance", value: `₹${user?.walletBalance || 0}`, icon: Wallet, color: "text-emerald-400" },
    { label: "Role", value: user?.role || "Student", icon: GraduationCap, color: "text-indigo-400" },
    { label: "Programs Enrolled", value: enrollments.length, icon: BookOpen, color: "text-purple-400" },
    { label: "Learning Streak", value: user?.streak ? `${user.streak}d 🔥` : "1d 🔥", icon: Flame, color: "text-orange-400" },
  ];

  return (
    <div className="min-h-screen bg-[#0b0d17] text-white p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ── PROFILE HERO HEADER ── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121428] via-[#101222] to-[#0c0d1a] border border-white/10 p-6 sm:p-8 shadow-2xl">
          {/* Ambient Glow */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-violet-600/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-600/15 blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-2xl sm:text-3xl font-extrabold text-white shadow-xl ring-4 ring-white/10">
                  {initials}
                </div>
                {user?.isEmailVerified && (
                  <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-[#0b0d17]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{user?.name}</h1>
                  {user?.isEmailVerified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  )}
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30 capitalize">
                    {user?.role || "Student"}
                  </span>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm">{user?.email}</p>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <Link
                href="/hackathons"
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition shadow-lg shadow-violet-600/30"
              >
                <Trophy className="w-4 h-4" /> Explore Hackathons
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition"
              >
                Edit Profile
              </Link>
            </div>
          </div>

          {/* STATS BAR GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-black/30 border border-white/5 rounded-2xl p-4 transition hover:border-white/15">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400 font-medium">{s.label}</span>
                    <Icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                  <p className="text-xl font-extrabold text-white tracking-tight">{s.value}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── TABS NAVIGATION ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 overflow-x-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === "all"
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              All Activity ({activityList.length})
            </button>
            <button
              onClick={() => setActiveTab("hackathons")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === "hackathons"
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              Hackathons & Submissions ({hackathons.length + submissions.length})
            </button>
            <button
              onClick={() => setActiveTab("learning")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === "learning"
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Learning ({enrollments.length})
            </button>
            <button
              onClick={() => setActiveTab("enquiries")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === "enquiries"
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              Enquiries ({enquiries.length})
            </button>
          </div>
        </div>

        {/* ── TAB CONTENT ── */}

        {/* TAB 1: ALL ACTIVITY TIMELINE */}
        {activeTab === "all" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" /> Recent User Activity Timeline
              </h3>
            </div>

            {activityList.length === 0 ? (
              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-12 text-center space-y-3">
                <Activity className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-base font-semibold text-slate-300">No activity recorded yet</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">Apply for hackathons or enroll in learning programs to start building your activity history.</p>
                <Link
                  href="/hackathons"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-bold shadow-lg shadow-violet-600/30"
                >
                  Explore Live Events 🚀
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {activityList.map((act) => {
                  const Icon = act.icon;
                  return (
                    <div
                      key={act.id}
                      className="group bg-slate-900/60 hover:bg-slate-900 border border-white/10 hover:border-violet-500/40 rounded-2xl p-4 sm:p-5 transition-all flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-violet-600/15 border border-violet-500/30 text-violet-400 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-white text-sm sm:text-base group-hover:text-violet-300 transition">{act.title}</h4>
                            {act.status && (
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${act.badgeColor || "bg-white/5 text-slate-300 border-white/10"}`}>
                                {act.status}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400">{act.subtitle}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-slate-500 font-mono hidden sm:inline">{act.date}</span>
                        {act.link && (
                          <Link
                            href={act.link}
                            className="p-2 rounded-xl bg-white/5 hover:bg-violet-600 text-slate-400 hover:text-white transition"
                            title="Open Details"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: HACKATHONS & SUBMISSIONS */}
        {activeTab === "hackathons" && (
          <div className="space-y-6">
            {/* Hackathons Joined */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-violet-400" /> My Registered Hackathons ({hackathons.length})
              </h3>

              {hackathons.length === 0 ? (
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 text-center space-y-2">
                  <p className="text-sm font-semibold text-slate-300">You haven&apos;t registered for any hackathon yet</p>
                  <Link href="/hackathons" className="inline-block text-xs text-violet-400 font-bold hover:underline">Browse Active Hackathons →</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hackathons.map((h) => (
                    <div key={h._id || h.id} className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 space-y-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-violet-500/15 text-violet-300 border border-violet-500/30">
                            Registered
                          </span>
                          <h4 className="font-bold text-white text-base mt-2">{h.title || h.hackathon?.title}</h4>
                        </div>
                        <Trophy className="w-6 h-6 text-amber-400 shrink-0" />
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2">{h.shortDescription || h.hackathon?.shortDescription || "Interactive coding competition"}</p>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                        <Link
                          href={`/hackathons/${h.slug || h.hackathon?.slug || h._id || h.id || h.hackathon?._id}`}
                          className="text-xs font-semibold text-slate-400 hover:text-white"
                        >
                          View Event →
                        </Link>
                        <Link
                          href={`/hackathons/${h._id || h.id || h.hackathon?._id}/submission`}
                          className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-sm"
                        >
                          Submit Project 🚀
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submissions Submitted */}
            {submissions.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-white/10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Code className="w-4 h-4 text-emerald-400" /> Submitted Projects ({submissions.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {submissions.map((s) => (
                    <div key={s._id} className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase">
                          {s.status || "Submitted"}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">{new Date(s.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-bold text-white text-base">{s.projectTitle}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{s.projectDescription}</p>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {s.githubRepo && (
                          <a href={s.githubRepo} target="_blank" rel="noreferrer" className="text-[11px] font-semibold text-indigo-400 hover:underline">
                            🔗 GitHub
                          </a>
                        )}
                        {s.demoVideo && (
                          <a href={s.demoVideo} target="_blank" rel="noreferrer" className="text-[11px] font-semibold text-indigo-400 hover:underline">
                            🎥 Demo Video
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LEARNING & ENROLLED PROGRAMS */}
        {activeTab === "learning" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-purple-400" /> My Learning Programs ({enrollments.length})
              </h3>
              <a href="/career/learning/programs" className="text-xs font-bold text-violet-400 hover:underline">
                Explore More Programs →
              </a>
            </div>

            {enrollments.length === 0 ? (
              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 text-center space-y-2">
                <p className="text-sm font-semibold text-slate-300">You are not enrolled in any program yet.</p>
                <a href="/career/learning/programs" className="inline-block text-xs text-violet-400 font-bold hover:underline">Browse Programs →</a>
              </div>
            ) : (
              <div className="space-y-3">
                {enrollments.map((en: any) => {
                  const item = en.itemRef || {};
                  const isCareerTrack = en.itemType === "CareerTrack";
                  const href = isCareerTrack
                    ? `/career/learning/career-tracks/${item.slug || ""}`
                    : `/career/learning/programs/${item.slug || ""}`;

                  return (
                    <div key={en._id} className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                          {isCareerTrack ? "🎯 Career Track" : "🚀 Program"}
                        </span>
                        <h4 className="font-bold text-white text-base">{en.itemTitle || item.name || item.title}</h4>
                      </div>
                      <a href={href} className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition shadow-sm">
                        Start Learning →
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ENQUIRIES */}
        {activeTab === "enquiries" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-400" /> My Service Enquiries ({enquiries.length})
              </h3>
              <Link href="/contact" className="text-xs font-bold text-violet-400 hover:underline">
                New Contact Enquiry →
              </Link>
            </div>

            {enquiries.length === 0 ? (
              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 text-center space-y-2">
                <p className="text-sm font-semibold text-slate-300">No service enquiries found.</p>
                <Link href="/contact" className="inline-block text-xs text-violet-400 font-bold hover:underline">Contact Us →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {enquiries.map((q) => (
                  <div key={q._id} className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">{q.serviceName || "Service Enquiry"}</span>
                      <span className="text-xs text-slate-500 font-mono">{new Date(q.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-400">{q.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Sparkles,
  Award,
  TrendingUp,
  Wallet,
  Share2,
  Copy,
  CheckCircle2,
  Clock,
  ExternalLink,
  Users,
  Briefcase,
  BookOpen,
  DollarSign,
  Trophy,
  Send,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Building2,
  Flame,
  Check,
  Globe,
  MessageSquare,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Sliders,
  XCircle,
  Edit,
} from "lucide-react";

export default function AdminCampusPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "participants" | "tasks" | "jobs" | "blogs" | "sales" | "payouts" | "settings"
  >("overview");

  // Overview Stats & College Matrix
  const [overviewStats, setOverviewStats] = useState<any>(null);
  const [collegeMatrix, setCollegeMatrix] = useState<any[]>([]);

  // Participants
  const [participants, setParticipants] = useState<any[]>([]);
  const [participantSearch, setParticipantSearch] = useState("");
  const [participantStatusFilter, setParticipantStatusFilter] = useState("all");
  const [selectedParticipant, setSelectedParticipant] = useState<any | null>(null);
  const [editParticipantModal, setEditParticipantModal] = useState(false);
  const [addParticipantModal, setAddParticipantModal] = useState(false);
  const [newParticipantForm, setNewParticipantForm] = useState({
    userEmail: "",
    collegeName: "",
    branch: "",
    year: "",
    phone: "",
    bonusPoints: 50,
  });
  const [editParticipantForm, setEditParticipantForm] = useState({
    status: "active",
    pointsAdjustment: 0,
    role: "ambassador",
  });

  // Tasks & Submissions
  const [tasks, setTasks] = useState<any[]>([]);
  const [taskSubmissions, setTaskSubmissions] = useState<any[]>([]);
  const [taskFilter, setTaskFilter] = useState("pending");
  const [createTaskModal, setCreateTaskModal] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({
    title: "",
    description: "",
    category: "outreach",
    points: 100,
    rewardAmount: 0,
    guidelines: "",
    actionLink: "",
    targetColleges: "",
  });
  const [creatingTask, setCreatingTask] = useState(false);
  const [reviewTaskModal, setReviewTaskModal] = useState<{ open: boolean; sub: any | null }>({
    open: false,
    sub: null,
  });
  const [taskReviewForm, setTaskReviewForm] = useState({ status: "approved", pointsAwarded: 100, adminFeedback: "" });

  // Job Promotions
  const [jobPromotions, setJobPromotions] = useState<any[]>([]);
  const [jobFilter, setJobFilter] = useState("pending");
  const [reviewJobModal, setReviewJobModal] = useState<{ open: boolean; promo: any | null }>({
    open: false,
    promo: null,
  });
  const [jobReviewForm, setJobReviewForm] = useState({ status: "approved", rewardAmount: 2, adminFeedback: "" });

  // Blogs
  const [campusBlogs, setCampusBlogs] = useState<any[]>([]);
  const [blogFilter, setBlogFilter] = useState("all");
  const [reviewBlogModal, setReviewBlogModal] = useState<{ open: boolean; blog: any | null }>({
    open: false,
    blog: null,
  });
  const [blogReviewForm, setBlogReviewForm] = useState({ status: "published", adminFeedback: "" });

  // Course Sales
  const [courseSales, setCourseSales] = useState<any[]>([]);

  // Payouts
  const [payouts, setPayouts] = useState<any[]>([]);
  const [payoutFilter, setPayoutFilter] = useState("all");
  const [processPayoutModal, setProcessPayoutModal] = useState<{ open: boolean; payout: any | null }>({
    open: false,
    payout: null,
  });
  const [payoutForm, setPayoutForm] = useState({ status: "paid", transactionId: "", adminNotes: "" });

  // Settings
  const [settings, setSettings] = useState<any>({
    courseCommissionPercent: 10,
    jobPromotionReward: 2,
    blogViewsThreshold: 500,
    blogViewsReward: 20,
    referralSignupBonusPoints: 50,
    minPayoutAmount: 100,
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Fetch Overview Data
  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/campus/overview");
      if (res.data.success) {
        setOverviewStats(res.data.stats);
        setCollegeMatrix(res.data.collegeMatrix || []);
      }
    } catch (err) {
      console.error("Failed to load admin campus overview:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  // Fetch Specific Tab Data
  useEffect(() => {
    if (activeTab === "participants") {
      api.get("/admin/campus/participants").then((r) => r.data.success && setParticipants(r.data.participants || []));
    } else if (activeTab === "tasks") {
      api.get("/admin/campus/tasks").then((r) => r.data.success && setTasks(r.data.tasks || []));
      api
        .get(`/admin/campus/task-submissions?status=${taskFilter}`)
        .then((r) => r.data.success && setTaskSubmissions(r.data.submissions || []));
    } else if (activeTab === "jobs") {
      api
        .get(`/admin/campus/job-promotions?status=${jobFilter}`)
        .then((r) => r.data.success && setJobPromotions(r.data.promotions || []));
    } else if (activeTab === "blogs") {
      api
        .get(`/admin/campus/blogs?status=${blogFilter}`)
        .then((r) => r.data.success && setCampusBlogs(r.data.blogs || []));
    } else if (activeTab === "sales") {
      api.get("/admin/campus/course-sales").then((r) => r.data.success && setCourseSales(r.data.sales || []));
    } else if (activeTab === "payouts") {
      api
        .get(`/admin/campus/payouts?status=${payoutFilter}`)
        .then((r) => r.data.success && setPayouts(r.data.payouts || []));
    } else if (activeTab === "settings") {
      api.get("/admin/campus/settings").then((r) => r.data.success && setSettings(r.data.settings || {}));
    }
  }, [activeTab, taskFilter, jobFilter, blogFilter, payoutFilter]);

  // Actions: Add Participant
  const handleAddParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/admin/campus/participants", newParticipantForm);
      if (res.data.success) {
        toast.success("Campus participant registered successfully!");
        setAddParticipantModal(false);
        setNewParticipantForm({
          userEmail: "",
          collegeName: "",
          branch: "",
          year: "",
          phone: "",
          bonusPoints: 50,
        });
        const r = await api.get("/admin/campus/participants");
        if (r.data.success) setParticipants(r.data.participants || []);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add participant");
    }
  };

  // Actions: Update Participant
  const handleUpdateParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParticipant) return;
    try {
      const res = await api.put(`/admin/campus/participants/${selectedParticipant._id}`, editParticipantForm);
      if (res.data.success) {
        toast.success("Participant updated successfully!");
        setEditParticipantModal(false);
        const r = await api.get("/admin/campus/participants");
        if (r.data.success) setParticipants(r.data.participants || []);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update participant");
    }
  };

  // Actions: Create Task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskForm.title.trim() || !newTaskForm.description.trim()) {
      toast.error("Please provide task title and description");
      return;
    }
    try {
      setCreatingTask(true);
      const res = await api.post("/admin/campus/tasks", {
        ...newTaskForm,
        category: (newTaskForm.category || "outreach").toLowerCase(),
      });
      if (res.data.success) {
        toast.success("New campus task published successfully!");
        setCreateTaskModal(false);
        setNewTaskForm({
          title: "",
          description: "",
          category: "outreach",
          points: 100,
          rewardAmount: 0,
          guidelines: "",
          actionLink: "",
          targetColleges: "",
        });
        const r = await api.get("/admin/campus/tasks");
        if (r.data.success) setTasks(r.data.tasks || []);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create task");
    } finally {
      setCreatingTask(false);
    }
  };

  // Actions: Review Task Submission
  const handleReviewTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTaskModal.sub) return;
    try {
      const res = await api.put(
        `/admin/campus/task-submissions/${reviewTaskModal.sub._id}/review`,
        taskReviewForm
      );
      if (res.data.success) {
        toast.success("Task submission reviewed!");
        setReviewTaskModal({ open: false, sub: null });
        const r = await api.get(`/admin/campus/task-submissions?status=${taskFilter}`);
        if (r.data.success) setTaskSubmissions(r.data.submissions || []);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to review task");
    }
  };

  // Actions: Review Job Promotion
  const handleReviewJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewJobModal.promo) return;
    try {
      const res = await api.put(
        `/admin/campus/job-promotions/${reviewJobModal.promo._id}/review`,
        jobReviewForm
      );
      if (res.data.success) {
        toast.success("Job promotion reviewed!");
        setReviewJobModal({ open: false, promo: null });
        const r = await api.get(`/admin/campus/job-promotions?status=${jobFilter}`);
        if (r.data.success) setJobPromotions(r.data.promotions || []);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to review job promotion");
    }
  };

  // Actions: Review Blog
  const handleReviewBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBlogModal.blog) return;
    try {
      const res = await api.put(`/admin/campus/blogs/${reviewBlogModal.blog._id}/review`, blogReviewForm);
      if (res.data.success) {
        toast.success(
          blogReviewForm.status === "published"
            ? "Blog published live to Codelura!"
            : "Blog status updated!"
        );
        setReviewBlogModal({ open: false, blog: null });
        const r = await api.get(`/admin/campus/blogs?status=${blogFilter}`);
        if (r.data.success) setCampusBlogs(r.data.blogs || []);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to review blog");
    }
  };

  // Actions: Process Payout
  const handleProcessPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!processPayoutModal.payout) return;
    try {
      const res = await api.put(`/admin/campus/payouts/${processPayoutModal.payout._id}`, payoutForm);
      if (res.data.success) {
        toast.success("Payout marked as completed/updated!");
        setProcessPayoutModal({ open: false, payout: null });
        const r = await api.get(`/admin/campus/payouts?status=${payoutFilter}`);
        if (r.data.success) setPayouts(r.data.payouts || []);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to process payout");
    }
  };

  // Actions: Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      const res = await api.put("/admin/campus/settings", settings);
      if (res.data.success) {
        toast.success("Campus program settings updated live!");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save settings");
    } finally {
      setSavingSettings(false);
    }
  };

  // Filtered Participants
  const filteredParticipants = participants.filter((p) => {
    const searchMatch =
      p.user?.name?.toLowerCase().includes(participantSearch.toLowerCase()) ||
      p.user?.email?.toLowerCase().includes(participantSearch.toLowerCase()) ||
      p.collegeName?.toLowerCase().includes(participantSearch.toLowerCase()) ||
      p.referralCode?.toLowerCase().includes(participantSearch.toLowerCase());
    const statusMatch = participantStatusFilter === "all" || p.status === participantStatusFilter;
    return searchMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-[#070814] text-white p-4 sm:p-8 font-sans">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/40 px-3.5 py-1 text-xs font-bold text-purple-300 mb-2">
              <ShieldCheck size={14} className="text-purple-400" />
              ADMIN MASTER CONTROLLER
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Codelura Campus Program Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Oversee 80+ campus ambassadors, college performance matrices, submissions verification, 10% course sales,
              and payouts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchOverview}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-bold text-slate-300 transition"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              onClick={() => setAddParticipantModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition"
            >
              <Plus size={14} />
              Add Ambassador
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 scrollbar-none">
          {[
            { id: "overview", label: "Overview & College Matrix", icon: TrendingUp },
            { id: "participants", label: "Ambassadors", icon: Users },
            { id: "tasks", label: "Tasks & Proofs", icon: CheckCircle2 },
            { id: "jobs", label: "Job Promotions", icon: Briefcase },
            { id: "blogs", label: "Blog Reviews", icon: BookOpen },
            { id: "sales", label: "Course Sales (10%)", icon: DollarSign },
            { id: "payouts", label: "Payout Requests", icon: Wallet },
            { id: "settings", label: "Reward Settings", icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                  active
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ────────────────────────────────────────────────────────────
           TAB 1: OVERVIEW & COLLEGE PERFORMANCE MATRIX
        ──────────────────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* 6 Top Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="rounded-2xl border border-white/10 bg-[#0E1022] p-4">
                <span className="text-[11px] text-slate-400 font-medium">Total Ambassadors</span>
                <p className="text-xl font-bold text-white mt-1">{overviewStats?.totalParticipants || 0}</p>
                <span className="text-[10px] text-emerald-400 font-medium">
                  {overviewStats?.activeParticipants || 0} Active
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0E1022] p-4">
                <span className="text-[11px] text-slate-400 font-medium">Colleges Onboard</span>
                <p className="text-xl font-bold text-indigo-400 mt-1">{overviewStats?.totalColleges || 0}</p>
                <span className="text-[10px] text-slate-400 font-medium">Pan-India Reach</span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0E1022] p-4">
                <span className="text-[11px] text-slate-400 font-medium">Course Sales Vol.</span>
                <p className="text-xl font-bold text-emerald-400 mt-1">
                  ₹{overviewStats?.totalCourseSalesAmount?.toLocaleString("en-IN") || 0}
                </p>
                <span className="text-[10px] text-purple-300 font-medium">
                  ₹{overviewStats?.totalCommissionEarned?.toLocaleString("en-IN") || 0} (10% comm.)
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0E1022] p-4">
                <span className="text-[11px] text-slate-400 font-medium">Earnings Distributed</span>
                <p className="text-xl font-bold text-yellow-400 mt-1">
                  ₹{overviewStats?.totalEarningsDistributed?.toLocaleString("en-IN") || 0}
                </p>
                <span className="text-[10px] text-slate-400 font-medium">All Rewards</span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0E1022] p-4">
                <span className="text-[11px] text-slate-400 font-medium">Pending Payouts</span>
                <p className="text-xl font-bold text-amber-400 mt-1">
                  ₹{overviewStats?.pendingPayoutsAmount?.toLocaleString("en-IN") || 0}
                </p>
                <span className="text-[10px] text-amber-300 font-medium">
                  {overviewStats?.pendingPayoutsCount || 0} Requests
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0E1022] p-4">
                <span className="text-[11px] text-slate-400 font-medium">Pending Reviews</span>
                <p className="text-xl font-bold text-cyan-400 mt-1">{overviewStats?.pendingReviewsCount || 0}</p>
                <span className="text-[10px] text-cyan-300 font-medium">Tasks / Jobs / Blogs</span>
              </div>
            </div>

            {/* College Performance Matrix */}
            <div className="rounded-2xl border border-white/10 bg-[#0C0E1F] p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Building2 className="text-purple-400" size={18} />
                    College-Wise Performance Matrix
                  </h3>
                  <p className="text-xs text-slate-400">
                    Aggregated metrics per institution to identify top-performing campus clusters.
                  </p>
                </div>
              </div>

              {collegeMatrix.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  <Building2 size={32} className="mx-auto mb-2 opacity-30" />
                  No college data aggregated yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-white/5 uppercase text-[10px] text-slate-400">
                      <tr>
                        <th className="p-3">Rank</th>
                        <th className="p-3">College / University</th>
                        <th className="p-3 text-center">Ambassadors</th>
                        <th className="p-3 text-center">Total Points</th>
                        <th className="p-3 text-center">Course Sales (10%)</th>
                        <th className="p-3 text-right">Commission Distributed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {collegeMatrix.map((c, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02]">
                          <td className="p-3 font-bold text-white">#{idx + 1}</td>
                          <td className="p-3 font-semibold text-white">{c.collegeName || "Unknown College"}</td>
                          <td className="p-3 text-center text-slate-300">{c.participantCount}</td>
                          <td className="p-3 text-center font-bold text-yellow-400">{c.totalPoints} pts</td>
                          <td className="p-3 text-center font-medium text-purple-300">{c.courseSalesCount || 0}</td>
                          <td className="p-3 text-right font-bold text-emerald-400">
                            ₹{(c.totalEarnings || 0).toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────
           TAB 2: AMBASSADORS (PARTICIPANTS)
        ──────────────────────────────────────────────────────────── */}
        {activeTab === "participants" && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-white/10 bg-[#0C0E1F] p-4">
              <div className="relative flex-1 w-full">
                <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, college, referral code..."
                  value={participantSearch}
                  onChange={(e) => setParticipantSearch(e.target.value)}
                  className="w-full rounded-xl bg-white/5 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={participantStatusFilter}
                  onChange={(e) => setParticipantStatusFilter(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#12142B] px-3 py-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            {/* Participants Table */}
            <div className="rounded-2xl border border-white/10 bg-[#0C0E1F] p-6 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-white/5 uppercase text-[10px] text-slate-400">
                    <tr>
                      <th className="p-3">Ambassador</th>
                      <th className="p-3">College &amp; Branch</th>
                      <th className="p-3">Referral Code</th>
                      <th className="p-3 text-center">Points</th>
                      <th className="p-3 text-center">Total Earnings</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredParticipants.map((p) => (
                      <tr key={p._id} className="hover:bg-white/[0.02]">
                        <td className="p-3">
                          <p className="font-semibold text-white">{p.user?.name || "Ambassador"}</p>
                          <p className="text-[10px] text-slate-400">{p.user?.email}</p>
                        </td>
                        <td className="p-3">
                          <p className="text-white">{p.collegeName}</p>
                          <p className="text-[10px] text-slate-400">
                            {p.branch} {p.year && `(${p.year})`}
                          </p>
                        </td>
                        <td className="p-3 font-mono font-bold text-yellow-400">{p.referralCode}</td>
                        <td className="p-3 text-center font-bold text-yellow-400">{p.points || 0}</td>
                        <td className="p-3 text-center font-bold text-emerald-400">
                          ₹{(p.totalEarnings || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              p.status === "active"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : p.status === "suspended"
                                ? "bg-red-500/20 text-red-300"
                                : "bg-slate-500/20 text-slate-400"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedParticipant(p);
                              setEditParticipantForm({
                                status: p.status || "active",
                                pointsAdjustment: 0,
                                role: p.role || "ambassador",
                              });
                              setEditParticipantModal(true);
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-2.5 py-1 text-xs text-slate-200 transition"
                          >
                            <Edit size={12} /> Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────
           TAB 3: TASKS & SUBMISSIONS REVIEW
        ──────────────────────────────────────────────────────────── */}
        {activeTab === "tasks" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {["pending", "approved", "rejected", "all"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setTaskFilter(status)}
                    className={`rounded-xl px-4 py-2 text-xs font-bold capitalize transition ${
                      taskFilter === status
                        ? "bg-purple-600 text-white shadow-md"
                        : "bg-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCreateTaskModal(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2 text-xs font-bold text-white transition shadow-md"
              >
                <Plus size={14} /> Create Task
              </button>
            </div>

            {/* Submissions Table */}
            <div className="rounded-2xl border border-white/10 bg-[#0C0E1F] p-6 space-y-4">
              <h3 className="text-base font-bold text-white">Student Task Proof Submissions</h3>

              {taskSubmissions.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  <CheckCircle2 size={32} className="mx-auto mb-2 opacity-30" />
                  No task submissions found for this filter.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-white/5 uppercase text-[10px] text-slate-400">
                      <tr>
                        <th className="p-3">Task Title</th>
                        <th className="p-3">Ambassador</th>
                        <th className="p-3">Proof Details</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Submitted Date</th>
                        <th className="p-3 text-right">Review</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {taskSubmissions.map((sub) => (
                        <tr key={sub._id} className="hover:bg-white/[0.02]">
                          <td className="p-3 font-semibold text-white">{sub.task?.title || "Campus Task"}</td>
                          <td className="p-3">
                            <p className="text-white font-medium">{sub.participant?.user?.name || "Ambassador"}</p>
                            <p className="text-[10px] text-slate-400">{sub.participant?.collegeName}</p>
                          </td>
                          <td className="p-3 max-w-xs">
                            <p className="truncate text-slate-300">{sub.proofText}</p>
                            {sub.proofLinks?.length > 0 && (
                              <p className="text-[10px] text-indigo-400 font-mono mt-0.5">
                                {sub.proofLinks.length} Links attached
                              </p>
                            )}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                sub.status === "approved"
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : sub.status === "rejected"
                                  ? "bg-red-500/20 text-red-300"
                                  : "bg-amber-500/20 text-amber-300"
                              }`}
                            >
                              {sub.status}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400">
                            {new Date(sub.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setReviewTaskModal({ open: true, sub });
                                setTaskReviewForm({
                                  status: "approved",
                                  pointsAwarded: sub.task?.points || 100,
                                  adminFeedback: "",
                                });
                              }}
                              className="rounded-lg bg-purple-600 hover:bg-purple-500 px-3 py-1 text-xs font-bold text-white transition"
                            >
                              Inspect &amp; Verify
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────
           TAB 4: JOB PROMOTIONS REVIEW
        ──────────────────────────────────────────────────────────── */}
        {activeTab === "jobs" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              {["pending", "approved", "rejected", "all"].map((status) => (
                <button
                  key={status}
                  onClick={() => setJobFilter(status)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold capitalize transition ${
                    jobFilter === status
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0C0E1F] p-6 space-y-4">
              <h3 className="text-base font-bold text-white">Job Promotion Proof Submissions (₹1–₹2 Rewards)</h3>

              {jobPromotions.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  <Briefcase size={32} className="mx-auto mb-2 opacity-30" />
                  No job promotion proofs found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-white/5 uppercase text-[10px] text-slate-400">
                      <tr>
                        <th className="p-3">Job Opportunity</th>
                        <th className="p-3">Ambassador</th>
                        <th className="p-3">Platform</th>
                        <th className="p-3">Proof Link / Screenshot</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Review</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {jobPromotions.map((promo) => (
                        <tr key={promo._id} className="hover:bg-white/[0.02]">
                          <td className="p-3 font-semibold text-white">{promo.job?.title || "Job Alert"}</td>
                          <td className="p-3">
                            <p className="text-white font-medium">{promo.participant?.user?.name || "Ambassador"}</p>
                            <p className="text-[10px] text-slate-400">{promo.participant?.collegeName}</p>
                          </td>
                          <td className="p-3 font-medium text-blue-300">{promo.platform}</td>
                          <td className="p-3">
                            {promo.proofLink && (
                              <a
                                href={promo.proofLink}
                                target="_blank"
                                rel="noreferrer"
                                className="text-purple-400 hover:underline inline-flex items-center gap-1 block"
                              >
                                View Link <ExternalLink size={10} />
                              </a>
                            )}
                            {promo.proofImage && (
                              <a
                                href={promo.proofImage}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-400 hover:underline inline-flex items-center gap-1 block mt-0.5"
                              >
                                View Screenshot <ExternalLink size={10} />
                              </a>
                            )}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                promo.status === "approved"
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : promo.status === "rejected"
                                  ? "bg-red-500/20 text-red-300"
                                  : "bg-amber-500/20 text-amber-300"
                              }`}
                            >
                              {promo.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setReviewJobModal({ open: true, promo });
                                setJobReviewForm({
                                  status: "approved",
                                  rewardAmount: settings?.jobPromotionReward || 2,
                                  adminFeedback: "",
                                });
                              }}
                              className="rounded-lg bg-blue-600 hover:bg-blue-500 px-3 py-1 text-xs font-bold text-white transition"
                            >
                              Verify Proof
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────
           TAB 5: BLOG REVIEWS
        ──────────────────────────────────────────────────────────── */}
        {activeTab === "blogs" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              {["all", "submitted", "published", "rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setBlogFilter(status)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold capitalize transition ${
                    blogFilter === status
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0C0E1F] p-6 space-y-4">
              <h3 className="text-base font-bold text-white">Submitted Campus Blog Articles</h3>

              {campusBlogs.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  <BookOpen size={32} className="mx-auto mb-2 opacity-30" />
                  No campus blog submissions found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-white/5 uppercase text-[10px] text-slate-400">
                      <tr>
                        <th className="p-3">Article Title</th>
                        <th className="p-3">Ambassador</th>
                        <th className="p-3">Genuine Views</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Review &amp; Publish</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {campusBlogs.map((b) => (
                        <tr key={b._id} className="hover:bg-white/[0.02]">
                          <td className="p-3 font-semibold text-white max-w-sm">
                            <p>{b.title}</p>
                            <p className="text-[10px] text-slate-400 truncate">{b.excerpt || b.content?.slice(0, 80)}</p>
                          </td>
                          <td className="p-3">
                            <p className="text-white font-medium">{b.participant?.user?.name || "Ambassador"}</p>
                            <p className="text-[10px] text-slate-400">{b.participant?.collegeName}</p>
                          </td>
                          <td className="p-3 font-bold text-emerald-400">
                            {b.views || 0} / {settings?.blogViewsThreshold || 500}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                b.status === "published"
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : b.status === "rejected"
                                  ? "bg-red-500/20 text-red-300"
                                  : "bg-amber-500/20 text-amber-300"
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setReviewBlogModal({ open: true, blog: b });
                                setBlogReviewForm({ status: "published", adminFeedback: "" });
                              }}
                              className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1 text-xs font-bold text-white transition"
                            >
                              Editorial Review
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────
           TAB 6: COURSE SALES (10% COMMISSION)
        ──────────────────────────────────────────────────────────── */}
        {activeTab === "sales" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#0C0E1F] p-6 space-y-4">
              <h3 className="text-base font-bold text-white">Campus Referral 10% Course Sales Ledger</h3>

              {courseSales.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  <DollarSign size={32} className="mx-auto mb-2 opacity-30" />
                  No course sales records found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-white/5 uppercase text-[10px] text-slate-400">
                      <tr>
                        <th className="p-3">Course</th>
                        <th className="p-3">Ambassador (Referrer)</th>
                        <th className="p-3">Buyer Name</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Commission (10%)</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {courseSales.map((sale) => (
                        <tr key={sale._id} className="hover:bg-white/[0.02]">
                          <td className="p-3 font-semibold text-white">{sale.course?.title || "Course"}</td>
                          <td className="p-3">
                            <p className="text-white font-medium">{sale.participant?.user?.name || "Ambassador"}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{sale.referralCode}</p>
                          </td>
                          <td className="p-3 text-slate-300">{sale.buyer?.name || "Student"}</td>
                          <td className="p-3 font-medium text-white">₹{sale.coursePrice}</td>
                          <td className="p-3 font-bold text-emerald-400">+₹{sale.commissionAmount}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                sale.status === "approved" || sale.status === "paid"
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : "bg-amber-500/20 text-amber-300"
                              }`}
                            >
                              {sale.status}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400">
                            {new Date(sale.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────
           TAB 7: PAYOUT REQUESTS
        ──────────────────────────────────────────────────────────── */}
        {activeTab === "payouts" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              {["all", "pending", "processing", "paid", "rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setPayoutFilter(status)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold capitalize transition ${
                    payoutFilter === status
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0C0E1F] p-6 space-y-4">
              <h3 className="text-base font-bold text-white">Student Ambassador Payout Requests</h3>

              {payouts.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  <Wallet size={32} className="mx-auto mb-2 opacity-30" />
                  No payout requests found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-white/5 uppercase text-[10px] text-slate-400">
                      <tr>
                        <th className="p-3">Ambassador</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Payment Method &amp; Details</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Transaction Ref</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {payouts.map((pay) => (
                        <tr key={pay._id} className="hover:bg-white/[0.02]">
                          <td className="p-3">
                            <p className="font-semibold text-white">{pay.participant?.user?.name || "Ambassador"}</p>
                            <p className="text-[10px] text-slate-400">{pay.participant?.collegeName}</p>
                          </td>
                          <td className="p-3 font-bold text-emerald-400 text-sm">
                            ₹{pay.amount?.toLocaleString("en-IN")}
                          </td>
                          <td className="p-3">
                            <span className="uppercase text-[10px] font-bold text-indigo-300 block">
                              {pay.paymentMethod}
                            </span>
                            {pay.paymentMethod === "upi" ? (
                              <span className="font-mono text-xs text-white">{pay.paymentDetails?.upiId}</span>
                            ) : (
                              <div className="text-[11px] text-slate-300">
                                <p>A/C: {pay.paymentDetails?.bankAccountNumber}</p>
                                <p>IFSC: {pay.paymentDetails?.bankIfsc}</p>
                                <p>Holder: {pay.paymentDetails?.accountHolderName}</p>
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                pay.status === "paid"
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : pay.status === "rejected"
                                  ? "bg-red-500/20 text-red-300"
                                  : "bg-amber-500/20 text-amber-300"
                              }`}
                            >
                              {pay.status}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-[11px] text-slate-400">{pay.transactionId || "—"}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setProcessPayoutModal({ open: true, payout: pay });
                                setPayoutForm({
                                  status: "paid",
                                  transactionId: pay.transactionId || "",
                                  adminNotes: "",
                                });
                              }}
                              className="rounded-lg bg-purple-600 hover:bg-purple-500 px-3 py-1 text-xs font-bold text-white transition"
                            >
                              Process
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────
           TAB 8: REWARD & PROGRAM SETTINGS
        ──────────────────────────────────────────────────────────── */}
        {activeTab === "settings" && (
          <div className="max-w-3xl space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#0C0E1F] p-6 space-y-6">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="text-purple-400" size={18} />
                  Campus Program Reward &amp; Commission Rates
                </h3>
                <p className="text-xs text-slate-400">
                  Update reward rates in real time. Changes reflect immediately across all student dashboards.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Course Referral Commission Rate (%)
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={100}
                      value={settings.courseCommissionPercent || 10}
                      onChange={(e) =>
                        setSettings({ ...settings, courseCommissionPercent: parseFloat(e.target.value) })
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Default: 10% on paid course enrollments</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Job Promotion Reward Amount (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={settings.jobPromotionReward || 2}
                      onChange={(e) =>
                        setSettings({ ...settings, jobPromotionReward: parseFloat(e.target.value) })
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Reward per verified job share proof (₹1 – ₹2)</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Blog Milestone Views Target
                    </label>
                    <input
                      type="number"
                      required
                      min={50}
                      value={settings.blogViewsThreshold || 500}
                      onChange={(e) =>
                        setSettings({ ...settings, blogViewsThreshold: parseInt(e.target.value) })
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Default: 500 genuine views</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Blog Milestone Cash Reward (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={settings.blogViewsReward || 20}
                      onChange={(e) =>
                        setSettings({ ...settings, blogViewsReward: parseFloat(e.target.value) })
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Reward when blog achieves 500+ genuine views (₹20)</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Referral Signup Bonus (Points)
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={settings.referralSignupBonusPoints || 50}
                      onChange={(e) =>
                        setSettings({ ...settings, referralSignupBonusPoints: parseInt(e.target.value) })
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Minimum Payout Withdrawal Amount (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={settings.minPayoutAmount || 100}
                      onChange={(e) =>
                        setSettings({ ...settings, minPayoutAmount: parseFloat(e.target.value) })
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition disabled:opacity-50"
                  >
                    {savingSettings ? <Loader2 size={14} className="animate-spin" /> : <SaveIcon />}
                    Save Configuration
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────
           MODALS
        ──────────────────────────────────────────────────────────── */}

        {/* Add Participant Modal */}
        <AnimatePresence>
          {addParticipantModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0E1022] p-6 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Add Campus Ambassador</h3>
                  <button onClick={() => setAddParticipantModal(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddParticipant} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">User Email / Existing Account</label>
                    <input
                      type="email"
                      required
                      placeholder="student@example.com"
                      value={newParticipantForm.userEmail}
                      onChange={(e) => setNewParticipantForm({ ...newParticipantForm, userEmail: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">College Name</label>
                      <input
                        type="text"
                        required
                        placeholder="DTU / IIT / etc."
                        value={newParticipantForm.collegeName}
                        onChange={(e) => setNewParticipantForm({ ...newParticipantForm, collegeName: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Branch</label>
                      <input
                        type="text"
                        placeholder="CSE / IT"
                        value={newParticipantForm.branch}
                        onChange={(e) => setNewParticipantForm({ ...newParticipantForm, branch: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setAddParticipantModal(false)}
                      className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-slate-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-purple-600 hover:bg-purple-500 px-5 py-2 text-xs font-bold text-white"
                    >
                      Add Ambassador
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Edit Participant Modal */}
        <AnimatePresence>
          {editParticipantModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0E1022] p-6 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">
                    Edit Ambassador: {selectedParticipant?.user?.name}
                  </h3>
                  <button onClick={() => setEditParticipantModal(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleUpdateParticipant} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                    <select
                      value={editParticipantForm.status}
                      onChange={(e) => setEditParticipantForm({ ...editParticipantForm, status: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#12142B] p-3 text-xs text-white focus:outline-none"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Manual Points Adjustment (+/-)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. +50 or -20"
                      value={editParticipantForm.pointsAdjustment}
                      onChange={(e) =>
                        setEditParticipantForm({
                          ...editParticipantForm,
                          pointsAdjustment: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setEditParticipantModal(false)}
                      className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-slate-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-purple-600 hover:bg-purple-500 px-5 py-2 text-xs font-bold text-white"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Create Task Modal */}
        <AnimatePresence>
          {createTaskModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0E1022] p-6 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Create Official Campus Task</h3>
                  <button onClick={() => setCreateTaskModal(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateTask} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Task Title <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Conduct College Workshop / Share Hackathon Poster"
                      value={newTaskForm.title}
                      onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                      <select
                        value={newTaskForm.category}
                        onChange={(e) => setNewTaskForm({ ...newTaskForm, category: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-[#12142B] p-3 text-xs text-white focus:outline-none"
                      >
                        <option value="outreach">Outreach &amp; Awareness</option>
                        <option value="workshop">College Workshop</option>
                        <option value="social">Social Media Promotion</option>
                        <option value="content">Content Creation</option>
                        <option value="referral">Referral Campaign</option>
                        <option value="feedback">Product Feedback</option>
                        <option value="other">Other Campus Activity</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Target Colleges (Optional)</label>
                      <input
                        type="text"
                        placeholder="All or e.g. DTU, IIT"
                        value={newTaskForm.targetColleges}
                        onChange={(e) => setNewTaskForm({ ...newTaskForm, targetColleges: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Description <span className="text-red-400">*</span></label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Explain what the student ambassador needs to do..."
                      value={newTaskForm.description}
                      onChange={(e) => setNewTaskForm({ ...newTaskForm, description: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Submission Guidelines (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Upload photo of attendees or share LinkedIn post link"
                      value={newTaskForm.guidelines}
                      onChange={(e) => setNewTaskForm({ ...newTaskForm, guidelines: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Points to Award</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={newTaskForm.points}
                        onChange={(e) => setNewTaskForm({ ...newTaskForm, points: parseInt(e.target.value) || 0 })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Cash Reward (₹, Optional)</label>
                      <input
                        type="number"
                        min={0}
                        value={newTaskForm.rewardAmount}
                        onChange={(e) =>
                          setNewTaskForm({ ...newTaskForm, rewardAmount: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setCreateTaskModal(false)}
                      className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-slate-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creatingTask}
                      className="rounded-xl bg-purple-600 hover:bg-purple-500 px-5 py-2 text-xs font-bold text-white shadow-md disabled:opacity-50"
                    >
                      {creatingTask ? "Publishing..." : "Publish Task"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Review Task Submission Modal */}
        <AnimatePresence>
          {reviewTaskModal.open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0E1022] p-6 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Review Task Proof</h3>
                  <button
                    onClick={() => setReviewTaskModal({ open: false, sub: null })}
                    className="text-slate-400 hover:text-white text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="rounded-xl bg-white/5 p-3.5 space-y-2 text-xs">
                  <p>
                    <strong>Ambassador:</strong> {reviewTaskModal.sub?.participant?.user?.name} (
                    {reviewTaskModal.sub?.participant?.collegeName})
                  </p>
                  <p>
                    <strong>Proof Description:</strong> {reviewTaskModal.sub?.proofText}
                  </p>
                  {reviewTaskModal.sub?.proofLinks?.map((l: string, i: number) => (
                    <a
                      key={i}
                      href={l}
                      target="_blank"
                      rel="noreferrer"
                      className="text-purple-400 hover:underline block truncate"
                    >
                      🔗 {l}
                    </a>
                  ))}
                </div>

                <form onSubmit={handleReviewTask} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Decision</label>
                      <select
                        value={taskReviewForm.status}
                        onChange={(e) => setTaskReviewForm({ ...taskReviewForm, status: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-[#12142B] p-3 text-xs text-white focus:outline-none"
                      >
                        <option value="approved">Approve</option>
                        <option value="rejected">Reject</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Points to Award</label>
                      <input
                        type="number"
                        value={taskReviewForm.pointsAwarded}
                        onChange={(e) =>
                          setTaskReviewForm({
                            ...taskReviewForm,
                            pointsAwarded: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Feedback</label>
                    <input
                      type="text"
                      placeholder="Optional remarks for the ambassador"
                      value={taskReviewForm.adminFeedback}
                      onChange={(e) => setTaskReviewForm({ ...taskReviewForm, adminFeedback: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setReviewTaskModal({ open: false, sub: null })}
                      className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-slate-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-purple-600 hover:bg-purple-500 px-5 py-2 text-xs font-bold text-white"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Review Job Promotion Modal */}
        <AnimatePresence>
          {reviewJobModal.open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0E1022] p-6 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Review Job Promotion Proof</h3>
                  <button
                    onClick={() => setReviewJobModal({ open: false, promo: null })}
                    className="text-slate-400 hover:text-white text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleReviewJob} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Decision</label>
                      <select
                        value={jobReviewForm.status}
                        onChange={(e) => setJobReviewForm({ ...jobReviewForm, status: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-[#12142B] p-3 text-xs text-white focus:outline-none"
                      >
                        <option value="approved">Approve &amp; Reward</option>
                        <option value="rejected">Reject</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Reward (₹)</label>
                      <input
                        type="number"
                        value={jobReviewForm.rewardAmount}
                        onChange={(e) =>
                          setJobReviewForm({
                            ...jobReviewForm,
                            rewardAmount: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setReviewJobModal({ open: false, promo: null })}
                      className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-slate-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2 text-xs font-bold text-white"
                    >
                      Confirm Review
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Review Blog Modal */}
        <AnimatePresence>
          {reviewBlogModal.open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0E1022] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Review Article: {reviewBlogModal.blog?.title}</h3>
                  <button
                    onClick={() => setReviewBlogModal({ open: false, blog: null })}
                    className="text-slate-400 hover:text-white text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="rounded-xl bg-white/5 p-4 space-y-2 text-xs">
                  <p className="font-bold text-slate-300">Article Content Preview:</p>
                  <div className="max-h-60 overflow-y-auto font-mono text-slate-300 whitespace-pre-wrap bg-black/30 p-3 rounded-lg">
                    {reviewBlogModal.blog?.content}
                  </div>
                </div>

                <form onSubmit={handleReviewBlog} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Action</label>
                    <select
                      value={blogReviewForm.status}
                      onChange={(e) => setBlogReviewForm({ ...blogReviewForm, status: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#12142B] p-3 text-xs text-white focus:outline-none"
                    >
                      <option value="published">Publish to Codelura Live Blog</option>
                      <option value="rejected">Reject</option>
                      <option value="changes_requested">Request Changes</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setReviewBlogModal({ open: false, blog: null })}
                      className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-slate-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2 text-xs font-bold text-white"
                    >
                      Save Editorial Decision
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Process Payout Modal */}
        <AnimatePresence>
          {processPayoutModal.open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0E1022] p-6 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Process Ambassador Payout</h3>
                  <button
                    onClick={() => setProcessPayoutModal({ open: false, payout: null })}
                    className="text-slate-400 hover:text-white text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="rounded-xl bg-white/5 p-3 text-xs text-slate-300">
                  <p>
                    Amount to Pay:{" "}
                    <strong className="text-emerald-400 text-sm">
                      ₹{processPayoutModal.payout?.amount?.toLocaleString("en-IN")}
                    </strong>
                  </p>
                  <p className="mt-1">
                    Beneficiary: <strong>{processPayoutModal.payout?.participant?.user?.name}</strong>
                  </p>
                </div>

                <form onSubmit={handleProcessPayout} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                    <select
                      value={payoutForm.status}
                      onChange={(e) => setPayoutForm({ ...payoutForm, status: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#12142B] p-3 text-xs text-white focus:outline-none"
                    >
                      <option value="paid">Paid (Mark Completed)</option>
                      <option value="processing">Processing</option>
                      <option value="rejected">Reject &amp; Refund to Balance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Bank / UPI Transaction ID (UTR Ref)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. UTR492817294827"
                      value={payoutForm.transactionId}
                      onChange={(e) => setPayoutForm({ ...payoutForm, transactionId: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs font-mono text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setProcessPayoutModal({ open: false, payout: null })}
                      className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-slate-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-purple-600 hover:bg-purple-500 px-5 py-2 text-xs font-bold text-white"
                    >
                      Save Payout
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SaveIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

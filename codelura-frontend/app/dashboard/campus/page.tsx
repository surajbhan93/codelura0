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
  Building2,
  Flame,
  Check,
  Loader2,
} from "lucide-react";

export default function CampusDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [isParticipant, setIsParticipant] = useState(false);
  const [participant, setParticipant] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [recentEarnings, setRecentEarnings] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    "overview" | "courses" | "jobs" | "blogs" | "tasks" | "referrals" | "leaderboard" | "payouts"
  >("overview");

  // Registration Modal State
  const [joinForm, setJoinForm] = useState({
    collegeName: "",
    branch: "",
    year: "",
    phone: "",
    bio: "",
  });
  const [joining, setJoining] = useState(false);

  // Tab Data States
  const [tasks, setTasks] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [courseSales, setCourseSales] = useState<any[]>([]);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [referralStats, setReferralStats] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [leaderboardFilter, setLeaderboardFilter] = useState<"alltime" | "monthly" | "weekly">("alltime");
  const [earnings, setEarnings] = useState<any[]>([]);
  const [earningsTotals, setEarningsTotals] = useState<any>(null);

  // Modals
  const [taskModal, setTaskModal] = useState<{ open: boolean; task: any | null }>({ open: false, task: null });
  const [taskProofText, setTaskProofText] = useState("");
  const [taskProofLinks, setTaskProofLinks] = useState("");
  const [taskProofImages, setTaskProofImages] = useState("");
  const [submittingTask, setSubmittingTask] = useState(false);

  const [jobModal, setJobModal] = useState<{ open: boolean; job: any | null }>({ open: false, job: null });
  const [jobPlatform, setJobPlatform] = useState("WhatsApp");
  const [jobProofLink, setJobProofLink] = useState("");
  const [jobProofImage, setJobProofImage] = useState("");
  const [submittingJob, setSubmittingJob] = useState(false);

  const [blogModal, setBlogModal] = useState(false);
  const [blogForm, setBlogForm] = useState({ title: "", excerpt: "", content: "", tags: "", canonicalUrl: "" });
  const [submittingBlog, setSubmittingBlog] = useState(false);

  const [payoutModal, setPayoutModal] = useState(false);
  const [payoutForm, setPayoutForm] = useState({
    amount: "",
    paymentMethod: "upi",
    upiId: "",
    bankAccountNumber: "",
    bankIfsc: "",
    accountHolderName: "",
  });
  const [submittingPayout, setSubmittingPayout] = useState(false);

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Load Main Profile & Dashboard
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get("/campus/profile");
      if (res.data.success) {
        setIsParticipant(res.data.isParticipant);
        setParticipant(res.data.participant);
        setSettings(res.data.settings);

        if (res.data.isParticipant) {
          const dashRes = await api.get("/campus/dashboard");
          if (dashRes.data.success) {
            const m = dashRes.data.metrics || dashRes.data.stats || {};
            setMetrics({
              ...m,
              points: m.points ?? dashRes.data.participant?.points ?? 0,
              totalEarnings: m.totalEarnings ?? dashRes.data.participant?.totalEarnings ?? 0,
              approvedEarnings: m.approvedEarnings ?? dashRes.data.participant?.approvedEarnings ?? 0,
              pendingEarnings: m.pendingEarnings ?? dashRes.data.participant?.pendingEarnings ?? 0,
              rank: m.rank ?? dashRes.data.participant?.rank ?? 1,
            });
            setRecentEarnings(dashRes.data.recentEarnings || []);
            setParticipant(dashRes.data.participant);
            if (dashRes.data.settings) setSettings(dashRes.data.settings);
          }
        }
      }
    } catch (err: any) {
      console.error("Campus Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Fetch Tab-Specific Data on Tab Change
  useEffect(() => {
    if (!isParticipant) return;

    if (activeTab === "tasks") {
      api.get("/campus/tasks").then((r) => r.data.success && setTasks(r.data.tasks || []));
    } else if (activeTab === "jobs") {
      api.get("/campus/jobs").then((r) => r.data.success && setJobs(r.data.jobs || []));
    } else if (activeTab === "blogs") {
      api.get("/campus/blogs").then((r) => r.data.success && setBlogs(r.data.blogs || []));
    } else if (activeTab === "courses") {
      api.get("/campus/course-sales").then((r) => {
        if (r.data.success) {
          setCourseSales(r.data.sales || []);
          setAvailableCourses(r.data.courses || []);
        }
      });
    } else if (activeTab === "referrals") {
      api.get("/campus/referrals").then((r) => {
        if (r.data.success) {
          setReferrals(r.data.referrals || []);
          setReferralStats(r.data.stats || null);
        }
      });
    } else if (activeTab === "leaderboard") {
      api.get(`/campus/leaderboard?filter=${leaderboardFilter}`).then((r) => {
        if (r.data.success) setLeaderboard(r.data.leaderboard || []);
      });
    } else if (activeTab === "payouts") {
      api.get("/campus/earnings").then((r) => {
        if (r.data.success) {
          setEarnings(r.data.earnings || []);
          setEarningsTotals(r.data.totals || null);
        }
      });
    }
  }, [activeTab, isParticipant, leaderboardFilter]);

  // Handle Join Campus Program
  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinForm.collegeName.trim()) {
      toast.error("Please enter your college name");
      return;
    }
    try {
      setJoining(true);
      const res = await api.post("/campus/join", joinForm);
      if (res.data.success) {
        toast.success("Welcome to Codelura Campus Program! +50 points awarded 🎉");
        setIsParticipant(true);
        setParticipant(res.data.participant);
        fetchDashboard();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to join program");
    } finally {
      setJoining(false);
    }
  };

  // Copy Referral Code
  const copyReferralCode = () => {
    if (!participant?.referralCode) return;
    navigator.clipboard.writeText(participant.referralCode);
    setCopiedCode(true);
    toast.success("Referral Code copied to clipboard!");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Copy Promotion Link
  const copyPromotionLink = (url: string, id: string) => {
    const fullUrl = `${window.location.origin}${url}${url.includes("?") ? "&" : "?"}ref=${participant?.referralCode || ""}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(id);
    toast.success("Promotional link copied with your referral tag!");
    setTimeout(() => setCopiedLink(null), 2000);
  };

  // Submit Task Proof
  const handleSubmitTask = async () => {
    if (!taskModal.task) return;
    try {
      setSubmittingTask(true);
      const linksArray = taskProofLinks.split("\n").map((s) => s.trim()).filter(Boolean);
      const imagesArray = taskProofImages.split("\n").map((s) => s.trim()).filter(Boolean);

      const res = await api.post(`/campus/tasks/${taskModal.task._id}/submit`, {
        proofText: taskProofText,
        proofLinks: linksArray,
        proofImages: imagesArray,
      });

      if (res.data.success) {
        toast.success("Task proof submitted successfully for review!");
        setTaskModal({ open: false, task: null });
        setTaskProofText("");
        setTaskProofLinks("");
        setTaskProofImages("");
        const r = await api.get("/campus/tasks");
        if (r.data.success) setTasks(r.data.tasks || []);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit task proof");
    } finally {
      setSubmittingTask(false);
    }
  };

  // Submit Job Promotion Proof
  const handleSubmitJob = async () => {
    if (!jobModal.job) return;
    try {
      setSubmittingJob(true);
      const res = await api.post("/campus/jobs/promote", {
        jobId: jobModal.job._id,
        platform: jobPlatform,
        proofLink: jobProofLink,
        proofImage: jobProofImage,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Job promotion proof submitted!");
        setJobModal({ open: false, job: null });
        setJobProofLink("");
        setJobProofImage("");
        const r = await api.get("/campus/jobs");
        if (r.data.success) setJobs(r.data.jobs || []);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit job proof");
    } finally {
      setSubmittingJob(false);
    }
  };

  // Submit Blog
  const handleSubmitBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title.trim() || !blogForm.content.trim()) {
      toast.error("Please provide a title and article content");
      return;
    }
    try {
      setSubmittingBlog(true);
      const tagsArray = blogForm.tags.split(",").map((s) => s.trim()).filter(Boolean);
      const res = await api.post("/campus/blogs/submit", {
        ...blogForm,
        tags: tagsArray,
      });
      if (res.data.success) {
        toast.success("Blog article submitted for review! Once published, genuine views will earn rewards.");
        setBlogModal(false);
        setBlogForm({ title: "", excerpt: "", content: "", tags: "", canonicalUrl: "" });
        const r = await api.get("/campus/blogs");
        if (r.data.success) setBlogs(r.data.blogs || []);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit blog");
    } finally {
      setSubmittingBlog(false);
    }
  };

  // Request Payout
  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(payoutForm.amount);
    const minAmt = settings?.minPayoutAmount || 100;
    if (isNaN(amt) || amt < minAmt) {
      toast.error(`Minimum withdrawal amount is ₹${minAmt}`);
      return;
    }
    try {
      setSubmittingPayout(true);
      const paymentDetails =
        payoutForm.paymentMethod === "upi"
          ? { upiId: payoutForm.upiId }
          : {
              bankAccountNumber: payoutForm.bankAccountNumber,
              bankIfsc: payoutForm.bankIfsc,
              accountHolderName: payoutForm.accountHolderName,
            };

      const res = await api.post("/campus/payout/request", {
        amount: amt,
        paymentMethod: payoutForm.paymentMethod,
        paymentDetails,
      });

      if (res.data.success) {
        toast.success("Payout request submitted successfully!");
        setPayoutModal(false);
        setPayoutForm({
          amount: "",
          paymentMethod: "upi",
          upiId: "",
          bankAccountNumber: "",
          bankIfsc: "",
          accountHolderName: "",
        });
        fetchDashboard();
        const r = await api.get("/campus/earnings");
        if (r.data.success) {
          setEarnings(r.data.earnings || []);
          setEarningsTotals(r.data.totals || null);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit payout request");
    } finally {
      setSubmittingPayout(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070814] text-white flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 size={32} className="animate-spin text-purple-500" />
          <p className="text-sm font-medium">Loading Codelura Campus Program...</p>
        </div>
      </div>
    );
  }

  /* ────────────────────────────────────────────────────────────
     ONBOARDING SCREEN (If User has not joined yet)
  ──────────────────────────────────────────────────────────── */
  if (!isParticipant) {
    return (
      <div className="min-h-screen bg-[#070814] text-white p-4 sm:p-8 font-sans">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-[#12142B] via-[#0D0F21] to-[#080914] p-6 sm:p-10 shadow-2xl">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/50 px-3.5 py-1 text-xs font-bold text-purple-300">
                  <Sparkles size={14} className="text-yellow-400" />
                  CODELURA CAMPUS AMBASSADOR PROGRAM
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Lead Tech Culture at Your College &amp; Earn Rewards
                </h1>
                <p className="text-sm sm:base text-slate-300 max-w-xl leading-relaxed">
                  Join an exclusive network of student ambassadors across India. Promote tech courses, share job alerts,
                  write blogs, complete campus tasks, and earn real cash rewards &amp; verified certificates.
                </p>
              </div>
            </div>

            {/* Perks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
              <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-3">
                  <DollarSign size={20} />
                </div>
                <h4 className="text-sm font-bold text-white">10% Course Commission</h4>
                <p className="text-xs text-slate-400 mt-1">Earn 10% direct payout on every paid course purchase.</p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
                  <Briefcase size={20} />
                </div>
                <h4 className="text-sm font-bold text-white">₹1 – ₹2 Job Sharing</h4>
                <p className="text-xs text-slate-400 mt-1">Circulate genuine hiring alerts in your student groups.</p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
                  <BookOpen size={20} />
                </div>
                <h4 className="text-sm font-bold text-white">₹20 Blog Milestones</h4>
                <p className="text-xs text-slate-400 mt-1">Write tech guides. Cross 500 views &amp; unlock payouts.</p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                  <Trophy size={20} />
                </div>
                <h4 className="text-sm font-bold text-white">Leaderboard &amp; Perks</h4>
                <p className="text-xs text-slate-400 mt-1">Earn leaderboard ranks, swag bags, and experience letters.</p>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="rounded-3xl border border-white/10 bg-[#0C0E1F] p-6 sm:p-8 shadow-xl">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <GraduationCap className="text-purple-400" />
              Join the Program in 30 Seconds
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 mb-6">
              Enter your college and academic info to instantly get your unique referral code and campus dashboard.
            </p>

            <form onSubmit={handleJoin} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    College / University Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Delhi Technological University, DTU"
                    value={joinForm.collegeName}
                    onChange={(e) => setJoinForm({ ...joinForm, collegeName: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Branch / Degree</label>
                  <input
                    type="text"
                    placeholder="e.g. B.Tech Computer Science"
                    value={joinForm.branch}
                    onChange={(e) => setJoinForm({ ...joinForm, branch: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Year of Study</label>
                  <select
                    value={joinForm.year}
                    onChange={(e) => setJoinForm({ ...joinForm, year: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#12142B] px-4 py-3 text-xs sm:text-sm text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate / Alumni">Postgraduate / Alumni</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">WhatsApp / Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 9876543210"
                    value={joinForm.phone}
                    onChange={(e) => setJoinForm({ ...joinForm, phone: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Short Bio / Why do you want to represent Codelura? (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your student clubs, interests, or leadership experience..."
                  value={joinForm.bio}
                  onChange={(e) => setJoinForm({ ...joinForm, bio: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={joining}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-600/30 transition hover:brightness-110 disabled:opacity-50"
                >
                  {joining ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Complete Registration &amp; Get +50 Welcome Points
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  /* ────────────────────────────────────────────────────────────
     MAIN CAMPUS DASHBOARD (Active Participant)
  ──────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#070814] text-white p-4 sm:p-8 font-sans">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Top Header Card */}
        <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-[#12142B] via-[#0E1022] to-[#070814] p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-950/60 px-3 py-1 text-xs font-bold text-purple-300">
                  <GraduationCap size={13} className="text-purple-400" />
                  CAMPUS AMBASSADOR
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3 py-1 text-xs font-bold text-emerald-300">
                  <CheckCircle2 size={13} />
                  Status: {participant?.status?.toUpperCase() || "ACTIVE"}
                </span>
                {participant?.campusId && (
                  <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-mono text-slate-300">
                    ID: {participant.campusId}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                {participant?.user?.name || "Campus Ambassador"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2">
                <Building2 size={15} className="text-indigo-400" />
                <span className="font-semibold text-white">{participant?.collegeName || "Your College"}</span>
                {participant?.branch && <span>• {participant.branch}</span>}
                {participant?.year && <span>({participant.year})</span>}
              </p>
            </div>

            {/* Referral Code Box */}
            <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:p-4 backdrop-blur-md">
              <div className="space-y-0.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Your Unique Referral Code
                </p>
                <p className="text-base sm:text-lg font-mono font-extrabold text-yellow-400 tracking-wider">
                  {participant?.referralCode}
                </p>
              </div>
              <button
                onClick={copyReferralCode}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2.5 text-xs font-bold text-white transition shadow-md"
              >
                {copiedCode ? <Check size={14} className="text-white" /> : <Copy size={14} />}
                {copiedCode ? "Copied!" : "Copy Code"}
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-white/10">
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3.5">
              <p className="text-[11px] font-medium text-slate-400">Total Earnings</p>
              <p className="text-lg sm:text-xl font-bold text-emerald-400 mt-0.5">
                ₹{metrics?.totalEarnings?.toLocaleString("en-IN") || 0}
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3.5">
              <p className="text-[11px] font-medium text-slate-400">Approved Balance</p>
              <p className="text-lg sm:text-xl font-bold text-white mt-0.5">
                ₹{metrics?.approvedEarnings?.toLocaleString("en-IN") || 0}
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3.5">
              <p className="text-[11px] font-medium text-slate-400">Campus Points</p>
              <p className="text-lg sm:text-xl font-bold text-yellow-400 mt-0.5 flex items-center gap-1">
                <Sparkles size={16} />
                {metrics?.points || 0}
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3.5">
              <p className="text-[11px] font-medium text-slate-400">Leaderboard Rank</p>
              <p className="text-lg sm:text-xl font-bold text-indigo-400 mt-0.5 flex items-center gap-1">
                <Trophy size={16} />
                #{metrics?.rank || "-"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3.5">
              <p className="text-[11px] font-medium text-slate-400">Course Sales</p>
              <p className="text-lg sm:text-xl font-bold text-purple-400 mt-0.5">
                {metrics?.courseSalesCount || 0} (10%)
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3.5">
              <p className="text-[11px] font-medium text-slate-400">Referrals Joined</p>
              <p className="text-lg sm:text-xl font-bold text-cyan-400 mt-0.5">
                {metrics?.totalReferralsCount || 0} Students
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 scrollbar-none">
          {[
            { id: "overview", label: "Overview", icon: TrendingUp },
            { id: "courses", label: "Course Sales (10%)", icon: DollarSign },
            { id: "jobs", label: "Job Promotions (₹1-₹2)", icon: Briefcase },
            { id: "blogs", label: "Blog Program (₹20)", icon: BookOpen },
            { id: "tasks", label: "Campus Tasks", icon: CheckCircle2 },
            { id: "referrals", label: "My Referrals", icon: Users },
            { id: "leaderboard", label: "Leaderboard", icon: Trophy },
            { id: "payouts", label: "Earnings & Payouts", icon: Wallet },
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
           TAB 1: OVERVIEW
        ──────────────────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-white/10 bg-[#0E1022] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Pending Earnings</span>
                  <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Clock size={16} />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-amber-400 mt-2">
                  ₹{metrics?.pendingEarnings?.toLocaleString("en-IN") || 0}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Awaiting admin review / verification</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0E1022] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Approved Balance</span>
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Wallet size={16} />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-emerald-400 mt-2">
                  ₹{metrics?.approvedEarnings?.toLocaleString("en-IN") || 0}
                </p>
                <button
                  onClick={() => setPayoutModal(true)}
                  className="text-xs text-purple-400 font-bold hover:underline mt-1 inline-flex items-center gap-1"
                >
                  Request Payout <ArrowUpRight size={12} />
                </button>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0E1022] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Completed Tasks</span>
                  <div className="h-8 w-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <CheckCircle2 size={16} />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-white mt-2">{metrics?.completedTasksCount || 0}</p>
                <p className="text-[11px] text-slate-500 mt-1">Tasks verified by Codelura team</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0E1022] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Job Promotions</span>
                  <div className="h-8 w-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Share2 size={16} />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-blue-400 mt-2">{metrics?.jobPromotionsCount || 0}</p>
                <p className="text-[11px] text-slate-500 mt-1">Verified hiring post shares</p>
              </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#0C0E1F] p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Flame className="text-orange-400" size={18} />
                  Ways to Maximize Earnings &amp; Points This Week
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div
                    onClick={() => setActiveTab("courses")}
                    className="group cursor-pointer rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-purple-500/40 hover:bg-purple-950/20"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-300">10% COMMISSION</span>
                      <ArrowUpRight size={15} className="text-slate-400 group-hover:text-white" />
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1">Promote Paid Courses</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Share your unique course link. When any student enrolls, earn 10% instant commission!
                    </p>
                  </div>

                  <div
                    onClick={() => setActiveTab("jobs")}
                    className="group cursor-pointer rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-blue-500/40 hover:bg-blue-950/20"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-300">₹{settings?.jobPromotionReward || 2} REWARD</span>
                      <ArrowUpRight size={15} className="text-slate-400 group-hover:text-white" />
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1">Share Job Alerts</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Circulate active off-campus job links in WhatsApp/Telegram college groups.
                    </p>
                  </div>

                  <div
                    onClick={() => setActiveTab("blogs")}
                    className="group cursor-pointer rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-emerald-500/40 hover:bg-emerald-950/20"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-300">₹{settings?.blogViewsReward || 20} MILESTONE</span>
                      <ArrowUpRight size={15} className="text-slate-400 group-hover:text-white" />
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1">Publish Technical Articles</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Write tutorials or roadmaps. Reach 500+ genuine views to earn ₹20 reward per blog!
                    </p>
                  </div>

                  <div
                    onClick={() => setActiveTab("tasks")}
                    className="group cursor-pointer rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-amber-500/40 hover:bg-amber-950/20"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300">CAMPUS TASKS</span>
                      <ArrowUpRight size={15} className="text-slate-400 group-hover:text-white" />
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1">Complete Outreach Tasks</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Host coding sessions, distribute posters, or onboard batchmates for high points.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0C0E1F] p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center justify-between">
                  <span>Recent Earnings Activity</span>
                  <button
                    onClick={() => setActiveTab("payouts")}
                    className="text-xs text-purple-400 font-bold hover:underline"
                  >
                    View All
                  </button>
                </h3>

                {recentEarnings.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    <Clock size={28} className="mx-auto mb-2 opacity-40" />
                    No recent activity yet. Start promoting courses or sharing jobs!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentEarnings.slice(0, 5).map((earn) => (
                      <div
                        key={earn._id}
                        className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs"
                      >
                        <div className="space-y-0.5">
                          <p className="font-semibold text-white truncate max-w-[170px]">{earn.description}</p>
                          <p className="text-[10px] text-slate-400">
                            {new Date(earn.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-bold ${
                              earn.amount > 0 ? "text-emerald-400" : "text-yellow-400"
                            }`}
                          >
                            {earn.amount > 0 ? `+₹${earn.amount}` : `+${earn.points} pts`}
                          </p>
                          <span
                            className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                              earn.status === "approved"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : earn.status === "paid"
                                ? "bg-blue-500/20 text-blue-300"
                                : "bg-amber-500/20 text-amber-300"
                            }`}
                          >
                            {earn.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────
           TAB 2: COURSE SALES (10% COMMISSION)
        ──────────────────────────────────────────────────────────── */}
        {activeTab === "courses" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-[#0E1022] to-indigo-950/40 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  Direct Cash Commissions
                </span>
                <h2 className="text-xl font-extrabold text-white">
                  Earn {settings?.courseCommissionPercent || 10}% on Every Course Sale
                </h2>
                <p className="text-xs text-slate-300 max-w-xl">
                  Copy the tracked link for any Codelura course below. When a student clicks your link and enrolls,
                  10% of the price is credited to your balance upon payment confirmation!
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-xs text-slate-400 font-medium">Your Sales Volume</p>
                <p className="text-2xl font-bold text-emerald-400">
                  ₹{courseSales.reduce((acc, s) => acc + (s.commissionAmount || 0), 0).toLocaleString("en-IN")}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{courseSales.length} Total Sales</p>
              </div>
            </div>

            {/* Available Courses Grid */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">
                Courses Available for Promotion
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableCourses.map((course) => {
                  const courseUrl = `/courses/${course.slug || course._id}`;
                  const isCopied = copiedLink === course._id;
                  const commissionAmt = Math.round(((course.price || 0) * (settings?.courseCommissionPercent || 10)) / 100);

                  return (
                    <div
                      key={course._id}
                      className="rounded-2xl border border-white/10 bg-[#0E1022] p-5 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                            {course.category || "Development"}
                          </span>
                          <span className="text-sm font-extrabold text-white">₹{course.price || 0}</span>
                        </div>

                        <h4 className="text-base font-bold text-white line-clamp-2">{course.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2">{course.subtitle || course.description}</p>
                      </div>

                      <div className="pt-3 border-t border-white/10 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Your Earning (10%):</span>
                          <span className="font-bold text-emerald-400">₹{commissionAmt} / sale</span>
                        </div>

                        <button
                          onClick={() => copyPromotionLink(courseUrl, course._id)}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2 text-xs font-bold text-white transition"
                        >
                          {isCopied ? <Check size={14} /> : <Copy size={14} />}
                          {isCopied ? "Link Copied!" : "Copy Promotion Link"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Course Sales Ledger */}
            <div className="rounded-2xl border border-white/10 bg-[#0C0E1F] p-6 space-y-4">
              <h3 className="text-base font-bold text-white">Your Course Sales Ledger</h3>

              {courseSales.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  <DollarSign size={32} className="mx-auto mb-2 opacity-30" />
                  No course sales recorded yet. Share your tracked course links in college groups to make your first sale!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-white/5 uppercase text-[10px] text-slate-400">
                      <tr>
                        <th className="p-3">Course</th>
                        <th className="p-3">Buyer</th>
                        <th className="p-3">Course Price</th>
                        <th className="p-3">Commission (10%)</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {courseSales.map((sale) => (
                        <tr key={sale._id} className="hover:bg-white/[0.02]">
                          <td className="p-3 font-semibold text-white">{sale.course?.title || "Course"}</td>
                          <td className="p-3 text-slate-400">{sale.buyer?.name || "Student"}</td>
                          <td className="p-3 font-medium">₹{sale.coursePrice}</td>
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
           TAB 3: JOB PROMOTIONS (₹1–₹2 REWARDS)
        ──────────────────────────────────────────────────────────── */}
        {activeTab === "jobs" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-950/40 via-[#0E1022] to-purple-950/40 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  Social &amp; College Sharing Rewards
                </span>
                <h2 className="text-xl font-extrabold text-white">
                  Share Jobs &amp; Earn ₹{settings?.jobPromotionReward || 2} Per Verified Share
                </h2>
                <p className="text-xs text-slate-300 max-w-xl">
                  Pick any active job or internship alert below. Share it to your college WhatsApp/Telegram/LinkedIn
                  networks, submit the screenshot/post link, and earn instant rewards!
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-xs text-slate-400 font-medium">Verified Job Promos</p>
                <p className="text-2xl font-bold text-blue-400">{metrics?.jobPromotionsCount || 0}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Anti-Spam Verified</p>
              </div>
            </div>

            {/* Active Jobs List */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">
                Active Job Openings Ready for Sharing
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.map((job) => {
                  const jobUrl = `/career/jobs/${job.slug || job._id}`;
                  const isCopied = copiedLink === job._id;

                  return (
                    <div
                      key={job._id}
                      className="rounded-2xl border border-white/10 bg-[#0E1022] p-5 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                            {job.jobType || "Full Time"}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">{job.company || "Company"}</span>
                        </div>

                        <h4 className="text-base font-bold text-white line-clamp-1">{job.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {job.location || "Remote"} • {job.experience || "Fresher"}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-white/10 space-y-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyPromotionLink(jobUrl, job._id)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 py-2 text-xs font-bold text-slate-200 transition"
                          >
                            {isCopied ? <Check size={13} /> : <Copy size={13} />}
                            {isCopied ? "Copied" : "Copy Link"}
                          </button>

                          <button
                            onClick={() => setJobModal({ open: true, job })}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 py-2 text-xs font-bold text-white transition shadow-md"
                          >
                            <Send size={13} />
                            Submit Proof
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────
           TAB 4: BLOG WRITING PROGRAM (₹20 REWARDS)
        ──────────────────────────────────────────────────────────── */}
        {activeTab === "blogs" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/40 via-[#0E1022] to-teal-950/40 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Technical Writing &amp; Thought Leadership
                </span>
                <h2 className="text-xl font-extrabold text-white">
                  Write Tech Blogs &amp; Earn ₹{settings?.blogViewsReward || 20} at 500 Views
                </h2>
                <p className="text-xs text-slate-300 max-w-xl">
                  Publish programming guides, interview experiences, or framework tutorials. Once approved by our team,
                  your article goes live on Codelura Blog. When it achieves {settings?.blogViewsThreshold || 500} unique
                  genuine views, ₹{settings?.blogViewsReward || 20} is automatically added to your balance!
                </p>
              </div>

              <button
                onClick={() => setBlogModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition hover:brightness-110 whitespace-nowrap"
              >
                <Plus size={15} />
                Submit New Article
              </button>
            </div>

            {/* Submitted Blogs List */}
            <div className="rounded-2xl border border-white/10 bg-[#0C0E1F] p-6 space-y-4">
              <h3 className="text-base font-bold text-white">Your Campus Blog Submissions</h3>

              {blogs.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  <BookOpen size={32} className="mx-auto mb-2 opacity-30" />
                  You haven't submitted any articles yet. Share your coding knowledge and earn ₹20 per milestone!
                </div>
              ) : (
                <div className="space-y-4">
                  {blogs.map((b) => {
                    const views = b.views || 0;
                    const target = settings?.blogViewsThreshold || 500;
                    const percent = Math.min(100, Math.round((views / target) * 100));

                    return (
                      <div
                        key={b._id}
                        className="rounded-xl border border-white/10 bg-[#0E1022] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
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
                            <span className="text-xs text-slate-400">
                              {new Date(b.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-white">{b.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-2">{b.excerpt || b.content?.slice(0, 120)}</p>

                          <div className="pt-2 max-w-md">
                            <div className="flex items-center justify-between text-[11px] mb-1">
                              <span className="text-slate-400">
                                Genuine Views: <strong className="text-white">{views}</strong> / {target}
                              </span>
                              <span className="font-bold text-emerald-400">
                                {b.reached500Views ? "₹20 Reward Claimed ✓" : `${percent}%`}
                              </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {b.publishedBlog && (
                          <a
                            href={`/blogs/${b.publishedBlog.slug || b.publishedBlog._id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-bold text-purple-300 transition"
                          >
                            <ExternalLink size={13} />
                            View Published Article
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────
           TAB 5: CAMPUS TASKS
        ──────────────────────────────────────────────────────────── */}
        {activeTab === "tasks" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#0E1022] p-6 space-y-1">
              <h2 className="text-xl font-extrabold text-white">Campus Ambassador Action Tasks</h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Complete official outreach tasks, workshops, social campaigns, and posters to earn points and climb the
                leaderboard.
              </p>
            </div>

            <div className="space-y-4">
              {tasks.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-[#0C0E1F] p-8 text-center text-slate-500 text-xs">
                  <CheckCircle2 size={32} className="mx-auto mb-2 opacity-30" />
                  No tasks assigned currently. New campus campaigns will appear here soon!
                </div>
              ) : (
                tasks.map((task) => {
                  const hasSubmitted = !!task.mySubmission;
                  const submissionStatus = task.mySubmission?.status;

                  return (
                    <div
                      key={task._id}
                      className="rounded-2xl border border-white/10 bg-[#0E1022] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold">
                            {task.category || "Outreach"}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-bold flex items-center gap-1">
                            <Sparkles size={12} />
                            +{task.points} Points
                          </span>
                          {task.rewardAmount > 0 && (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                              +₹{task.rewardAmount}
                            </span>
                          )}
                        </div>

                        <h4 className="text-base font-bold text-white">{task.title}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{task.description}</p>
                        {task.guidelines && (
                          <p className="text-[11px] text-slate-400 bg-white/5 p-2.5 rounded-lg border border-white/5">
                            <strong>Guidelines:</strong> {task.guidelines}
                          </p>
                        )}
                      </div>

                      <div>
                        {hasSubmitted ? (
                          <div className="text-right space-y-1">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                submissionStatus === "approved"
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : submissionStatus === "rejected"
                                  ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              }`}
                            >
                              Proof {submissionStatus}
                            </span>
                            <p className="text-[10px] text-slate-400">
                              {submissionStatus === "pending"
                                ? "Under Review"
                                : `Awarded: +${task.mySubmission.pointsAwarded} pts`}
                            </p>
                          </div>
                        ) : (
                          <button
                            onClick={() => setTaskModal({ open: true, task })}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 px-5 py-2.5 text-xs font-bold text-white shadow-md transition"
                          >
                            <Send size={14} />
                            Submit Proof
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────
           TAB 6: MY REFERRALS
        ──────────────────────────────────────────────────────────── */}
        {activeTab === "referrals" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#0E1022] p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-extrabold text-white">Your Campus Referral Network</h2>
                  <p className="text-xs text-slate-400">
                    Students who sign up using your referral code are tagged under your profile.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={copyReferralCode}
                    className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2.5 text-xs font-bold text-white transition shadow-md"
                  >
                    {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                    {copiedCode ? "Code Copied!" : "Copy My Referral Code"}
                  </button>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
                  <p className="text-xs text-slate-400 font-medium">Total Registered</p>
                  <p className="text-2xl font-bold text-white mt-1">{referralStats?.totalRegistered || 0}</p>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
                  <p className="text-xs text-slate-400 font-medium">Email Verified</p>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">{referralStats?.verified || 0}</p>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
                  <p className="text-xs text-slate-400 font-medium">Course Sales From Referrals</p>
                  <p className="text-2xl font-bold text-purple-400 mt-1">
                    {referralStats?.totalSalesFromReferrals || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Referrals List Table */}
            <div className="rounded-2xl border border-white/10 bg-[#0C0E1F] p-6 space-y-4">
              <h3 className="text-base font-bold text-white">Registered Students</h3>

              {referrals.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  <Users size={32} className="mx-auto mb-2 opacity-30" />
                  No students registered via your referral code yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-white/5 uppercase text-[10px] text-slate-400">
                      <tr>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {referrals.map((u) => (
                        <tr key={u._id} className="hover:bg-white/[0.02]">
                          <td className="p-3 font-semibold text-white">{u.name}</td>
                          <td className="p-3 text-slate-400">{u.email}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                u.isEmailVerified
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : "bg-slate-500/20 text-slate-400"
                              }`}
                            >
                              {u.isEmailVerified ? "Verified" : "Unverified"}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400">
                            {new Date(u.createdAt).toLocaleDateString("en-IN", {
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
           TAB 7: LEADERBOARD
        ──────────────────────────────────────────────────────────── */}
        {activeTab === "leaderboard" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#0E1022] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <Trophy className="text-yellow-400" />
                  Campus Ambassador Leaderboard
                </h2>
                <p className="text-xs text-slate-400">
                  Top performers receive monthly performance stipends, Codelura merch kits, and recommendation letters.
                </p>
              </div>

              <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 p-1">
                {(["alltime", "monthly", "weekly"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setLeaderboardFilter(filter)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition ${
                      leaderboardFilter === filter
                        ? "bg-purple-600 text-white shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0C0E1F] p-6 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-white/5 uppercase text-[10px] text-slate-400">
                    <tr>
                      <th className="p-3 w-16">Rank</th>
                      <th className="p-3">Ambassador</th>
                      <th className="p-3">College</th>
                      <th className="p-3 text-right">Points</th>
                      <th className="p-3 text-right">Badge</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {leaderboard.map((item, idx) => {
                      const isMe = item._id === participant?._id;
                      const rank = idx + 1;

                      return (
                        <tr
                          key={item._id}
                          className={`transition ${
                            isMe ? "bg-purple-950/30 border-l-4 border-purple-500" : "hover:bg-white/[0.02]"
                          }`}
                        >
                          <td className="p-3 font-extrabold text-sm">
                            {rank === 1 ? (
                              <span className="text-yellow-400">🥇 1</span>
                            ) : rank === 2 ? (
                              <span className="text-slate-300">🥈 2</span>
                            ) : rank === 3 ? (
                              <span className="text-amber-600">🥉 3</span>
                            ) : (
                              `#${rank}`
                            )}
                          </td>
                          <td className="p-3 font-semibold text-white flex items-center gap-2">
                            {item.user?.name || "Ambassador"}
                            {isMe && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-600 text-white">
                                You
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-slate-300 font-medium">{item.collegeName || "—"}</td>
                          <td className="p-3 text-right font-extrabold text-yellow-400">
                            {item.leaderboardPoints || item.points || 0} pts
                          </td>
                          <td className="p-3 text-right">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-purple-300 border border-purple-500/20">
                              {item.badge || "Campus Lead"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────
           TAB 8: EARNINGS & PAYOUTS
        ──────────────────────────────────────────────────────────── */}
        {activeTab === "payouts" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/10 bg-[#0E1022] p-5">
                <span className="text-xs text-slate-400 font-medium">Total Lifetime Earnings</span>
                <p className="text-2xl font-extrabold text-emerald-400 mt-2">
                  ₹{earningsTotals?.totalEarnings?.toLocaleString("en-IN") || 0}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Across all campaigns &amp; courses</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0E1022] p-5">
                <span className="text-xs text-slate-400 font-medium">Approved / Withdrawable Balance</span>
                <p className="text-2xl font-extrabold text-white mt-2">
                  ₹{earningsTotals?.approvedEarnings?.toLocaleString("en-IN") || 0}
                </p>
                <button
                  onClick={() => setPayoutModal(true)}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2 text-xs font-bold text-white transition shadow-md"
                >
                  <Wallet size={13} />
                  Request Payout (Min ₹{settings?.minPayoutAmount || 100})
                </button>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0E1022] p-5">
                <span className="text-xs text-slate-400 font-medium">Paid Out to Date</span>
                <p className="text-2xl font-extrabold text-blue-400 mt-2">
                  ₹{earningsTotals?.paidEarnings?.toLocaleString("en-IN") || 0}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Successfully transferred to UPI/Bank</p>
              </div>
            </div>

            {/* Earnings History Table */}
            <div className="rounded-2xl border border-white/10 bg-[#0C0E1F] p-6 space-y-4">
              <h3 className="text-base font-bold text-white">Full Earnings &amp; Rewards Ledger</h3>

              {earnings.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  <Wallet size={32} className="mx-auto mb-2 opacity-30" />
                  No earnings ledger entries found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-white/5 uppercase text-[10px] text-slate-400">
                      <tr>
                        <th className="p-3">Description</th>
                        <th className="p-3">Source</th>
                        <th className="p-3">Cash / Points</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {earnings.map((e) => (
                        <tr key={e._id} className="hover:bg-white/[0.02]">
                          <td className="p-3 font-semibold text-white">{e.description}</td>
                          <td className="p-3 uppercase text-[10px] text-slate-400 font-mono">{e.source}</td>
                          <td className="p-3 font-bold text-emerald-400">
                            {e.amount > 0 ? `+₹${e.amount}` : `+${e.points} pts`}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                e.status === "approved"
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : e.status === "paid"
                                  ? "bg-blue-500/20 text-blue-300"
                                  : "bg-amber-500/20 text-amber-300"
                              }`}
                            >
                              {e.status}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400">
                            {new Date(e.createdAt).toLocaleDateString("en-IN", {
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
           MODALS
        ──────────────────────────────────────────────────────────── */}

        {/* 1. Task Proof Modal */}
        <AnimatePresence>
          {taskModal.open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0E1022] p-6 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Submit Task Proof: {taskModal.task?.title}</h3>
                  <button
                    onClick={() => setTaskModal({ open: false, task: null })}
                    className="text-slate-400 hover:text-white text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Proof Description / Details
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Explain how you completed this task..."
                      value={taskProofText}
                      onChange={(e) => setTaskProofText(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Proof Links (LinkedIn post, tweet, Google Drive link, etc. - 1 per line)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="https://linkedin.com/posts/..."
                      value={taskProofLinks}
                      onChange={(e) => setTaskProofLinks(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Screenshot / Image URLs (Optional - 1 per line)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="https://i.imgur.com/... or Google Drive public link"
                      value={taskProofImages}
                      onChange={(e) => setTaskProofImages(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setTaskModal({ open: false, task: null })}
                    className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitTask}
                    disabled={submittingTask}
                    className="rounded-xl bg-purple-600 hover:bg-purple-500 px-5 py-2.5 text-xs font-bold text-white shadow-md disabled:opacity-50"
                  >
                    {submittingTask ? "Submitting..." : "Submit Proof"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 2. Job Promotion Modal */}
        <AnimatePresence>
          {jobModal.open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0E1022] p-6 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">
                    Submit Job Sharing Proof: {jobModal.job?.title}
                  </h3>
                  <button
                    onClick={() => setJobModal({ open: false, job: null })}
                    className="text-slate-400 hover:text-white text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Platform Where Shared</label>
                    <select
                      value={jobPlatform}
                      onChange={(e) => setJobPlatform(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#12142B] p-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="WhatsApp">WhatsApp Group / Status</option>
                      <option value="Telegram">Telegram Student Channel</option>
                      <option value="LinkedIn">LinkedIn Post</option>
                      <option value="Discord">Discord Server</option>
                      <option value="Instagram">Instagram Story / Broadcast</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Post Link / Share URL (if public)
                    </label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/feed/update/..."
                      value={jobProofLink}
                      onChange={(e) => setJobProofLink(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Screenshot Image URL (Imgur / Drive / Image URL)
                    </label>
                    <input
                      type="url"
                      placeholder="https://i.imgur.com/screenshot.png"
                      value={jobProofImage}
                      onChange={(e) => setJobProofImage(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setJobModal({ open: false, job: null })}
                    className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitJob}
                    disabled={submittingJob}
                    className="rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-xs font-bold text-white shadow-md disabled:opacity-50"
                  >
                    {submittingJob ? "Submitting..." : "Submit Proof (+₹2)"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 3. Blog Submit Modal */}
        <AnimatePresence>
          {blogModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0E1022] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <BookOpen className="text-emerald-400" size={18} />
                    Submit Technical Blog for Review &amp; Rewards
                  </h3>
                  <button onClick={() => setBlogModal(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmitBlog} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Article Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Complete Guide to System Design for College Students"
                      value={blogForm.title}
                      onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Short Excerpt / Summary</label>
                    <input
                      type="text"
                      placeholder="1-2 sentences summarizing the article"
                      value={blogForm.excerpt}
                      onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Article Content (Markdown supported) <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows={8}
                      required
                      placeholder="Write your article in markdown or paste your content here..."
                      value={blogForm.content}
                      onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs font-mono text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (comma-separated)</label>
                      <input
                        type="text"
                        placeholder="React, JavaScript, Career"
                        value={blogForm.tags}
                        onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Canonical URL (Optional if cross-posted)
                      </label>
                      <input
                        type="url"
                        placeholder="https://medium.com/@you/..."
                        value={blogForm.canonicalUrl}
                        onChange={(e) => setBlogForm({ ...blogForm, canonicalUrl: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setBlogModal(false)}
                      className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingBlog}
                      className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-md disabled:opacity-50"
                    >
                      {submittingBlog ? "Submitting..." : "Submit for Editorial Review"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 4. Request Payout Modal */}
        <AnimatePresence>
          {payoutModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0E1022] p-6 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Wallet className="text-purple-400" size={18} />
                    Request Earnings Payout
                  </h3>
                  <button
                    onClick={() => setPayoutModal(false)}
                    className="text-slate-400 hover:text-white text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="rounded-xl bg-white/5 p-3 text-xs text-slate-300">
                  <p>
                    Available Approved Balance:{" "}
                    <strong className="text-emerald-400">
                      ₹{metrics?.approvedEarnings?.toLocaleString("en-IN") || 0}
                    </strong>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Minimum Payout: ₹{settings?.minPayoutAmount || 100}
                  </p>
                </div>

                <form onSubmit={handleRequestPayout} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Withdrawal Amount (₹) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={settings?.minPayoutAmount || 100}
                      max={metrics?.approvedEarnings || 0}
                      placeholder={`e.g. ${settings?.minPayoutAmount || 100}`}
                      value={payoutForm.amount}
                      onChange={(e) => setPayoutForm({ ...payoutForm, amount: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Method</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPayoutForm({ ...payoutForm, paymentMethod: "upi" })}
                        className={`rounded-xl py-2.5 text-xs font-bold transition ${
                          payoutForm.paymentMethod === "upi"
                            ? "bg-purple-600 text-white"
                            : "bg-white/5 text-slate-400 hover:text-white"
                        }`}
                      >
                        UPI ID (GPay/PhonePe)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPayoutForm({ ...payoutForm, paymentMethod: "bank" })}
                        className={`rounded-xl py-2.5 text-xs font-bold transition ${
                          payoutForm.paymentMethod === "bank"
                            ? "bg-purple-600 text-white"
                            : "bg-white/5 text-slate-400 hover:text-white"
                        }`}
                      >
                        Bank Transfer
                      </button>
                    </div>
                  </div>

                  {payoutForm.paymentMethod === "upi" ? (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        UPI ID (VPA) <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="yourname@okhdfcbank / yourname@paytm"
                        value={payoutForm.upiId}
                        onChange={(e) => setPayoutForm({ ...payoutForm, upiId: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Account Holder Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="As per bank passbook"
                          value={payoutForm.accountHolderName}
                          onChange={(e) => setPayoutForm({ ...payoutForm, accountHolderName: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Bank Account Number <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Account Number"
                          value={payoutForm.bankAccountNumber}
                          onChange={(e) => setPayoutForm({ ...payoutForm, bankAccountNumber: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Bank IFSC Code <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. HDFC0001234"
                          value={payoutForm.bankIfsc}
                          onChange={(e) => setPayoutForm({ ...payoutForm, bankIfsc: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none uppercase"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setPayoutModal(false)}
                      className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingPayout}
                      className="rounded-xl bg-purple-600 hover:bg-purple-500 px-6 py-2.5 text-xs font-bold text-white shadow-md disabled:opacity-50"
                    >
                      {submittingPayout ? "Processing..." : "Submit Payout Request"}
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

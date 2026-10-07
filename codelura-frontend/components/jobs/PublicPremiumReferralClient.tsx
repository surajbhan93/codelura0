"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Sparkles,
  Coins,
  Search,
  Building2,
  MapPin,
  Lock,
  Unlock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Briefcase,
  Zap,
  Filter,
  RefreshCw,
  Plus,
  Mail,
  Phone,
  ExternalLink,
  Info,
  LayoutDashboard
} from "lucide-react";
import api from "@/lib/api";
import CreditBadge from "@/components/credits/CreditBadge";
import UnlockReferralButton from "@/components/jobs/UnlockReferralButton";
import BuyCreditsModal from "@/components/credits/BuyCreditsModal";
import ReferralCommentsSection from "@/components/referrals/ReferralCommentsSection";
import toast from "react-hot-toast";

interface Job {
  _id: string;
  title: string;
  slug: string;
  company: string;
  bannerImage?: string;
  location: string;
  type: string;
  salary?: string;
  tags: string[];
  description: string;
  creditCost?: number;
  isUnlocked?: boolean;
  recruiterEmail?: string;
  recruiterPhone?: string;
  referralLink?: string;
  applyInstructions?: string;
  careerPageUrl?: string;
  postedAt?: string;
}

export default function PublicPremiumReferralClient() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [userBalance, setUserBalance] = useState<number | null>(null);

  const fetchReferralJobs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs?type=premium-referral&limit=100");
      setJobs(res.data.jobs || []);
    } catch (err) {
      toast.error("Failed to load referral jobs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReferralJobs();
  }, [fetchReferralJobs]);

  const filteredJobs = jobs.filter((job) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q) ||
      (Array.isArray(job.tags) && job.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="min-h-screen bg-[#050714] text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Hero Section */}
        <div className="relative rounded-3xl border border-violet-500/30 bg-gradient-to-br from-[#0c0e29] via-[#101235] to-[#060817] p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-violet-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-extrabold uppercase tracking-wider mb-4">
                <Coins className="w-4 h-4 fill-amber-400 text-amber-400" /> Credit-Based Unlock System
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Unlock <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-violet-400 bg-clip-text text-transparent">Premium Job Referrals</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 mt-3 max-w-2xl leading-relaxed">
                Skip standard application queues. Use your credits to unlock verified recruiter email contacts, phone numbers, direct referral links, and application guidance.
              </p>
            </div>

            {/* Credit Wallet Widget connected to User Dashboard */}
            <div className="flex flex-col items-start md:items-end gap-3 flex-shrink-0 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
              <div className="flex items-center gap-2">
                <CreditBadge
                  showBuyBtn={false}
                  onBalanceChange={(bal) => setUserBalance(bal)}
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setBuyModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-extrabold transition shadow-lg shadow-violet-600/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Buy Credits
                </button>
                <Link
                  href="/dashboard/credits"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" /> Wallet
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar & Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by role, company, or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-violet-500 transition"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 w-full sm:w-auto justify-between sm:justify-end">
            <span>Showing <strong className="text-white">{filteredJobs.length}</strong> referral opportunities</span>
            <button
              onClick={fetchReferralJobs}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Refresh Jobs"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Job Grid */}
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center gap-3 text-slate-400">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs">Loading premium referrals...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-16 text-center">
            <Coins className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-300">No Referral Jobs Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Check back soon or adjust your search keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="relative rounded-2xl border border-slate-800 bg-slate-900/70 p-6 flex flex-col justify-between transition hover:border-violet-500/40 hover:bg-slate-900 shadow-xl"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        ⚡ Premium Referral
                      </span>
                      <Link href={`/jobs-Alerts/${job.slug}`}>
                        <h3 className="font-extrabold text-lg text-white mt-2 leading-snug hover:text-amber-300 transition cursor-pointer">
                          {job.title}
                        </h3>
                      </Link>
                      <p className="text-xs font-semibold text-violet-300 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3.5 h-3.5" /> {job.company}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black shadow-sm">
                        <Coins className="w-3.5 h-3.5 fill-amber-400" /> {job.creditCost || 10}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 my-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" /> {job.location}
                    </span>
                    {job.salary && (
                      <span className="text-emerald-400 font-medium">{job.salary}</span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {job.description}
                  </p>

                  {/* Unlocked Details Box */}
                  {job.isUnlocked ? (
                    <div className="rounded-xl bg-slate-950 p-4 border border-emerald-500/40 space-y-2 mb-4 text-xs shadow-inner">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs mb-2">
                        <CheckCircle2 className="w-4 h-4" /> Recruiter Details Unlocked!
                      </div>
                      {job.recruiterEmail && (
                        <p className="text-slate-300 text-xs flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-violet-400" />
                          <strong>Email:</strong> <span className="font-mono text-violet-300 select-all">{job.recruiterEmail}</span>
                        </p>
                      )}
                      {job.recruiterPhone && (
                        <p className="text-slate-300 text-xs flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          <strong>Phone:</strong> <span className="font-mono text-emerald-300 select-all">{job.recruiterPhone}</span>
                        </p>
                      )}
                      {job.applyInstructions && (
                        <p className="text-slate-400 text-xs mt-2 border-t border-slate-800 pt-2">
                          <strong>Instructions:</strong> {job.applyInstructions}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-xl bg-slate-950/60 p-3.5 border border-slate-800 space-y-1.5 mb-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px]">
                        <Lock className="w-3.5 h-3.5" /> Protected Recruiter Details
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Unlock this referral to reveal recruiter email, phone, and direct referral application URL.
                      </p>
                    </div>
                  )}

                  {/* Skill tags */}
                  {Array.isArray(job.tags) && job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {job.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <Link
                    href={`/jobs-Alerts/${job.slug}`}
                    className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold text-center transition border border-slate-700 flex items-center justify-center gap-1"
                  >
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {job.isUnlocked ? (
                    <a
                      href={job.referralLink || job.careerPageUrl || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs text-center transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20"
                    >
                      Apply via Referral Link <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <UnlockReferralButton
                      referralId={job._id}
                      creditCost={job.creditCost || 10}
                      isUnlocked={job.isUnlocked}
                      className="w-full sm:flex-1 py-2.5 text-xs font-extrabold"
                      onUnlockedSuccess={(updatedJob) => {
                        setJobs((prev) =>
                          prev.map((j) => (j._id === job._id ? { ...j, ...updatedJob, isUnlocked: true } : j))
                        );
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Student Reviews & Comments Section */}
        <ReferralCommentsSection />
      </div>

      <BuyCreditsModal
        isOpen={buyModalOpen}
        onClose={() => setBuyModalOpen(false)}
        onSuccess={(newBal) => setUserBalance(newBal)}
      />
    </div>
  );
}

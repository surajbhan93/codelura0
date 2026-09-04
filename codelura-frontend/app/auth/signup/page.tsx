"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import api from "@/lib/api";
import PasswordStrength from "@/components/PasswordStrength";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Rocket,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Trophy,
  Zap,
} from "lucide-react";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      toast.success("Account created 🎉 Check your email to verify");
      window.location.href = "/auth/check-email";
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#070814] text-white flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
      {/* ── AMBIENT AURORA BACKGROUND GLOWS ── */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute top-1/2 -right-40 w-[30rem] h-[30rem] bg-indigo-600/15 rounded-full blur-[160px]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 w-[26rem] h-[26rem] bg-cyan-600/15 rounded-full blur-[140px]" />

      {/* Subtle Matrix Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* ── LEFT SHOWCASE COLUMN (DESKTOP) ── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="hidden lg:flex lg:col-span-7 flex-col justify-between space-y-8 pr-6"
        >
          {/* TOP LOGO */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-violet-600/30">
                <div className="w-full h-full bg-[#0b0d1b] rounded-[10px] flex items-center justify-center font-black text-xl text-white group-hover:scale-105 transition">
                  C
                </div>
              </div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Codelura<span className="text-violet-500">.</span>
              </span>
            </Link>
          </div>

          {/* HEADLINE */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold tracking-wide">
              <Rocket className="w-3.5 h-3.5 text-cyan-400" /> Start Building Your Tech Future
            </div>

            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.15]">
              Join the next generation <br />
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
                of engineers & creators.
              </span>
            </h1>

            <p className="text-slate-400 text-base max-w-lg leading-relaxed">
              Create your account in under a minute and get immediate access to national hackathons, developer bounties, and personalized learning roadmaps.
            </p>
          </div>

          {/* 3 VALUE BULLETS */}
          <div className="space-y-3">
            {[
              { title: "National Level Hackathons", desc: "Build real projects, win prizes & get noticed by top tech recruiters.", icon: Trophy, color: "text-amber-400 bg-amber-500/15 border-amber-500/30" },
              { title: "Industry-Ready Career Tracks", desc: "Learn Full Stack, AI, Cloud, and DevOps with real mentorship.", icon: GraduationCap, color: "text-violet-400 bg-violet-500/15 border-violet-500/30" },
              { title: "Developer Portfolio & Verified Badges", desc: "Showcase your GitHub submissions & verified certificates.", icon: ShieldCheck, color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30" },
            ].map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.07] backdrop-blur-md">
                  <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${b.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{b.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{b.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FOOTER STATS */}
          <div className="flex items-center gap-6 pt-4 border-t border-white/[0.08]">
            <div>
              <p className="text-xl font-black text-white">50K+</p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Active Developers</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <p className="text-xl font-black text-white">₹10L+</p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Prizes Awarded</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <p className="text-xl font-black text-white">100%</p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Hands-on Practice</p>
            </div>
          </div>
        </motion.div>

        {/* ── RIGHT SIGNUP CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="lg:col-span-5 w-full"
        >
          <div className="relative rounded-3xl bg-[#0f1123]/90 border border-white/[0.12] p-6 sm:p-9 shadow-[0_0_80px_rgba(99,102,241,0.2)] backdrop-blur-2xl">
            {/* Top mobile brand header */}
            <div className="lg:hidden text-center mb-6">
              <Link href="/" className="inline-flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center font-bold text-white text-sm">
                  C
                </div>
                <span className="text-xl font-bold text-white">Codelura</span>
              </Link>
            </div>

            {/* CARD TITLE */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Create an account
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Start your journey with free access to all live tracks.
              </p>
            </div>

            {/* GOOGLE ONE-CLICK SIGNUP */}
            <div className="mb-5">
              <div className="w-full flex justify-center p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-violet-500/40 transition">
                <GoogleLogin
                  onSuccess={async (res) => {
                    try {
                      const response = await api.post("/auth/google", {
                        token: res.credential,
                      });

                      if (response.data?.token) {
                        localStorage.setItem("token", response.data.token);
                        localStorage.setItem("role", response.data.user?.role || "user");

                        toast.success("Account created with Google 🚀");

                        const targetUrl = response.data.user?.role === "admin" ? "/admin" : "/dashboard/Portal";
                        window.location.href = targetUrl;
                      }
                    } catch (err: any) {
                      console.error(err);
                      toast.error(err.response?.data?.message || "Google signup failed");
                    }
                  }}
                  onError={() => toast.error("Google signup failed")}
                  width="350"
                  shape="rectangular"
                  theme="filled_black"
                  text="signup_with"
                />
              </div>
            </div>

            {/* DIVIDER */}
            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-white/[0.1]" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                Or fill details
              </span>
              <div className="flex-1 h-px bg-white/[0.1]" />
            </div>

            {/* FORM */}
            <form onSubmit={submit} className="space-y-4">
              {/* FULL NAME */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] focus:border-violet-500 focus:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-violet-500/30 text-white placeholder-slate-500 text-sm transition"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] focus:border-violet-500 focus:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-violet-500/30 text-white placeholder-slate-500 text-sm transition"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Create strong password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] focus:border-violet-500 focus:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-violet-500/30 text-white placeholder-slate-500 text-sm transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* PASSWORD STRENGTH */}
              {form.password && (
                <div className="pt-1">
                  <PasswordStrength password={form.password} />
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                type="submit"
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:via-indigo-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* TERMS & PRIVACY */}
            <p className="text-[11px] text-slate-500 text-center mt-4">
              By creating an account, you agree to our Terms of Service & Privacy Policy.
            </p>

            {/* LOGIN REDIRECT */}
            <div className="mt-5 pt-4 border-t border-white/[0.08] text-center">
              <p className="text-xs text-slate-400">
                Already part of Codelura?{" "}
                <Link
                  href="/auth/login"
                  className="font-bold text-violet-400 hover:text-violet-300 hover:underline transition ml-1"
                >
                  Sign in here →
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

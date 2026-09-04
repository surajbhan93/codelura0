"use client";

import { motion } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Trophy,
  Code2,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectParam = searchParams.get("redirect");
  const defaultTarget = (role: string) => {
    if (role === "admin") return "/admin";
    if (redirectParam && redirectParam !== "/" && redirectParam !== "/login" && redirectParam !== "/auth/login") {
      return redirectParam;
    }
    return "/dashboard";
  };

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") || "user";

    const isLoggedIn =
      token &&
      token !== "undefined" &&
      token !== "null" &&
      token.trim() !== "";

    if (isLoggedIn) {
      const target = defaultTarget(role);
      if (window.location.pathname !== target && target !== "/auth/login" && target !== "/login") {
        api.get("/auth/me")
          .then(() => {
            window.location.href = target;
          })
          .catch(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
          });
      }
    }
  }, []);

  const submit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      const { user, token } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);

      toast.success("Welcome back to Codelura 🚀");

      window.location.href = defaultTarget(user.role);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#070814] text-white flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-hidden font-sans">
      {/* ── AMBIENT AURORA BACKGROUND GLOWS ── */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute top-1/2 -right-40 w-[30rem] h-[30rem] bg-indigo-600/15 rounded-full blur-[160px]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 w-[26rem] h-[26rem] bg-fuchsia-600/15 rounded-full blur-[140px]" />

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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" /> Empowering 50,000+ Tech Innovators
            </div>

            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.15]">
              Build your career. <br />
              <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                Compete, learn & ship faster.
              </span>
            </h1>

            <p className="text-slate-400 text-base max-w-lg leading-relaxed">
              Access curated hackathons, guided career tracks, live competitions, and real-world project portfolios in one unified ecosystem.
            </p>
          </div>

          {/* INTERACTIVE FEATURE CARDS */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md hover:border-violet-500/40 transition group">
              <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-3 group-hover:scale-110 transition">
                <Trophy className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-sm">Live Hackathons</h4>
              <p className="text-xs text-slate-400 mt-1">Cash prizes, developer badges, and hiring opportunities.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md hover:border-indigo-500/40 transition group">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3 group-hover:scale-110 transition">
                <Code2 className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-sm">Career Tracks</h4>
              <p className="text-xs text-slate-400 mt-1">Hands-on industry curriculum verified by tech mentors.</p>
            </div>
          </div>

          {/* SOCIAL PROOF FOOTER */}
          <div className="flex items-center gap-4 pt-4 border-t border-white/[0.08]">
            <div className="flex -space-x-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-[#070814] bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white"
                >
                  {["A", "S", "R"][i]}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400">
              <span className="font-bold text-white">4.9/5 Rating</span> from 1,200+ developer reviews across India
            </p>
          </div>
        </motion.div>

        {/* ── RIGHT AUTH CARD ── */}
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
                Welcome back
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Enter your credentials to continue to your dashboard.
              </p>
            </div>

            {/* GOOGLE SIGN-IN */}
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

                        toast.success("Logged in with Google 🚀");

                        const targetUrl = defaultTarget(response.data.user?.role || "user");
                        window.location.href = targetUrl;
                      }
                    } catch (err: any) {
                      console.error(err);
                      toast.error(err.response?.data?.message || "Google login failed");
                    }
                  }}
                  onError={() => toast.error("Google login failed")}
                  width="350"
                  shape="rectangular"
                  theme="filled_black"
                  text="signin_with"
                />
              </div>
            </div>

            {/* DIVIDER */}
            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-white/[0.1]" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                Or with email
              </span>
              <div className="flex-1 h-px bg-white/[0.1]" />
            </div>

            {/* FORM */}
            <form onSubmit={submit} className="space-y-4">
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
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
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

              {/* REMEMBER ME */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                    className="w-4 h-4 rounded bg-white/[0.08] border-white/20 text-violet-600 focus:ring-violet-500 focus:ring-offset-0 focus:ring-1 cursor-pointer"
                  />
                  <span className="text-xs text-slate-300 font-medium">Remember this device</span>
                </label>
              </div>

              {/* SUBMIT BUTTON */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                type="submit"
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* SIGNUP REDIRECT */}
            <div className="mt-6 pt-5 border-t border-white/[0.08] text-center">
              <p className="text-xs text-slate-400">
                Don&apos;t have an account yet?{" "}
                <Link
                  href="/auth/signup"
                  className="font-bold text-violet-400 hover:text-violet-300 hover:underline transition ml-1"
                >
                  Create one for free →
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070814] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  BuildingOffice2Icon, 
  BriefcaseIcon, 
  CurrencyDollarIcon, 
  ChatBubbleLeftRightIcon,
  GlobeAltIcon,
  RocketLaunchIcon,
  UserGroupIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  EnvelopeIcon,
  BellIcon,
  ShieldCheckIcon,
  SparklesIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

// Features data
const features = [
  {
    icon: BuildingOffice2Icon,
    title: "Company Profiles",
    description: "Deep dive into culture, tech stack, locations, and growth trajectory.",
    color: "from-violet-500 to-indigo-500"
  },
  {
    icon: BriefcaseIcon,
    title: "Active Openings",
    description: "Curated internships, fresher roles, off-campus drives, and more.",
    color: "from-cyan-500 to-blue-500"
  },
  {
    icon: CurrencyDollarIcon,
    title: "Salary Insights",
    description: "Transparent compensation data, benefits, and negotiation tips.",
    color: "from-emerald-500 to-teal-500"
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: "Interview Experiences",
    description: "Real candidate stories, preparation guides, and hiring process.",
    color: "from-rose-500 to-pink-500"
  }
];

/* ── SIMPLIFIED BACKGROUND ── */
function SimpleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Single subtle gradient orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/5 blur-[120px] rounded-full" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-cyan-500/5 blur-[100px]" />
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-500/5 blur-[100px]" />
      
      {/* Very subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)
          `,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
}

/* ── STAT CARD ── */
function StatCard({ stat, index }: { stat: { label: string; value: string }; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/40 to-slate-800/20 p-6 text-center backdrop-blur-sm hover:border-violet-500/30 transition-all duration-300 hover:bg-slate-900/60 hover:shadow-xl hover:shadow-violet-500/5"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-cyan-500/0 group-hover:from-violet-500/5 group-hover:to-cyan-500/5 rounded-2xl transition-all duration-300" />
      <div className="relative">
        <motion.div 
          className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {stat.value}
        </motion.div>
        <div className="text-sm text-slate-400 mt-1 font-medium">{stat.label}</div>
      </div>
    </motion.div>
  );
}

/* ── COMING SOON CARD ── */
function ComingSoonCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const Icon = feature.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      className="group relative rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/40 to-slate-800/20 p-6 text-left backdrop-blur-sm hover:border-violet-500/30 transition-all duration-300 hover:bg-slate-900/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/5"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-cyan-500/0 group-hover:from-violet-500/5 group-hover:to-cyan-500/5 rounded-2xl transition-all duration-300" />
      
      {/* Coming Soon Badge */}
      <div className="absolute top-4 right-4">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-[10px] font-medium backdrop-blur-sm">
          <ClockIcon className="w-3 h-3" />
          Coming Soon
        </span>
      </div>

      <div className="relative">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color}/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300`}>
          <Icon className="w-6 h-6 text-violet-400" />
        </div>
        <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-violet-300 transition-colors">
          {feature.title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
      </div>
    </motion.div>
  );
}

/* ── MAIN PAGE ── */
export default function CompaniesPage() {
  const [email, setEmail] = useState("");

  const stats = [
    { label: "Companies in Pipeline", value: "200+" },
    { label: "Coming Soon", value: "50+" },
    { label: "Verified Partners", value: "30+" },
    { label: "Early Access Slots", value: "100" },
  ];

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you! We'll notify you at ${email} when we launch.`);
      setEmail("");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#06070d] via-[#0a0b14] to-[#06070d] relative overflow-hidden">
      {/* ── SIMPLIFIED BACKGROUND ── */}
      <SimpleBackground />

      <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-20">
        {/* ── HEADER ── */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium mb-6 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400" />
              </span>
              🚀 Launching Soon • Q3 2026
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative inline-block mb-6"
          >
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/30 relative">
              <BuildingOffice2Icon className="w-14 h-14 text-white" />
            </div>
            <motion.div 
              className="absolute -top-2 -right-2 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              <RocketLaunchIcon className="w-4 h-4 text-white" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl font-black text-white leading-tight mb-6"
          >
            Discover Top{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400">
              Companies
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Your gateway to the world&apos;s leading tech companies. Explore detailed 
            profiles, curated opportunities, and insider insights to accelerate 
            your career journey.
          </motion.p>
        </div>

        {/* ── COMING SOON NOTICE ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-900/20 to-indigo-900/20 p-8 md:p-12 text-center backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-cyan-500/5" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            
            <div className="relative">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                className="text-6xl mb-6"
              >
                🏗️
              </motion.div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
                  Coming Soon!
                </span>
              </h2>
              
              <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
                We&apos;re building the most comprehensive company directory for tech professionals. 
                Get ready to explore detailed profiles, real-time openings, and insider insights 
                from India&apos;s top companies.
              </p>

              {/* Progress bar */}
              <div className="max-w-md mx-auto mt-6">
                <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                  <span>Development Progress</span>
                  <span className="text-violet-400 font-semibold">75%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </div>
              </div>

              {/* Features coming soon */}
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                {[
                  { icon: "📊", label: "Company Analytics" },
                  { icon: "💼", label: "Job Board" },
                  { icon: "💰", label: "Salary Data" },
                  { icon: "📝", label: "Interview Prep" },
                  { icon: "🌟", label: "Employee Reviews" },
                  { icon: "🌐", label: "Global Companies" }
                ].map((item, index) => (
                  <motion.span
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-700/50 bg-slate-800/30 text-slate-300 text-sm"
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── STATISTICS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>

        {/* ── FEATURES WITH COMING SOON BADGE ── */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mb-6"
          >
            <SparklesIcon className="w-6 h-6 text-violet-400" />
            <h2 className="text-2xl font-bold text-white">Features Coming Soon</h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-medium backdrop-blur-sm">
              <ClockIcon className="w-3.5 h-3.5" />
              In Development
            </span>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, index) => (
              <ComingSoonCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>

        {/* ── NOTIFICATION BANNER ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-900/10 to-blue-900/10 p-6 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-violet-500/5" />
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <BellIcon className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    Get Early Access!
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Be the first to know when we launch. Join our waitlist for exclusive early access.
                  </p>
                </div>
              </div>
              <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700/50 bg-slate-900/50 text-white text-sm placeholder:text-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all outline-none min-w-[200px]"
                  required
                />
                <button 
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-300 text-sm group"
                >
                  <span>Notify Me</span>
                  <ArrowTrendingUpIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="inline-block p-0.5 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600">
            <Link
              href="/career/jobs/latest"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all duration-300 group relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative">Explore Current Jobs</span>
              <ArrowTrendingUpIcon className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <UserGroupIcon className="w-4 h-4" />
              5K+ Users
            </span>
            <span className="flex items-center gap-2">
              <GlobeAltIcon className="w-4 h-4" />
              20+ Countries
            </span>
            <span className="flex items-center gap-2">
              <ChartBarIcon className="w-4 h-4" />
              Real-time Updates
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheckIcon className="w-4 h-4" />
              Trusted Platform
            </span>
            <span className="flex items-center gap-2 text-violet-400">
              <AcademicCapIcon className="w-4 h-4" />
              Coming Soon
            </span>
          </div>
          
          <motion.p 
            className="mt-6 text-sm text-slate-500/70"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🚀 Join thousands of professionals discovering their dream companies on Codelura
          </motion.p>
        </motion.div>
      </div>

      {/* ── CUSTOM ANIMATIONS ── */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(0, -30px) scale(1.05); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(0, 30px) scale(1.05); }
        }
        @keyframes float-delayed-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(0, -20px) scale(1.03); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
          animation-delay: 2s;
        }
        .animate-float-delayed-2 {
          animation: float-delayed-2 12s ease-in-out infinite;
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}
// app/community/page.tsx

import Link from "next/link";
import {
  UsersIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  RocketLaunchIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

// Social Media Data
const socialLinks = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/codelura/?viewAsMember=true",
    icon: BuildingOffice2Icon,
    color: "bg-[#0A66C2]",
    description: "Follow us for company updates and industry news.",
  },
  {
    name: "Telegram",
    url: "https://t.me/mentorsetu",
    icon: ChatBubbleLeftRightIcon,
    color: "bg-[#26A5E4]",
    description: "Join our community for instant updates and discussions.",
  },
  {
    name: "WhatsApp",
    url: "https://whatsapp.com/channel/0029VbD0U2i1SWt770AxDi3t",
    icon: UserGroupIcon,
    color: "bg-[#25D366]",
    description: "Subscribe to our channel for daily career opportunities.",
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@Codelura",
    icon: AcademicCapIcon,
    color: "bg-[#FF0000]",
    description: "Watch tutorials, webinars, and career guidance sessions.",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/codelura",
    icon: RocketLaunchIcon,
    color: "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
    description: "Follow us for daily tips, stories, and behind-the-scenes.",
  },
];

// Community Statistics
const stats = [
  { label: "Total Community Members", value: "1,00,000+", icon: UsersIcon },
  { label: "Daily Active Users", value: "20,500+", icon: UserGroupIcon },
  { label: "Companies Listed", value: "500+", icon: BuildingOffice2Icon },
  { label: "Job Opportunities", value: "2,000+", icon: BriefcaseIcon },
];

// Industry Categories
const industries = [
  { name: "Fintech", icon: "💰", color: "from-emerald-400 to-cyan-400" },
  { name: "EdTech", icon: "📚", color: "from-blue-400 to-indigo-400" },
  { name: "HealthTech", icon: "🏥", color: "from-red-400 to-rose-400" },
  { name: "SaaS", icon: "☁️", color: "from-purple-400 to-pink-400" },
  { name: "E-Commerce", icon: "🛒", color: "from-orange-400 to-amber-400" },
  { name: "AI/ML", icon: "🤖", color: "from-violet-400 to-purple-400" },
  { name: "Cybersecurity", icon: "🔒", color: "from-cyan-400 to-blue-400" },
  { name: "Cloud Computing", icon: "🌐", color: "from-sky-400 to-indigo-400" },
];

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-[#06070d] to-slate-900 relative overflow-hidden">

      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/5 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-violet-600/5 blur-[150px] rounded-full" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-cyan-600/5 blur-[120px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">

        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            Community Hub
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
            Join Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400">
              Growing Community
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Connect with like-minded professionals, discover opportunities, 
            and accelerate your career journey with Codelura&apos;s vibrant community.
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-center backdrop-blur-sm hover:border-indigo-500/30 transition-all duration-300 hover:bg-slate-900/60 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600/20 to-violet-600/20 flex items-center justify-center mx-auto mb-3 group-hover:from-indigo-600/30 group-hover:to-violet-600/30 transition-all">
                  <Icon className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Industry Categories */}
        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
            Explore by{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              Industry
            </span>
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {industries.map((industry) => (
              <span
                key={industry.name}
                className={`px-5 py-2.5 rounded-full border border-slate-700/50 bg-slate-800/30 text-slate-200 text-sm font-medium hover:scale-105 transition-all duration-300 cursor-default backdrop-blur-sm bg-gradient-to-r ${industry.color} bg-clip-text hover:text-transparent hover:border-transparent hover:bg-gradient-to-r ${industry.color} hover:bg-opacity-10`}
              >
                <span className="mr-2">{industry.icon}</span>
                {industry.name}
              </span>
            ))}
          </div>
        </div>

        {/* Social Links Section */}
        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">
            Connect With Us{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              Everywhere
            </span>
          </h2>
          <p className="text-slate-400 text-center max-w-2xl mx-auto mb-12">
            Join our community across all platforms to stay updated and connected.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${social.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-lg mb-1">{social.name}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{social.description}</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 border-2 border-transparent rounded-2xl group-hover:border-indigo-500/20 transition-all duration-300 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-indigo-600/0 to-indigo-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </a>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="relative inline-block p-0.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600">
            <Link
              href="/careers"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all duration-300 group relative z-10"
            >
              <span>Explore Career Opportunities</span>
              <svg 
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            🚀 Join thousands of professionals building their careers with Codelura
          </p>
        </div>

      </div>
    </main>
  );
}
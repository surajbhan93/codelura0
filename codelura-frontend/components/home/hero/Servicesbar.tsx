import {
  BookOpen,
  Trophy,
  Briefcase,
  GraduationCap,
  Code2,
  Brain,
} from "lucide-react";

const SERVICES = [
  { icon: BookOpen, label: "Software Notes", desc: "Curated, AI-enhanced study material", color: "from-blue-500 to-cyan-500" },
  { icon: Trophy, label: "Hackathons", desc: "Compete, collaborate & win prizes", color: "from-amber-500 to-orange-500" },
  { icon: Briefcase, label: "Career Guidance", desc: "Roadmaps, resume & interview prep", color: "from-emerald-500 to-teal-500" },
  { icon: GraduationCap, label: "Mentorship", desc: "1-on-1 with industry experts", color: "from-violet-500 to-purple-500" },
  { icon: Code2, label: "SaaS Tools", desc: "Developer-grade productivity tools", color: "from-rose-500 to-pink-500" },
  { icon: Brain, label: "AI Services", desc: "Smart automation & AI integrations", color: "from-indigo-500 to-blue-500" },
];

/* Pure server component — no "use client", no hooks. Hover
   effects below use Tailwind's CSS-only hover: classes, so no
   JS is required for the interaction. */
export default function ServicesBar() {
  return (
    <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {SERVICES.map(({ icon: Icon, label, desc, color }, i) => (
        <div
          key={label}
          className="anim-fade-up group flex items-start gap-3 rounded-2xl border border-white/8 bg-white/4 p-3.5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.04] hover:-translate-y-[3px] hover:border-white/20 hover:bg-white/8 cursor-pointer"
          style={{ animationDelay: `${0.6 + i * 0.08}s` }}
        >
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
            <Icon className="h-4 w-4 text-white" />
          </span>
          <div>
            <p className="text-sm font-semibold text-white/90 leading-tight">{label}</p>
            <p className="mt-0.5 text-[11px] text-white/45 leading-tight">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
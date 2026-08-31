import {
  BookOpen,
  Trophy,
  Briefcase,
  GraduationCap,
  Code2,
  Brain,
} from "lucide-react";

const SERVICES = [
  { icon: BookOpen, label: "Software Notes", color: "from-blue-500 to-cyan-500" },
  { icon: Trophy, label: "Hackathons", color: "from-amber-500 to-orange-500" },
  { icon: Briefcase, label: "Career Guidance", color: "from-emerald-500 to-teal-500" },
  { icon: GraduationCap, label: "Mentorship", color: "from-violet-500 to-purple-500" },
  { icon: Code2, label: "SaaS Tools", color: "from-rose-500 to-pink-500" },
  { icon: Brain, label: "AI Services", color: "from-indigo-500 to-blue-500" },
];

export default function ServicesBar() {
  return (
    <div className="mt-12 flex flex-wrap gap-2.5">
      {SERVICES.map(({ icon: Icon, label, color }, i) => (
        <div
          key={label}
          className="anim-fade-up group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 backdrop-blur-sm transition-all duration-300 hover:scale-[1.05] hover:border-white/25 hover:bg-white/10 cursor-pointer"
          style={{ animationDelay: `${0.6 + i * 0.08}s` }}
        >
          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${color}`}>
            <Icon className="h-3 w-3 text-white" />
          </span>
          <p className="text-xs font-semibold text-white/75">{label}</p>
        </div>
      ))}
    </div>
  );
}
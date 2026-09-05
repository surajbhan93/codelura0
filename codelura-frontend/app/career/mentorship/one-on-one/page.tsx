// import Link from "next/link";
// import Image from "next/image";
// import { 
//   Check, 
//   Linkedin, 
//   FileText, 
//   Compass, 
//   ArrowRight, 
//   Star, 
//   Clock, 
//   Shield, 
//   Users, 
//   Award,
//   Briefcase,
//   TrendingUp,
//   Zap,
//   Crown,
//   Sparkles,
//   Rocket,
//   Target,
//   MessageCircle,
//   Mail,
//   Phone,
//   Building2,
//   Globe,
//   BadgeCheck,
//   Lightbulb,
//   HeartHandshake
// } from "lucide-react";

// export const metadata = {
//   title: "MentorSetu 1:1 Career Guidance | Codelura",
//   description:
//     "Industry-specific career guidance from verified professionals. Choose your personalized plan — single session, 3-month program, or advanced mentorship.",
//   keywords: "career guidance, mentorship, industry experts, career switch, professional development",
// };

// export const dynamic = "force-static";
// export const revalidate = false;

// // ── PLANS DATA ──
// const PLANS = [
//   {
//     href: "/career/jobs/premium/mentorsetu-personal-guidance-(1-to-1)",
//     name: "Quick Start",
//     tagline: "Focused session to get you unstuck and moving",
//     price: "₹299",
//     period: "one session",
//     icon: Zap,
//     color: "amber",
//     features: [
//       "1:1 personalized video call with industry expert",
//       "Custom career roadmap for your target role",
//       "Written summary with actionable steps",
//       "48-hour follow-up support via email",
//     ],
//     highlight: false,
//     bestFor: "Perfect for quick clarity & direction",
//   },
//   {
//     href: "/career/jobs/premium/mentorsetu-personal-3-months-guidance-(1-to-1)",
//     name: "Growth Program",
//     tagline: "Ongoing mentorship to accelerate your career",
//     price: "₹1,449",
//     period: "3 months",
//     icon: Rocket,
//     color: "purple",
//     features: [
//       "Everything in Quick Start plan",
//       "Weekly 30-min check-ins for 3 months",
//       "Resume + LinkedIn profile makeover",
//       "Direct chat access to your mentor",
//       "Monthly progress tracking reports",
//     ],
//     highlight: true,
//     bestFor: "Best for serious career growth",
//   },
//   {
//     href: "/career/jobs/premium/mentorsetu-advanced-personal-guidance-(1-to-1)",
//     name: "Executive Edge",
//     tagline: "Comprehensive support for leadership roles",
//     price: "₹999",
//     period: "full program",
//     icon: Crown,
//     color: "emerald",
//     features: [
//       "Everything in Growth Program plan",
//       "Mock interviews with detailed feedback",
//       "Salary negotiation & offer evaluation",
//       "Priority scheduling with senior mentors",
//       "Personal brand building strategy",
//       "Network introduction & referrals",
//     ],
//     highlight: false,
//     bestFor: "Ideal for senior roles & leadership",
//   },
// ];

// // ── INDUSTRY COVERAGE ──
// const INDUSTRIES = [
//   { name: "Technology", icon: "💻", count: "150+ mentors" },
//   { name: "Finance", icon: "💰", count: "80+ mentors" },
//   { name: "Healthcare", icon: "🏥", count: "60+ mentors" },
//   { name: "Design", icon: "🎨", count: "45+ mentors" },
//   { name: "Marketing", icon: "📊", count: "70+ mentors" },
//   { name: "Core Engineering", icon: "⚙️", count: "90+ mentors" },
//   { name: "Government/PSU", icon: "🏛️", count: "40+ mentors" },
//   { name: "Consulting", icon: "📈", count: "55+ mentors" },
// ];

// // ── SUCCESS STATS ──
// const STATS = [
//   { value: "85%", label: "Got their target role within 6 months" },
//   { value: "4.9/5", label: "Average mentor rating" },
//   { value: "10,000+", label: "Professionals guided" },
//   { value: "50+", label: "Industries covered" },
// ];

// // ── TESTIMONIALS ──
// const TESTIMONIALS = [
//   {
//     name: "Priya Sharma",
//     role: "Product Manager at FinTech Startup",
//     text: "The 3-month program completely transformed my career trajectory. My mentor helped me identify the right skills to build and connected me with the right people. Landed my dream role within 4 months!",
//     rating: 5,
//     industry: "Technology",
//   },
//   {
//     name: "Rahul Verma",
//     role: "Senior Analyst → Strategy Consultant",
//     text: "I was stuck in my career for 2 years. One session with my mentor gave me the clarity I needed. The industry-specific roadmap was exactly what I was looking for. Worth every rupee.",
//     rating: 5,
//     industry: "Consulting",
//   },
//   {
//     name: "Ananya Reddy",
//     role: "Design Lead at Global Agency",
//     text: "The advanced program helped me prepare for leadership interviews. The mock interviews and feedback sessions were incredibly valuable. Got promoted to Design Lead within 3 months!",
//     rating: 5,
//     industry: "Design",
//   },
// ];

// // ── FAQS ──
// const FAQS = [
//   {
//     q: "Which plan should I choose?",
//     a: "If you need quick clarity on one specific decision (which industry, which role, how to switch), go with Quick Start. If you want ongoing support while executing a career plan over time, choose Growth Program. For senior roles and leadership positions, Executive Edge is your best bet.",
//   },
//   {
//     q: "How are mentors matched?",
//     a: "We match you with a verified professional who has 5+ years of experience in your target industry. Before the session, we analyze your background, goals, and challenges to ensure the perfect match.",
//   },
//   {
//     q: "What happens after I choose a plan?",
//     a: "You'll fill a short form with your details, pick a convenient time slot, and complete payment securely. Within 24 hours, you'll receive a confirmation with your mentor's profile and session link.",
//   },
//   {
//     q: "Can I switch plans later?",
//     a: "Absolutely! If you start with Quick Start and want to continue with Growth or Executive Edge, just reach out to our support team. We'll adjust the difference seamlessly.",
//   },
//   {
//     q: "What's the refund policy?",
//     a: "We offer a 100% refund if requested before your first session begins. Once a session has started, we provide prorated refunds for unused sessions in the program.",
//   },
//   {
//     q: "Is this only for tech roles?",
//     a: "Not at all! We have mentors across Technology, Finance, Healthcare, Design, Marketing, Core Engineering, Government/PSU, Consulting, and more. You'll be matched with an expert in your specific industry.",
//   },
// ];

// // ── OTHER SERVICES ──
// const OTHER_SERVICES = [
//   {
//     href: "/career/mentorship/resume-review",
//     icon: FileText,
//     tag: "Most Requested",
//     title: "Resume Review",
//     desc: "Get your resume reviewed by an industry expert — ATS-friendly formatting, stronger bullet points, and honest feedback in 24-48 hours.",
//     price: "Starting ₹199",
//     cta: "Get Resume Reviewed",
//     gradient: "from-blue-50 to-indigo-50",
//     borderColor: "border-blue-200",
//   },
//   {
//     href: "/career/mentorship/linkedin-review",
//     icon: Linkedin,
//     tag: "Boost Visibility",
//     title: "LinkedIn Profile Review",
//     desc: "Recruiter-visibility optimization, headline & summary rewrite, and keyword optimization so recruiters actually find you.",
//     price: "Starting ₹249",
//     cta: "Get LinkedIn Reviewed",
//     gradient: "from-sky-50 to-cyan-50",
//     borderColor: "border-sky-200",
//   },
//   {
//     href: "/career/mentorship/career-guidance",
//     icon: Compass,
//     tag: "Popular Choice",
//     title: "Career Guidance",
//     desc: "Industry-specific roadmap, realistic salary expectations, and a clear plan — perfect if you're still deciding your direction.",
//     price: "Starting ₹299",
//     cta: "Explore Career Guidance",
//     gradient: "from-amber-50 to-orange-50",
//     borderColor: "border-amber-200",
//   },
// ];

// export default function MentorSetuPlansPage() {
//   return (
//     <div className="min-h-screen bg-[#f9f5ef]">
//       {/* ── HERO SECTION ── */}
//       <section className="relative overflow-hidden bg-[#1a1208] px-6 py-20 sm:py-28">
//         {/* Animated background elements */}
//         <div className="pointer-events-none absolute inset-0">
//           <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-amber-600/10 blur-3xl" />
//           <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-orange-600/10 blur-3xl" />
//           <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-2xl" />
//         </div>

//         <div className="relative mx-auto max-w-5xl text-center">
//           {/* Badge */}
//           <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-amber-800/50 bg-amber-900/30 px-5 py-2 backdrop-blur-sm">
//             <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-amber-300">
//               Trusted by 10,000+ Professionals
//             </span>
//           </div>

//           <h1 className="mb-4 text-4xl font-black leading-[1.1] tracking-tight text-[#f9f5ef] sm:text-5xl md:text-6xl lg:text-7xl">
//             Your <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-amber-200 bg-clip-text text-transparent">Career Accelerator</span>
//           </h1>
          
//           <p className="mx-auto mb-8 max-w-2xl text-base font-light leading-relaxed text-slate-300 sm:text-lg">
//             Get personalized guidance from industry experts. Choose the plan that fits your goals —
//             from a quick clarity session to comprehensive mentorship.
//           </p>

//           {/* Quick stats */}
//           <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
//             <div className="flex items-center gap-2 text-amber-300">
//               <BadgeCheck className="h-5 w-5" />
//               <span>Verified Mentors</span>
//             </div>
//             <div className="flex items-center gap-2 text-amber-300">
//               <Shield className="h-5 w-5" />
//               <span>Secure Payment</span>
//             </div>
//             <div className="flex items-center gap-2 text-amber-300">
//               <Clock className="h-5 w-5" />
//               <span>24-48 hr Response</span>
//             </div>
//             <div className="flex items-center gap-2 text-amber-300">
//               <HeartHandshake className="h-5 w-5" />
//               <span>Refund Guarantee</span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ── PLANS SECTION ── */}
//       <section className="px-6 py-16">
//         <div className="mx-auto max-w-6xl">
//           <div className="mb-12 text-center">
//             <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800">
//               <Sparkles className="h-3 w-3" />
//               Choose Your Path
//             </span>
//             <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
//               Pick the Right <span className="text-amber-600">Mentorship Plan</span>
//             </h2>
//             <p className="mt-2 text-slate-600">
//               Each plan is designed for different career stages and goals
//             </p>
//           </div>

//           <div className="grid gap-6 md:grid-cols-3">
//             {PLANS.map((plan) => {
//               const Icon = plan.icon;
//               const colorMap = {
//                 amber: "border-amber-200 bg-amber-50/60",
//                 purple: "border-purple-200 bg-purple-50/60 shadow-purple-900/5",
//                 emerald: "border-emerald-200 bg-emerald-50/60 shadow-emerald-900/5",
//               };
//               const btnColorMap = {
//                 amber: "bg-amber-600 hover:bg-amber-500",
//                 purple: "bg-purple-600 hover:bg-purple-500",
//                 emerald: "bg-emerald-600 hover:bg-emerald-500",
//               };
//               const badgeColorMap = {
//                 amber: "bg-amber-100 text-amber-700",
//                 purple: "bg-purple-100 text-purple-700",
//                 emerald: "bg-emerald-100 text-emerald-700",
//               };
//               const iconBgMap = {
//                 amber: "bg-amber-100 text-amber-600",
//                 purple: "bg-purple-100 text-purple-600",
//                 emerald: "bg-emerald-100 text-emerald-600",
//               };

//               return (
//                 <div
//                   key={plan.href}
//                   className={`group relative flex flex-col rounded-2xl border-2 p-7 transition-all duration-300 hover:-translate-y-2 ${
//                     plan.highlight
//                       ? `${colorMap[plan.color as keyof typeof colorMap]} shadow-xl`
//                       : "border-slate-200 bg-white hover:border-amber-300 hover:shadow-lg"
//                   }`}
//                 >
//                   {plan.highlight && (
//                     <>
//                       <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-4 py-1 text-xs font-bold text-white shadow-lg shadow-amber-600/30">
//                         ⭐ Most Popular
//                       </span>
//                       <div className="absolute -right-1 -top-1">
//                         <div className="h-16 w-16 overflow-hidden">
//                           <div className="absolute -right-8 -top-8 h-20 w-20 rotate-45 bg-gradient-to-r from-amber-400 to-orange-400 opacity-20" />
//                         </div>
//                       </div>
//                     </>
//                   )}

//                   {/* Icon & Badge */}
//                   <div className="mb-4 flex items-center justify-between">
//                     <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBgMap[plan.color as keyof typeof iconBgMap]}`}>
//                       <Icon className="h-6 w-6" />
//                     </div>
//                     <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${badgeColorMap[plan.color as keyof typeof badgeColorMap]}`}>
//                       {plan.bestFor}
//                     </span>
//                   </div>

//                   <h2 className="text-xl font-bold text-slate-900">{plan.name}</h2>
//                   <p className="mb-4 text-sm text-slate-500">{plan.tagline}</p>

//                   <div className="mb-6 flex items-baseline gap-1.5">
//                     <span className="text-4xl font-black text-amber-600">{plan.price}</span>
//                     <span className="text-sm text-slate-400">/ {plan.period}</span>
//                   </div>

//                   <ul className="mb-8 flex-1 space-y-3">
//                     {plan.features.map((f) => (
//                       <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
//                         <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
//                         <span>{f}</span>
//                       </li>
//                     ))}
//                   </ul>

//                   <Link
//                     href={plan.href}
//                     prefetch
//                     className={`block w-full rounded-xl px-4 py-3.5 text-center text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
//                       btnColorMap[plan.color as keyof typeof btnColorMap]
//                     }`}
//                   >
//                     Get Started Now
//                     <ArrowRight className="ml-2 inline-block h-4 w-4" />
//                   </Link>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* ── STATS SECTION ── */}
//       <section className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-16">
//         <div className="mx-auto max-w-6xl">
//           <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
//             {STATS.map((stat, idx) => (
//               <div key={idx} className="text-center text-white">
//                 <div className="text-4xl font-black">{stat.value}</div>
//                 <div className="mt-1 text-sm font-light text-amber-100">{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── INDUSTRY COVERAGE ── */}
//       <section className="bg-white px-6 py-16">
//         <div className="mx-auto max-w-6xl">
//           <div className="mb-10 text-center">
//             <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700">
//               <Building2 className="h-3 w-3" />
//               Industry Coverage
//             </span>
//             <h2 className="text-3xl font-bold text-slate-900">
//               Experts From <span className="text-indigo-600">Every Industry</span>
//             </h2>
//             <p className="mt-2 text-slate-600">
//               Get matched with a mentor who understands your field
//             </p>
//           </div>

//           <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
//             {INDUSTRIES.map((industry) => (
//               <div
//                 key={industry.name}
//                 className="flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition hover:border-indigo-300 hover:bg-indigo-50/30"
//               >
//                 <span className="mb-1 text-2xl">{industry.icon}</span>
//                 <span className="text-sm font-semibold text-slate-700">{industry.name}</span>
//                 <span className="text-xs text-slate-400">{industry.count}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── TESTIMONIALS ── */}
//       <section className="bg-[#f9f5ef] px-6 py-16">
//         <div className="mx-auto max-w-6xl">
//           <div className="mb-10 text-center">
//             <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
//               <Star className="h-3 w-3 fill-emerald-500" />
//               Real Stories
//             </span>
//             <h2 className="text-3xl font-bold text-slate-900">
//               What Our <span className="text-emerald-600">Community Says</span>
//             </h2>
//           </div>

//           <div className="grid gap-6 md:grid-cols-3">
//             {TESTIMONIALS.map((testimonial, idx) => (
//               <div
//                 key={idx}
//                 className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
//               >
//                 <div className="mb-3 flex items-center gap-1">
//                   {[...Array(testimonial.rating)].map((_, i) => (
//                     <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
//                   ))}
//                 </div>
//                 <p className="mb-4 text-sm leading-relaxed text-slate-600">"{testimonial.text}"</p>
//                 <div className="border-t border-slate-100 pt-4">
//                   <p className="font-semibold text-slate-900">{testimonial.name}</p>
//                   <p className="text-xs text-slate-500">{testimonial.role}</p>
//                   <span className="mt-1 inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-600">
//                     {testimonial.industry}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── FAQ SECTION ── */}
//       <section className="bg-white px-6 py-16">
//         <div className="mx-auto max-w-3xl">
//           <div className="mb-10 text-center">
//             <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-purple-700">
//               <Lightbulb className="h-3 w-3" />
//               Got Questions?
//             </span>
//             <h2 className="text-3xl font-bold text-slate-900">
//               Frequently Asked <span className="text-purple-600">Questions</span>
//             </h2>
//           </div>

//           <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-sm">
//             {FAQS.map((faq, idx) => (
//               <details key={idx} className="group px-6 py-5 first:rounded-t-2xl last:rounded-b-2xl">
//                 <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800 marker:content-none hover:text-amber-600">
//                   <span className="flex items-center justify-between gap-4">
//                     {faq.q}
//                     <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600 transition duration-300 group-open:rotate-45">
//                       <span className="text-xl font-light">+</span>
//                     </span>
//                   </span>
//                 </summary>
//                 <p className="mt-3 text-sm leading-relaxed text-slate-500">{faq.a}</p>
//               </details>
//             ))}
//           </div>

//           {/* Contact Support */}
//           <div className="mt-8 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100/50 p-6 text-center">
//             <p className="text-sm font-medium text-slate-700">
//               Still have questions? We're here to help!
//             </p>
//             <div className="mt-3 flex flex-wrap items-center justify-center gap-4">
//               <a
//                 href="mailto:support@codelura.com"
//                 className="inline-flex items-center gap-2 text-sm text-amber-600 transition hover:text-amber-700"
//               >
//                 <Mail className="h-4 w-4" />
//                 support@codelura.com
//               </a>
//               <span className="text-slate-300">|</span>
//               <a
//                 href="tel:+919330456710"
//                 className="inline-flex items-center gap-2 text-sm text-amber-600 transition hover:text-amber-700"
//               >
//                 <Phone className="h-4 w-4" />
//                 +91 9330456710
//               </a>
//               <span className="text-slate-300">|</span>
//               <a
//                 href="#"
//                 className="inline-flex items-center gap-2 text-sm text-amber-600 transition hover:text-amber-700"
//               >
//                 <MessageCircle className="h-4 w-4" />
//                 WhatsApp
//               </a>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ── OTHER SERVICES ── */}
//       <section className="bg-[#f9f5ef] px-6 py-16">
//         <div className="mx-auto max-w-6xl">
//           <div className="mb-10 text-center">
//             <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-rose-700">
//               <Globe className="h-3 w-3" />
//               Explore More
//             </span>
//             <h2 className="text-3xl font-bold text-slate-900">
//               Other <span className="text-rose-600">Services</span> You Might Need
//             </h2>
//           </div>

//           <div className="grid gap-6 md:grid-cols-3">
//             {OTHER_SERVICES.map((s) => {
//               const Icon = s.icon;
//               return (
//                 <Link
//                   key={s.href}
//                   href={s.href}
//                   prefetch
//                   className={`group relative flex flex-col overflow-hidden rounded-2xl border-2 ${s.borderColor} bg-gradient-to-br ${s.gradient} p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}
//                 >
//                   <span className="mb-3 inline-flex w-fit items-center rounded-full bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-rose-700 shadow-sm">
//                     {s.tag}
//                   </span>
//                   <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/80 shadow-sm">
//                     <Icon className="h-6 w-6 text-slate-700" />
//                   </div>
//                   <h3 className="mb-1.5 text-lg font-bold text-slate-900">{s.title}</h3>
//                   <p className="mb-5 flex-1 text-sm leading-relaxed text-slate-600">{s.desc}</p>
//                   <div className="flex items-center justify-between border-t border-white/50 pt-4">
//                     <span className="text-sm font-bold text-rose-600">{s.price}</span>
//                     <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 transition group-hover:gap-2 group-hover:text-rose-600">
//                       {s.cta}
//                       <ArrowRight className="h-4 w-4" />
//                     </span>
//                   </div>
//                 </Link>
//               );
//             })}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }


// app/premium/mock-interview/page.jsx
import { Suspense } from "react";
import Link from "next/link";
// import Image from "next/image";
import CareerPromo from "@/components/career/CareerPromo";
import { 
  Check, 
  ArrowRight, 
  Star, 
  Clock, 
  Shield, 
  // Zap,
  // Crown,
  Sparkles,
  // Rocket,
 
  MessageCircle,
  Mail,
  Phone,
  Building2,
  
  BadgeCheck,
  Lightbulb,
  HeartHandshake,
  Crown, Rocket, Zap 
 
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ✅ ISR - Revalidate every 1 hour
export const revalidate = 3600;
interface PremiumPlan {
  _id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  discountedPrice?: number;
  durationInMonths?: number;
  shortDescription?: string;
  features?: string[];
  bannerImage?: string;
   // 👇 Add these
  badge?: string;
  isRecommended?: boolean;
}

// ============================================
// DATA FETCHING (Server Side)
// ============================================
async function getMentorshipPlans() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.codelura.com/api";
    const res = await fetch(`${apiUrl}/premium/plans`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    
    const plans: PremiumPlan[] = data.plans || [];
    // ✅ Filter for mentorship categories with fallbacks
    const filtered = plans.filter((plan: PremiumPlan) => {
      const category = plan.category?.toLowerCase() || "";
      return (
        category === "mentorship" || 
        category === "mentor" ||
        category === "career-guidance" ||
        category === "mock-interview" ||
        category === "resume" ||
        category === "linkedin" ||
        category.includes("mentor") ||
        category.includes("guidance")
      );
    });

    return filtered.length > 0 ? filtered : plans;
  } catch (error) {
    console.error('Error fetching mentorship plans:', error);
    return [];
  }
}

// ============================================
// COMPONENTS
// ============================================

// ─── Mentorship Plan Card ───
const MentorshipPlanCard = ({ plan }: { plan: PremiumPlan }) => {
  const hasDiscount = plan.discountedPrice != null && plan.discountedPrice < plan.price;
  const actualPrice = hasDiscount ? plan.discountedPrice : plan.price;
  const discountPercent = hasDiscount
  ? Math.round(((plan.price - plan.discountedPrice!) / plan.price) * 100)
  : 0;

  // Color mapping based on plan name
  const getColorScheme = (plan: PremiumPlan) => {
    const name = plan.title?.toLowerCase() || "";
    if (name.includes("advanced") || name.includes("executive") || name.includes("premium")) {
      return {
        border: "border-emerald-200",
        bg: "bg-emerald-50/60",
        btn: "bg-emerald-600 hover:bg-emerald-500",
        badge: "bg-emerald-100 text-emerald-700",
        iconBg: "bg-emerald-100 text-emerald-600",
        highlight: "from-emerald-600 to-teal-600",
      };
    }
    if (name.includes("growth") || name.includes("pro") || name.includes("standard")) {
      return {
        border: "border-purple-200",
        bg: "bg-purple-50/60",
        btn: "bg-purple-600 hover:bg-purple-500",
        badge: "bg-purple-100 text-purple-700",
        iconBg: "bg-purple-100 text-purple-600",
        highlight: "from-purple-600 to-violet-600",
      };
    }
    return {
      border: "border-amber-200",
      bg: "bg-amber-50/60",
      btn: "bg-amber-600 hover:bg-amber-500",
      badge: "bg-amber-100 text-amber-700",
      iconBg: "bg-amber-100 text-amber-600",
      highlight: "from-amber-600 to-orange-600",
    };
  };

  const colors = getColorScheme(plan);

  // Icon mapping
  const getIcon = (plan: PremiumPlan): LucideIcon => {
    const name = plan.title?.toLowerCase() || "";
    if (name.includes("advanced") || name.includes("executive") || name.includes("premium")) {
      return Crown;
    }
    if (name.includes("growth") || name.includes("pro") || name.includes("standard")) {
      return Rocket;
    }
    return Zap;
  };

  // const Icon = getIcon(plan);
  // const Icon = getIcon(plan);

// eslint-disable-next-line react/no-unstable-nested-components
const IconComponent = getIcon(plan);
  // Best for mapping
  const getBestFor = (plan: PremiumPlan) => {
    const name = plan.title?.toLowerCase() || "";
    if (name.includes("advanced") || name.includes("executive") || name.includes("premium")) {
      return "For leadership roles";
    }
    if (name.includes("growth") || name.includes("pro") || name.includes("standard")) {
      return "For career growth";
    }
    return "For quick clarity";
  };



  // Highlight if plan is recommended
  const isRecommended = plan.isRecommended || plan.badge === "Popular" || plan.badge === "Recommended";

  return (
    <div
      className={`group relative flex flex-col rounded-2xl border-2 p-7 transition-all duration-300 hover:-translate-y-2 ${colors.border} ${colors.bg} hover:shadow-xl ${isRecommended ? 'shadow-lg' : ''}`}
    >
      {isRecommended && (
        <>
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-4 py-1 text-xs font-bold text-white shadow-lg shadow-amber-600/30 whitespace-nowrap">
            ⭐ Most Popular
          </span>
          <div className="absolute -right-1 -top-1">
            <div className="h-16 w-16 overflow-hidden">
              <div className="absolute -right-8 -top-8 h-20 w-20 rotate-45 bg-gradient-to-r from-amber-400 to-orange-400 opacity-20" />
            </div>
          </div>
        </>
      )}

      {/* Icon & Badge */}
      <div className="mb-4 flex items-center justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.iconBg}`}>
          {/* <Icon className="h-6 w-6" /> */}
          <IconComponent className="h-6 w-6" />
        </div>
        <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${colors.badge}`}>
          {getBestFor(plan)}
        </span>
      </div>

      <h2 className="text-xl font-bold text-slate-900">{plan.title}</h2>
      {plan.shortDescription && (
        <p className="mb-4 text-sm text-slate-500">{plan.shortDescription}</p>
      )}

      <div className="mb-6 flex items-baseline gap-1.5">
        <span className="text-4xl font-black text-amber-600">₹{actualPrice}</span>
        {plan.durationInMonths && (
          <span className="text-sm text-slate-400">/ {plan.durationInMonths} month{plan.durationInMonths > 1 ? 's' : ''}</span>
        )}
        {!plan.durationInMonths && (
          <span className="text-sm text-slate-400">/ session</span>
        )}
      </div>

      {hasDiscount && (
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Save {discountPercent}% • ₹{plan.price - plan.discountedPrice!} off
        </div>
      )}

     {(plan.features?.length ?? 0) > 0 && (
  <ul className="mb-8 flex-1 space-y-3">
    {plan.features!.slice(0, 6).map((feature) => (
      <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-600">
        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
        <span>{feature}</span>
      </li>
    ))}
  </ul>
)}

      <Link
        href={`/career/jobs/premium/${plan.slug}`}
        className={`block w-full rounded-xl px-4 py-3.5 text-center text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${colors.btn}`}
      >
        Get Started Now
        <ArrowRight className="ml-2 inline-block h-4 w-4" />
      </Link>
    </div>
  );
};

// ─── Skeleton Loader ───
const PlansSkeleton = () => (
  <div className="grid gap-6 md:grid-cols-3">
    {[1, 2, 3].map((i) => (
      <div key={i} className="rounded-2xl border border-slate-200 bg-white p-7 animate-pulse">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-12 w-12 rounded-xl bg-slate-200" />
          <div className="h-6 w-24 rounded-full bg-slate-200" />
        </div>
        <div className="mb-2 h-6 w-3/4 rounded bg-slate-200" />
        <div className="mb-4 h-4 w-1/2 rounded bg-slate-200" />
        <div className="mb-6 h-10 w-1/3 rounded bg-slate-200" />
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-slate-200" />
          <div className="h-4 w-5/6 rounded bg-slate-200" />
          <div className="h-4 w-4/5 rounded bg-slate-200" />
        </div>
        <div className="mt-8 h-12 w-full rounded-xl bg-slate-200" />
      </div>
    ))}
  </div>
);

// ─── Stats Section ───
const STATS = [
  { value: "85%", label: "Career Success Rate" },
  { value: "4.9/5", label: "Average Rating" },
  { value: "10,000+", label: "Professionals Guided" },
  { value: "50+", label: "Industries Covered" },
];

const StatsSection = () => (
  <section className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-16">
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
        {STATS.map((stat, idx) => (
          <div key={idx} className="text-center text-white">
            <div className="text-4xl font-black">{stat.value}</div>
            <div className="mt-1 text-sm font-light text-amber-100">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Industries Covered ───
const INDUSTRIES = [
  { name: "Technology", icon: "💻", count: "150+ mentors" },
  { name: "Finance", icon: "💰", count: "80+ mentors" },
  { name: "Healthcare", icon: "🏥", count: "60+ mentors" },
  { name: "Design", icon: "🎨", count: "45+ mentors" },
  { name: "Marketing", icon: "📊", count: "70+ mentors" },
  { name: "Core Engineering", icon: "⚙️", count: "90+ mentors" },
  { name: "Government/PSU", icon: "🏛️", count: "40+ mentors" },
  { name: "Consulting", icon: "📈", count: "55+ mentors" },
];

// ─── Testimonials ───
const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Product Manager at FinTech Startup",
    text: "The 3-month program completely transformed my career trajectory. My mentor helped me identify the right skills to build and connected me with the right people. Landed my dream role within 4 months!",
    rating: 5,
    industry: "Technology",
  },
  {
    name: "Rahul Verma",
    role: "Senior Analyst → Strategy Consultant",
    text: "I was stuck in my career for 2 years. One session with my mentor gave me the clarity I needed. The industry-specific roadmap was exactly what I was looking for. Worth every rupee.",
    rating: 5,
    industry: "Consulting",
  },
  {
    name: "Ananya Reddy",
    role: "Design Lead at Global Agency",
    text: "The advanced program helped me prepare for leadership interviews. The mock interviews and feedback sessions were incredibly valuable. Got promoted to Design Lead within 3 months!",
    rating: 5,
    industry: "Design",
  },
];

// ─── FAQs ───
const FAQS = [
  {
    q: "Which mentorship plan should I choose?",
    a: "If you need quick clarity on one specific decision, go with Quick Start. If you want ongoing support while executing a career plan over time, choose Growth Program. For senior roles and leadership positions, Executive Edge is your best bet."
  },
  {
    q: "How are mentors matched?",
    a: "We match you with a verified professional who has 5+ years of experience in your target industry. Before the session, we analyze your background, goals, and challenges to ensure the perfect match."
  },
  {
    q: "What happens after I choose a plan?",
    a: "You'll fill a short form with your details, pick a convenient time slot, and complete payment securely. Within 24 hours, you'll receive a confirmation with your mentor's profile and session link."
  },
  {
    q: "Can I switch plans later?",
    a: "Absolutely! If you start with Quick Start and want to continue with Growth or Executive Edge, just reach out to our support team. We'll adjust the difference seamlessly."
  },
  {
    q: "What's the refund policy?",
    a: "We offer a 100% refund if requested before your first session begins. Once a session has started, we provide prorated refunds for unused sessions in the program."
  },
  {
    q: "Is this only for tech roles?",
    a: "Not at all! We have mentors across Technology, Finance, Healthcare, Design, Marketing, Core Engineering, Government/PSU, Consulting, and more. You'll be matched with an expert in your specific industry."
  },
];

// ============================================
// MAIN PAGE (Server Component)
// ============================================
export default async function MockInterviewPage() {
  const plans = await getMentorshipPlans();

  return (
    <div className="min-h-screen bg-[#f9f5ef]">
      
      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden bg-[#1a1208] px-6 py-20 sm:py-28">
        {/* Animated background elements */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-amber-600/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-orange-600/10 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-2xl" />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-amber-800/50 bg-amber-900/30 px-5 py-2 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-300">
              🎯 MentorSetu - Career Guidance
            </span>
          </div>

          <h1 className="mb-4 text-4xl font-black leading-[1.1] tracking-tight text-[#f9f5ef] sm:text-5xl md:text-6xl lg:text-7xl">
            Your <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-amber-200 bg-clip-text text-transparent">Career Accelerator</span>
          </h1>
          
          <p className="mx-auto mb-8 max-w-2xl text-base font-light leading-relaxed text-slate-300 sm:text-lg">
            Get personalized guidance from industry experts. Choose the plan that fits your goals —
            from a quick clarity session to comprehensive mentorship.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-amber-300">
              <BadgeCheck className="h-5 w-5" />
              <span>Verified Mentors</span>
            </div>
            <div className="flex items-center gap-2 text-amber-300">
              <Shield className="h-5 w-5" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-amber-300">
              <Clock className="h-5 w-5" />
              <span>24-48 hr Response</span>
            </div>
            <div className="flex items-center gap-2 text-amber-300">
              <HeartHandshake className="h-5 w-5" />
              <span>Refund Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PLANS SECTION ─── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800">
              <Sparkles className="h-3 w-3" />
              Choose Your Path
            </span>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Pick the Right <span className="text-amber-600">Mentorship Plan</span>
            </h2>
            <p className="mt-2 text-slate-600">
              Each plan is designed for different career stages and goals
            </p>
          </div>

          <Suspense fallback={<PlansSkeleton />}>
            {plans.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                <div className="mb-4 text-6xl">🎯</div>
                <h3 className="mb-2 text-xl font-bold text-slate-900">No Mentorship Plans Available</h3>
                <p className="text-slate-500">We're preparing new mentorship packages for you. Check back soon!</p>
                <Link href="/premium" className="mt-4 inline-block text-amber-600 hover:text-amber-700">
                  ← Browse All Plans
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-3">
                {plans.map((plan) => (
                  <MentorshipPlanCard key={plan._id} plan={plan} />
                ))}
              </div>
            )}
          </Suspense>
        </div>
      </section>

      {/* ─── STATS SECTION ─── */}
      <StatsSection />

      {/* ─── INDUSTRY COVERAGE ─── */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700">
              <Building2 className="h-3 w-3" />
              Industry Coverage
            </span>
            <h2 className="text-3xl font-bold text-slate-900">
              Experts From <span className="text-indigo-600">Every Industry</span>
            </h2>
            <p className="mt-2 text-slate-600">
              Get matched with a mentor who understands your field
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {INDUSTRIES.map((industry) => (
              <div
                key={industry.name}
                className="flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition hover:border-indigo-300 hover:bg-indigo-50/30"
              >
                <span className="mb-1 text-2xl">{industry.icon}</span>
                <span className="text-sm font-semibold text-slate-700">{industry.name}</span>
                <span className="text-xs text-slate-400">{industry.count}</span>
              </div>
            ))}
          </div>
        </div>
        <CareerPromo section={2} />
      </section>
{/* <CareerPromo section={2} /> */}
      {/* ─── TESTIMONIALS ─── */}
      <section className="bg-[#f9f5ef] px-6 py-16">
        {/* <CareerPromo section={2} /> */}
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              <Star className="h-3 w-3 fill-emerald-500" />
              Real Stories
            </span>
            <h2 className="text-3xl font-bold text-slate-900">
              What Our <span className="text-emerald-600">Community Says</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((testimonial, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
              >
                <div className="mb-3 flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-slate-600">{testimonial.text}</p>
                <div className="border-t border-slate-100 pt-4">
                  <p className="font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-xs text-slate-500">{testimonial.role}</p>
                  <span className="mt-1 inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-600">
                    {testimonial.industry}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ SECTION ─── */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-purple-700">
              <Lightbulb className="h-3 w-3" />
              Got Questions?
            </span>
            <h2 className="text-3xl font-bold text-slate-900">
              Frequently Asked <span className="text-purple-600">Questions</span>
            </h2>
          </div>

          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-sm">
            {FAQS.map((faq, idx) => (
              <details key={idx} className="group px-6 py-5 first:rounded-t-2xl last:rounded-b-2xl">
                <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800 marker:content-none hover:text-amber-600">
                  <span className="flex items-center justify-between gap-4">
                    {faq.q}
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600 transition duration-300 group-open:rotate-45">
                      <span className="text-xl font-light">+</span>
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{faq.a}</p>
              </details>
            ))}
          </div>

          {/* Contact Support */}
          <div className="mt-8 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100/50 p-6 text-center">
            <p className="text-sm font-medium text-slate-700">
              Still have questions? We're here to help!
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-4">
              <a
                href="mailto:support@codelura.com"
                className="inline-flex items-center gap-2 text-sm text-amber-600 transition hover:text-amber-700"
              >
                <Mail className="h-4 w-4" />
                support@codelura.com
              </a>
              <span className="text-slate-300">|</span>
              <a
                href="tel:+919330456710"
                className="inline-flex items-center gap-2 text-sm text-amber-600 transition hover:text-amber-700"
              >
                <Phone className="h-4 w-4" />
                +91 9330456710
              </a>
              <span className="text-slate-300">|</span>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-sm text-amber-600 transition hover:text-amber-700"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-16">
        <div className="mx-auto max-w-3xl text-center text-white">
          <h2 className="text-3xl font-bold">
            Ready to <span className="text-amber-200">Transform</span> Your Career?
          </h2>
          <p className="mt-2 text-amber-100">
            Book your mentorship session today and get expert guidance.
          </p>
          <Link
            href={plans.length > 0 ? `/career/jobs/premium/${plans[0]?.slug}` : "/premium"}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-amber-700 transition hover:scale-[1.02] hover:shadow-xl"
          >
            Get Started Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
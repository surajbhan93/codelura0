"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { CareerTrack, CareerTrackSingleResponse } from "@/components/admin/careerTrack";
import { toast } from "react-hot-toast";

import RazorpayPaymentModal from "@/components/career/RazorpayPaymentModal";

function TrackSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-[#050714] text-white">
      <div className="border-b border-slate-800 bg-[#0B0F24] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="h-6 w-32 rounded bg-purple-950" />
          <div className="mt-4 h-12 w-2/3 rounded bg-purple-950" />
          <div className="mt-4 h-5 w-1/2 rounded bg-purple-950" />
        </div>
      </div>
    </div>
  );
}

export default function CareerTrackDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [track, setTrack] = useState<CareerTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Razorpay Modal state
  const [rzpModalOpen, setRzpModalOpen] = useState(false);
  const [rzpOrderData, setRzpOrderData] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchTrack = async () => {
      try {
        const { data } = await api.get<CareerTrackSingleResponse>(
          `/career-tracks/${params.slug}`
        );
        if (!cancelled) {
          setTrack(data.data);
          if (data.data?._id) {
            checkEnrollment(data.data._id);
          }
        }
      } catch (err) {
        if (!cancelled) setError("This career track couldn't be found.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const checkEnrollment = async (trackId: string) => {
      try {
        const { data } = await api.get("/enrollments/my-enrollments");
        if (data.success) {
          const ids = (data.data || []).map(
            (e: any) => e.itemRef?._id || e.itemRef
          );
          if (ids.includes(trackId)) {
            setIsEnrolled(true);
          }
        }
      } catch (err) {
        // Silent ignore
      }
    };

    fetchTrack();
    return () => {
      cancelled = true;
    };
  }, [params.slug]);

  const handleEnroll = useCallback(async () => {
    if (!track) return;
    setEnrolling(true);

    try {
      // 1. Create Enrollment Order for CareerTrack
      const { data } = await api.post("/enrollments/create-order", {
        itemType: "CareerTrack",
        itemId: track._id,
      });

      if (!data.success) {
        toast.error(data.message || "Enrollment failed.");
        setEnrolling(false);
        return;
      }

      if (data.isFree) {
        toast.success(`Successfully enrolled in ${track.title} for free! 🎉`);
        setIsEnrolled(true);
        setEnrolling(false);
        return;
      }

      // If test mode fallback is triggered (key expired), open built-in Razorpay modal
      if (data.isTestMode) {
        setRzpOrderData({
          orderId: data.orderId,
          enrollmentId: data.enrollmentId,
          amount: data.amount,
          currency: data.currency || "INR",
          itemTitle: track.title,
        });
        setRzpModalOpen(true);
        setEnrolling(false);
        return;
      }

      // 2. Open Official Razorpay SDK Modal
      const options = {
        key: data.key,
        amount: data.amount * 100,
        currency: data.currency || "INR",
        name: "Codelura",
        description: `Enrollment for ${track.title}`,
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await api.post("/enrollments/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              enrollmentId: data.enrollmentId,
            });

            if (verifyRes.data?.success) {
              toast.success(`Successfully enrolled in ${track.title}! 🎉`);
              setIsEnrolled(true);
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (err: any) {
            toast.error(
              err?.response?.data?.message || "Payment verification failed."
            );
          } finally {
            setEnrolling(false);
          }
        },
        modal: {
          ondismiss: function () {
            setEnrolling(false);
          },
        },
        theme: {
          color: "#4F46E5",
        },
      };

      if (typeof window !== "undefined" && (window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        toast.error("Razorpay SDK failed to load. Please refresh.");
        setEnrolling(false);
      }
    } catch (err: any) {
      if (err?.response?.status === 401) {
        toast.error("Please log in to enroll in this career track.");
        router.push("/auth/login");
      } else {
        toast.error(
          err?.response?.data?.message || "Failed to initiate enrollment."
        );
      }
      setEnrolling(false);
    }
  }, [track, router]);

  if (loading) {
    return <TrackSkeleton />;
  }

  if (!track) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-[#050714] px-6 text-center text-slate-400">
        <h1 className="text-2xl font-bold text-white">
          {error || "Career track not found."}
        </h1>
        <p className="text-sm">
          It may have been removed, renamed, or is temporarily unavailable.
        </p>
        <Link
          href="/career/learning/programs"
          className="mt-4 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Explore Career Tracks & Programs
        </Link>
      </div>
    );
  }

  const displayPrice = track.discountPrice || track.price || 9999;
  const originalPrice = track.price || 14999;
  const discountPercent =
    originalPrice && displayPrice
      ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
      : 33;

  const hiringPartners =
    track.hiringPartners && track.hiringPartners.length > 0
      ? track.hiringPartners
      : ["Amazon", "Microsoft", "Adobe", "Flipkart", "Swiggy", "Uber"];

  const defaultRoadmapSteps = [
    {
      phase: "PHASE 01 • MONTH 1",
      title: "Foundations & Core Programming Mastery",
      duration: "4 Weeks (60+ Hours)",
      description:
        "Build rock-solid fundamentals in memory management, object-oriented concepts, time & space complexity, and problem-solving basics.",
      skills: ["Language Syntax", "Pointers & Memory", "Time/Space Complexity", "Recursion"],
      project: "Mini Algorithmic Benchmarking Suite",
    },
    {
      phase: "PHASE 02 • MONTH 2",
      title: "Advanced Data Structures & Algorithms",
      duration: "5 Weeks (90+ Hours)",
      description:
        "Master Linked Lists, Stacks, Queues, Binary Search Trees, Graphs, Dynamic Programming, and Competitive Programming interview techniques.",
      skills: ["Trees & Graphs", "Dynamic Programming", "Tries & Segment Trees", "Greedy"],
      project: "High-Performance Search & Indexing Engine",
    },
    {
      phase: "PHASE 03 • MONTH 3",
      title: "Production Web & System Architecture",
      duration: "6 Weeks (120+ Hours)",
      description:
        "Architect scalable backend services, reactive frontend UIs, RESTful & GraphQL APIs, database modeling, authentication, and caching.",
      skills: ["Frontend Frameworks", "Node/Backend APIs", "SQL & NoSQL DBs", "Redis & Caching"],
      project: "Production Enterprise SaaS Application",
    },
    {
      phase: "PHASE 04 • MONTH 4",
      title: "Cloud Infrastructure, DevOps & Microservices",
      duration: "4 Weeks (80+ Hours)",
      description:
        "Containerize applications with Docker, deploy to AWS cloud services, setup automated CI/CD pipelines, load balancing, and monitoring.",
      skills: ["Docker & Containers", "AWS Cloud Services", "CI/CD Pipelines", "System Monitoring"],
      project: "Multi-Region Distributed Cloud Microservice",
    },
    {
      phase: "PHASE 05 • MONTH 5",
      title: "Placement Acceleration & 1:1 Mentorship",
      duration: "3 Weeks (50+ Hours)",
      description:
        "Undergo 1:1 mock technical interviews, resume & LinkedIn profile reviews, and receive direct hiring referrals to 100+ partner tech firms.",
      skills: ["1:1 Mock Interviews", "Resume Optimization", "Portfolio Review", "Direct Referrals"],
      project: "Verified Career Track Certificate & Hiring Referrals",
    },
  ];

  const displayRoadmapSteps =
    track.roadmap && track.roadmap.length > 0
      ? track.roadmap.map((step, idx) => ({
          phase: `PHASE 0${idx + 1}`,
          title: step.title,
          duration: step.duration || "3-4 Weeks",
          description: step.description,
          skills: [],
          project: undefined,
        }))
      : defaultRoadmapSteps;

  return (
    <div className="min-h-screen bg-[#050714] text-white">
      {/* HERO BANNER SECTION */}
      <section className="relative overflow-hidden border-b border-purple-500/20 bg-gradient-to-b from-[#0D102A] via-[#080B1C] to-[#050714] px-6 py-16">
        <div className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-purple-600/25 blur-[140px]" />
        <div className="pointer-events-none absolute top-1/3 -right-20 h-[450px] w-[450px] rounded-full bg-blue-600/20 blur-[140px]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Left Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/40 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-purple-300 backdrop-blur-md shadow-lg">
                <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse"></span>
                {track.badge || "CAREER ACCELERATOR"}
              </div>

              <h1 className="text-3xl font-extrabold leading-tight text-white md:text-5xl">
                {track.title}{" "}
                <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">
                  Track
                </span>
              </h1>

              {track.subtitle && (
                <p className="text-lg font-medium text-purple-200">
                  {track.subtitle}
                </p>
              )}

              <p className="text-base leading-relaxed text-slate-300 max-w-2xl">
                {track.shortDescription || track.description}
              </p>

              {/* Stats Strip */}
              <div className="grid grid-cols-2 gap-4 border-t border-purple-500/20 pt-6 sm:grid-cols-4 text-xs text-slate-300">
                <div className="rounded-xl border border-purple-500/20 bg-purple-950/20 p-3">
                  <span className="block text-slate-400">Total Duration</span>
                  <span className="font-bold text-white text-sm">
                    {track.totalHours || track.duration || "450+ Hours"}
                  </span>
                </div>
                <div className="rounded-xl border border-purple-500/20 bg-purple-950/20 p-3">
                  <span className="block text-slate-400">Real Projects</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {track.totalProjects || 8} Production Projects
                  </span>
                </div>
                <div className="rounded-xl border border-purple-500/20 bg-purple-950/20 p-3">
                  <span className="block text-slate-400">Expected Salary</span>
                  <span className="font-bold text-amber-400 text-sm">
                    {track.salaryRange || "₹8 LPA - ₹24 LPA"}
                  </span>
                </div>
                <div className="rounded-xl border border-purple-500/20 bg-purple-950/20 p-3">
                  <span className="block text-slate-400">Enrolled Students</span>
                  <span className="font-bold text-white text-sm">
                    {track.enrollments || 1240}+ Students
                  </span>
                </div>
              </div>
            </div>

            {/* Right Sticky Enrollment Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 overflow-hidden rounded-2xl border border-purple-500/30 bg-[#0F1330] p-6 shadow-2xl shadow-purple-950/40">
                {track.thumbnail && (
                  <div className="mb-5 overflow-hidden rounded-xl bg-slate-900">
                    <img
                      src={track.thumbnail}
                      alt={track.title}
                      className="h-44 w-full object-cover"
                    />
                  </div>
                )}

                <div className="mb-4 flex items-baseline gap-3">
                  <span className="text-4xl font-extrabold text-white">
                    ₹{displayPrice.toLocaleString()}
                  </span>
                  <span className="text-base text-slate-500 line-through">
                    ₹{originalPrice.toLocaleString()}
                  </span>
                  <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-xs font-bold text-purple-300 border border-purple-500/30">
                    {discountPercent}% Off
                  </span>
                </div>

                <p className="mb-5 text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  ✓ Lifetime Access + Placement Support Included
                </p>

                {isEnrolled ? (
                  <button
                    disabled
                    className="w-full rounded-xl bg-emerald-500/20 border border-emerald-500/40 py-3.5 text-center font-bold text-emerald-400"
                  >
                    ✓ Enrolled in this Career Track
                  </button>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 py-4 text-center text-base font-bold text-white shadow-lg shadow-purple-600/30 transition hover:from-purple-500 hover:to-indigo-500 active:scale-[0.99] disabled:opacity-50"
                  >
                    {enrolling ? "Processing..." : "Enroll in Career Track"}
                  </button>
                )}

                <div className="mt-6 space-y-3 text-xs text-slate-400 border-t border-purple-500/20 pt-4">
                  <div className="flex justify-between">
                    <span>Placement Assistance</span>
                    <span className="font-semibold text-emerald-400">Yes (1:1 Referrals)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mentor Support</span>
                    <span className="font-semibold text-emerald-400">1:1 Dedicated</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Certificate</span>
                    <span className="font-semibold text-slate-200">Official Certificate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HIRING PARTNERS BANNER */}
      <section className="border-b border-purple-500/10 bg-[#090C1F] py-8 px-6">
        <div className="mx-auto max-w-6xl text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-purple-400">
            Top Tech Companies Hiring From Codelura Career Tracks
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-80">
            {hiringPartners.map((partner, index) => (
              <span
                key={index}
                className="rounded-xl border border-purple-500/20 bg-purple-950/30 px-5 py-2 text-sm font-bold text-slate-200"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN TRACK DETAILS & VISUAL ROADMAP */}
      <div className="mx-auto max-w-6xl px-6 py-12 space-y-12">
        {/* 🗺️ VISUAL LEARNING PATH ROADMAP DIAGRAM */}
        <section className="rounded-2xl border border-purple-500/20 bg-[#0C0F28] p-8 shadow-xl">
          <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-purple-500/10 pb-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/40 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-purple-300">
                🗺️ VISUAL LEARNING ROADMAP
              </span>
              <h2 className="mt-2 text-2xl font-extrabold text-white md:text-3xl">
                Your Complete <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">Career Flowchart Diagram</span>
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                A structured step-by-step roadmap showing every milestone, project & skill from Day 1 to Job Placement.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-full">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                5 Milestone Projects
              </span>
              <span className="flex items-center gap-1.5 font-bold text-purple-300 bg-purple-950/40 border border-purple-500/30 px-3 py-1.5 rounded-full">
                🎯 1:1 Mentors
              </span>
            </div>
          </div>

          {/* TIMELINE FLOWCHART DIAGRAM */}
          <div className="relative border-l-2 border-dashed border-purple-500/40 pl-6 md:pl-10 space-y-10 my-4">
            {displayRoadmapSteps.map((step, idx) => (
              <div key={idx} className="relative group">
                {/* Glowing Numbered Node Ring */}
                <div className="absolute -left-[31px] md:-left-[47px] top-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-purple-400 bg-[#07091B] font-extrabold text-xs text-purple-300 shadow-lg shadow-purple-500/30 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
                  0{idx + 1}
                </div>

                {/* Flowchart Card Box */}
                <div className="rounded-2xl border border-purple-500/20 bg-[#07091B] p-6 transition-all group-hover:border-purple-500/50 group-hover:bg-[#0E1233] group-hover:shadow-2xl shadow-purple-950/40">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full bg-purple-950/80 px-3 py-1 text-[11px] font-bold text-purple-300 border border-purple-500/30 uppercase tracking-wide">
                      {step.phase}
                    </span>
                    <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                      ⏱️ {step.duration}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition">
                    {step.title}
                  </h3>

                  <p className="text-xs leading-relaxed text-slate-300 mb-4">
                    {step.description}
                  </p>

                  {/* Topics Covered & Milestone Project */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border-t border-purple-500/10 pt-4 text-xs">
                    {step.skills && step.skills.length > 0 && (
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-purple-400 mb-1.5">
                          Key Skills & Topics
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {step.skills.map((sk: string, sIdx: number) => (
                            <span
                              key={sIdx}
                              className="rounded-md bg-purple-950/40 border border-purple-500/20 px-2 py-0.5 text-[11px] font-medium text-slate-300"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {step.project && (
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1.5">
                          🚀 Milestone Production Project
                        </span>
                        <span className="inline-block rounded-md bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 text-[11px] font-bold text-emerald-300">
                          {step.project}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* COURSES INCLUDED IN THIS TRACK */}
        {track.courses && track.courses.length > 0 && (
          <section className="rounded-2xl border border-purple-500/20 bg-[#0C0F28] p-8">
            <h2 className="mb-2 text-2xl font-bold text-white">
              Programs & Courses Included in this Track
            </h2>
            <p className="mb-6 text-sm text-slate-400">
              A structured step-by-step curriculum designed to take you from fundamentals to production mastery.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {track.courses.map((course: any, index: number) => (
                <Link
                  key={course._id || index}
                  href={`/career/learning/programs/${course.slug}`}
                  className="group flex flex-col justify-between rounded-xl border border-purple-500/20 bg-[#07091B] p-5 transition hover:border-purple-500/50 hover:bg-[#0F1334]"
                >
                  <div>
                    {course.thumbnail && (
                      <img
                        src={course.thumbnail}
                        alt={course.name}
                        className="mb-3 h-32 w-full rounded-lg object-cover"
                      />
                    )}
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wide">
                      Module {index + 1}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-purple-300">
                      {course.name}
                    </h3>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-purple-500/10 pt-3 text-xs text-slate-400">
                    <span>{course.level || "Intermediate"}</span>
                    <span className="text-purple-400 font-semibold group-hover:underline">
                      Explore Module →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS & TOOLS MASTERED */}
        <section className="rounded-2xl border border-purple-500/20 bg-[#0C0F28] p-8">
          <h2 className="mb-4 text-2xl font-bold text-white">Skills & Tools You&apos;ll Master</h2>

          {track.skills && track.skills.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-purple-400">
                Core Skills
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {track.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-purple-500/30 bg-purple-950/40 px-4 py-1.5 text-xs font-semibold text-purple-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {track.tools && track.tools.length > 0 && (
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-purple-400">
                Tools & Technologies
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {track.tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-blue-500/30 bg-blue-950/40 px-4 py-1.5 text-xs font-semibold text-blue-200"
                  >
                    🛠️ {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* TRACK PERKS & HIGHLIGHTS */}
        <section className="rounded-2xl border border-purple-500/20 bg-[#0C0F28] p-8">
          <h2 className="mb-6 text-2xl font-bold text-white">Why Choose Codelura Career Tracks</h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 text-slate-300">
            <div className="rounded-xl border border-purple-500/20 bg-[#07091B] p-5">
              <div className="mb-3 text-2xl">🧑‍🏫</div>
              <h4 className="mb-1 font-bold text-white text-sm">1:1 Dedicated Mentorship</h4>
              <p className="text-xs text-slate-400">Personalized code reviews and 1-on-1 guidance from top engineers.</p>
            </div>
            <div className="rounded-xl border border-purple-500/20 bg-[#07091B] p-5">
              <div className="mb-3 text-2xl">🚀</div>
              <h4 className="mb-1 font-bold text-white text-sm">Real Production Projects</h4>
              <p className="text-xs text-slate-400">Build 8+ production-ready apps to showcase in your portfolio.</p>
            </div>
            <div className="rounded-xl border border-purple-500/20 bg-[#07091B] p-5">
              <div className="mb-3 text-2xl">💼</div>
              <h4 className="mb-1 font-bold text-white text-sm">Direct Hiring Referrals</h4>
              <p className="text-xs text-slate-400">Get referred directly to top tech firms and partner startups.</p>
            </div>
            <div className="rounded-xl border border-purple-500/20 bg-[#07091B] p-5">
              <div className="mb-3 text-2xl">📄</div>
              <h4 className="mb-1 font-bold text-white text-sm">Resume & Mock Reviews</h4>
              <p className="text-xs text-slate-400">Expert feedback on resume, LinkedIn profile & mock interviews.</p>
            </div>
          </div>
        </section>
      </div>

      {/* Razorpay Online Payment Gateway Modal */}
      {rzpOrderData && (
        <RazorpayPaymentModal
          isOpen={rzpModalOpen}
          onClose={() => setRzpModalOpen(false)}
          orderData={rzpOrderData}
          onSuccess={() => setIsEnrolled(true)}
        />
      )}
    </div>
  );
}
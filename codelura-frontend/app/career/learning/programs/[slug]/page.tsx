"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Program, Section, Instructor } from "@/components/admin/program";
import { toast } from "react-hot-toast";

interface ProgramSingleResponse {
  success: boolean;
  data: Program;
}

// Default Fallback Instructors (CodeHelp Style)
const DEFAULT_INSTRUCTORS: Instructor[] = [
  {
    name: "Love Babbar",
    title: "Founder, Software Engineer & Youtuber",
    company: "Ex-Amazon, Ex-Microsoft SDE",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    bio: "Known for expertise in coding and software engineering. Mentored 500,000+ students.",
    highlights: [
      "Previously worked at Amazon and Microsoft",
      "Followed by students and professionals (~1M+ subscribers)",
      "Mentored 500,000+ students in coding & tech career growth",
    ],
  },
  {
    name: "Lakshay Kumar",
    title: "Lead Instructor & Computer Scientist II at Adobe",
    company: "6+ years industry experience at Adobe",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    bio: "Skilled at breaking down complex computer concepts into easy-to-grasp lessons.",
    highlights: [
      "Currently working at Adobe & Instructor at CodeHelp",
      "Known for simplified explanations and real-life teaching examples",
      "Ex-students now working at Microsoft, Amazon, DE Shaw, and Adobe",
    ],
  },
];

// Default Fallback Curriculum Sections (CodeHelp Style)
const DEFAULT_SECTIONS: Section[] = [
  {
    title: "Namaste Coder !!",
    lessons: [
      { title: "Welcome to Red" },
      { title: "What is LIVE Dashboard" },
      { title: "What is RED Dashboard" },
      { title: "How to access Lectures" },
      { title: "How to Join Discord" },
      { title: "How to clear Doubts" },
      { title: "How to download Course Certificate" },
      { title: "How to Raise Issue/Tickets" },
    ],
  },
  {
    title: "Learn C++",
    lessons: [
      { title: "Intro to C++" },
      { title: "Setting up VS Code for C++ Coding [Windows]" },
      { title: "Setting up VS Code for C++ Coding [Mac devices]" },
      { title: "First CPP Program" },
      { title: "Variables and Datatypes" },
      { title: "User Input in C++" },
      { title: "Control Flow" },
      { title: "Switch Case in C++" },
      { title: "Ternary Operator in C++" },
      { title: "For && While Loop" },
      { title: "Do-while Loop && Nested Loops" },
      { title: "Operators in C++" },
      { title: "Reference: Binary & Decimal Number System" },
      { title: "Reference: TypeCasting in C++" },
      { title: "Functions in C++" },
      { title: "Debug Exercise - 1" },
      { title: "32-bit Vs 64-bit" },
      { title: "All about datatypes" },
      { title: "How Positive & Negative data is stored in memory" },
    ],
  },
  {
    title: "Programming in C++",
    lessons: [
      { title: "L1-Basics of Programming" },
      { title: "L2-Basics of Programming" },
      { title: "L3-Basics of Programming" },
      { title: "MS-Basics of Programming" },
      { title: "RED Quiz - Programming in C++" },
    ],
  },
  { title: "Patterns", lessons: [{ title: "Pattern Problems & Practice" }] },
  { title: "Arrays", lessons: [{ title: "1D & 2D Arrays Deep Dive" }] },
  { title: "Maths Practice Problems", lessons: [{ title: "Essential Math for CP & Interviews" }] },
  { title: "C++ STL", lessons: [{ title: "Vectors, Maps, Sets, Iterators" }] },
  { title: "Sorting and Searching", lessons: [{ title: "Binary Search, Quick Sort, Merge Sort" }] },
  { title: "Strings", lessons: [{ title: "String Manipulation & Char Arrays" }] },
  { title: "Pointers and Basic Maths", lessons: [{ title: "Memory Allocation & Pointers" }] },
  { title: "Practice Problems", lessons: [{ title: "Curated Problem Solving" }] },
  { title: "Recursion", lessons: [{ title: "Recursive Backtracking & Patterns" }] },
  { title: "BT and DnC", lessons: [{ title: "Divide and Conquer & Backtracking" }] },
  { title: "OOPs Concept", lessons: [{ title: "Classes, Objects, Inheritance, Polymorphism" }] },
  { title: "Linked Lists", lessons: [{ title: "Singly, Doubly & Circular Linked Lists" }] },
  { title: "Stacks", lessons: [{ title: "Stack Operations & Applications" }] },
  { title: "Queues", lessons: [{ title: "Queue & Deque Implementations" }] },
  { title: "Trees", lessons: [{ title: "Binary Trees & Traversals" }] },
  { title: "BSTs", lessons: [{ title: "Binary Search Trees Operations" }] },
  { title: "Heaps", lessons: [{ title: "Min Heap, Max Heap, Priority Queue" }] },
  { title: "Maps n Tries", lessons: [{ title: "HashMaps & Trie Data Structure" }] },
  { title: "DP L1", lessons: [{ title: "Dynamic Programming Basics & 1D DP" }] },
  { title: "Graphs L1", lessons: [{ title: "BFS, DFS & Graph Traversals" }] },
  { title: "Graphs L2", lessons: [{ title: "Dijkstra, MST & Advanced Graphs" }] },
  { title: "End: BONUS Module", lessons: [{ title: "Interview Prep & Resume Tips" }] },
];

import RazorpayPaymentModal from "@/components/career/RazorpayPaymentModal";

function ProgramSkeleton() {
  return (
    <div className="min-h-screen bg-[#0A0D17] text-white animate-pulse">
      <div className="border-b border-slate-800 bg-[#0E1222] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="h-6 w-32 rounded bg-slate-800" />
          <div className="mt-4 h-10 w-2/3 rounded bg-slate-800" />
          <div className="mt-4 h-4 w-1/2 rounded bg-slate-800" />
        </div>
      </div>
    </div>
  );
}

export default function ProgramDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Razorpay Modal state
  const [rzpModalOpen, setRzpModalOpen] = useState(false);
  const [rzpOrderData, setRzpOrderData] = useState<any>(null);

  // Search section state
  const [searchSection, setSearchSection] = useState("");
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({
    0: true,
    1: true,
  });

  useEffect(() => {
    let cancelled = false;

    const fetchProgram = async () => {
      try {
        const { data } = await api.get<ProgramSingleResponse>(
          `/programs/slug/${params.slug}`
        );
        if (!cancelled) {
          setProgram(data.data);
          if (data.data?._id) {
            checkEnrollment(data.data._id);
          }
        }
      } catch (err) {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const checkEnrollment = async (programId: string) => {
      try {
        const { data } = await api.get("/enrollments/my-enrollments");
        if (data.success) {
          const enrollmentsList = data.data || [];
          // 1. Direct program enrollment check
          const isDirect = enrollmentsList.some(
            (e: any) => (e.itemRef?._id || e.itemRef) === programId
          );

          if (isDirect) {
            setIsEnrolled(true);
            return;
          }

          // 2. Check if any enrolled Career Track contains this program
          const enrolledTracks = enrollmentsList.filter(
            (e: any) => e.itemType === "CareerTrack"
          );
          for (const trackEnrollment of enrolledTracks) {
            const trackObj = trackEnrollment.itemRef || {};
            const trackCourses = trackObj.courses || [];
            const courseIds = trackCourses.map((c: any) => c._id || c);
            if (courseIds.includes(programId)) {
              setIsEnrolled(true);
              return;
            }
          }
        }
      } catch (err) {
        // Silent ignore
      }
    };

    fetchProgram();
    return () => {
      cancelled = true;
    };
  }, [params.slug]);

  const handleEnroll = useCallback(async () => {
    if (!program) return;
    setEnrolling(true);

    try {
      const { data } = await api.post("/enrollments/create-order", {
        itemType: "Program",
        itemId: program._id,
      });

      if (!data.success) {
        toast.error(data.message || "Enrollment failed.");
        setEnrolling(false);
        return;
      }

      if (data.isFree) {
        toast.success(`Enrolled in ${program.name} for free! 🎉`);
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
          itemTitle: program.name,
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
        description: `Enrollment for ${program.name}`,
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
              toast.success(`Successfully enrolled in ${program.name}! 🎉`);
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
          color: "#E11D48",
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
        toast.error("Please log in to buy this course.");
        router.push("/auth/login");
      } else {
        toast.error(
          err?.response?.data?.message || "Failed to initiate purchase."
        );
      }
      setEnrolling(false);
    }
  }, [program, router]);

  const toggleSection = (index: number) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (loading) {
    return <ProgramSkeleton />;
  }

  if (notFound || !program) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-[#0A0D17] px-6 text-slate-400">
        <h1 className="text-2xl font-bold text-white">Course not found</h1>
        <p className="text-sm">This course may have been removed or unpublished.</p>
        <a
          href="/career/learning/programs"
          className="mt-4 rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
        >
          Explore Courses
        </a>
      </div>
    );
  }

  // Data Calculations
  const badgeText = program.badge || "Codehelp RED";
  const displayPrice = program.discountPrice || program.price || 4100;
  const originalPrice = program.price || 7000;
  const discountPercent =
    originalPrice && displayPrice
      ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
      : 41;

  const displaySections =
    program.sections && program.sections.length > 0
      ? program.sections
      : DEFAULT_SECTIONS;

  const displayInstructors =
    program.instructors && program.instructors.length > 0
      ? program.instructors
      : DEFAULT_INSTRUCTORS;

  const filteredSections = displaySections.filter((sec) =>
    sec.title.toLowerCase().includes(searchSection.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070913] text-white">
      {/* HERO BANNER SECTION (CODEHELP RED STYLE) */}
      <section className="relative border-b border-slate-800 bg-gradient-to-b from-[#0F1426] to-[#070913] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Left Content */}
            <div className="lg:col-span-2">
              {/* Badge */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-rose-400">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
                {program.name} [{badgeText}]
              </div>

              {/* Title */}
              <h1 className="mb-4 text-3xl font-extrabold leading-tight text-white md:text-5xl">
                {program.name}{" "}
                <span className="bg-gradient-to-r from-rose-500 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                  [{badgeText}]
                </span>
              </h1>

              {/* Stats Bar */}
              <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-slate-300">
                <div className="flex items-center gap-1 text-amber-400 font-semibold">
                  <span>⭐ {program.rating ?? "0.0"}</span>
                  <span className="text-slate-400 font-normal">
                    ({program.totalReviews ?? 0}+ Ratings)
                  </span>
                </div>
                <span className="text-slate-700">•</span>
                <div>👥 {program.totalStudentsCount || "3k+ students"}</div>
                <span className="text-slate-700">•</span>
                <div>⏱ {program.totalHours || program.duration || "293 Hours"}</div>
                <span className="text-slate-700">•</span>
                <div>📚 {program.totalSectionsCount || displaySections.length} Sections</div>
                <span className="text-slate-700">•</span>
                <div>🌐 {program.language || "Hindi"}</div>
              </div>

              {/* Description */}
              <p className="mb-6 text-base leading-relaxed text-slate-300 md:text-lg">
                {program.shortDescription ||
                  program.description ||
                  `Master ${program.name} in this course led by industry experts. Learn problem-solving techniques, crack coding interviews, and build a strong foundation with personalized guidance.`}
              </p>
            </div>

            {/* Right Pricing Card Sticky */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 overflow-hidden rounded-2xl border border-rose-500/30 bg-[#0F1426] p-6 shadow-2xl shadow-rose-950/20">
                {(program.thumbnail || program.image) && (
                  <div className="mb-5 overflow-hidden rounded-xl bg-slate-900">
                    <img
                      src={program.thumbnail || program.image}
                      alt={program.name}
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
                  <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-xs font-bold text-rose-400 border border-rose-500/30">
                    {discountPercent}% Off
                  </span>
                </div>

                {program.includedInSubscription !== false && (
                  <p className="mb-5 text-xs font-medium text-amber-400 flex items-center gap-1">
                    ✓ (Included in subscription)
                  </p>
                )}

                {isEnrolled ? (
                  <button
                    disabled
                    className="w-full rounded-xl bg-emerald-500/20 border border-emerald-500/40 py-3.5 text-center font-bold text-emerald-400"
                  >
                    ✓ Enrolled in this Course
                  </button>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full rounded-xl bg-gradient-to-r from-rose-600 to-red-600 py-4 text-center text-base font-bold text-white shadow-lg shadow-rose-600/30 transition hover:from-rose-500 hover:to-red-500 active:scale-[0.99] disabled:opacity-50"
                  >
                    {enrolling ? "Processing..." : "Buy Course"}
                  </button>
                )}

                <div className="mt-6 space-y-3 text-xs text-slate-400 border-t border-slate-800/80 pt-4">
                  <div className="flex justify-between">
                    <span>Course Validity</span>
                    <span className="font-semibold text-slate-200">Lifetime Access</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Language</span>
                    <span className="font-semibold text-slate-200">{program.language || "Hindi"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Certificate</span>
                    <span className="font-semibold text-emerald-400">Included</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-12 space-y-16">
        {/* WHAT YOU'LL LEARN */}
        <section className="rounded-2xl border border-slate-800 bg-[#0C101F] p-8">
          <h2 className="mb-2 text-2xl font-bold text-white">What you&apos;ll learn</h2>
          <p className="mb-6 text-sm text-slate-400">
            Discover the key skills and concepts you&apos;ll master in this course to advance your programming expertise.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {(program.points && program.points.length > 0
              ? program.points
              : [
                  "Master C++ & Advanced Data Structures from basic to advanced level",
                  "Solve 300+ Curated Interview & Competitive Programming Problems",
                  "Learn Problem Solving Techniques & Space-Time Complexity Analysis",
                  "Personalized guidance & doubt clearance with top industry mentors",
                  "Build strong foundation for product-based company hiring rounds",
                ]
            ).map((point, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold">
                  ✓
                </span>
                <span className="text-sm text-slate-200">{point}</span>
              </div>
            ))}
          </div>
        </section>

        {/* COURSE CONTENT (SECTIONS ACCORDION) */}
        <section className="rounded-2xl border border-slate-800 bg-[#0C101F] p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Course Content</h2>
              <p className="mt-1 text-xs text-slate-400">
                {displaySections.length} Sections • Detailed step-by-step curriculum
              </p>
            </div>

            <input
              type="text"
              value={searchSection}
              onChange={(e) => setSearchSection(e.target.value)}
              placeholder="Search sections..."
              className="w-full max-w-xs rounded-xl border border-slate-700 bg-[#070913] px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="space-y-3">
            {filteredSections.map((sec, index) => {
              const isOpen = Boolean(openSections[index]);
              return (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl border border-slate-800/80 bg-[#070913]"
                >
                  <button
                    onClick={() => toggleSection(index)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-slate-900/50 transition"
                  >
                    <span className="font-semibold text-slate-100 text-sm">
                      {sec.title}
                    </span>
                    <span className="text-slate-400 text-sm font-bold">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && sec.lessons && sec.lessons.length > 0 && (
                    <div className="border-t border-slate-800/60 bg-[#0C101F] px-5 py-3 space-y-2">
                      {sec.lessons.map((les, lIndex) => (
                        <div
                          key={lIndex}
                          className="flex items-center justify-between py-1.5 text-xs text-slate-300"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">▶</span>
                            <span>{les.title}</span>
                          </div>
                          {les.duration && (
                            <span className="text-slate-500">{les.duration}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* OUR INSTRUCTORS */}
        <section className="rounded-2xl border border-slate-800 bg-[#0C101F] p-8">
          <h2 className="mb-1 text-2xl font-bold text-white">Our Instructors</h2>
          <p className="mb-8 text-sm text-slate-400">
            Passionate mentors dedicated to fuelling your coding journey.
          </p>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {displayInstructors.map((inst, i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-[#070913] p-6"
              >
                <div>
                  <div className="mb-4 flex items-center gap-4">
                    {inst.image ? (
                      <img
                        src={inst.image}
                        alt={inst.name}
                        className="h-16 w-16 rounded-full object-cover border-2 border-rose-500/40"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-600 font-bold text-xl text-white">
                        {inst.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-white">{inst.name}</h3>
                      <p className="text-xs text-rose-400 font-semibold">{inst.title}</p>
                      {inst.company && (
                        <p className="text-xs text-slate-400 mt-0.5">{inst.company}</p>
                      )}
                    </div>
                  </div>

                  {inst.bio && (
                    <p className="mb-4 text-xs leading-relaxed text-slate-300">
                      {inst.bio}
                    </p>
                  )}

                  {inst.highlights && inst.highlights.length > 0 && (
                    <div className="space-y-2 border-t border-slate-800 pt-4 text-xs text-slate-300">
                      {inst.highlights.map((hl, hIndex) => (
                        <div key={hIndex} className="flex items-start gap-2">
                          <span className="text-rose-400">•</span>
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* OUR SUCCESS STORIES */}
        <section className="rounded-2xl border border-slate-800 bg-[#0C101F] p-8">
          <h2 className="mb-1 text-2xl font-bold text-white">Our Success Stories</h2>
          <p className="mb-6 text-sm text-slate-400">
            Discover inspiration and insights through recent reviews from our students. Their success stories reflect the transformative journey of learning and growth with us.
          </p>

          {program.reviews && program.reviews.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {program.reviews.map((rev, rIndex) => (
                <div
                  key={rIndex}
                  className="flex flex-col justify-between rounded-xl border border-slate-800/80 bg-[#070913] p-6 shadow-md transition hover:border-slate-700"
                >
                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      {rev.userAvatar ? (
                        <img
                          src={rev.userAvatar}
                          alt={rev.userName}
                          className="h-12 w-12 rounded-full object-cover border border-rose-500/40"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-600/30 border border-rose-500/40 text-rose-300 font-bold text-lg">
                          {rev.userName ? rev.userName.charAt(0).toUpperCase() : "S"}
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-white">{rev.userName}</h4>
                        {rev.userRole && (
                          <p className="text-xs text-rose-400 font-medium">{rev.userRole}</p>
                        )}
                      </div>
                    </div>

                    <div className="mb-3 text-xs text-amber-400">
                      {"★".repeat(rev.rating || 5)}
                      {"☆".repeat(5 - Math.min(5, Math.max(1, rev.rating || 5)))}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      &quot;{rev.comment}&quot;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-slate-500 border border-dashed border-slate-800 rounded-xl">
              No reviews yet. Be the first to enroll and share your success story!
            </div>
          )}
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
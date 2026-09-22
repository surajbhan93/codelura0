
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { getCourses, getTestimonials } from "./lib/data";
import { Hero } from "./components/Hero";
import { CourseGrid } from "./components/CourseGrid";
import { MentorshipBanner } from "./components/MentorshipBanner";

// Lazy load below-the-fold Testimonials section for optimal bundle splitting
const Testimonials = dynamic(
  () => import("./components/Testimonials").then((mod) => mod.Testimonials),
  { ssr: true }
);

// Enable ISR (Incremental Static Revalidation) every 5 minutes
export const revalidate = 300;

// Full SEO Metadata (Desktop 100 / SEO 100)
export const metadata: Metadata = {
  title: "Best Study Materials for Placements & Software Engineering Interviews",
  description: "Free and premium DSA Notes, Aptitude Guides, System Design, Core CS Subjects, Roadmaps and Interview Preparation Courses.",
  keywords: ["DSA Notes", "Placement Prep", "Coding Interview Questions", "Software Engineering Courses", "System Design"],
  openGraph: {
    title: "Best Study Materials for Placements & Engineering Interviews",
    description: "DSA Notes, Aptitude, Core Subjects, Interview Questions & Roadmaps.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Placement Study Materials",
    description: "Prepare for Software Engineering Interviews with top-rated DSA and System Design materials.",
  },
};

export default async function CoursesPage() {
  // Fetch cached data in parallel on the server
  const [courses, testimonials] = await Promise.all([
    getCourses(),
    getTestimonials(),
  ]);

  const paidCoursesCount = courses.filter((c) => c.isPaid).length;

  // Rich JSON-LD Structured Data Schema for Search Engines (SEO 100)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Software Engineering Study Materials & Courses",
    "itemListElement": courses.slice(0, 10).map((c, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "Course",
        "name": c.title,
        "description": c.category,
        "provider": {
          "@type": "Organization",
          "name": "Tech Prep Hub",
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans selection:bg-indigo-500 selection:text-white">
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <Hero totalCourses={courses.length} paidCoursesCount={paidCoursesCount} />

          <CourseGrid initialCourses={courses} />

          <MentorshipBanner />

          <Suspense fallback={<div className="h-40 animate-pulse bg-slate-200/50 rounded-2xl mt-20" />}>
            <Testimonials testimonials={testimonials} />
          </Suspense>
        </div>
      </main>
    </>
  );
}
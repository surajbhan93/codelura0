// app/ats-checker/page.tsx
// Server Component — static sections render with zero client JS.
// Only the actual tool (input, PDF parsing, results, FAQ toggle) is client-side.
import Link from "next/link";
import AtsCheckerTool from "./AtsCheckerTool";
import FaqAccordion from "./FaqAccordion";
import { FAQS } from "./faqs";

// FAQ structured data for search engines — computed at build/request time on the server
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function AtsCheckerPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        {/* Breadcrumb — static, server-rendered */}
        <nav className="mb-6 text-xs text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-300">Home</Link>
          <span className="mx-1.5">/</span>
          <Link href="/career" className="hover:text-slate-300">Career Tools</Link>
          <span className="mx-1.5">/</span>
          <span className="text-slate-400">ATS Resume Checker</span>
        </nav>

        {/* Header — static, server-rendered */}
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
            🔑 100% private — your resume never leaves your browser
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Free ATS Resume Checker
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-sm text-slate-400 sm:text-base">
            Paste your resume or upload a PDF to get an instant{" "}
            <strong>ATS compatibility score</strong>, a keyword match against any
            job description, and a prioritized list of fixes.
          </p>
          <p className="mt-2 max-w-2xl mx-auto text-xs text-slate-500 sm:text-sm">
            Used by job seekers to check resume formatting, parseability, and keyword
            coverage before applying — the same things most Applicant Tracking Systems
            evaluate before a recruiter ever sees your resume.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/50 px-3 py-1 text-xs text-slate-400">
              📄 Parse check
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/50 px-3 py-1 text-xs text-slate-400">
              🔍 Keyword match
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/50 px-3 py-1 text-xs text-slate-400">
              ⚡ Instant
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/50 px-3 py-1 text-xs text-slate-400">
              🏆 ATS badge
            </span>
          </div>
        </div>

        {/* How it works — static, server-rendered */}
        <section className="mb-10 grid gap-4 sm:grid-cols-3" aria-labelledby="how-it-works">
          <h2 id="how-it-works" className="sr-only">How the ATS checker works</h2>
          {[
            { n: "1", t: "Add your resume", d: "Paste the text or upload a PDF/TXT file. Parsing happens in your browser." },
            { n: "2", t: "Add a job description", d: "Optional, but this unlocks a keyword match score against the specific role." },
            { n: "3", t: "Get your score", d: "See a category breakdown, missing keywords, and a prioritized fix list." },
          ].map((s) => (
            <div key={s.n} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/15 text-xs font-semibold text-blue-300">
                {s.n}
              </span>
              <p className="mt-3 text-sm font-medium text-slate-200">{s.t}</p>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </section>

        {/* The actual interactive tool — client component, only this ships JS */}
        <AtsCheckerTool />

        {/* Related tools — static, server-rendered */}
        <section className="mt-10" aria-labelledby="related-tools">
          <h2 id="related-tools" className="mb-4 text-lg font-semibold">More career tools</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/career/tools/resume-builder" className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition hover:border-blue-500/50">
              <div className="text-2xl mb-2">📝</div>
              <p className="text-sm font-medium text-slate-200">Resume Builder</p>
              <p className="mt-1 text-xs text-slate-500">Build an ATS-friendly resume in minutes.</p>
            </Link>
            <Link href="/career/mentorship/resume-review" className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition hover:border-blue-500/50">
              <div className="text-2xl mb-2">📄</div>
              <p className="text-sm font-medium text-slate-200">Resume Review Session</p>
              <p className="mt-1 text-xs text-slate-500">Get personalized feedback from an expert.</p>
            </Link>
            <Link href="/career/mentorship/mock-interview" className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition hover:border-blue-500/50">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-sm font-medium text-slate-200">Mock Interview</p>
              <p className="mt-1 text-xs text-slate-500">Practice with experienced engineers.</p>
            </Link>
            <Link href="/career/learning/study-material" className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition hover:border-blue-500/50">
              <div className="text-2xl mb-2">❓</div>
              <p className="text-sm font-medium text-slate-200">Interview Questions</p>
              <p className="mt-1 text-xs text-slate-500">Common questions asked by top companies.</p>
            </Link>
          </div>
        </section>

        {/* Educational content — static, server-rendered */}
        <section className="mt-14" aria-labelledby="what-we-check">
          <h2 id="what-we-check" className="mb-4 text-lg font-semibold">
            What this ATS checker looks at
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <p className="text-sm font-medium text-slate-200">Parseability</p>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Checks whether your resume&apos;s structure — headings, dates, bullet
                points — is in a format most parsing software can read correctly,
                without relying on tables, columns, or images that often get scrambled.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <p className="text-sm font-medium text-slate-200">Keyword coverage</p>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Compares the skills and terms in your resume against the job
                description you provide, so you can see exactly what&apos;s missing
                before you hit apply.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <p className="text-sm font-medium text-slate-200">Section structure</p>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Looks for standard sections — experience, education, skills — under
                clear headings, since non-standard labels can confuse both software
                and human reviewers.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <p className="text-sm font-medium text-slate-200">Length and word count</p>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Flags resumes that are too short to show impact or too long to hold
                a recruiter&apos;s attention during a quick first pass.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ — data is server-rendered, only the open/close toggle is client-side */}
        <section className="mt-14" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="mb-4 text-lg font-semibold">
            Frequently asked questions
          </h2>
          <FaqAccordion faqs={FAQS} />
        </section>

        {/* Footer links — static, server-rendered */}
        <footer className="mt-14 border-t border-slate-800 pt-6 text-center">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
            <Link href="/career/tools/resume-builder" className="hover:text-slate-300">Resume Builder</Link>
            <Link href="/career/learning/career-tracks" className="hover:text-slate-300">Career Roadmaps</Link>
            <Link href="/career/learning/study-material" className="hover:text-slate-300">Interview Questions</Link>
            <Link href="/career/learning/courses" className="hover:text-slate-300">Free Courses</Link>
            <Link href="/career/jobs/latest" className="hover:text-slate-300">Browse Jobs</Link>
          </div>
          <p className="mt-4 text-[11px] text-slate-600">
            Resume text is parsed in your browser and used only to generate your score — not stored or shared.
          </p>
        </footer>
      </div>
    </main>
  );
}
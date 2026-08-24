import type { Metadata } from "next";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
import CTABand from "@/components/services/Ctaband";

export const metadata: Metadata = {
  title: "School Website Design | Admissions, Notices & Parent Enquiries — Pixelnext",
  description:
    "Pixelnext builds school websites with online admission forms, notice boards, and parent-friendly pages that simplify communication and boost enrolment enquiries.",
};

const features = [
  {
    title: "Online admission forms",
    desc: "A guided, mobile-friendly admission enquiry form collects student details and routes them directly to your admissions office.",
  },
  {
    title: "Notice board & circulars",
    desc: "A simple, dated notice section that parents check regularly, replacing scattered WhatsApp group forwards and printed circulars.",
  },
  {
    title: "Academics & curriculum pages",
    desc: "Clear pages explaining your board affiliation, curriculum approach, and grade-wise structure, written for parents new to the school.",
  },
  {
    title: "Faculty & infrastructure showcase",
    desc: "Photos and details of classrooms, labs, sports facilities, and teaching staff help parents visualise daily school life before a campus visit.",
  },
  {
    title: "Events & achievements gallery",
    desc: "An easily updatable gallery for annual day, sports day, and competition wins keeps the website feeling alive rather than static.",
  },
  {
    title: "Fee & transport information",
    desc: "Clear, organised information about fee structure and transport routes reduces the volume of repetitive calls to your front office.",
  },
];

const process = [
  {
    step: "Understanding your school",
    detail:
      "We learn your board affiliation, grade structure, facilities, and the specific concerns parents in your area typically have.",
  },
  {
    step: "Content & sitemap",
    detail:
      "We map every page — academics, admissions, facilities, notices, contact — and draft content for your review and correction.",
  },
  {
    step: "Design & build",
    detail:
      "A warm, trustworthy design is built reflecting your school's character, then development adds forms, notices, and galleries.",
  },
  {
    step: "Review & launch",
    detail:
      "You review the live preview, request changes, and we launch on your domain after a final mobile and speed check.",
  },
  {
    step: "Academic-year support",
    detail:
      "We help post new notices, update admission windows, and refresh galleries through the academic year as things change.",
  },
];

const faqs = [
  {
    q: "Can parents submit admission enquiries directly through the website?",
    a: "Yes, we build a structured admission enquiry form that collects the child's grade, previous school, and contact details, routing it straight to your admissions team.",
  },
  {
    q: "How do we keep the notice board updated without calling the agency every time?",
    a: "We provide simple, guided access so your office staff can post a new notice or circular themselves in under a minute, without touching any other part of the website.",
  },
  {
    q: "Can the website list our transport routes and fee structure?",
    a: "Yes, we organise transport routes by area and fee structure by grade into clear, easy-to-scan pages that significantly reduce repetitive office phone calls.",
  },
  {
    q: "Will the website work well for parents who are not very tech-savvy?",
    a: "Yes, we deliberately keep navigation simple and language plain, since a meaningful share of parents visiting the site may not be comfortable with complex web interfaces.",
  },
  {
    q: "Can we add photos and videos from school events after launch?",
    a: "Yes, the events and achievements gallery is built for easy ongoing updates, so annual day, sports day, and competition highlights can be added throughout the year.",
  },
];

export default function SchoolWebsitesPage() {
  return (
    <main className="overflow-hidden bg-white">
      {/* <Navbar /> */}

      <section className="relative border-b border-slate-200 bg-gradient-to-b from-brand-50 via-white to-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-600">
              Education · School Websites
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-slate-900 lg:text-5xl">
              A school website that parents actually trust
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
              We build school websites with simple admissions, an always
              up-to-date notice board, and clear academic information that
              helps parents feel confident before they even visit campus.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
                    <a
  href="#contact"
  className="
    group
    relative
    inline-flex
    items-center
    gap-2
    overflow-hidden
    rounded-full
    bg-gradient-to-r
    from-blue-600
    via-cyan-500
    to-emerald-500
    px-8
    py-3.5
    text-sm
    font-semibold
    text-white
    shadow-xl
    shadow-cyan-500/30
    transition-all
    duration-300
    hover:-translate-y-1
    hover:scale-105
    hover:shadow-2xl
    hover:shadow-cyan-500/40
  "
>
  <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

  <span className="relative z-10">
    Get a Free Quote
  </span>

  <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
    →
  </span>
</a>
             <a
  href="#process"
  className="
    group
    relative
    overflow-hidden
    rounded-full
    border-2
    border-blue-500
    bg-gradient-to-r
    from-blue-50
    to-cyan-50
    px-8
    py-3
    text-sm
    font-semibold
    text-blue-700
    shadow-lg
    shadow-blue-500/20
    transition-all
    duration-300
    hover:-translate-y-1
    hover:border-cyan-500
    hover:shadow-xl
    hover:shadow-cyan-500/30
  "
>
  <span className="relative z-10 flex items-center gap-2">
    See how we work
    <span className="transition-transform duration-300 group-hover:translate-x-1">
      →
    </span>
  </span>
</a>
            </div>
            <div className="mt-10 flex flex-wrap gap-8 text-sm text-slate-500">
              <div>
                <p className="font-display text-2xl font-bold text-slate-900">
                  90+
                </p>
                <p>Schools delivered</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-slate-900">
                  2x
                </p>
                <p>Average admission enquiries</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-slate-900">
                  14 days
                </p>
                <p>Typical turnaround</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200">
              <img
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop"
                alt="School building exterior with students"
                className="h-[420px] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden w-56 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl lg:block">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                New Notice
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                Admissions open for Grade 1
              </p>
              <p className="text-xs text-slate-500">Posted 2 hours ago</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1503676382389-4809596d5290?q=80&w=1100&auto=format&fit=crop"
              alt="Children in a classroom raising hands"
              className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lg"
            />
          </div>
          <div>
            <h2 className="font-display text-3xl font-semibold text-slate-900">
              A school website is often a parent's first campus visit
            </h2>
            <p className="mt-5 leading-relaxed text-slate-600">
              Before a parent ever steps onto your campus, they almost
              certainly visit your website, often comparing it against two
              or three other schools in the same search session. They are
              looking for reassurance: is this school organised, is it
              well-resourced, does it communicate clearly with parents.
              An outdated, cluttered, or broken website quietly suggests
              the school itself might be the same way, even if that is
              far from true in reality.
            </p>
            <p className="mt-4 leading-relaxed text-slate-600">
              We design school websites to project the calm, organised
              environment parents are hoping to find. Clear admissions
              information, visible facilities, real photos rather than
              generic stock imagery, and a notice board that is
              demonstrably kept current all combine to build that
              confidence before a single phone call is made.
            </p>
            <p className="mt-4 leading-relaxed text-slate-600">
              We also design with the school's daily operational reality
              in mind. Office staff are often juggling many
              responsibilities, so the website needs to be easy for them
              to update without specialist help — posting a new notice,
              updating an admission deadline, or adding photos from a
              recent event should take minutes, not require a call to a
              developer.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-slate-900">
              What goes into every school website
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              Each feature is designed around a specific concern parents
              raise during the admission decision process.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-brand-200 hover:shadow-md"
              >
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-6 sm:grid-cols-3">
          <img
            src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=700&auto=format&fit=crop"
            alt="Teacher helping students in classroom"
            className="aspect-[3/4] w-full rounded-2xl object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=700&auto=format&fit=crop"
            alt="Children playing in a school playground"
            className="aspect-[3/4] w-full rounded-2xl object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=700&auto=format&fit=crop"
            alt="School library with students reading"
            className="aspect-[3/4] w-full rounded-2xl object-cover"
          />
        </div>
      </section>

      <section id="process" className="bg-[#0B1224] py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-white">
              How we build your school website
            </h2>
            <p className="mt-4 leading-relaxed text-slate-400">
              A five-step process designed around academic-year cycles
              and how school office teams actually operate.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-5">
            {process.map((p, i) => (
              <div
                key={p.step}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <span className="font-display text-3xl font-bold text-brand-500">
                  0{i + 1}
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-white">
                  {p.step}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {p.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <h2 className="font-display text-3xl font-semibold text-slate-900">
          Built for every kind of school
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-slate-600">
          From single-campus neighbourhood schools to multi-branch
          institutions, the structure adapts while staying easy for
          parents to navigate.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-4">
          {[
            {
              name: "Neighbourhood day schools",
              detail:
                "A focused, welcoming site emphasising proximity, safety, and a clear admissions process for nearby families.",
            },
            {
              name: "CBSE / ICSE / State board schools",
              detail:
                "Clear board affiliation, curriculum approach, and grade-wise academic structure presented in parent-friendly language.",
            },
            {
              name: "International & IB schools",
              detail:
                "Detailed curriculum philosophy pages and global outcome highlights for parents evaluating international education paths.",
            },
            {
              name: "Multi-branch school groups",
              detail:
                "A branch locator with individual campus pages, while keeping consistent branding and admissions process across locations.",
            },
          ].map((item) => (
            <div
              key={item.name}
              className="rounded-2xl border border-slate-200 p-6"
            >
              <h3 className="font-display text-base font-semibold text-slate-900">
                {item.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-display text-3xl font-semibold text-slate-900">
                What changes after launch
              </h2>
              <p className="mt-4 leading-relaxed text-slate-600">
                Schools that move to a structured, modern website typically
                see admission enquiries become better qualified, since
                parents arrive already informed about fees, curriculum,
                and facilities, rather than asking basic questions the
                website should have already answered.
              </p>
              <p className="mt-4 leading-relaxed text-slate-600">
                Front office teams consistently report fewer repetitive
                calls about fee structure, transport routes, and admission
                deadlines once that information lives clearly on the
                website.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="font-display text-3xl font-bold text-brand-500">
                  2x
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Average increase in admission enquiry form submissions.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="font-display text-3xl font-bold text-brand-500">
                  40%
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Reported drop in repetitive front-office phone queries.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="font-display text-3xl font-bold text-brand-500">
                  14 days
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Typical build time for a full school website.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="font-display text-3xl font-bold text-brand-500">
                  97%
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Client satisfaction score across post-launch reviews.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 lg:px-10">
        <h2 className="font-display text-3xl font-semibold text-slate-900">
          A closer look at what makes school websites work
        </h2>
        <div className="mt-8 space-y-6 leading-relaxed text-slate-600">
          <p>
            A school website serves two very different audiences at once:
            prospective parents evaluating whether to enrol their child,
            and current parents who need quick access to notices, fee
            details, and event updates. Trying to serve both audiences
            with the same homepage layout often satisfies neither well, so
            we design clear, separate pathways — an admissions-focused
            entry point for new parents, and an easily findable notice
            board and parent resources section for current families.
          </p>
          <p>
            Admission decisions are emotional as much as logistical.
            Parents are not just evaluating curriculum and fees, they are
            imagining their child spending years in this environment. Real
            photography of actual classrooms, playgrounds, and students —
            with appropriate consent — does far more to build that
            emotional confidence than generic stock photos of children who
            have never set foot on your campus. We always push for real
            imagery wherever a school can provide it, even if it means a
            short delay while photos are gathered.
          </p>
          <p>
            The notice board is one of the most-visited sections on any
            active school website, and also the one most likely to go
            stale without an easy update process. We build this section
            specifically for non-technical office staff, with a simple
            form to add a new notice, attach a circular PDF if needed, and
            have it appear instantly on the website without touching any
            other page. A notice board that visibly updates regularly
            becomes a habit destination for parents, reducing reliance on
            scattered WhatsApp group messages that are easy to miss.
          </p>
          <p>
            Fee and transport information is another area where clarity
            consistently reduces operational load. We organise fee
            structures by grade and transport routes by area into clean,
            scannable tables, which we have seen measurably reduce the
            volume of routine calls to the front office, freeing staff to
            focus on more substantive parent conversations.
          </p>
          <p>
            Finally, we think about the academic-year rhythm a school
            actually lives by. Admission windows open and close, annual
            events happen on a calendar, and exam schedules shift each
            term. We design the website's content structure to be
            refreshed easily along this rhythm, rather than treating
            launch as a one-time event after which the site quietly goes
            stale.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <h2 className="font-display text-3xl font-semibold text-slate-900">
            A quick checklist before choosing a school website partner
          </h2>
          <p className="mt-4 leading-relaxed text-slate-600">
            Use this checklist to evaluate any agency you are considering
            for your school's website project.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              "Will your office staff be able to post a new notice themselves in a few minutes, without developer help?",
              "Does the proposed design use real photos of your campus, or generic stock images of unrelated schools?",
              "Is there a structured admission enquiry form that routes directly to your admissions team?",
              "Are fee structures and transport routes presented clearly, rather than hidden behind a 'contact us' message?",
              "Will the site clearly separate information for prospective parents versus current parents?",
              "Is there a plan for updating the events and achievements gallery throughout the academic year?",
              "Does the agency understand board-specific terminology relevant to your school (CBSE, ICSE, IB, State board)?",
              "Is there a clear, written timeline and cost for the project?",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-5"
              >
                <span className="mt-0.5 grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                  ✓
                </span>
                <p className="text-sm leading-relaxed text-slate-700">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 lg:px-10 border-t border-slate-200">
        <h2 className="font-display text-3xl font-semibold text-slate-900">
          Frequently asked questions
        </h2>
        <div className="mt-10 divide-y divide-slate-200">
          {faqs.map((f) => (
            <details key={f.q} className="group py-6">
              <summary className="flex cursor-pointer items-center justify-between font-display text-base font-semibold text-slate-900">
                {f.q}
                <span className="ml-4 text-brand-500 transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <CTABand
        heading="Let's build a school website parents trust from the first click"
        subtext="Share your school details and we'll show you a sample homepage within 48 hours, free of cost."
      />

      {/* <Footer /> */}
    </main>
  );
}
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
// import { Suspense, lazy } from "react";
import CTABand from "@/components/services/Ctaband";
import TypeAnimationWrapper from "./TypeAnimationWrapper";
// SEO Metadata
export const metadata: Metadata = {
  title: "Clinic & Hospital Website Design | Appointment-Ready Healthcare Websites",
  description: "Professional clinic websites with online booking, WhatsApp enquiry, doctor profiles, and mobile-first design. Turn visitors into booked appointments.",
  keywords: "clinic website design, hospital website, healthcare website, doctor website, medical website, online appointment booking, WhatsApp enquiry",
  openGraph: {
    title: "Clinic & Hospital Website Design - Appointment-Ready",
    description: "Turn website visitors into booked appointments with online scheduling, WhatsApp enquiry, and doctor profiles.",
    type: "website",
    url: "https://codelura.com/services/clinic-websites",
    siteName: "Codelura",
    images: [
      {
        url: "/og/clinic-websites.jpg",
        width: 1200,
        height: 630,
        alt: "Clinic Website Design Services",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://codelura.com/services/clinic-websites",
  },
};

// Lazy load heavy components
// const TypeAnimation = lazy(() => import("react-type-animation").then(mod => ({ default: mod.TypeAnimation })));

// Static data - moved outside component to prevent recreation
const features = [
  {
    title: "Online appointment booking",
    desc: "A real-time booking widget lets patients pick a doctor, date, and slot without calling the front desk, cutting no-shows and phone load.",
  },
  {
    title: "WhatsApp & call-back enquiry",
    desc: "Every page carries a floating WhatsApp button and a call-back form, so patients can reach you in the channel they already trust.",
  },
  {
    title: "Department & doctor pages",
    desc: "Dedicated pages for each department and consulting doctor make it easy for patients to find the right specialist before they even call.",
  },
  {
    title: "Mobile-first layout",
    desc: "Eight in ten patients search for a clinic on their phone. Every page is built mobile-first, then scaled up, not the other way round.",
  },
  {
    title: "Google Maps & directions",
    desc: "An embedded map with parking notes and nearest landmark reduces the 'where exactly is it' calls your reception gets every day.",
  },
  {
    title: "Patient testimonials & ratings",
    desc: "Verified Google reviews and patient stories are pulled onto the homepage automatically, building trust before the first visit.",
  },
] as const;

const buildProcess = [
  {
    step: "Discovery call",
    detail: "We spend 30 minutes understanding your departments, doctors, busiest hours, and what currently frustrates your front-desk team.",
  },
  {
    step: "Content & sitemap",
    detail: "We map every page your clinic needs — home, departments, doctors, packages, contact — and write first-draft content for your review.",
  },
  {
    step: "Design & build",
    detail: "Our designers build a clinic-specific layout, then our developers wire up booking, WhatsApp, forms, and maps end to end.",
  },
  {
    step: "Review & launch",
    detail: "You review on a live preview link, we apply changes, run a final speed and mobile check, then go live on your domain.",
  },
  {
    step: "Care & updates",
    detail: "Post-launch we monitor uptime, update doctor schedules or new departments, and report monthly enquiry numbers.",
  },
] as const;

const clinicTypes = [
  {
    name: "Single-doctor clinics",
    detail: "One strong homepage, a doctor bio, a services list, and a booking form is usually all that is needed to convert local search traffic.",
  },
  {
    name: "Multi-specialty clinics",
    detail: "Each department gets its own page with relevant doctors, procedures, and FAQs, with a shared navigation so patients never feel lost.",
  },
  {
    name: "Diagnostic & imaging centres",
    detail: "Test and package pages with pricing, preparation instructions, and report turnaround time reduce repetitive phone queries.",
  },
  {
    name: "Hospital chains",
    detail: "A branch locator, centralised doctor directory, and consistent design across locations while still allowing local content per branch.",
  },
] as const;

const stats = [
  { value: "2.3x", label: "Average increase in online appointment requests within 90 days of launch." },
  { value: "< 2s", label: "Typical mobile load time for pages we build and deploy." },
  { value: "35%", label: "Reported drop in repetitive front-desk phone queries." },
  { value: "98%", label: "Client satisfaction score across post-launch reviews." },
] as const;

const checklist = [
  "Does the team have actual healthcare website examples, not just generic templates relabeled with a stethoscope icon?",
  "Is appointment booking a real, working feature in the demo, or just a button that opens a static contact form?",
  "Will doctor and department pages be structured for search engines, or dumped into one long scrolling page?",
  "Is there a clear plan for updating doctor schedules, new departments, or seasonal health camps after launch?",
  "Does the proposal include WhatsApp integration, which is how most Indian patients actually prefer to communicate?",
  "Is mobile performance tested on a real device and slower network, not just a fast office Wi-Fi connection?",
  "Are patient testimonials and Google reviews pulled in a way that looks authentic rather than stock photography?",
  "Is there a written estimate of timeline and cost, with no vague 'depends on requirements' answer at this stage?",
] as const;

const faqs = [
  {
    q: "How long does a clinic website take to build?",
    a: "Most single-location clinic websites go live in 10 to 14 working days once content and doctor details are shared. Multi-department hospitals with 15+ pages typically take 3 to 4 weeks.",
  },
  {
    q: "Can patients book appointments directly from the website?",
    a: "Yes. We integrate a booking widget that shows doctor-wise availability by date and time slot. Bookings can route to email, WhatsApp, or your existing clinic management software.",
  },
  {
    q: "Will the website work for my multi-branch clinic chain?",
    a: "Yes, we build a branch locator with individual location pages, each with its own address, doctors, timings, and map pin, while keeping one shared brand experience.",
  },
  {
    q: "Do you also handle hosting and domain after launch?",
    a: "We can set up hosting, SSL, and domain connection for you, or hand over deployment instructions if your internal IT team prefers to manage it themselves.",
  },
  {
    q: "Is the website ready for Google Search from day one?",
    a: "Every clinic page ships with proper title tags, meta descriptions, schema markup for medical business, and fast load times, which together form the technical base Google needs to rank you.",
  },
] as const;

// Image data for optimization
const heroImage = {
  src: "https://images.unsplash.com/photo-1584516150909-c43483ee7932?q=80&w=1124&auto=format&fit=crop",
  alt: "Modern clinic reception desk with staff helping patients",
  width: 1124,
  height: 420,
};

const featureImages = [
  {
    src: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=700&auto=format&fit=crop",
    alt: "Doctor consulting a patient in clinic examination room",
  },
  {
    src: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=700&auto=format&fit=crop",
    alt: "Modern clinic waiting area with comfortable seating",
  },
  {
    src: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=700&auto=format&fit=crop",
    alt: "Medical professional using digital tablet in clinic",
  },
];

export default function ClinicWebsitesPage() {
  return (
    <main className="overflow-hidden bg-white">
      <HeroSection />
      <WhyItMattersSection />
      <FeaturesSection />
      <ImageBandSection />
      <ProcessSection />
      <ClinicTypesSection />
      <ResultsSection />
      <DetailedGuideSection />
      <ChecklistSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}

// Hero Section Component
function HeroSection() {
  return (
    <section className="relative border-b border-slate-200 bg-gradient-to-b from-brand-50 via-white to-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-12 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-16">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-600">
       <TypeAnimationWrapper
  sequences={[
    "Healthcare · Clinic Websites",
    2000,
    "Healthcare · Hospital Websites",
    2000,
    "Healthcare · Doctor Websites",
    2000,
    "Healthcare · Medical Websites",
    2000,
  ]}
  speed={60}
  repeat={Infinity}
/>
          </span>

          <h1 className="mt-6 font-display text-4xl font-bold leading-tight lg:text-6xl">
            Appointment-ready websites built for
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
          <TypeAnimationWrapper
  sequences={[
    "Clinics",
    2000,
    "Hospitals",
    2000,
    "Doctors",
    2000,
    "Healthcare Brands",
    2000,
  ]}
  speed={40}
  repeat={Infinity}
/>
              <span className="sr-only">Clinics, Hospitals &amp; Doctors</span>
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
            We design and build clinic websites that turn visitors into
            booked appointments — with online scheduling, WhatsApp
            enquiry, doctor profiles, and pages your front desk will
            actually thank you for.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="#contact"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/40"
            >
              <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative z-10">Get a Free Quote</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="#process"
              className="group relative overflow-hidden rounded-full border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 px-8 py-3 text-sm font-semibold text-blue-700 shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/30"
            >
              <span className="relative z-10 flex items-center gap-2">
                See how we work
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-8 text-sm text-slate-500">
            <div>
              <p className="font-display text-2xl font-bold text-slate-900">180+</p>
              <p>Clinics &amp; hospitals delivered</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-slate-900">4.8★</p>
              <p>Average client rating</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-slate-900">10 days</p>
              <p>Typical turnaround</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200">
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              width={heroImage.width}
              height={heroImage.height}
              className="h-[420px] w-full object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={85}
            />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden w-56 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl lg:block">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Live booking</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">Dr. Mehta · Cardiology</p>
            <p className="text-xs text-slate-500">Today, 4:30 PM slot available</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Why It Matters Section
function WhyItMattersSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <Image
            src="https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?q=80&w=1100&auto=format&fit=crop"
            alt="Doctor reviewing patient records on a digital tablet in clinic"
            width={1100}
            height={733}
            className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lg"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={80}
          />
        </div>
        <div>
          <h2 className="font-display text-3xl font-semibold text-slate-900">
            Most clinic websites lose patients before the first call
          </h2>
          <p className="mt-5 leading-relaxed text-slate-600">
            A patient searching for a clinic nearby is usually anxious, in
            a hurry, and comparing three or four options on their phone in
            under two minutes. If your website takes too long to load,
            hides your doctors behind a PDF brochure, or has no clear way
            to book, that patient simply moves to the next search result.
            We have seen this pattern repeat across more than 180
            healthcare projects, and it is almost always fixable with the
            right structure.
          </p>
          <p className="mt-4 leading-relaxed text-slate-600">
            A clinic website is not a brochure. It is the first point of
            contact in a patient&apos;s care journey, and it needs to
            answer three questions within seconds: can this clinic treat
            my problem, is the doctor available, and how do I book. Every
            page we design for clinics is structured around answering
            those three questions before anything else.
          </p>
        </div>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-slate-900">
            What goes into every clinic website
          </h2>
          <p className="mt-4 leading-relaxed text-slate-600">
            These are not add-ons we upsell later — they are the standard
            build for every clinic and hospital website we ship, because
            each one directly affects how many enquiries you receive.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-brand-200 hover:shadow-md"
            >
              <h3 className="font-display text-lg font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Image Band Section
function ImageBandSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <div className="grid gap-6 sm:grid-cols-3">
        {featureImages.map((img, index) => (
          <Image
            key={index}
            src={img.src}
            alt={img.alt}
            width={700}
            height={933}
            className="aspect-[3/4] w-full rounded-2xl object-cover"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
            quality={80}
          />
        ))}
      </div>
    </section>
  );
}

// Process Section
function ProcessSection() {
  return (
    <section id="process" className="bg-[#0B1224] py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-white">
            How we build your clinic website
          </h2>
          <p className="mt-4 leading-relaxed text-slate-400">
            A five-stage process refined across hospital chains, single
            clinics, and diagnostic centres, so nothing about your
            departments or doctor list gets missed.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          {buildProcess.map((p, i) => (
            <div key={p.step} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <span className="font-display text-3xl font-bold text-brand-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-white">{p.step}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Clinic Types Section
function ClinicTypesSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <h2 className="font-display text-3xl font-semibold text-slate-900">
        Built for every kind of clinical setup
      </h2>
      <p className="mt-4 max-w-2xl leading-relaxed text-slate-600">
        Whether you run a single-doctor clinic or a multi-specialty
        hospital with twelve departments, the underlying structure changes
        but the goal stays the same: make booking effortless.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-4">
        {clinicTypes.map((item) => (
          <div key={item.name} className="rounded-2xl border border-slate-200 p-6">
            <h3 className="font-display text-base font-semibold text-slate-900">{item.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// Results Section
function ResultsSection() {
  return (
    <section className="bg-brand-50 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold text-slate-900">
              What changes after launch
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              Clinics that move from a static, brochure-style site to a
              booking-enabled one typically see a meaningful shift in how
              patients reach them — fewer scattered phone calls, more
              structured online bookings, and a front desk that can focus
              on patients already walking through the door.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="font-display text-3xl font-bold text-brand-500">{s.value}</p>
                <p className="mt-2 text-sm text-slate-600">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Detailed Guide Section
function DetailedGuideSection() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20 lg:px-10">
      <h2 className="font-display text-3xl font-semibold text-slate-900">
        A closer look at what makes clinic websites different
      </h2>
      <div className="mt-8 space-y-6 leading-relaxed text-slate-600">
        <p>
          Designing a website for a clinic is a different discipline from
          designing one for a retail brand or a software company, even
          though the underlying tools — pages, navigation, forms — look
          similar on the surface. The biggest difference is intent. A
          person browsing a furniture store is often exploring out of
          curiosity. A person browsing a clinic website almost always has
          a specific problem they want solved soon, and that changes
          everything about how the page should be structured, written,
          and laid out.
        </p>
        <p>
          We start every clinic project by listing the real questions
          patients ask your reception desk over the phone. Which doctor
          treats knee pain. Do you accept this insurance. Is the clinic
          open on Sunday. How much does a consultation cost. These
          questions, gathered directly from your staff, become the
          backbone of the website&apos;s content.
        </p>
      </div>
    </section>
  );
}

// Checklist Section
function ChecklistSection() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <h2 className="font-display text-3xl font-semibold text-slate-900">
          A quick checklist before you choose a clinic website partner
        </h2>
        <p className="mt-4 leading-relaxed text-slate-600">
          Many clinic owners have already been through one disappointing
          website project before they speak to us. Use this checklist when
          comparing options, including us.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {checklist.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-5"
            >
              <span className="mt-0.5 grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                ✓
              </span>
              <p className="text-sm leading-relaxed text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// FAQ Section
function FAQSection() {
  return (
    <section className="mx-auto max-w-4xl border-t border-slate-200 px-6 py-20 lg:px-10">
      <h2 className="font-display text-3xl font-semibold text-slate-900">
        Frequently asked questions
      </h2>
      <div className="mt-10 divide-y divide-slate-200">
        {faqs.map((f) => (
          <details key={f.q} className="group py-6">
            <summary className="flex cursor-pointer items-center justify-between font-display text-base font-semibold text-slate-900">
              {f.q}
              <span className="ml-4 flex-shrink-0 text-brand-500 transition-transform duration-200 group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section id="contact" className="bg-[#0B1224] py-20 text-center">
      <div className="mx-auto max-w-2xl px-6">
        <h2 className="font-display text-3xl font-semibold text-white">
          Let&apos;s build a clinic website your front desk will love
        </h2>
        <p className="mt-4 leading-relaxed text-slate-400">
          Tell us about your departments and doctors, and we&apos;ll show
          you a sample page within 48 hours, free of cost.
        </p>
        <Link
          href="mailto:codelura@gmail.com"
          className="mt-8 inline-flex rounded-full bg-brand-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600"
        >
          Get a Free Quote
        </Link>
      </div>
    </section>
  );
}
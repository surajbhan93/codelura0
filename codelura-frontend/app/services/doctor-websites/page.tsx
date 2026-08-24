import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CTABand from "@/components/services/Ctaband";

// SEO Metadata - Enhanced
export const metadata: Metadata = {
  title: "Doctor Website Design | Personal Profile & Treatment Pages — Pixelnext",
  description: "Pixelnext builds personal doctor websites with treatment pages, patient booking, and Google-ready profiles that help independent doctors build a trusted online presence.",
  keywords: "doctor website design, personal doctor website, medical website, healthcare website, doctor profile, treatment pages, patient booking",
  openGraph: {
    title: "Doctor Website Design | Personal Profile & Treatment Pages",
    description: "Build a personal doctor website with treatment pages, patient booking, and Google-ready profiles.",
    type: "website",
    url: "https://codelura.com/services/doctor-websites",
    siteName: "Pixelnext",
    images: [
      {
        url: "/og/doctor-websites.jpg",
        width: 1200,
        height: 630,
        alt: "Doctor Website Design Services",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://codelura.com/services/doctor-websites",
  },
};

// Static data - moved outside for better performance
const features = [
  {
    title: "Doctor profile & credentials",
    desc: "A dedicated bio page covering qualifications, years of practice, hospital affiliations, and areas of specialisation, written in plain language patients understand.",
  },
  {
    title: "Treatment-specific pages",
    desc: "Individual pages for each procedure or condition you treat, so patients searching for a specific treatment find you directly rather than a generic clinic listing.",
  },
  {
    title: "Appointment request form",
    desc: "A simple, low-friction booking form that asks only what is needed, with confirmation sent automatically over WhatsApp or email.",
  },
  {
    title: "Before/after & case galleries",
    desc: "For specialisations like dermatology, dental, or cosmetic practice, a tasteful gallery section with consent-based case examples builds real confidence.",
  },
  {
    title: "Publications & media mentions",
    desc: "Research papers, press features, and conference talks are organised into a credibility section that sets you apart from nearby practitioners.",
  },
  {
    title: "Personal SEO setup",
    desc: "Your name, specialisation, and city are woven into page titles and structured data, so a search for 'Dr. [Name] [City]' leads straight to you.",
  },
];

const process = [
  {
    step: "Understanding your practice",
    detail: "We talk through your specialisation, the procedures you most want more patients for, and any current online presence you already have.",
  },
  {
    step: "Content drafting",
    detail: "We write your bio, treatment descriptions, and FAQ copy in clear language, then send it for your medical accuracy review before anything is designed.",
  },
  {
    step: "Personal-brand design",
    detail: "The visual direction reflects your specialisation and personality, not a generic hospital template, while staying clinically credible.",
  },
  {
    step: "Build & integrate",
    detail: "We build the site, connect booking and WhatsApp, and add your existing reviews, certificates, and case studies.",
  },
  {
    step: "Launch & grow",
    detail: "After going live we track which treatment pages bring enquiries and suggest new pages worth adding as your practice grows.",
  },
];

const faqs = [
  {
    q: "I already work at a hospital — do I still need my own website?",
    a: "Yes. A hospital website lists you among dozens of doctors, but your own site lets patients find and choose you specifically, especially for referrals and repeat patients searching your name directly.",
  },
  {
    q: "Can the website include patient reviews from Google or Practo?",
    a: "Yes, we can pull and display your existing verified reviews from Google and platforms like Practo or JustDial, so new visitors see real patient feedback without leaving your site.",
  },
  {
    q: "Will this help me get found in Google search results?",
    a: "We structure your name, specialisation, and location correctly across every page, which is the foundation search engines need. Ongoing content like treatment guides helps build on that over time.",
  },
  {
    q: "What if I practice from multiple clinics or hospitals?",
    a: "We add a locations section listing each clinic with its own timing and address, so patients can choose whichever is most convenient for them.",
  },
  {
    q: "Can I update my own availability or add a new achievement later?",
    a: "Yes, we hand over simple edit access for text-based updates like availability, achievements, or new case studies, without needing to contact us for every small change.",
  },
];

const practiceTypes = [
  {
    name: "Consulting physicians",
    detail: "A clear bio, condition pages for common complaints, and a simple booking form focused on first-visit conversions.",
  },
  {
    name: "Surgeons & specialists",
    detail: "Procedure-specific pages explaining the surgery, recovery timeline, and risk factors in patient-friendly language.",
  },
  {
    name: "Dentists & cosmetic practice",
    detail: "Visual-heavy layout with before/after galleries, pricing guidance, and treatment package comparisons.",
  },
  {
    name: "Mental health practitioners",
    detail: "A calm, reassuring design with clear confidentiality messaging and an easy, low-pressure first-session booking flow.",
  },
];

const stats = [
  { value: "3.1x", label: "Average increase in direct, name-based search visits." },
  { value: "60%", label: "Of bookings now arrive via WhatsApp instead of phone calls." },
  { value: "7 days", label: "Typical build time for a single-doctor website." },
  { value: "96%", label: "Of clients renew their website care plan each year." },
];

const checklist = [
  "Will the bio and treatment content be written specifically for your specialisation, or copied from a generic medical template?",
  "Is there a real plan to bring in your existing Google or Practo reviews, rather than starting from a blank reputation?",
  "Does the proposed site include condition-specific or treatment-specific pages, not just one long 'services' section?",
  "Will the site be structured to rank for searches of your name plus your city and specialisation?",
  "Is there a simple way for you to update your availability or add a new achievement without contacting the agency every time?",
  "Does the design feel personal to your practice, or could the same layout be relabeled for any other doctor?",
  "Is WhatsApp booking included, given how many patients in India prefer messaging over calling?",
  "Is there a clear, written cost and timeline, rather than an open-ended 'depends' response?",
];

// Image data for optimization
const heroImage = {
  src: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1200&auto=format&fit=crop",
  alt: "Confident doctor in white coat smiling in modern medical office",
  width: 1200,
  height: 420,
};

const featureImages = [
  {
    src: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=700&auto=format&fit=crop",
    alt: "Doctor writing medical notes during patient consultation",
  },
  {
    src: "https://images.unsplash.com/photo-1576765608866-5b51046452be?q=80&w=700&auto=format&fit=crop",
    alt: "Professional doctor portrait in clinic hallway",
  },
  {
    src: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=700&auto=format&fit=crop",
    alt: "Stethoscope and medical chart on modern desk",
  },
];

export default function DoctorWebsitesPage() {
  return (
    <main className="overflow-hidden bg-white">
      <HeroSection />
      <WhySection />
      <FeaturesSection />
      <ImageBandSection />
      <ProcessSection />
      <PracticeTypesSection />
      <ResultsSection />
      <DetailedGuideSection />
      <ChecklistSection />
      <FAQSection />
      <CTABand
        heading="Let's build a website patients find when they search your name"
        subtext="Share your specialisation and we'll show you a sample profile page within 48 hours, free of cost."
      />
    </main>
  );
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative border-b border-slate-200 bg-gradient-to-b from-brand-50 via-white to-white">
      <div className="mx-auto grid max-w-7xl gap-8 sm:gap-12 px-4 sm:px-6 py-8 sm:py-12 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-16">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 sm:px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-600">
            Healthcare · Doctor Websites
          </span>
          
          <h1 className="mt-6 font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-slate-900">
            A personal website that makes patients choose you by name
          </h1>
          
          <p className="mt-4 sm:mt-6 max-w-lg text-base sm:text-lg leading-relaxed text-slate-600">
            We build doctor profile and treatment websites that present
            your expertise clearly, make booking effortless, and help
            patients find you directly instead of a generic hospital
            directory listing.
          </p>
          
          <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4">
            <Link
              href="#contact"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 px-6 sm:px-8 py-3 sm:py-3.5 text-sm font-semibold text-white shadow-xl shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/40"
            >
              <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative z-10">Get a Free Quote</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            
            <Link
              href="#process"
              className="group relative overflow-hidden rounded-full border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 px-6 sm:px-8 py-3 text-sm font-semibold text-blue-700 shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/30"
            >
              <span className="relative z-10 flex items-center gap-2">
                See how we work
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </Link>
          </div>
          
          <div className="mt-8 sm:mt-10 flex flex-wrap gap-6 sm:gap-8 text-sm text-slate-500">
            <div>
              <p className="font-display text-xl sm:text-2xl font-bold text-slate-900">220+</p>
              <p className="text-xs sm:text-sm">Doctor websites delivered</p>
            </div>
            <div>
              <p className="font-display text-xl sm:text-2xl font-bold text-slate-900">30+</p>
              <p className="text-xs sm:text-sm">Specialisations covered</p>
            </div>
            <div>
              <p className="font-display text-xl sm:text-2xl font-bold text-slate-900">7 days</p>
              <p className="text-xs sm:text-sm">Typical turnaround</p>
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
              className="h-[300px] sm:h-[380px] lg:h-[420px] w-full object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={85}
            />
          </div>
          <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 hidden sm:block w-48 sm:w-56 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Verified Reviews</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">4.9 / 5 · 312 patients</p>
            <p className="text-xs text-slate-500">Pulled live from Google</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Why Section
function WhySection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20 lg:px-10">
      <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">
            Why independent doctors need more than a hospital listing
          </h2>
          <p className="mt-4 sm:mt-5 leading-relaxed text-slate-600">
            When a patient is referred to you by another doctor or a
            relative, the very first thing they do is search your name.
            What they find in those first few seconds shapes how
            confident they feel about booking. A thin hospital directory
            entry with a tiny photo and one line of text does not build
            that confidence. A dedicated website, written around your
            specific expertise, does.
          </p>
          <p className="mt-4 leading-relaxed text-slate-600">
            We have built websites for general physicians, dentists,
            dermatologists, orthopedists, psychiatrists, gynaecologists,
            and dozens of other specialisations, and the pattern is
            consistent: patients respond to clarity and specificity, not
            generic claims.
          </p>
        </div>
        <div>
          <Image
            src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?q=80&w=1100&auto=format&fit=crop"
            alt="Doctor consulting with a patient at a desk in modern clinic"
            width={1100}
            height={733}
            className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lg"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={80}
          />
        </div>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  return (
    <section className="bg-slate-50 py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">
            What goes into every doctor website
          </h2>
          <p className="mt-4 leading-relaxed text-slate-600">
            Each section below is designed to answer a specific question
            a prospective patient is silently asking while reading about
            you for the first time.
          </p>
        </div>

        <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 transition hover:border-brand-200 hover:shadow-md"
            >
              <h3 className="font-display text-base sm:text-lg font-semibold text-slate-900">
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
  );
}

// Image Band Section
function ImageBandSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20 lg:px-10">
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
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
    <section id="process" className="bg-[#0B1224] py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white">
            How we build your personal website
          </h2>
          <p className="mt-4 leading-relaxed text-slate-400">
            A focused five-step process built around your existing
            reputation and the procedures patients search for most.
          </p>
        </div>

        <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {process.map((p, i) => (
            <div
              key={p.step}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6"
            >
              <span className="font-display text-2xl sm:text-3xl font-bold text-brand-500">
                0{i + 1}
              </span>
              <h3 className="mt-3 sm:mt-4 font-display text-sm sm:text-base font-semibold text-white">
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
  );
}

// Practice Types Section
function PracticeTypesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20 lg:px-10">
      <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">
        Built for every kind of independent practice
      </h2>
      <p className="mt-4 max-w-2xl leading-relaxed text-slate-600">
        The right structure differs by specialisation, and we adapt the
        site accordingly rather than forcing every doctor into the same
        template.
      </p>

      <div className="mt-8 sm:mt-10 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {practiceTypes.map((item) => (
          <div
            key={item.name}
            className="rounded-2xl border border-slate-200 p-5 sm:p-6"
          >
            <h3 className="font-display text-sm sm:text-base font-semibold text-slate-900">
              {item.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// Results Section
function ResultsSection() {
  return (
    <section className="bg-brand-50 py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">
              What changes after launch
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              Doctors who move from no website, or a thin one-page
              profile, to a structured personal site typically notice
              more patients arriving already informed about their
              specialisation, which shortens the first consultation and
              improves the overall experience for both sides.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm">
                <p className="font-display text-2xl sm:text-3xl font-bold text-brand-500">
                  {s.value}
                </p>
                <p className="mt-2 text-xs sm:text-sm text-slate-600">{s.label}</p>
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
    <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-20 lg:px-10">
      <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">
        A closer look at building your personal medical brand online
      </h2>
      <div className="mt-6 sm:mt-8 space-y-6 leading-relaxed text-slate-600">
        <p>
          For most of medical history, reputation traveled by word of
          mouth alone. A patient trusted a doctor because a neighbour or
          relative recommended them. That word-of-mouth trust still
          matters enormously, but today it almost always gets verified
          online before the first call is made.
        </p>
        <p>
          We write doctor bios differently from how most clinics write
          them. Instead of a list of degrees and a stock phrase about
          compassionate care, we focus on specifics: the types of
          cases you see most often, your approach to a first
          consultation, and anything that genuinely differentiates how
          you practice.
        </p>
        <p>
          Treatment pages are where most doctor websites fall short. A
          single paragraph buried in a long Services list rarely ranks
          well or convinces a patient. We write a dedicated page for
          each major procedure or condition you treat.
        </p>
      </div>
    </section>
  );
}

// Checklist Section
function ChecklistSection() {
  return (
    <section className="bg-slate-50 py-12 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-10">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">
          A quick checklist before building your personal website
        </h2>
        <p className="mt-4 leading-relaxed text-slate-600">
          Use this list to evaluate any agency or freelancer you are
          considering, including us, before committing to a project.
        </p>
        <div className="mt-8 sm:mt-10 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          {checklist.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:p-5"
            >
              <span className="mt-0.5 grid h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                ✓
              </span>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
                {item}
              </p>
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
    <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-20 lg:px-10 border-t border-slate-200">
      <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">
        Frequently asked questions
      </h2>
      <div className="mt-8 sm:mt-10 divide-y divide-slate-200">
        {faqs.map((f) => (
          <details key={f.q} className="group py-5 sm:py-6">
            <summary className="flex cursor-pointer items-center justify-between font-display text-sm sm:text-base font-semibold text-slate-900">
              {f.q}
              <span className="ml-4 text-brand-500 transition group-open:rotate-45 text-xl sm:text-2xl">
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
  );
}
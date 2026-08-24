type CTABandProps = {
  heading: string;
  subtext: string;
};

export default function CTABand({ heading, subtext }: CTABandProps) {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#0B1224] py-20"
    >
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#2952E3]/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#2952E3]/20 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="font-display text-3xl font-semibold text-white lg:text-4xl">
          {heading}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-300">
          {subtext}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="/Enquiries?service=Website%20Development&medium=cta"
            className="rounded-full bg-[#2952E3] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2952E3]/30 transition hover:bg-[#1F3FBF]"
          >
            Get a Free Quote
          </a>
         <a
            href="https://wa.me/919336289192?text=Hi%20Codelura,%20I%20would%20like%20a%20free%20consultation."
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-emerald-500 px-7 py-3 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/10"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
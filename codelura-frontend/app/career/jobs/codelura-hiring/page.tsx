// page.tsx
import Link from 'next/link';
import ClientCard from './ClientCard';

const PIPELINE = [
  { label: 'Sourcing',    detail: 'Opens Q3 2026',        status: 'next' as const },
  { label: 'Screening',   detail: 'Resume + ATS check',   status: 'pending' as const },
  { label: 'Interviews',  detail: 'Technical + culture',  status: 'pending' as const },
  { label: 'Offers',      detail: 'Welcome aboard',        status: 'pending' as const },
];

export default function CodeluraHiring() {
  return (
    <main className="min-h-screen bg-[#0d1016] text-[#eef1f6] flex items-center justify-center p-6 sm:p-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500&display=swap');
        :root {
          --font-display: 'Space Grotesk', sans-serif;
          --font-mono: 'IBM Plex Mono', monospace;
          --font-body: 'Inter', sans-serif;
        }
        .codelura-root { font-family: var(--font-body); }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fade-up 0.6s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .fade-up { animation: none !important; }
          .animate-ping { animation: none !important; }
        }
      `}</style>

      <div className="codelura-root max-w-7xl w-full">
<br /> <br />
        {/* Top bar */}
        <div className="flex items-center justify-between mb-14 fade-up">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg bg-[#f5a742] flex items-center justify-center text-[#0d1016] font-bold text-sm"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              C
            </div>
            <span className="text-[15px] tracking-tight" style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>
              codelura
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#9099a8]" style={{ fontFamily: 'var(--font-mono)' }}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f5a742] opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#f5a742]" />
            </span>
            build: queued
          </div>
        </div>

        {/* Pipeline rail — the signature element. Order here is real: it's the actual hiring funnel. */}
        <div className="mb-12 fade-up" style={{ animationDelay: '0.05s' }}>
          <p className="text-xs mb-5 text-[#565f6e] tracking-wide" style={{ fontFamily: 'var(--font-mono)' }}>
            &gt; hiring_pipeline.status
          </p>
          <div className="flex items-start">
            {PIPELINE.map((stage, i) => (
              <div key={stage.label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-start gap-2 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                      {stage.status === 'next' && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f5a742] opacity-50" />
                      )}
                      <span
                        className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                          stage.status === 'next' ? 'bg-[#f5a742]' : 'bg-[#333a47]'
                        }`}
                      />
                    </span>
                    <span
                      className={`text-[11px] tracking-wide whitespace-nowrap ${
                        stage.status === 'next' ? 'text-[#eef1f6]' : 'text-[#565f6e]'
                      }`}
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      0{i + 1} {stage.label.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#565f6e] pl-[18px] hidden sm:block whitespace-nowrap">
                    {stage.detail}
                  </span>
                </div>
                {i < PIPELINE.length - 1 && <div className="h-px flex-1 mx-3 mt-[5px] bg-[#242a35]" />}
              </div>
            ))}
          </div>
        </div>

        {/* Headline */}
        <div className="mb-10 fade-up" style={{ animationDelay: '0.1s' }}>
          <h1
            className="text-4xl sm:text-5xl leading-[1.05] tracking-tight mb-5"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
          >
            Join the <span className="text-[#f5a742]">codelura</span> team
          </h1>
          <p className="text-[#9099a8] text-base sm:text-lg leading-relaxed max-w-xl">
            We&apos;re not actively hiring yet — sourcing opens Q3 2026. Freelancers and
            future teammates can still get on our radar starting now.
          </p>
        </div>

        {/* Action log — replaces the card grid with a terminal-style list */}
        <div className="border-t border-[#242a35] fade-up" style={{ animationDelay: '0.15s' }}>
          <LogRow
            command="apply --freelance"
            description="Apply for freelance / contract work with Codelura."
            href="https://forms.gle/zYx3wYQj5WRiaNTN6"
            linkText="Apply now"
          />
          <div className="border-t border-[#242a35]">
            <ClientCard
              title="check --resume-ats"
              description="Check how your resume performs against ATS filters."
              linkText="Check score"
              variant="secondary"
              type="ats"
              slug="ats-resume-checker" // Added slug
            />
          </div>
          <div className="border-t border-b border-[#242a35]">
            <ClientCard
              title="build --resume"
              description="Build an ATS-friendly resume tailored for Codelura."
              linkText="Build resume"
              variant="secondary"
              type="resume"
              slug="resume-builder" // Added slug
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className="mt-10 flex flex-wrap items-center justify-between gap-3 text-xs text-[#565f6e] fade-up"
          style={{ animationDelay: '0.2s', fontFamily: 'var(--font-mono)' }}
        >
          <span>© 2026 codelura — we hire humans, not bots.</span>
          <div className="flex items-center gap-4">
            <Link href="mailto:hello@codelura.com" className="hover:text-[#45d8c0] transition-colors">
              hello@codelura.com
            </Link>
            <span>#buildwithcodelura</span>
          </div>
        </div>
      </div>
    </main>
  );
}

/* Terminal-style log row — no box, no shadow, just a hairline-divided line */
function LogRow({
  command, description, href, linkText,
}: { command: string; description: string; href: string; linkText: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-6 py-5 hover:bg-[#151922] transition-colors -mx-2 px-2 rounded-md"
    >
      <div className="min-w-0">
        <p className="text-sm text-[#eef1f6] mb-1" style={{ fontFamily: 'var(--font-mono)' }}>
          <span className="text-[#565f6e]">$</span> {command}
        </p>
        <p className="text-[13px] text-[#9099a8] truncate">{description}</p>
      </div>
      <span className="shrink-0 inline-flex items-center gap-1.5 text-sm text-[#45d8c0] group-hover:gap-2.5 transition-all">
        {linkText}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </span>
    </Link>
  );
}
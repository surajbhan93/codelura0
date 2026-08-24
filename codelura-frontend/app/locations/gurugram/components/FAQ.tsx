import { GURUGRAM_FAQS } from '../constants';

export default function FAQ() {
  return (
    <section className="py-20 bg-slate-950 border-b border-slate-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Frequently Asked Questions</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Gurugram Software &amp; IT Engineering FAQ
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Clear answers to common questions about working with Codelura Technologies in Gurugram (Gurgaon).
          </p>
        </div>

        <div className="space-y-4">
          {GURUGRAM_FAQS.map((faq, i) => (
            <div key={i} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="text-cyan-400">Q.</span>
                <span>{faq.question}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-6">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

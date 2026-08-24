// components/cover-letter/CoverLetterGeneratorClient.tsx
'use client';

import { useState, useCallback, useMemo, useRef, memo } from 'react';
import { tokens, STOP } from '@/lib/score';
import Link from 'next/link';
import { 
  User, Briefcase, Building2, Target, Award, 
  Copy, Download, FileText, Linkedin, Globe,
  Sparkles, CheckCircle, AlertCircle
} from 'lucide-react';

interface ExperiencePoint {
  id: string;
  value: string;
}

// ─── Memoized Components ───
const ExperienceInput = memo(({ 
  exp, 
  onUpdate, 
  onRemove, 
  canRemove 
}: { 
  exp: ExperiencePoint; 
  onUpdate: (id: string, value: string) => void; 
  onRemove: (id: string) => void; 
  canRemove: boolean;
}) => (
  <div className="flex gap-2 group">
    <div className="relative flex-1">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400 text-xs font-bold">•</span>
      <input
        className="w-full bg-[#1b2233] border border-white/10 rounded-xl pl-7 pr-4 py-2.5 text-sm text-gray focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all placeholder-gray-500 hover:border-gray-600"
        value={exp.value}
        onChange={(e) => onUpdate(exp.id, e.target.value)}
        placeholder="e.g. Improved checkout conversion by 12%"
      />
    </div>
    {canRemove && (
      <button
        onClick={() => onRemove(exp.id)}
        className="px-3 text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Remove experience"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    )}
  </div>
));
ExperienceInput.displayName = 'ExperienceInput';

// ─── Input Field Component ───
const InputField = memo(({ 
  icon: Icon, 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = 'text' 
}: { 
  icon?: any; 
  label: string; 
  value: string; 
  onChange: (e: any) => void; 
  placeholder: string; 
  type?: string;
}) => (
  <div>
    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-2">
      {Icon && <Icon size={14} className="text-violet-300" />}
      {label}
    </label>
    <input
      type={type}
      className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all placeholder-gray-600 hover:border-gray-600"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
));
InputField.displayName = 'InputField';

// ─── Main Client Component ───
export default function CoverLetterGeneratorClient() {
  // ─── State ───
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [tone, setTone] = useState<'professional' | 'warm' | 'concise'>('professional');
  const [length, setLength] = useState<'short' | 'standard' | 'detailed'>('standard');
  const [experiencePoints, setExperiencePoints] = useState<ExperiencePoint[]>([
    { id: '1', value: '' },
  ]);
  const [output, setOutput] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [usedKeywords, setUsedKeywords] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  // ─── Memoized JD Filler ───
  const JD_FILLER = useMemo(
    () =>
      new Set(
        (
          'looking seeking candidate candidates applicant applicants position role roles ' +
          'responsibilities responsibility requirements requirement required require preferred preferences ' +
          'qualifications qualification including include includes ability abilities experience experienced ' +
          'years year opportunity opportunities company companies team teams join joining hiring apply ' +
          'applying application looking ideal successful strong excellent great good working work job ' +
          'description seeking duties tasks based remote hybrid onsite full time part benefits salary ' +
          'competitive please email resume cover letter'
        ).split(/\s+/)
      ),
    []
  );

  // ─── Extract Keywords ───
  const extractKeywords = useCallback(
    (jd: string, n: number): string[] => {
      if (!jd || jd.trim().length < 40) return [];

      const capSet = new Set<string>();
      const raw = jd.match(/[A-Za-z][A-Za-z+#.\-]{1,}/g) || [];

      raw.forEach((w, i) => {
        if (/^[A-Z]/.test(w)) {
          const prev = raw[i - 1] || '';
          const sentenceStart = i === 0 || /[.!?:;]$/.test(prev) || prev === '';
          if (/^[A-Z0-9+#.\-]+$/.test(w) || !sentenceStart) {
            capSet.add(w.toLowerCase().replace(/[.\-]+$/, ''));
          }
        }
      });

      const tk = tokens(jd).filter(
        (w) => w.length > 2 && !STOP.has(w) && !JD_FILLER.has(w)
      );

      const freq: Record<string, number> = {};
      tk.forEach((w) => (freq[w] = (freq[w] || 0) + 1));

      let cand = [...new Set(tk)].filter((w) => freq[w] >= 2 || w.length >= 4);
      const skillish = (w: string) => /[.+#]/.test(w);
      const scoreOf = (w: string) =>
        freq[w] + (capSet.has(w) ? 5 : 0) + (skillish(w) ? 3 : 0) + (w.length >= 7 ? 1 : 0);

      cand.sort((a, b) => scoreOf(b) - scoreOf(a));
      return cand.slice(0, n);
    },
    [JD_FILLER]
  );

  // ─── Update Keywords when JD changes ───
  const handleJobDescriptionChange = useCallback((value: string) => {
    setJobDescription(value);
    const kws = extractKeywords(value, 12);
    setKeywords(kws);
  }, [extractKeywords]);

  // ─── Join List Helper ───
  const joinList = useCallback((arr: string[]) => {
    if (!arr || arr.length === 0) return '';
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return arr[0] + ' and ' + arr[1];
    return arr.slice(0, -1).join(', ') + ', and ' + arr[arr.length - 1];
  }, []);

  // ─── Generate Cover Letter ───
  const generateLetter = useCallback(() => {
    setIsGenerating(true);

    setTimeout(() => {
      const nameVal = name.trim() || 'Your Name';
      const titleVal = title.trim();
      const companyVal = company.trim() || 'the company';
      const roleVal = role.trim() || 'this role';
      const linkedinVal = linkedin.trim();
      const portfolioVal = portfolio.trim();
      const expVals = experiencePoints.map((e) => e.value.trim()).filter(Boolean);

      const kws = extractKeywords(jobDescription, 12);
      setKeywords(kws);
      const woven = kws.slice(0, 4);
      setUsedKeywords(woven);

      const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const greeting =
        tone === 'warm' ? `Dear ${companyVal} Hiring Team,` : `Dear Hiring Manager,`;

      const intro = titleVal ? `As a ${titleVal}, ` : '';
      let hook;
      if (tone === 'concise') {
        hook = `I'm applying for the ${roleVal} position at ${companyVal}. ${intro}I believe my background is a strong match for what you're looking for.`;
      } else if (tone === 'warm') {
        hook = `I was genuinely excited to come across the ${roleVal} opening at ${companyVal}. ${intro}I've long admired the work your team does, and this role feels like a natural place to contribute.`;
      } else {
        hook = `I am writing to express my strong interest in the ${roleVal} position at ${companyVal}. ${intro}I am confident that my experience and skills align closely with the requirements of this role.`;
      }

      let kwSentence = '';
      if (woven.length) {
        kwSentence = ` In particular, I noticed this role values ${joinList(woven)} — areas I have worked with directly and enjoy.`;
      }

      let body1;
      if (expVals.length) {
        const lead = tone === 'warm' ? "A few things I'm proud of:" : 'In my experience, I have:';
        const maxPoints = length === 'short' ? 2 : length === 'detailed' ? 5 : 3;
        const bullets = expVals
          .slice(0, maxPoints)
          .map((e) => {
            const t = e.replace(/^[-•\s]+/, '');
            return '• ' + t.charAt(0).toUpperCase() + t.slice(1);
          })
          .join('\n');
        body1 = `${lead}\n${bullets}`;
      } else {
        body1 =
          'Throughout my career I have consistently delivered measurable results, taken ownership of important problems, and collaborated closely with the people around me to ship work that matters.';
      }

      let body2;
      if (tone === 'concise') {
        body2 = `I'd bring that same focus to ${companyVal}.${kwSentence}`;
      } else if (tone === 'warm') {
        body2 = `What draws me to ${companyVal} specifically is the chance to do meaningful work alongside a team that cares about it.${kwSentence} I'd love to bring my energy and experience to your ${roleVal} role.`;
      } else {
        body2 = `I am particularly drawn to ${companyVal} because of its reputation and the impact of this role.${kwSentence} I am eager to bring my track record to your team and contribute from day one.`;
      }

      let close;
      if (tone === 'warm') {
        close = `Thank you so much for considering my application. I'd welcome the chance to talk about how I can help ${companyVal} succeed.`;
      } else if (tone === 'concise') {
        close = `Thank you for your time. I'd welcome the opportunity to discuss the role further.`;
      } else {
        close = `Thank you for considering my application. I would welcome the opportunity to discuss how my background can contribute to ${companyVal}'s goals.`;
      }

      let signature = nameVal;
      if (linkedinVal || portfolioVal) {
        signature += '\n';
        if (linkedinVal) signature += `LinkedIn: ${linkedinVal}\n`;
        if (portfolioVal) signature += `Portfolio: ${portfolioVal}`;
      }

      const letter = `${today}\n\n${greeting}\n\n${hook}\n\n${body1}\n\n${body2}\n\n${close}\n\nSincerely,\n${signature}`;

      setOutput(letter);
      setIsGenerating(false);
    }, 400);
  }, [name, title, company, role, linkedin, portfolio, jobDescription, tone, length, experiencePoints, extractKeywords, joinList]);

  // ─── Experience Handlers ───
  const addExperiencePoint = useCallback(() => {
    if (experiencePoints.length < 6) {
      setExperiencePoints([
        ...experiencePoints,
        { id: String(Date.now()), value: '' },
      ]);
    }
  }, [experiencePoints]);

  const updateExperiencePoint = useCallback((id: string, value: string) => {
    setExperiencePoints(
      experiencePoints.map((e) => (e.id === id ? { ...e, value } : e))
    );
  }, [experiencePoints]);

  const removeExperiencePoint = useCallback((id: string) => {
    if (experiencePoints.length > 1) {
      setExperiencePoints(experiencePoints.filter((e) => e.id !== id));
    }
  }, [experiencePoints]);

  // ─── Copy to Clipboard ───
  const copyToClipboard = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (e) {
      if (outputRef.current) {
        outputRef.current.select();
        document.execCommand('copy');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    }
  }, [output]);

  // ─── Download Handlers ───
  const downloadFile = useCallback((content: string, extension: string, mimeType: string) => {
    const companySlug = (company.trim() || 'company').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${companySlug}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [company]);

  const downloadTxt = useCallback(() => {
    if (output) downloadFile(output, 'txt', 'text/plain');
  }, [output, downloadFile]);

  const downloadDoc = useCallback(() => {
    if (!output) return;
    const html =
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"></head><body style="font-family:Calibri,Arial,sans-serif;font-size:11pt;white-space:pre-wrap">' +
      output.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] || '')) +
      '</body></html>';
    downloadFile(html, 'doc', 'application/msword');
  }, [output, downloadFile]);

  // ─── Load Sample ───
  const loadSample = useCallback(() => {
    setName('Jordan Reyes');
    setTitle('Senior Data Analyst');
    setCompany('BrightCart');
    setRole('Senior Data Analyst');
    setLinkedin('linkedin.com/in/jordanreyes');
    setPortfolio('jordanreyes.dev');
    setExperiencePoints([
      { id: '1', value: 'Built self-serve Looker dashboards and trained 40 colleagues' },
      { id: '2', value: 'Ran A/B tests that improved checkout conversion by 12%' },
      { id: '3', value: 'Owned executive Tableau reporting used for budget planning' },
    ]);
    setJobDescription(
      'We are looking for a Senior Data Analyst to own dashboards and reporting in Tableau and Looker, design and analyze A/B tests, write efficient SQL, build data models in dbt against Snowflake, and communicate findings to stakeholders. Requirements: 5+ years analytics experience, expert SQL, strong Python, experimentation, and stakeholder communication.'
    );
    setTone('professional');
    setLength('standard');
    
    const kws = extractKeywords(
      'We are looking for a Senior Data Analyst to own dashboards and reporting in Tableau and Looker, design and analyze A/B tests, write efficient SQL, build data models in dbt against Snowflake, and communicate findings to stakeholders. Requirements: 5+ years analytics experience, expert SQL, strong Python, experimentation, and stakeholder communication.',
      12
    );
    setKeywords(kws);
    setUsedKeywords(kws.slice(0, 4));
  }, [extractKeywords]);

  // ─── Render ───
  return (
    <div className="grid lg:grid-cols-12 bg-gradient-to-br  via-[#0b1020] to-[#050816] gap-8 mt-8">
      {/* ─── Input Section ─── */}
      <div className="lg:col-span-4 space-y-4">
        {/* Quick Actions */}
        <div className="bg-[#111827]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:border-white/10 transition-all">
          <button
            onClick={loadSample}
            className="w-full bg-gradient-to-r from-violet-600/20 to-blue-600/20 border border-violet-600/30 text-violet-300 rounded-xl px-4 py-3 text-sm font-medium hover:bg-violet-600/30 transition-all flex items-center justify-center space-x-2 group"
          >
            <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
            <span>Load Sample Data</span>
          </button>
        </div>

        {/* Personal Info */}
        <div className="bg-[#111827]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-5 space-y-4 hover:border-white/10 transition-all">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <User size={16} className="text-violet-400" />
            Your Details
          </h3>
          
          <div className="space-y-3">
            <InputField
              icon={User}
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jordan Reyes"
            />
            
            <InputField
              icon={Briefcase}
              label="Current Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Senior Data Analyst"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InputField
              icon={Building2}
              label="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="BrightCart"
            />
            
            <InputField
              icon={Target}
              label="Target Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Senior Data Analyst"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InputField
              icon={Linkedin}
              label="LinkedIn URL"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="linkedin.com/in/username"
            />
            
            <InputField
              icon={Globe}
              label="Portfolio URL"
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              placeholder="yourportfolio.dev"
            />
          </div>
        </div>

        {/* Experience Points */}
        <div className="bg-[#111827]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-5 space-y-4 hover:border-white/10 transition-all">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <Award size={16} className="text-violet-400" />
              Key Achievements
            </h3>
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">{experiencePoints.length}/6</span>
          </div>
          
          <div className="space-y-2">
            {experiencePoints.map((exp) => (
              <ExperienceInput
                key={exp.id}
                exp={exp}
                onUpdate={updateExperiencePoint}
                onRemove={removeExperiencePoint}
                canRemove={experiencePoints.length > 1}
              />
            ))}
          </div>
          
          {experiencePoints.length < 6 && (
            <button
              onClick={addExperiencePoint}
              className="w-full border border-dashed border-white/10 text-gray-500 hover:text-violet-400 hover:border-violet-500 rounded-xl px-4 py-2.5 text-sm transition-all flex items-center justify-center gap-2"
            >
              <span className="text-lg">+</span>
              Add Achievement
            </button>
          )}
        </div>

        {/* Job Description */}
        <div className="bg-[#111827]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-5 space-y-4 hover:border-white/10 transition-all">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <FileText size={16} className="text-violet-400" />
            Job Description
          </h3>
          
          <textarea
            className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 min-h-[120px] resize-y focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all placeholder-gray-600 hover:border-gray-600"
            value={jobDescription}
            onChange={(e) => handleJobDescriptionChange(e.target.value)}
            placeholder="Paste the full job description here. We'll extract the most important keywords to tailor your letter..."
          />
          
          {keywords.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <Sparkles size={12} className="text-violet-400" />
                Detected Keywords:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {keywords.slice(0, 8).map((kw) => (
                  <span
                    key={kw}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                      usedKeywords.includes(kw)
                        ? 'border-green-500/50 bg-green-500/10 text-green-400'
                        : 'border-white/10 bg-gray-800/50 text-gray-400'
                    }`}
                  >
                    {kw}
                  </span>
                ))}
                {keywords.length > 8 && (
                  <span className="text-xs text-gray-600 px-2 py-1">
                    +{keywords.length - 8} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="bg-[#111827]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-5 space-y-4 hover:border-white/10 transition-all">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle size={16} className="text-violet-400" />
            Settings
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Tone</label>
              <select
                className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:border-violet-500 outline-none hover:border-gray-600 transition-all"
                value={tone}
                onChange={(e) => setTone(e.target.value as 'professional' | 'warm' | 'concise')}
              >
                <option value="professional">Professional</option>
                <option value="warm">Warm &amp; Friendly</option>
                <option value="concise">Concise &amp; Direct</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Length</label>
              <select
                className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:border-violet-500 outline-none hover:border-gray-600 transition-all"
                value={length}
                onChange={(e) => setLength(e.target.value as 'short' | 'standard' | 'detailed')}
              >
                <option value="short">Short</option>
                <option value="standard">Standard</option>
                <option value="detailed">Detailed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateLetter}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-violet-600/25 hover:shadow-xl hover:shadow-violet-600/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
              <span>Generate Cover Letter</span>
            </>
          )}
        </button>

        {/* Premium Card */}
        <div className="bg-gradient-to-br from-violet-950/40 to-blue-950/40 border border-violet-800/30 rounded-2xl p-5 space-y-3 hover:border-violet-700/50 transition-all">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-600/20">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-sm font-semibold text-violet-300">Codelura Premium</span>
          </div>
          
          <p className="text-sm text-gray-400">
            Want to optimize your entire job search? Get AI-powered resume reviews, ATS optimization, and expert mentorship.
          </p>
          
          <div className="space-y-2">
            <a
              href="https://hugoclaw.gumroad.com/l/ats-kit?from=coverletter"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium py-2.5 px-4 rounded-xl text-center transition-all"
            >
              Get ATS Resume Kit → $12
            </a>
            
            <Link
              href="/mentorship"
              className="block w-full bg-gray-800 hover:bg-gray-700 border border-white/10 text-gray-200 text-sm font-medium py-2.5 px-4 rounded-xl text-center transition-all"
            >
              Book Resume Review Session
            </Link>
            
            <Link
              href="/resume-review"
              className="block w-full bg-gray-800 hover:bg-gray-700 border border-white/10 text-gray-200 text-sm font-medium py-2.5 px-4 rounded-xl text-center transition-all"
            >
              Professional Resume Review
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Output Section ─── */}
      <div className="lg:col-span-8 space-y-4">
        <div className="bg-[#111827]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-5 space-y-4 sticky top-20 hover:border-white/10 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FileText size={20} className="text-violet-400" />
                Your Cover Letter
              </h3>
              <p className="text-sm text-gray-500 mt-1">Edit freely before downloading</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={copyToClipboard}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm transition-all ${
                  isCopied 
                    ? 'bg-green-600 border-green-500 text-white' 
                    : 'bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300'
                }`}
              >
                <Copy size={15} />
                <span>{isCopied ? 'Copied!' : 'Copy'}</span>
              </button>
              
              <button
                onClick={downloadTxt}
                className="flex items-center space-x-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 px-4 py-2 rounded-xl text-sm transition-all"
              >
                <Download size={15} />
                <span>TXT</span>
              </button>
              
              <button
                onClick={downloadDoc}
                className="flex items-center space-x-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 px-4 py-2 rounded-xl text-sm transition-all"
              >
                <Download size={15} />
                <span>DOC</span>
              </button>
            </div>
          </div>
          
          <div className="relative">
            <textarea
              ref={outputRef}
              className="w-full bg-[#111827] border border-white/10 rounded-xl px-5 py-4 text-sm text-gray-200 font-mono min-h-[500px] resize-y focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all leading-relaxed"
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              placeholder="Your generated cover letter will appear here. Fill in your details and click Generate..."
            />
            
            {/* Status Indicator */}
            {output && (
              <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-green-400 bg-green-400/10 px-3 py-1.5 rounded-full border border-green-400/20">
                <CheckCircle size={12} />
                <span>Generated</span>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="mt-6 space-y-6">
            {/* Premium Card */}
            <div className="rounded-2xl border border-violet-700/30 bg-gradient-to-r from-violet-900/30 to-blue-900/30 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center rounded-full bg-violet-600/20 px-3 py-1 text-xs font-medium text-violet-300">
                    ⭐ CodeLura Premium
                  </span>

                  <h3 className="mt-3 text-2xl font-bold text-white">
                    Get Interview-Ready Documents
                  </h3>

                  <p className="mt-2 text-gray-400">
                    Go beyond a basic cover letter. Generate ATS-optimized resumes,
                    personalized cover letters, LinkedIn summaries, interview answers,
                    and AI-powered resume reviews.
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <CheckCircle size={14} className="text-violet-400" />
                      ATS Resume Review
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <CheckCircle size={14} className="text-violet-400" />
                      AI Resume Builder
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <CheckCircle size={14} className="text-violet-400" />
                      Cover Letter Generator
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <CheckCircle size={14} className="text-violet-400" />
                      LinkedIn Optimizer
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <CheckCircle size={14} className="text-violet-400" />
                      Interview Preparation
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <CheckCircle size={14} className="text-violet-400" />
                      HR Resume Review
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Link
                      href="/resume-review"
                      className="rounded-xl bg-violet-600 px-5 py-3 text-white font-medium hover:bg-violet-500 transition-all"
                    >
                      Resume Review
                    </Link>

                    <Link
                      href="/mentorship"
                      className="rounded-xl border border-white/10 px-5 py-3 text-gray-200 hover:bg-gray-800 transition-all"
                    >
                      Book Mentorship
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="rounded-2xl border border-white/10 bg-[#111827]/80 p-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Lightbulb size={20} className="text-violet-400" />
                Tips for Writing a Winning Cover Letter
              </h3>

              <div className="mt-5 grid md:grid-cols-2 gap-5">
                <div className="bg-gray-800/30 rounded-xl p-4 border border-white/10/50">
                  <h4 className="font-semibold text-violet-400 flex items-center gap-2">
                    <Sparkles size={14} />
                    Personalize Every Letter
                  </h4>
                  <p className="mt-2 text-gray-400 text-sm leading-7">
                    Mention the company name, role, and explain why you're interested.
                    Avoid sending the same generic cover letter to every employer.
                  </p>
                </div>

                <div className="bg-gray-800/30 rounded-xl p-4 border border-white/10/50">
                  <h4 className="font-semibold text-violet-400 flex items-center gap-2">
                    <Sparkles size={14} />
                    Quantify Your Achievements
                  </h4>
                  <p className="mt-2 text-gray-400 text-sm leading-7">
                    Include measurable achievements like percentages, revenue,
                    performance improvements, or users impacted.
                  </p>
                </div>

                <div className="bg-gray-800/30 rounded-xl p-4 border border-white/10/50">
                  <h4 className="font-semibold text-violet-400 flex items-center gap-2">
                    <Sparkles size={14} />
                    Match ATS Keywords
                  </h4>
                  <p className="mt-2 text-gray-400 text-sm leading-7">
                    Use important keywords from the job description naturally throughout
                    your cover letter to improve ATS compatibility.
                  </p>
                </div>

                <div className="bg-gray-800/30 rounded-xl p-4 border border-white/10/50">
                  <h4 className="font-semibold text-violet-400 flex items-center gap-2">
                    <Sparkles size={14} />
                    Keep It Short
                  </h4>
                  <p className="mt-2 text-gray-400 text-sm leading-7">
                    A great cover letter usually fits on one page with 250–400 words and
                    focuses on your most relevant experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {output && (
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <CheckCircle size={14} className="text-green-400" />
                <span>Generated locally • Nothing uploaded</span>
              </div>
              
              <span className="text-xs text-gray-600">
                {output.split(/\s+/).length} words
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Lightbulb Icon ───
function Lightbulb(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 21h4" />
    </svg>
  );
}
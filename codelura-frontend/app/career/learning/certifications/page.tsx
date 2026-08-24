"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import toast, { Toaster } from 'react-hot-toast';

const SUBJECTS = [
  // Programming & Development
  "Web Development",
  "Full Stack Development (MERN)",
  "Frontend Development (React.js)",
  "Backend Development (Node.js)",
  "Python Programming",
  "Java Programming",
  "C Programming",
  "C++ Programming",
  "JavaScript Programming",
  "TypeScript",
  "PHP Development",

  // Computer Science
  "Data Structures & Algorithms",
  "SQL & Database Management",
  "Database Management System (DBMS)",
  "Operating Systems",
  "Computer Networks",
  "Cloud Computing (AWS/Azure)",
  "DevOps Fundamentals",
  "Git & GitHub",

  // AI & Data
  "Data Science & Analytics",
  "Machine Learning",
  "Artificial Intelligence",
  "Power BI",
  "Tableau",

  // Office & Accounting
  "Microsoft Excel",
  "Advanced Microsoft Excel",
  "Microsoft Word",
  "Microsoft PowerPoint",
  "Microsoft Office",
  "Tally Prime",
  "GST & Accounting",
  "Financial Accounting",

  // Design & Marketing
  "UI/UX Design",
  "Graphic Design",
  "Canva Design",
  "Adobe Photoshop",
  "Adobe Illustrator",
  "Digital Marketing",
  "SEO (Search Engine Optimization)",
  "Social Media Marketing",
  "Content Writing",

  // Business
  "Business Analytics",
  "Project Management",

  // Cyber Security
  "Cyber Security",
  "Ethical Hacking",

  // Other Skills
  "Communication Skills",
  "Spoken English",
  "Resume Building & Career Preparation",
];

const COURSE_PATHS: Record<string, string> = {
  "Web Development": "/courses/web-development",
  "Full Stack Development (MERN)": "/courses/mern-stack",
  "Data Structures & Algorithms": "/courses/dsa",
  "Python Programming": "/courses/python",
  "Java Programming": "/courses/java",
  "Data Science & Analytics": "/courses/data-science",
  "Machine Learning": "/courses/machine-learning",
  "UI/UX Design": "/courses/ui-ux-design",
  "Digital Marketing": "/courses/digital-marketing",
  "Cloud Computing (AWS/Azure)": "/courses/cloud-computing",
  "SQL & Database Management": "/courses/sql-database",
  "DevOps Fundamentals": "/courses/devops",
};

// Get demo codes from environment variables
const DEMO_CODES = process.env.NEXT_PUBLIC_DEMO_CODES?.split(',') || ["CDL-2026-0001", "CDL-2026-0002", "CDL-2026-0003"];
const ISSUER_NAME = process.env.NEXT_PUBLIC_CERTIFICATE_ISSUER || "Suraj Bhan";
const ISSUER_TITLE = process.env.NEXT_PUBLIC_CERTIFICATE_ISSUER_TITLE || "Founder & CEO, Codelura";
const COMPANY_NAME = process.env.NEXT_PUBLIC_COMPANY_NAME || "Codelura";

function generateCertId() {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  const year = new Date().getFullYear();
  return `CDLR-${year}-${rand}`;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

export default function CertificationPage() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [generated, setGenerated] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [securityCode, setSecurityCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSecurityPopup, setShowSecurityPopup] = useState(false);

  const certId = useMemo(() => generateCertId(), [generated]);

  const canGenerate = name.trim().length > 1;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("⚠️ Please enter your full name");
      return;
    }
    
    setIsGenerating(true);
    
    setTimeout(() => {
      setGenerated(true);
      setIsGenerating(false);
      setIsVerified(false);
      toast.success("🎉 Certificate generated! Enter security code to verify.", {
        duration: 3000,
      });
      
      setTimeout(() => {
        document.getElementById("certificate-preview")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }, 1500);
  };

  const handleVerifyCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!securityCode.trim()) {
      toast.error("⚠️ Please enter the security code");
      return;
    }
    
    if (DEMO_CODES.includes(securityCode.toUpperCase())) {
      setIsVerified(true);
      setShowSecurityPopup(false);
      setSecurityCode("");
      toast.success("✅ Certificate Verified! You can now download.", {
        duration: 3000,
        icon: '🔓',
      });
    } else {
      toast.error("❌ Invalid security code. Please try again.", {
        duration: 3000,
      });
      setSecurityCode("");
    }
  };

  const handleDownload = () => {
    if (!isVerified) {
      toast.error("🔒 Please verify your certificate first!");
      return;
    }
    toast.success("📄 Opening print dialog...", {
      duration: 2000,
    });
    window.print();
  };

  const handleEditDetails = () => {
    setGenerated(false);
    setIsVerified(false);
    setSecurityCode("");
    setShowSecurityPopup(false);
    toast.success("✏️ Edit your details and regenerate", {
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 px-6 py-16 text-[#0d0d0d]">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            padding: '16px',
            borderRadius: '12px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;900&family=Great+Vibes&family=DM+Sans:wght@400;500;600;700&family=Cormorant+Garamond:wght@400;600;700&display=swap');

        .cert-font-serif { font-family: 'Playfair Display', serif; }
        .cert-font-script { font-family: 'Great Vibes', cursive; }
        .cert-font-garamond { font-family: 'Cormorant Garamond', serif; }

        /* PRINT STYLES - Fixed */
        @media print {
          /* Hide everything except certificate */
          body * { 
            visibility: hidden !important; 
          }
          
          #certificate-preview, 
          #certificate-preview * { 
            visibility: visible !important; 
          }
          
          #certificate-preview {
            position: fixed !important;
            inset: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            background: white !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 9999 !important;
          }

          /* Ensure certificate inner content fills the page */
          #certificate-preview > div {
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
            padding: 20px !important;
          }

          /* Show all certificate elements */
          .no-print { 
            display: none !important; 
          }
          
          .print-only { 
            display: block !important; 
          }

          /* Hide verification badges in print */
          .verification-badge {
            display: none !important;
          }

          /* Certificate border for print */
          .cert-border {
            border: 2px solid #1a1a2e !important;
          }

          @page { 
            size: landscape; 
            margin: 0; 
          }
        }

        .print-only { display: none; }

        .generating-spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .unverified-badge {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }

        .verified-badge {
          animation: glow 1.5s ease-in-out;
        }
        @keyframes glow {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        .certificate-pattern {
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.03) 0%, transparent 50%);
        }

        .certificate-shadow {
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.15),
            inset 0 0 60px rgba(212, 168, 67, 0.05);
        }
      `}</style>

      {/* ── HEADER (hidden on print) ── */}
      <div className="no-print mx-auto mb-12 max-w-4xl text-center">
        <div className="mb-4 inline-flex items-center gap-3 rounded-full bg-indigo-100 px-4 py-2">
          <span className="text-lg">🏆</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
            {COMPANY_NAME} Certification Program
          </span>
        </div>
        
        <h1 className="mb-4 text-4xl font-black tracking-tight sm:text-5xl">
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Industry-Grade
          </span>{" "}
          Certifications
        </h1>
        
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600">
          Complete your course and earn a prestigious certificate from {COMPANY_NAME}.
          Fill in your details below to generate your personalized certificate.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
          <span className="flex items-center gap-2">
            <span className="text-indigo-600">✓</span> Industry Recognized
          </span>
          <span className="flex items-center gap-2">
            <span className="text-indigo-600">✓</span> Lifetime Validity
          </span>
          <span className="flex items-center gap-2">
            <span className="text-indigo-600">✓</span> Verified Credentials
          </span>
          <span className="flex items-center gap-2">
            <span className="text-indigo-600">✓</span> Secure Download
          </span>
        </div>
      </div>

      {/* ── FORM (hidden on print) ── */}
      {!generated && (
        <div className="no-print mx-auto mb-14 max-w-xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
            <div className="mb-6 text-center">
              <div className="mb-2 text-3xl">📝</div>
              <h2 className="text-2xl font-bold text-slate-800">
                Fill Your Details
              </h2>
              <p className="text-sm text-slate-500">
                Enter your information to generate your certificate
              </p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Full Name{" "}
                  <span className="font-normal text-slate-400">
                    (as you want on certificate)
                  </span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Rohit Kumar Sharma"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Course / Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Completion Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <button
                type="submit"
                disabled={!canGenerate || isGenerating}
                className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-sm font-bold text-white transition hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="generating-spinner inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Generating Certificate...
                  </span>
                ) : (
                  "Generate Certificate →"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── CERTIFICATE PREVIEW ── */}
      {generated && (
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 text-center no-print">
            <h3 className="text-2xl font-bold text-slate-800">🎉 Your Certificate is Ready!</h3>
            <p className="text-sm text-slate-500">
              {isVerified ? (
                <span className="text-green-600 font-semibold">✅ Verified Certificate - Ready to Download</span>
              ) : (
                <span className="text-amber-600 font-semibold unverified-badge">🔒 Unverified - Enter Security Code to Verify</span>
              )}
            </p>
          </div>

          <div
            id="certificate-preview"
            className="relative mx-auto aspect-[1.414/1] w-full overflow-hidden bg-white certificate-shadow"
            style={{ 
              border: isVerified ? "3px solid #10b981" : "3px solid #f59e0b",
              borderRadius: "12px",
            }}
          >
            {/* Background Pattern */}
            <div className="certificate-pattern absolute inset-0"></div>

            {/* Inner Border Frame - Gold */}
            <div className="absolute inset-[8px] border-2 border-[#d4a843] rounded-lg"></div>
            <div className="absolute inset-[14px] border border-[#d4a843]/30 rounded-lg"></div>

            {/* Decorative Corner Elements */}
            <div className="absolute left-6 top-6 w-12 h-12 border-l-2 border-t-2 border-[#d4a843] rounded-tl-lg"></div>
            <div className="absolute right-6 top-6 w-12 h-12 border-r-2 border-t-2 border-[#d4a843] rounded-tr-lg"></div>
            <div className="absolute left-6 bottom-6 w-12 h-12 border-l-2 border-b-2 border-[#d4a843] rounded-bl-lg"></div>
            <div className="absolute right-6 bottom-6 w-12 h-12 border-r-2 border-b-2 border-[#d4a843] rounded-br-lg"></div>

            {/* Decorative Inner Corner Elements */}
            <div className="absolute left-10 top-10 w-6 h-6 border-l border-t border-[#d4a843]/50"></div>
            <div className="absolute right-10 top-10 w-6 h-6 border-r border-t border-[#d4a843]/50"></div>
            <div className="absolute left-10 bottom-10 w-6 h-6 border-l border-b border-[#d4a843]/50"></div>
            <div className="absolute right-10 bottom-10 w-6 h-6 border-r border-b border-[#d4a843]/50"></div>

            {/* Verification Status Badge - Hidden in print */}
            <div className="absolute top-5 right-5 z-20 no-print verification-badge">
              {isVerified ? (
                <span className="verified-badge inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 border border-green-300 shadow-sm">
                  <span className="text-sm">✅</span> Verified
                </span>
              ) : (
                <span className="unverified-badge inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-300 shadow-sm">
                  <span className="text-sm">🔒</span> Unverified
                </span>
              )}
            </div>

            {/* Certificate Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-between px-16 py-12 text-center">

              {/* Header */}
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-4xl">🏅</span>
                  <span className="cert-font-serif text-4xl font-extrabold tracking-tight text-slate-900">
                    {COMPANY_NAME}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#d4a843]"></div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                    Certificate of Completion
                  </p>
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#d4a843]"></div>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 flex flex-col items-center justify-center gap-2 py-2">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400 font-medium">
                  This Certificate Is Proudly Presented To
                </p>
                
                <h2 className="cert-font-script text-7xl leading-tight text-indigo-900">
                  {name || "Your Name"}
                </h2>
                
                <div className="flex items-center gap-4 my-1">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#d4a843]"></div>
                  <p className="text-sm text-slate-500 font-medium">for successfully completing the course</p>
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#d4a843]"></div>
                </div>
                
                <p className="cert-font-serif text-3xl font-bold text-slate-800 tracking-wide">
                  {subject}
                </p>
                
                {!isVerified && (
                  <Link
                    href={COURSE_PATHS[subject] || "/courses"}
                    className="mt-1 text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1 no-print"
                  >
                    View Course Details →
                  </Link>
                )}

                <p className="text-sm text-slate-500 mt-1">
                  awarded on{" "}
                  <span className="font-semibold text-slate-700">
                    {formatDate(date)}
                  </span>
                </p>

                {isVerified && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                    <span className="text-9xl font-bold text-green-600 transform rotate-[-25deg] tracking-widest">VERIFIED</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="w-full flex items-end justify-between pt-2 border-t border-[#d4a843]/30">
                {/* Left - Issuer */}
                <div className="text-left">
                  <p className="cert-font-script text-3xl text-slate-700">{ISSUER_NAME}</p>
                  <div className="mt-0.5 w-48 border-t-2 border-[#d4a843] pt-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                      {ISSUER_TITLE}
                    </p>
                  </div>
                </div>

                {/* Center - Seal */}
                <div className="flex flex-col items-center no-print">
                  <div className={`flex h-20 w-20 items-center justify-center rounded-full border-4 ${
                    isVerified ? 'border-green-500 bg-green-50' : 'border-amber-500 bg-amber-50'
                  } shadow-lg`}>
                    <span className="text-3xl">{isVerified ? '✅' : '🔒'}</span>
                  </div>
                  <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {isVerified ? 'Verified Credential' : 'Awaiting Verification'}
                  </p>
                </div>

                {/* Right - Certificate ID */}
                <div className="text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Certificate ID
                  </p>
                  <p className="font-mono text-sm font-bold text-slate-700 tracking-wider">{certId}</p>
                  <p className="mt-0.5 text-[9px] text-slate-400">
                    ✦ Valid for Lifetime ✦
                  </p>
                </div>
              </div>

              {/* Bottom Decorative Line */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#d4a843] to-transparent"></div>
            </div>
          </div>

          {/* actions */}
          <div className="no-print mt-8 flex flex-col items-center justify-center gap-4">
            {!isVerified ? (
              <>
                <button
                  onClick={() => setShowSecurityPopup(true)}
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-sm font-bold text-white transition hover:scale-[1.02] hover:shadow-lg"
                >
                  🔓 Verify Certificate Now
                </button>
                <button
                  onClick={handleEditDetails}
                  className="rounded-xl border border-slate-300 px-8 py-4 text-sm font-bold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600"
                >
                  ✏️ Edit Details
                </button>
                <p className="text-xs text-slate-400">
                  ⚠️ Download requires verification. Enter security code to unlock download.
                </p>
              </>
            ) : (
              <>
                <button
                  onClick={handleDownload}
                  className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-4 text-sm font-bold text-white transition hover:scale-[1.02] hover:shadow-lg"
                >
                  ⬇ Download / Print Certificate
                </button>
                <button
                  onClick={handleEditDetails}
                  className="rounded-xl border border-slate-300 px-8 py-4 text-sm font-bold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600"
                >
                  ✏️ Edit Details
                </button>
              </>
            )}
          </div>

          {/* Security Code Popup */}
          {showSecurityPopup && (
            <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl animate-in fade-in zoom-in-95">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">🔐</div>
                  <h3 className="text-xl font-bold text-slate-800">Verify Your Certificate</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Enter the security code to verify and unlock download
                  </p>
                  
                  <div className="mt-4 rounded-lg bg-blue-50 p-3 border border-blue-200">
                    <p className="text-sm text-blue-700 text-center">
                      🔑 Enter the security code provided by the Codelura team.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleVerifyCertificate} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Security Code
                    </label>
                    <input
                      type="text"
                      value={securityCode}
                      onChange={(e) => setSecurityCode(e.target.value.toUpperCase())}
                      placeholder="Enter your security code"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-500 hover:scale-[1.02]"
                    >
                      Verify Certificate
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowSecurityPopup(false);
                        setSecurityCode("");
                      }}
                      className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>

                <p className="mt-4 text-center text-xs text-slate-400">
                  💡 Invalid code? Contact {COMPANY_NAME} team for assistance.
                </p>
              </div>
            </div>
          )}
          
          <div className="no-print mt-4 rounded-lg bg-indigo-50 p-4 text-center">
            <p className="text-sm text-indigo-700">
              {isVerified ? (
                "✅ Certificate verified! You can now download and print your certificate."
              ) : (
                "🔒 Certificate is unverified. Click 'Verify Certificate Now' to unlock download."
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
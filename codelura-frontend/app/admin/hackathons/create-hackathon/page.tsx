"use client";

import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Code, Sparkles, Check, Plus, Trash2, ArrowRight, ArrowLeft } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Track       { id: string; title: string; description: string }
interface Judge       { id: string; name: string; role: string; company: string; image: string }
interface Sponsor     { id: string; name: string; logo: string; website: string }
interface Faq         { id: string; question: string; answer: string }
interface Criteria    { id: string; title: string; weightage: string }

const uid = () => Math.random().toString(36).slice(2, 8);

const emptyTrack    = (): Track    => ({ id: uid(), title: "", description: "" });
const emptyJudge    = (): Judge    => ({ id: uid(), name: "", role: "", company: "", image: "" });
const emptySponsor  = (): Sponsor  => ({ id: uid(), name: "", logo: "", website: "" });
const emptyFaq      = (): Faq      => ({ id: uid(), question: "", answer: "" });
const emptyCriteria = (): Criteria => ({ id: uid(), title: "", weightage: "" });

export default function CreateHackathonPage() {
  const [loading, setLoading] = useState(false);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonText, setJsonText] = useState("");

  // Basics
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [theme, setTheme] = useState("");
  const [mode, setMode] = useState("Online");
  const [status, setStatus] = useState("upcoming");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [bannerImage, setBannerImage] = useState("");

  // Dates & Timeline
  const [registrationStart, setRegistrationStart] = useState("");
  const [registrationDeadline, setRegistrationDeadline] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [submissionDeadline, setSubmissionDeadline] = useState("");
  const [winnerAnnouncementDate, setWinnerAnnouncementDate] = useState("");

  // Stats & Team
  const [prizePool, setPrizePool] = useState("");
  const [prizeDetails, setPrizeDetails] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("500");
  const [teamSizeMin, setTeamSizeMin] = useState("1");
  const [teamSizeMax, setTeamSizeMax] = useState("4");

  // Lists
  const [eligibility, setEligibility] = useState("");
  const [submissionRequirements, setSubmissionRequirements] = useState("");
  const [benefits, setBenefits] = useState("");
  const [rules, setRules] = useState("");
  const [discordLink, setDiscordLink] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");

  // Array states
  const [tracks, setTracks] = useState<Track[]>([
    { id: uid(), title: "Generative AI", description: "Build AI assistants, AI agents, RAG systems, content generation tools." },
    { id: uid(), title: "Education & EdTech", description: "Build AI-powered tutors, personalized learning platforms." },
  ]);
  const [criteria, setCriteria] = useState<Criteria[]>([
    { id: uid(), title: "Innovation", weightage: "25" },
    { id: uid(), title: "Problem Impact", weightage: "25" },
    { id: uid(), title: "AI Implementation", weightage: "20" },
    { id: uid(), title: "Technical Execution", weightage: "15" },
    { id: uid(), title: "UI/UX", weightage: "10" },
    { id: uid(), title: "Scalability", weightage: "5" },
  ]);

  const [rawJsonData, setRawJsonData] = useState<any>(null);

  // JSON Import Auto-Fill Function
  const handleImportJson = () => {
    try {
      const data = JSON.parse(jsonText);
      setRawJsonData(data);

      if (data.title) setTitle(data.title);
      if (data.slug) setSlug(data.slug);
      if (data.theme) setTheme(data.theme);
      if (data.mode) setMode(data.mode);
      if (data.status) setStatus(data.status);
      if (data.shortDescription) setShortDescription(data.shortDescription);
      if (data.fullDescription) setFullDescription(data.fullDescription);
      if (data.bannerImageUrl || data.bannerImage) setBannerImage(data.bannerImageUrl || data.bannerImage);

      if (data.prizePool) setPrizePool(String(data.prizePool));
      if (data.maxParticipants) setMaxParticipants(String(data.maxParticipants));
      if (data.teamSize?.min) setTeamSizeMin(String(data.teamSize.min));
      if (data.teamSize?.max) setTeamSizeMax(String(data.teamSize.max));

      if (data.registrationStartDate) setRegistrationStart(data.registrationStartDate);
      if (data.registrationEndDate) setRegistrationDeadline(data.registrationEndDate);
      if (data.hackathonStartDate) setStartDate(data.hackathonStartDate);
      if (data.hackathonEndDate) setEndDate(data.hackathonEndDate);
      if (data.submissionDeadline) setSubmissionDeadline(data.submissionDeadline);
      if (data.winnerAnnouncementDate) setWinnerAnnouncementDate(data.winnerAnnouncementDate);

      // Handle Prizes array formatting
      if (Array.isArray(data.prizes)) {
        const prizeText = data.prizes
          .map((p: any) => `${p.title || `Rank ${p.rank}`}: ₹${p.cashPrize || p.prize} (${p.benefits?.join(", ") || ""})`)
          .join("\n");
        setPrizeDetails(prizeText);
      }

      // Arrays to text
      if (Array.isArray(data.eligibility)) setEligibility(data.eligibility.join("\n"));
      if (Array.isArray(data.submissionRequirements)) setSubmissionRequirements(data.submissionRequirements.join("\n"));
      if (Array.isArray(data.benefits)) setBenefits(data.benefits.join("\n"));
      if (Array.isArray(data.rules)) setRules(data.rules.join("\n"));

      // Tracks
      if (Array.isArray(data.tracks)) {
        setTracks(
          data.tracks.map((tr: any) => ({
            id: uid(),
            title: tr.name || tr.title || "",
            description: tr.description || "",
          }))
        );
      }

      // Judging Criteria
      if (Array.isArray(data.judgingCriteria)) {
        setCriteria(
          data.judgingCriteria.map((c: any) => ({
            id: uid(),
            title: c.criteria || c.title || "",
            weightage: String(c.weight || c.weightage || 0),
          }))
        );
      }

      toast.success("✨ JSON imported and form auto-filled successfully!");
      setShowJsonModal(false);
    } catch (err) {
      toast.error("Invalid JSON format. Please check your JSON syntax.");
    }
  };

  // Submit Handler
  const handleSubmit = async () => {
    if (!title || !shortDescription) {
      toast.error("Title and Short Description are required!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        theme,
        mode,
        status,
        shortDescription,
        fullDescription,
        bannerImage: bannerImage || "https://images.unsplash.com/photo-1518770660439-4636190af475",
        bannerImageUrl: bannerImage || "https://images.unsplash.com/photo-1518770660439-4636190af475",
        prizePool: typeof prizePool === "number" ? prizePool : (Number(String(prizePool).replace(/[^0-9]/g, "")) || 100000),
        prizeDetails,
        prizes: rawJsonData?.prizes || undefined,
        maxParticipants: Number(maxParticipants) || 500,
        teamSizeMin: Number(teamSizeMin) || 1,
        teamSizeMax: Number(teamSizeMax) || 4,
        teamSize: { min: Number(teamSizeMin) || 1, max: Number(teamSizeMax) || 4 },
        registrationStart: registrationStart ? new Date(registrationStart) : new Date(),
        registrationStartDate: registrationStart ? new Date(registrationStart) : new Date(),
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : new Date(),
        registrationEndDate: registrationDeadline ? new Date(registrationDeadline) : new Date(),
        startDate: startDate ? new Date(startDate) : new Date(),
        hackathonStartDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : new Date(),
        hackathonEndDate: endDate ? new Date(endDate) : new Date(),
        submissionDeadline: submissionDeadline ? new Date(submissionDeadline) : new Date(),
        winnerAnnouncementDate: winnerAnnouncementDate ? new Date(winnerAnnouncementDate) : new Date(),
        eligibility: typeof eligibility === "string" ? eligibility.split("\n").map((s) => s.trim()).filter(Boolean) : eligibility,
        submissionRequirements: typeof submissionRequirements === "string" ? submissionRequirements.split("\n").map((s) => s.trim()).filter(Boolean) : submissionRequirements,
        benefits: typeof benefits === "string" ? benefits.split("\n").map((s) => s.trim()).filter(Boolean) : benefits,
        rules: typeof rules === "string" ? rules.split("\n").map((s) => s.trim()).filter(Boolean) : rules,
        discordLink,
        websiteLink,
        tracks: rawJsonData?.tracks || tracks.map(({ title, description }) => ({ title, description })),
        judgingCriteria: rawJsonData?.judgingCriteria || criteria.map(({ title, weightage }) => ({ title, weightage: Number(weightage) })),
        isPublished: true,
      };

      await api.post("/admin/hackathons", payload);
      toast.success("Hackathon created successfully! 🚀");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create hackathon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-2">
              ⚡ Create New Hackathon
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Configure full hackathon details or auto-fill with JSON</p>
          </div>

          <button
            type="button"
            onClick={() => setShowJsonModal(true)}
            className="px-4 py-2.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/40 text-xs font-bold transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            Paste JSON & Auto-Fill
          </button>
        </div>

        {/* FORM SECTIONS */}
        <div className="space-y-6">

          {/* SECTION 1: BASICS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-violet-400">1. Basic Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
                  }}
                  placeholder="Codelura AI Innovation Hackathon 2026"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="codelura-ai-innovation-hackathon-2026"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Theme Tagline</label>
                <input
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="Build AI. Solve Real Problems. Create Impact."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Mode</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none"
                >
                  <option value="Online">Online</option>
                  <option value="Offline / Hybrid">Offline / Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="ended">Ended</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Short Summary Description *</label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Build AI-powered solutions for real-world problems and compete with innovators."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Full Description</label>
              <textarea
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                placeholder="Complete overview of the hackathon..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none h-28"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Banner Image URL</label>
              <input
                type="text"
                value={bannerImage}
                onChange={(e) => setBannerImage(e.target.value)}
                placeholder="https://images.unsplash.com/photo-1518770660439-4636190af475"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none"
              />
            </div>
          </div>

          {/* SECTION 2: DATES & TIMELINE */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-violet-400">2. Dates & Schedule</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Registration Start</label>
                <input
                  type="date"
                  value={registrationStart}
                  onChange={(e) => setRegistrationStart(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Registration End</label>
                <input
                  type="date"
                  value={registrationDeadline}
                  onChange={(e) => setRegistrationDeadline(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Hackathon Start</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Hackathon End</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Submission Deadline</label>
                <input
                  type="date"
                  value={submissionDeadline}
                  onChange={(e) => setSubmissionDeadline(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Winner Announcement</label>
                <input
                  type="date"
                  value={winnerAnnouncementDate}
                  onChange={(e) => setWinnerAnnouncementDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: PRIZES & TEAM */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-violet-400">3. Prize Pool & Team Size</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Total Prize Pool (₹)</label>
                <input
                  type="text"
                  value={prizePool}
                  onChange={(e) => setPrizePool(e.target.value)}
                  placeholder="100000"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Max Participants</label>
                <input
                  type="number"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(e.target.value)}
                  placeholder="500"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Min Team Size</label>
                <input
                  type="number"
                  value={teamSizeMin}
                  onChange={(e) => setTeamSizeMin(e.target.value)}
                  placeholder="1"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Max Team Size</label>
                <input
                  type="number"
                  value={teamSizeMax}
                  onChange={(e) => setTeamSizeMax(e.target.value)}
                  placeholder="4"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Prize Breakdown Details</label>
              <textarea
                value={prizeDetails}
                onChange={(e) => setPrizeDetails(e.target.value)}
                placeholder="1st Prize: ₹50,000 + Internship Opportunity&#10;2nd Prize: ₹30,000 + Certificate&#10;3rd Prize: ₹20,000 + Mentorship"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none h-24"
              />
            </div>
          </div>

          {/* SECTION 4: TRACKS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-violet-400">4. Hackathon Tracks</h2>
              <button
                type="button"
                onClick={() => setTracks([...tracks, emptyTrack()])}
                className="text-xs font-semibold text-violet-400 hover:underline flex items-center gap-1"
              >
                + Add Track
              </button>
            </div>

            <div className="space-y-3">
              {tracks.map((tr, i) => (
                <div key={tr.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={tr.title}
                      onChange={(e) => {
                        const copy = [...tracks];
                        copy[i].title = e.target.value;
                        setTracks(copy);
                      }}
                      placeholder="Track Title (e.g. Generative AI)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 outline-none"
                    />
                    <input
                      type="text"
                      value={tr.description}
                      onChange={(e) => {
                        const copy = [...tracks];
                        copy[i].description = e.target.value;
                        setTracks(copy);
                      }}
                      placeholder="Track Description"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setTracks(tracks.filter((_, idx) => idx !== i))}
                    className="text-red-400 hover:text-red-300 p-2 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: JUDGING CRITERIA */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-violet-400">5. Judging Criteria</h2>
              <button
                type="button"
                onClick={() => setCriteria([...criteria, emptyCriteria()])}
                className="text-xs font-semibold text-violet-400 hover:underline flex items-center gap-1"
              >
                + Add Criteria
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {criteria.map((cr, i) => (
                <div key={cr.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
                  <input
                    type="text"
                    value={cr.title}
                    onChange={(e) => {
                      const copy = [...criteria];
                      copy[i].title = e.target.value;
                      setCriteria(copy);
                    }}
                    placeholder="Criteria (e.g. Innovation)"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 outline-none"
                  />
                  <input
                    type="number"
                    value={cr.weightage}
                    onChange={(e) => {
                      const copy = [...criteria];
                      copy[i].weightage = e.target.value;
                      setCriteria(copy);
                    }}
                    placeholder="25%"
                    className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-center text-slate-100 outline-none font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setCriteria(criteria.filter((_, idx) => idx !== i))}
                    className="text-red-400 p-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 6: REQUIREMENTS, RULES & BENEFITS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-violet-400">6. Requirements, Eligibility & Rules</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Eligibility (1 per line)</label>
                <textarea
                  value={eligibility}
                  onChange={(e) => setEligibility(e.target.value)}
                  placeholder="College students&#10;Recent graduates&#10;Developers"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 outline-none h-24"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Submission Requirements (1 per line)</label>
                <textarea
                  value={submissionRequirements}
                  onChange={(e) => setSubmissionRequirements(e.target.value)}
                  placeholder="Project name&#10;Problem statement&#10;GitHub repository&#10;Live demo URL"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 outline-none h-24"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Benefits & Perks (1 per line)</label>
                <textarea
                  value={benefits}
                  onChange={(e) => setBenefits(e.target.value)}
                  placeholder="Technical mentorship&#10;Internship opportunities&#10;Participation certificate"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 outline-none h-24"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Official Rules (1 per line)</label>
                <textarea
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  placeholder="Participants can participate individually or in teams of up to 4 members.&#10;Projects must be built during the hackathon period."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 outline-none h-24"
                />
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-2xl shadow-xl shadow-violet-600/30 transition-all text-base disabled:opacity-50"
          >
            {loading ? "Creating Hackathon..." : "🚀 Publish Hackathon"}
          </button>
        </div>
      </div>

      {/* JSON AUTO-FILL MODAL */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-violet-500/40 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" /> Paste Hackathon Creation JSON
              </h3>
              <button onClick={() => setShowJsonModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <p className="text-xs text-slate-400">Paste your hackathon JSON payload below to automatically fill all form fields.</p>

            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder='{\n  "title": "Codelura AI Innovation Hackathon 2026",\n  "slug": "codelura-ai-innovation-hackathon-2026",\n  "prizePool": 100000\n}'
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-xs font-mono text-slate-200 outline-none h-64"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowJsonModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportJson}
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30"
              >
                Auto-Fill Form ✨
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

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

// ─── Reusable UI ──────────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
      {children}
    </label>
  );
}

function Input({
  value, onChange, placeholder, type = "text",
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
    />
  );
}

function Textarea({
  value, onChange, placeholder, rows = 3,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition resize-y"
    />
  );
}

function Card({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 bg-slate-800/80 border-b border-slate-700">
        <span className="text-xl">{icon}</span>
        <h2 className="font-bold text-slate-100 text-base">{title}</h2>
      </div>
      <div className="p-6 flex flex-col gap-5">{children}</div>
    </div>
  );
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

// ─── Repeatable List ──────────────────────────────────────────────────────────
interface FieldDef {
  key: string;
  label: string;
  placeholder?: string;
  type?: string;
  wide?: boolean;
}

function RepeatableList<T extends { id: string }>({
  items, onAdd, onRemove, onChange, fields, addLabel,
}: {
  items: T[];
  onAdd: () => void;
  onRemove: (i: number) => void;
  onChange: (i: number, key: string, val: string) => void;
  fields: FieldDef[];
  addLabel: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <div key={item.id} className="flex gap-3 items-start bg-slate-900 border border-slate-700 rounded-xl p-4">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fields.map((f) => (
              <div key={f.key} className={f.wide ? "sm:col-span-2" : ""}>
                <Label>{f.label}</Label>
                {f.type === "textarea" ? (
                  <Textarea
                    value={(item as Record<string, string>)[f.key]}
                    onChange={(v) => onChange(i, f.key, v)}
                    placeholder={f.placeholder}
                    rows={2}
                  />
                ) : (
                  <Input
                    type={f.type ?? "text"}
                    value={(item as Record<string, string>)[f.key]}
                    onChange={(v) => onChange(i, f.key, v)}
                    placeholder={f.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="mt-6 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition text-xs"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-violet-500/40 bg-violet-500/5 text-violet-400 text-sm hover:bg-violet-500/10 transition w-fit"
      >
        <span className="text-base leading-none">＋</span> {addLabel}
      </button>
    </div>
  );
}

// ─── Step Indicator ───────────────────────────────────────────────────────────
const STEPS = ["Basics", "Prizes & Dates", "Rules & Links", "Tracks", "People", "FAQs & Criteria"];

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1 flex-wrap mb-8">
      {STEPS.map((s, i) => (
        <div key={i} className="flex items-center gap-1">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              i === current
                ? "bg-violet-600 text-white"
                : i < current
                ? "bg-emerald-600/20 text-emerald-400"
                : "bg-slate-700/50 text-slate-500"
            }`}
          >
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
              i < current ? "bg-emerald-500 text-black" : i === current ? "bg-white text-violet-600" : "bg-slate-600 text-slate-400"
            }`}>
              {i < current ? "✓" : i + 1}
            </span>
            {s}
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-px w-4 ${i < current ? "bg-emerald-500" : "bg-slate-700"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CreateHackathonPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Step 0 — Basics
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [bannerImage, setBannerImage] = useState("");

  // Step 1 — Prizes & Dates
  const [prizePool, setPrizePool] = useState("");
  const [prizeDetails, setPrizeDetails] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [registrationStart, setRegistrationStart] = useState("");
  const [registrationDeadline, setRegistrationDeadline] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Step 2 — Rules & Links
  const [rules, setRules] = useState("");
  const [teamSizeMin, setTeamSizeMin] = useState("1");
  const [teamSizeMax, setTeamSizeMax] = useState("4");
  const [discordLink, setDiscordLink] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");

  // Step 3 — Tracks
  const [tracks, setTracks] = useState<Track[]>([emptyTrack()]);

  // Step 4 — Judges & Sponsors
  const [judges, setJudges] = useState<Judge[]>([emptyJudge()]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([emptySponsor()]);

  // Step 5 — FAQs & Criteria
  const [faqs, setFaqs] = useState<Faq[]>([emptyFaq()]);
  const [criteria, setCriteria] = useState<Criteria[]>([emptyCriteria()]);

  // ─── Array helpers
  function arrayHelpers<T extends { id: string }>(setter: React.Dispatch<React.SetStateAction<T[]>>) {
    return {
      add:    (fn: () => T) => setter((p) => [...p, fn()]),
      remove: (i: number)   => setter((p) => p.filter((_, idx) => idx !== i)),
      change: (i: number, key: string, val: string) =>
        setter((p) => p.map((item, idx) => idx === i ? { ...item, [key]: val } : item)),
    };
  }

  const t  = arrayHelpers(setTracks);
  const j  = arrayHelpers(setJudges);
  const sp = arrayHelpers(setSponsors);
  const f  = arrayHelpers(setFaqs);
  const c  = arrayHelpers(setCriteria);

  // ─── Submit
  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post("/admin/hackathons", {
        title, slug, shortDescription, fullDescription, bannerImage,
        prizePool, prizeDetails,
        maxParticipants: Number(maxParticipants),
        registrationStart: registrationStart ? new Date(registrationStart) : undefined,
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : undefined,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : new Date(),
        rules, discordLink, websiteLink,
        teamSizeMin: Number(teamSizeMin),
        teamSizeMax: Number(teamSizeMax),
        tracks: tracks.map(({ title, description }) => ({ title, description })),
        judges: judges.map(({ name, role, company, image }) => ({ name, role, company, image })),
        sponsors: sponsors.map(({ name, logo, website }) => ({ name, logo, website })),
        faqs: faqs.map(({ question, answer }) => ({ question, answer })),
        judgingCriteria: criteria.map(({ title, weightage }) => ({ title, weightage: Number(weightage) })),
      });
      toast.success("Hackathon created successfully! 🚀");
      setStep(0);
    } catch {
      toast.error("Failed to create hackathon");
    } finally {
      setLoading(false);
    }
  };

  const totalWeightage = criteria.reduce((sum, c) => sum + (Number(c.weightage) || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center gap-4">
        <span className="text-violet-400 text-xl">⚡</span>
        <span className="font-bold text-slate-100 text-lg tracking-tight">HackAdmin</span>
        <span className="text-slate-600">/</span>
        <span className="text-slate-400 text-sm">Create Hackathon</span>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <StepBar current={step} />

        {/* ── Step 0: Basics ── */}
        {step === 0 && (
          <Card title="Basic Information" icon="📋">
            <FieldRow>
              <div>
                <Label>Title *</Label>
                <Input
                  value={title}
                  onChange={(v) => { setTitle(v); setSlug(v.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")); }}
                  placeholder="AI Innovation Hackathon 2026"
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input value={slug} onChange={setSlug} placeholder="ai-innovation-hackathon-2026" />
              </div>
            </FieldRow>
            <div>
              <Label>Short Description</Label>
              <Input value={shortDescription} onChange={setShortDescription} placeholder="Build AI tools solving real world problems" />
            </div>
            <div>
              <Label>Full Description</Label>
              <Textarea value={fullDescription} onChange={setFullDescription} rows={5} placeholder="Describe the hackathon in detail…" />
            </div>
            <div>
              <Label>Banner Image URL</Label>
              <Input value={bannerImage} onChange={setBannerImage} placeholder="https://images.unsplash.com/…" />
            </div>
            {bannerImage && (
              <div className="rounded-xl overflow-hidden border border-slate-700 h-44">
                <img src={bannerImage} alt="Banner preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
              </div>
            )}
          </Card>
        )}

        {/* ── Step 1: Prizes & Dates ── */}
        {step === 1 && (
          <Card title="Prizes & Dates" icon="🏆">
            <FieldRow>
              <div>
                <Label>Prize Pool</Label>
                <Input value={prizePool} onChange={setPrizePool} placeholder="₹50,000" />
              </div>
              <div>
                <Label>Max Participants</Label>
                <Input type="number" value={maxParticipants} onChange={setMaxParticipants} placeholder="2000" />
              </div>
            </FieldRow>
            <div>
              <Label>Prize Breakdown</Label>
              <Textarea value={prizeDetails} onChange={setPrizeDetails} rows={2} placeholder="1st Prize ₹30,000, 2nd Prize ₹15,000, 3rd Prize ₹5,000" />
            </div>
            <div className="border-t border-slate-700 pt-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Timeline</p>
              <FieldRow>
                <div>
                  <Label>Registration Start</Label>
                  <Input type="datetime-local" value={registrationStart} onChange={setRegistrationStart} />
                </div>
                <div>
                  <Label>Registration Deadline</Label>
                  <Input type="datetime-local" value={registrationDeadline} onChange={setRegistrationDeadline} />
                </div>
                <div>
                  <Label>Hackathon Start</Label>
                  <Input type="datetime-local" value={startDate} onChange={setStartDate} />
                </div>
                <div>
                  <Label>Hackathon End</Label>
                  <Input type="datetime-local" value={endDate} onChange={setEndDate} />
                </div>
              </FieldRow>
            </div>
          </Card>
        )}

        {/* ── Step 2: Rules & Links ── */}
        {step === 2 && (
          <Card title="Rules & Links" icon="📜">
            <div>
              <Label>Rules</Label>
              <Textarea value={rules} onChange={setRules} rows={4} placeholder="Teams can have 1–4 members. All code must be written during the hackathon. Plagiarism will lead to disqualification." />
            </div>
            <FieldRow>
              <div>
                <Label>Min Team Size</Label>
                <Input type="number" value={teamSizeMin} onChange={setTeamSizeMin} placeholder="1" />
              </div>
              <div>
                <Label>Max Team Size</Label>
                <Input type="number" value={teamSizeMax} onChange={setTeamSizeMax} placeholder="4" />
              </div>
              <div>
                <Label>Discord Link</Label>
                <Input value={discordLink} onChange={setDiscordLink} placeholder="https://discord.gg/…" />
              </div>
              <div>
                <Label>Website Link</Label>
                <Input value={websiteLink} onChange={setWebsiteLink} placeholder="https://codelura.com" />
              </div>
            </FieldRow>
          </Card>
        )}

        {/* ── Step 3: Tracks ── */}
        {step === 3 && (
          <Card title="Tracks" icon="🛤️">
            <RepeatableList
              items={tracks}
              onAdd={() => t.add(emptyTrack)}
              onRemove={t.remove}
              onChange={t.change}
              addLabel="Add Track"
              fields={[
                { key: "title", label: "Track Title", placeholder: "AI for Healthcare" },
                { key: "description", label: "Description", placeholder: "Build AI tools to improve diagnostics…", type: "textarea", wide: true },
              ]}
            />
          </Card>
        )}

        {/* ── Step 4: Judges & Sponsors ── */}
        {step === 4 && (
          <div className="flex flex-col gap-6">
            <Card title="Judges" icon="👨‍⚖️">
              <RepeatableList
                items={judges}
                onAdd={() => j.add(emptyJudge)}
                onRemove={j.remove}
                onChange={j.change}
                addLabel="Add Judge"
                fields={[
                  { key: "name",    label: "Name",      placeholder: "Rishabh Gupta" },
                  { key: "role",    label: "Role",      placeholder: "Senior AI Engineer" },
                  { key: "company", label: "Company",   placeholder: "Google" },
                  { key: "image",   label: "Image URL", placeholder: "https://…", wide: true },
                ]}
              />
            </Card>
            <Card title="Sponsors" icon="🤝">
              <RepeatableList
                items={sponsors}
                onAdd={() => sp.add(emptySponsor)}
                onRemove={sp.remove}
                onChange={sp.change}
                addLabel="Add Sponsor"
                fields={[
                  { key: "name",    label: "Name",     placeholder: "AWS" },
                  { key: "logo",    label: "Logo URL", placeholder: "https://…" },
                  { key: "website", label: "Website",  placeholder: "https://aws.amazon.com", wide: true },
                ]}
              />
            </Card>
          </div>
        )}

        {/* ── Step 5: FAQs & Criteria ── */}
        {step === 5 && (
          <div className="flex flex-col gap-6">
            <Card title="FAQs" icon="❓">
              <RepeatableList
                items={faqs}
                onAdd={() => f.add(emptyFaq)}
                onRemove={f.remove}
                onChange={f.change}
                addLabel="Add FAQ"
                fields={[
                  { key: "question", label: "Question", placeholder: "Who can participate?" },
                  { key: "answer",   label: "Answer",   placeholder: "Anyone interested in technology…", type: "textarea", wide: true },
                ]}
              />
            </Card>
            <Card title="Judging Criteria" icon="⚖️">
              <RepeatableList
                items={criteria}
                onAdd={() => c.add(emptyCriteria)}
                onRemove={c.remove}
                onChange={c.change}
                addLabel="Add Criterion"
                fields={[
                  { key: "title",     label: "Criterion",    placeholder: "Innovation" },
                  { key: "weightage", label: "Weightage (%)", placeholder: "40", type: "number" },
                ]}
              />
              {/* Live weightage bar */}
              {criteria.length > 0 && (
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span>Weightage Distribution</span>
                    <span className={totalWeightage === 100 ? "text-emerald-400" : totalWeightage > 100 ? "text-red-400" : "text-amber-400"}>
                      {totalWeightage}% {totalWeightage === 100 ? "✓" : totalWeightage > 100 ? "(over 100%)" : "(incomplete)"}
                    </span>
                  </div>
                  <div className="flex h-6 rounded-lg overflow-hidden gap-0.5 bg-slate-900 p-0.5">
                    {criteria.map((cr, i) => {
                      const w = Math.min(Number(cr.weightage) || 0, 100);
                      const colors = ["bg-violet-500","bg-amber-400","bg-emerald-500","bg-pink-500","bg-sky-500"];
                      return w > 0 ? (
                        <div
                          key={cr.id}
                          className={`${colors[i % colors.length]} rounded flex items-center justify-center text-[9px] font-bold text-black overflow-hidden transition-all`}
                          style={{ width: `${(w / Math.max(totalWeightage, 100)) * 100}%` }}
                          title={`${cr.title}: ${cr.weightage}%`}
                        >
                          {w > 8 && cr.title.slice(0, 8)}
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ── Navigation ── */}
        <div className="flex items-center justify-between mt-8">
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="px-5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm font-semibold hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            ← Back
          </button>

          <span className="text-xs text-slate-600">{step + 1} / {STEPS.length}</span>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition"
            >
              Continue →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-amber-500 text-white text-sm font-bold hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-lg shadow-violet-900/30"
            >
              {loading ? "Creating…" : "🚀 Create Hackathon"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
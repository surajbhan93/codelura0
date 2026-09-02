"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface Track {
  _id?: string;
  title: string;
  description?: string;
}

interface Hackathon {
  id: string;
  title?: string;
  tracks?: Track[];
  registrationStartDate?: string;
  registrationStart?: string;
  registrationEndDate?: string;
  registrationDeadline?: string;
  registrationClosed?: boolean;
  isRegistered?: boolean;
}

function fmtDate(dStr?: string) {
  if (!dStr) return "";
  const d = new Date(dStr);
  return isNaN(d.getTime()) ? dStr : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function ParticipateButton({ hackathon }: { hackathon: Hackathon }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isRegisteredState, setIsRegisteredState] = useState<boolean>(hackathon.isRegistered || false);

  // Form State for easy application
  const [teamName, setTeamName] = useState("");
  const [track, setTrack] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [projectIdea, setProjectIdea] = useState("");

  const startDateStr = hackathon.registrationStartDate || hackathon.registrationStart;
  const endDateStr = hackathon.registrationEndDate || hackathon.registrationDeadline;

  const now = new Date();
  const isBeforeStart = startDateStr ? now < new Date(startDateStr) : false;
  const isAfterEnd = endDateStr ? now > new Date(endDateStr) : Boolean(hackathon.registrationClosed);

  // Check login & registration status
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const uRes = await api.get("/auth/me").catch(() => null);
        if (uRes?.data?.user) {
          setUser(uRes.data.user);

          // Check if user is already registered for this hackathon
          const pRes = await api.get("/participation/my-participations").catch(() => null);
          if (pRes?.data?.data && Array.isArray(pRes.data.data)) {
            const registered = pRes.data.data.some(
              (p: any) => p._id === hackathon.id || p.id === hackathon.id || p.hackathon?._id === hackathon.id || p.hackathon?.slug === hackathon.id
            );
            if (registered) setIsRegisteredState(true);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkUserStatus();
  }, [hackathon.id]);

  if (!hackathon) return null;

  const handleOpenModal = () => {
    if (!user) {
      toast.error("Please login first to participate");
      router.push(`/auth/login?redirect=/hackathons/${hackathon.id}`);
      return;
    }

    if (isBeforeStart) {
      toast.error(`Registration starts on ${fmtDate(startDateStr)}`);
      return;
    }

    if (isAfterEnd) {
      toast.error("Registration has closed.");
      return;
    }

    setShowModal(true);
  };

  const handleConfirmJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      const res = await api.post("/participation/join", {
        hackathonId: hackathon.id,
        teamName: teamName || "Solo Innovator",
        track: track || hackathon.tracks?.[0]?.title || "General",
        contactPhone,
        projectIdea,
      });

      if (res.data.success || res.status === 200 || res.status === 201) {
        toast.success("🎉 Successfully registered for the hackathon!");
        setIsRegisteredState(true);
        setShowModal(false);
        router.refresh();
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error("Please login first to participate");
        router.push(`/auth/login?redirect=/hackathons/${hackathon.id}`);
      } else if (err.response?.status === 409) {
        toast.success("You are already registered!");
        setIsRegisteredState(true);
        setShowModal(false);
      } else {
        toast.error(err.response?.data?.message || "Failed to join hackathon");
      }
    } finally {
      setLoading(false);
    }
  };

  // 1. Strict Check: Registration Has Not Started Yet
  if (isBeforeStart) {
    return (
      <Button className="w-full bg-slate-800/80 text-amber-300 py-3.5 rounded-xl border border-amber-500/30 font-bold cursor-not-allowed" disabled>
        ⏳ Registration Starts on {fmtDate(startDateStr)}
      </Button>
    );
  }

  // 2. Strict Check: Registration Has Closed
  if (isAfterEnd) {
    return (
      <Button className="w-full bg-slate-800 text-slate-400 py-3.5 rounded-xl border border-slate-700 font-semibold cursor-not-allowed" disabled>
        🔒 Registration Closed
      </Button>
    );
  }

  // 3. User Already Registered State
  if (isRegisteredState) {
    return (
      <div className="space-y-3 w-full">
        <Button className="w-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 cursor-default" disabled>
          ✅ Registered Participant
        </Button>

        <Button
          onClick={() => router.push(`/hackathons/${hackathon.id}/submission`)}
          className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 transition"
        >
          🚀 Submit Project
        </Button>
      </div>
    );
  }

  // 4. Default Registration Open State
  return (
    <>
      <Button
        onClick={handleOpenModal}
        disabled={loading}
        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-violet-600/30 transition flex items-center justify-center gap-2"
      >
        ⚡ Apply / Participate Now
      </Button>

      {/* EASY APPLICATION MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#121222] border border-violet-500/30 text-white rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  ⚡ Easy Apply Registration
                </h3>
                <p className="text-xs text-slate-400 mt-1">Fill quick details to reserve your hackathon slot</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-slate-400 hover:text-white flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleConfirmJoin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Team Name (or Solo Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cyber Squad or Solo Developer"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              {hackathon.tracks && hackathon.tracks.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Select Preferred Track
                  </label>
                  <select
                    value={track}
                    onChange={(e) => setTrack(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="">Select a track...</option>
                    {hackathon.tracks.map((t, idx) => (
                      <option key={idx} value={t.title}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  WhatsApp / Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 9876543210 for updates"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Project Abstract / Initial Idea (Optional)
                </label>
                <textarea
                  placeholder="Brief 1-2 lines on what you plan to build..."
                  value={projectIdea}
                  onChange={(e) => setProjectIdea(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 h-20"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-transparent border-white/10 text-slate-400 hover:bg-white/5 rounded-xl py-3 text-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl py-3 text-sm shadow-lg shadow-violet-600/30"
                >
                  {loading ? "Registering..." : "Confirm & Apply 🚀"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
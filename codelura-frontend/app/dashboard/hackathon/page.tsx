"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { Trophy, Code, Clock, ArrowRight, CheckCircle2, Rocket, Plus } from "lucide-react";

export default function HackathonUserDashboardPage() {
  const [participations, setParticipations] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, sRes] = await Promise.allSettled([
          api.get("/participation/my-participations").catch(() => api.get("/hackathons")),
          api.get("/participation/my-submissions").catch(() => null),
        ]);

        if (pRes.status === "fulfilled" && pRes.value?.data?.data) {
          setParticipations(Array.isArray(pRes.value.data.data) ? pRes.value.data.data : []);
        }

        if (sRes.status === "fulfilled" && sRes.value?.data?.data) {
          setSubmissions(Array.isArray(sRes.value.data.data) ? sRes.value.data.data : []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0d17] text-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0d17] text-white p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <Trophy className="w-8 h-8 text-amber-400" /> My Hackathons & Submissions
            </h1>
            <p className="text-slate-400 text-sm mt-1">Track your registered hackathons, team status, and project submissions</p>
          </div>

          <Link
            href="/hackathons"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition shadow-lg shadow-violet-600/30"
          >
            <Plus className="w-4 h-4" /> Browse Live Hackathons
          </Link>
        </div>

        {/* Section 1: Registered Hackathons */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Rocket className="w-4 h-4 text-violet-400" /> Active Participations ({participations.length})
          </h2>

          {participations.length === 0 ? (
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-10 text-center space-y-3">
              <Trophy className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-base font-semibold text-slate-300">No active hackathon participations</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">Register for a hackathon to build projects, showcase your code, and win prizes!</p>
              <Link
                href="/hackathons"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-bold shadow-lg shadow-violet-600/30"
              >
                Find Hackathons Now 🚀
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {participations.map((p) => {
                const title = p.title || p.hackathon?.title || "Hackathon Challenge";
                const hackId = p.slug || p.hackathon?.slug || p._id || p.id || p.hackathon?._id;

                return (
                  <div key={p._id || p.id} className="bg-slate-900/80 border border-white/10 hover:border-violet-500/30 rounded-2xl p-5 space-y-4 transition">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {p.status || "Registered"}
                        </span>
                        <h3 className="font-bold text-white text-lg mt-2">{title}</h3>
                      </div>
                      <Trophy className="w-6 h-6 text-amber-400 shrink-0" />
                    </div>

                    <div className="space-y-1 text-xs text-slate-400">
                      {p.teamName && <p>👥 Team: <span className="text-slate-200 font-medium">{p.teamName}</span></p>}
                      {p.track && <p>🎯 Track: <span className="text-slate-200 font-medium">{p.track}</span></p>}
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      <Link href={`/hackathons/${hackId}`} className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1">
                        View Details <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/hackathons/${hackId}/submission`}
                        className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
                      >
                        Submit Project 🚀
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 2: Submissions */}
        <div className="space-y-4 pt-6 border-t border-white/10">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Code className="w-4 h-4 text-emerald-400" /> Submitted Projects ({submissions.length})
          </h2>

          {submissions.length === 0 ? (
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-8 text-center text-xs text-slate-500">
              You haven&apos;t submitted any project entries yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {submissions.map((s) => (
                <div key={s._id} className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase">
                      {s.status || "Submitted"}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{new Date(s.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-bold text-white text-base">{s.projectTitle}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{s.projectDescription}</p>

                  <div className="flex flex-wrap gap-3 pt-2 text-xs font-semibold text-violet-400">
                    {s.githubRepo && <a href={s.githubRepo} target="_blank" rel="noreferrer" className="hover:underline">🔗 GitHub</a>}
                    {s.demoVideo && <a href={s.demoVideo} target="_blank" rel="noreferrer" className="hover:underline">🎥 Demo Video</a>}
                    {s.liveUrl && <a href={s.liveUrl} target="_blank" rel="noreferrer" className="hover:underline">🌐 Live URL</a>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
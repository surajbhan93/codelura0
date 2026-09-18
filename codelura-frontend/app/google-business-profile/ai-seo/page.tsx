"use client";
import { useEffect, useState } from "react";
import { gbpGetLocations, gbpAISEORecommendations, gbpAI30DayPlan, gbpGet30DayPlan, gbpUpdatePlanDay } from "@/lib/gbp/gbpApi";
import { Bot, Sparkles, CheckSquare, Square, Building2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AISEOPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [location, setLocation] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [plan, setPlan] = useState<any>(null);
  const [genRec, setGenRec] = useState(false);
  const [genPlan, setGenPlan] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const locRes = await gbpGetLocations();
        const locs = locRes.data.data || [];
        setLocations(locs);
        const loc = locs.find((l: any) => l.isPrimary) || locs[0];
        if (!loc) return;
        setLocation(loc);
        try {
          const planRes = await gbpGet30DayPlan(loc._id);
          if (planRes.data.data) setPlan(planRes.data.data);
        } catch (_) {}
      } catch { }
      finally { setLoading(false); }
    };
    init();
  }, []);

  const handleLocationChange = async (locId: string) => {
    const loc = locations.find((l: any) => l._id === locId);
    if (!loc) return;
    setLocation(loc);
    setRecommendations([]);
    setPlan(null);
    setLoading(true);
    try {
      const planRes = await gbpGet30DayPlan(loc._id);
      if (planRes.data.data) setPlan(planRes.data.data);
    } catch (_) {}
    finally { setLoading(false); }
  };

  const handleGenRecommendations = async () => {
    if (!location) return;
    setGenRec(true);
    try {
      const res = await gbpAISEORecommendations(location._id);
      const data = res.data.data;
      setRecommendations(Array.isArray(data) ? data : data?.recommendations || []);
      toast.success("AI recommendations generated!");
    } catch { toast.error("AI generation failed. Please try again."); }
    finally { setGenRec(false); }
  };

  const handleGenPlan = async () => {
    if (!location) return;
    setGenPlan(true);
    try {
      const res = await gbpAI30DayPlan(location._id);
      setPlan(res.data.data);
      toast.success("30-Day plan generated!");
    } catch { toast.error("Failed to generate plan."); }
    finally { setGenPlan(false); }
  };

  const toggleDay = async (dayNum: number, current: boolean) => {
    if (!plan || !location) return;
    try {
      const res = await gbpUpdatePlanDay(location._id, plan._id, dayNum, !current);
      setPlan(res.data.data);
    } catch { toast.error("Failed to update."); }
  };

  const PRIORITY_COLOR: Record<string, string> = { high: "text-red-400 bg-red-500/10 border-red-500/20", medium: "text-amber-400 bg-amber-500/10 border-amber-500/20", low: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="px-6 py-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2"><Bot className="h-5 w-5 text-violet-400" /> Codelura AI SEO</h1>
          <p className="text-xs text-slate-500 mt-0.5">AI-powered recommendations based on your actual profile data.</p>
        </div>

        {locations.length > 0 && (
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">
            <Building2 className="h-4 w-4 text-violet-400 flex-shrink-0" />
            <select
              value={location?._id || ""}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer max-w-[240px] truncate"
            >
              {locations.map((l: any) => (
                <option key={l._id} value={l._id} className="bg-slate-900 text-white">
                  📍 {l.locationName || `Location (${l.googleLocationId})`}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex-1 p-6 space-y-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  SEO Recommendations
                  {location?.locationName && (
                    <span className="text-xs font-normal text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-md px-2 py-0.5">
                      📍 {location.locationName}
                    </span>
                  )}
                </h2>
                <button onClick={handleGenRecommendations} disabled={genRec || !location}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition disabled:opacity-60 shadow-lg shadow-violet-600/20">
                  <Sparkles className={`h-4 w-4 ${genRec ? "animate-pulse" : ""}`} />
                  {genRec ? "Analyzing..." : "Generate"}
                </button>
              </div>
              {recommendations.length > 0 ? (
                <div className="space-y-3">
                  {recommendations.map((rec: any, i: number) => (
                    <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${PRIORITY_COLOR[rec.priority] || PRIORITY_COLOR.low}`}>
                          {rec.priority?.toUpperCase()}
                        </span>
                        {rec.category && <span className="text-[10px] text-slate-500 uppercase">{rec.category}</span>}
                      </div>
                      <p className="text-sm text-white font-medium">{rec.action}</p>
                      {rec.estimatedImpact && <p className="text-xs text-slate-500 mt-0.5">{rec.estimatedImpact}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center text-slate-500 text-sm">
                  Click &quot;Generate&quot; to get AI-powered SEO recommendations for {location?.locationName || "this location"}.
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  30-Day Local SEO Plan
                  {location?.locationName && (
                    <span className="text-xs font-normal text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-md px-2 py-0.5">
                      📍 {location.locationName}
                    </span>
                  )}
                </h2>
                <button onClick={handleGenPlan} disabled={genPlan || !location}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition disabled:opacity-60 shadow-lg shadow-purple-600/20">
                  <Bot className={`h-4 w-4 ${genPlan ? "animate-pulse" : ""}`} />
                  {genPlan ? "Generating..." : plan ? "Regenerate" : "Generate Plan"}
                </button>
              </div>
              {plan ? (
                <div className="space-y-2">
                  {plan.days?.map((day: any) => (
                    <button key={day.day} onClick={() => toggleDay(day.day, day.isCompleted)}
                      className={`w-full text-left rounded-xl border p-4 transition ${
                        day.isCompleted ? "border-emerald-500/30 bg-emerald-500/5" : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                      }`}>
                      <div className="flex items-start gap-3">
                        {day.isCompleted ? <CheckSquare className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" /> : <Square className="h-5 w-5 text-slate-600 flex-shrink-0 mt-0.5" />}
                        <div>
                          <p className={`text-sm font-semibold ${day.isCompleted ? "text-emerald-300 line-through" : "text-white"}`}>
                            Day {day.day}: {day.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">{day.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center text-slate-500 text-sm">
                  Generate a personalized 30-day action plan based on your profile data for {location?.locationName || "this location"}.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

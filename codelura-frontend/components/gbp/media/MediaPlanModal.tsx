"use client";
import { useState, useEffect } from "react";
import { X, Calendar, Sparkles, CheckCircle2, Target, Camera, ArrowRight, Lightbulb } from "lucide-react";
import { gbpGetMediaPlan } from "@/lib/gbp/gbpApi";
import toast from "react-hot-toast";

interface MediaPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: any;
  onOpenUpload: (category?: string) => void;
}

export default function MediaPlanModal({ isOpen, onClose, location, onOpenUpload }: MediaPlanModalProps) {
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(1);

  useEffect(() => {
    if (isOpen && location) {
      loadPlan();
    }
  }, [isOpen, location]);

  const loadPlan = async () => {
    setLoading(true);
    try {
      const res = await gbpGetMediaPlan(location._id);
      setPlan(res.data.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load media plan");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const monthName = new Date().toLocaleString("default", { month: "long", year: "numeric" });
  const remaining = Math.max(0, (plan?.recommendedCount || 8) - (plan?.uploadedCount || 0));

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-400" />
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                {monthName} Media Plan
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Structured authentic photography roadmap for <span className="text-violet-300 font-semibold">{location?.locationName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm text-slate-400">Generating intelligent monthly media roadmap...</p>
            </div>
          ) : (
            <>
              {/* Progress Summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 text-center">
                  <p className="text-xs text-violet-300 font-medium">Recommended</p>
                  <p className="text-2xl font-black text-white mt-1">{plan?.recommendedCount || 8}</p>
                  <p className="text-[11px] text-slate-400">Target photos</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <p className="text-xs text-emerald-300 font-medium">Uploaded</p>
                  <p className="text-2xl font-black text-white mt-1">{plan?.uploadedCount || 0}</p>
                  <p className="text-[11px] text-slate-400">This month</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                  <p className="text-xs text-amber-300 font-medium">Remaining</p>
                  <p className="text-2xl font-black text-white mt-1">{remaining}</p>
                  <p className="text-[11px] text-slate-400">To reach goal</p>
                </div>
              </div>

              {/* Week Tabs */}
              <div className="flex gap-2 border-b border-slate-800 pb-2">
                {plan?.weeks?.map((w: any) => (
                  <button
                    key={w.weekNumber}
                    onClick={() => setSelectedWeek(w.weekNumber)}
                    className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition text-center ${
                      selectedWeek === w.weekNumber
                        ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                        : "bg-slate-800/60 text-slate-400 hover:text-white"
                    }`}
                  >
                    Week {w.weekNumber}
                  </button>
                ))}
              </div>

              {/* Active Week Details */}
              {plan?.weeks && (
                <div className="space-y-4">
                  {(() => {
                    const current = plan.weeks.find((w: any) => w.weekNumber === selectedWeek) || plan.weeks[0];
                    return (
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider font-bold text-violet-400">
                              Week {current.weekNumber} Focus
                            </span>
                            <h4 className="text-base font-bold text-white">{current.theme}</h4>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                            Target: {current.targetCount || 2} Photos
                          </span>
                        </div>

                        {/* Photography Ideas for the week */}
                        <div>
                          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                            <Lightbulb className="h-4 w-4 text-amber-400" /> Actionable Photo Ideas
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {current.ideas?.map((idea: any, idx: number) => (
                              <div
                                key={idx}
                                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-violet-500/40 transition space-y-2.5"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <span className="text-sm font-bold text-white">{idea.title}</span>
                                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                                    {idea.category}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-400">{idea.whyUseful}</p>
                                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-300">
                                  <span className="font-semibold text-violet-300">How to shoot: </span>
                                  {idea.composition}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    onClose();
                                    onOpenUpload(idea.category);
                                  }}
                                  className="w-full mt-2 py-2 rounded-lg bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                                >
                                  <Camera className="h-3.5 w-3.5" /> Upload This Photo
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Encourages authentic real-world photos without fake or stock content.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

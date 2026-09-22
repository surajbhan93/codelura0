"use client";
import { useState } from "react";
import { X, Sparkles, Lightbulb, Camera, ArrowRight, MessageSquare } from "lucide-react";
import { gbpGetAIPhotoIdeas } from "@/lib/gbp/gbpApi";
import toast from "react-hot-toast";

interface PhotoIdeasModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: any;
  onOpenUpload: (category?: string) => void;
}

export default function PhotoIdeasModal({ isOpen, onClose, location, onOpenUpload }: PhotoIdeasModalProps) {
  const [prompt, setPrompt] = useState("");
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (queryText?: string) => {
    setLoading(true);
    try {
      const q = queryText !== undefined ? queryText : prompt;
      const res = await gbpGetAIPhotoIdeas(location._id, q);
      setIdeas(res.data.data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to generate photo ideas");
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "What should I photograph this week?",
    "Showcase our faculty & teaching excellence",
    "Highlight student study environment",
    "Improve storefront navigation for new visitors",
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl shadow-2xl my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">AI Photo Ideas Generator</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Custom photography prompts tailored for <span className="text-violet-300 font-semibold">{location?.locationName}</span>
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
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Quick Prompts */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Quick Suggestions
            </span>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((qp, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setPrompt(qp);
                    handleGenerate(qp);
                  }}
                  className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-violet-600/30 hover:text-violet-200 text-slate-300 border border-slate-700/80 transition"
                >
                  {qp}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Prompt Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Ideas for celebrating our student exam results..."
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
            <button
              type="button"
              onClick={() => handleGenerate()}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 text-white font-semibold text-xs transition disabled:opacity-50 flex items-center gap-1.5"
            >
              <Sparkles className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Generating..." : "Get Ideas"}
            </button>
          </div>

          {/* Results List */}
          {ideas.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Generated Photography Prompts ({ideas.length})
              </h4>
              <div className="space-y-3">
                {ideas.map((idea, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 space-y-2 hover:border-violet-500/40 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-sm font-bold text-white flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-400 flex-shrink-0" />
                        {idea.title}
                      </h5>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase bg-violet-500/20 text-violet-300 border border-violet-500/30">
                        {idea.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{idea.whyUseful}</p>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                      <p>
                        <span className="font-semibold text-violet-300">Staging & Composition: </span>
                        {idea.composition}
                      </p>
                      {idea.suggestedCaption && (
                        <p>
                          <span className="font-semibold text-emerald-300">Suggested Caption: </span>
                          "{idea.suggestedCaption}"
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenUpload(idea.category);
                      }}
                      className="mt-2 py-2 px-4 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <Camera className="h-3.5 w-3.5" /> Upload Photo for This Idea
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

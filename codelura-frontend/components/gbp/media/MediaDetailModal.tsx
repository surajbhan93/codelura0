"use client";
import { useState } from "react";
import {
  X,
  Sparkles,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Calendar,
  Layers,
  ShieldCheck,
  User,
  Image as ImageIcon,
} from "lucide-react";
import { gbpAnalyzeMediaQuality, gbpDeleteMedia, gbpUploadMedia } from "@/lib/gbp/gbpApi";
import toast from "react-hot-toast";

interface MediaDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: any;
  locationId: string;
  onRefresh: () => void;
}

export default function MediaDetailModal({
  isOpen,
  onClose,
  media,
  locationId,
  onRefresh,
}: MediaDetailModalProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [currentMedia, setCurrentMedia] = useState(media);

  if (!isOpen || !media) return null;

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await gbpAnalyzeMediaQuality(locationId, media._id);
      setCurrentMedia(res.data.data);
      toast.success("AI Quality Analysis complete!");
      onRefresh();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await gbpDeleteMedia(locationId, media._id);
      toast.success("Photo deleted from Google Business Profile");
      onRefresh();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete photo");
    } finally {
      setDeleting(false);
    }
  };

  const setAsCategory = async (newCategory: "PROFILE" | "COVER") => {
    try {
      const formData = new FormData();
      formData.append("category", newCategory);
      if (media.googleUrl || media.sourceUrl) {
        formData.append("sourceUrl", media.googleUrl || media.sourceUrl);
      }
      await gbpUploadMedia(locationId, formData);
      toast.success(`Photo updated as official ${newCategory === "PROFILE" ? "Profile Photo" : "Cover Photo"}!`);
      onRefresh();
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to set as ${newCategory}`);
    }
  };

  const item = currentMedia || media;
  const quality = item.qualityScore || 85;
  const isDuplicate = item.isDuplicate;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl my-6 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30">
              {item.category || "ADDITIONAL"}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                item.source === "CUSTOMER"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              }`}
            >
              {item.source === "CUSTOMER" ? "Customer Upload" : "Business Photo"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 overflow-y-auto flex-1">
          {/* Left Column: Image Display */}
          <div className="md:col-span-7 bg-slate-950/80 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-800 relative">
            <img
              src={item.googleUrl || item.thumbnailUrl}
              alt="Google Business Media"
              className="max-h-[50vh] w-auto object-contain rounded-xl shadow-lg border border-slate-800"
            />

            {item.googleUrl && (
              <a
                href={item.googleUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
              >
                Open Google-hosted image <ExternalLink className="h-3 w-3" />
              </a>
            )}

            {/* Customer Attribution */}
            {item.attribution && (
              <div className="mt-4 w-full p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                {item.attribution.profilePhotoUrl ? (
                  <img
                    src={item.attribution.profilePhotoUrl}
                    alt="att"
                    className="w-8 h-8 rounded-full border border-slate-700"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-400">Photo Credit:</p>
                  <p className="text-sm font-semibold text-white truncate">
                    {item.attribution.displayName || "Customer"}
                  </p>
                </div>
                {item.attribution.takedownUrl && (
                  <a
                    href={item.attribution.takedownUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-red-400 hover:text-red-300 underline"
                  >
                    Report / Takedown
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Right Column: AI Analysis & Actions */}
          <div className="md:col-span-5 p-6 space-y-5 bg-slate-900 overflow-y-auto">
            {/* Quality Score Card */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-semibold text-slate-400">Codelura Image Quality</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-2xl font-black text-white">{quality}</span>
                    <span className="text-xs text-slate-400">/ 100</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${
                        quality >= 85
                          ? "bg-emerald-500/20 text-emerald-300"
                          : quality >= 70
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {item.qualityStatus || "GOOD"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  <Sparkles className={`h-3.5 w-3.5 ${analyzing ? "animate-spin" : ""}`} />
                  {analyzing ? "Analyzing..." : "Re-Analyze"}
                </button>
              </div>

              {/* Duplicate Warning */}
              {isDuplicate && (
                <div className="mb-3 p-2.5 rounded-lg bg-red-950/40 border border-red-500/30 flex items-start gap-2 text-xs text-red-300">
                  <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Duplicate Upload Detected</p>
                    <p className="text-[11px] text-red-200/80">
                      Identical file hash detected with another media item in this profile.
                    </p>
                  </div>
                </div>
              )}

              {/* AI Criteria Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-700/50">
                  <span className="text-slate-400">Resolution:</span>
                  <span className="text-slate-200 font-medium">
                    {item.dimensions
                      ? `${item.dimensions.widthPixels} × ${item.dimensions.heightPixels} px`
                      : "Standard"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-700/50">
                  <span className="text-slate-400">Date Uploaded:</span>
                  <span className="text-slate-200 font-medium">
                    {item.createTime ? new Date(item.createTime).toLocaleDateString() : "Recent"}
                  </span>
                </div>
                {item.insights?.hasInsights && (
                  <div className="flex justify-between py-1 border-b border-slate-700/50">
                    <span className="text-slate-400">Customer Views:</span>
                    <span className="text-violet-300 font-bold">{item.insights.viewCount.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* AI Positives & Suggestions */}
            {item.aiAnalysis && (
              <div className="space-y-3">
                {item.aiAnalysis.positives?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Strengths
                    </p>
                    <ul className="space-y-1">
                      {item.aiAnalysis.positives.map((p: string, i: number) => (
                        <li key={i} className="text-xs text-slate-300 bg-emerald-950/20 px-2.5 py-1 rounded-md border border-emerald-500/20">
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.aiAnalysis.issues?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" /> Improvements
                    </p>
                    <ul className="space-y-1">
                      {item.aiAnalysis.issues.map((issue: string, i: number) => (
                        <li key={i} className="text-xs text-slate-300 bg-amber-950/20 px-2.5 py-1 rounded-md border border-amber-500/20">
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Actions</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAsCategory("PROFILE")}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
                >
                  Set as Profile Photo
                </button>
                <button
                  type="button"
                  onClick={() => setAsCategory("COVER")}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
                >
                  Set as Cover Photo
                </button>
              </div>

              {/* Delete Button */}
              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="w-full mt-2 px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete from Google Business
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 space-y-2">
                  <p className="text-xs font-bold text-red-200">
                    Are you sure you want to permanently delete this photo from Google Business Profile?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="flex-1 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-xs text-white font-bold transition disabled:opacity-50"
                    >
                      {deleting ? "Deleting..." : "Confirm Delete"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

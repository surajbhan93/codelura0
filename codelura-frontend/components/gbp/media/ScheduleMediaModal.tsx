"use client";
import { useState, useRef } from "react";
import {
  X,
  Calendar,
  Sparkles,
  UploadCloud,
  Image as ImageIcon,
  Loader2,
  Clock,
  Send,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { gbpScheduleMedia, gbpUploadMedia, gbpUploadImage } from "@/lib/gbp/gbpApi";
import toast from "react-hot-toast";

interface ScheduleMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: any;
  onSuccess: () => void;
}

const CATEGORIES = [
  { id: "EXTERIOR", label: "Exterior & Signboard" },
  { id: "INTERIOR", label: "Interior & Workspace" },
  { id: "AT_WORK", label: "At Work & Services" },
  { id: "TEAMS", label: "Team & Staff" },
  { id: "PRODUCT", label: "Products & Materials" },
  { id: "PROFILE", label: "Profile / Logo" },
  { id: "COVER", label: "Cover Banner" },
  { id: "ADDITIONAL", label: "Additional Photo" },
];

export default function ScheduleMediaModal({
  isOpen,
  onClose,
  location,
  onSuccess,
}: ScheduleMediaModalProps) {
  const [sourceType, setSourceType] = useState<"ai" | "upload">("ai");
  const [category, setCategory] = useState("EXTERIOR");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledAt, setScheduledAt] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(11, 0, 0, 0);
    return tomorrow.toISOString().slice(0, 16);
  });
  const [publishImmediately, setPublishImmediately] = useState(false);

  // AI Generation
  const [aiPrompt, setAiPrompt] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [generatingAi, setGeneratingAi] = useState(false);

  // Custom Upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleGenerateAI = () => {
    setGeneratingAi(true);
    try {
      const bName = location?.locationName || "Business";
      const cat = (category || "EXTERIOR").toUpperCase();
      const CATEGORY_SETS: Record<string, string[]> = {
        EXTERIOR: [
          "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1200&auto=format&fit=crop&q=80",
        ],
        INTERIOR: [
          "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=1200&auto=format&fit=crop&q=80",
        ],
        AT_WORK: [
          "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80",
        ],
        TEAMS: [
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&auto=format&fit=crop&q=80",
        ],
        PRODUCT: [
          "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80",
        ],
        PROFILE: [
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
        ],
        COVER: [
          "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80",
        ],
        ADDITIONAL: [
          "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80",
        ],
      };

      const set = CATEGORY_SETS[cat] || CATEGORY_SETS.ADDITIONAL;
      const url = set[Math.floor(Math.random() * set.length)];

      setPreviewUrl(url);
      if (!title) setTitle(`${bName} - ${category.replace("_", " ")}`);
      toast.success("AI Business Photo generated!");
    } catch (err: any) {
      toast.error("Failed to generate AI photo");
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setUploading(true);

    try {
      const uploadRes = await gbpUploadImage(file);
      const uploadedUrl = uploadRes.data?.url || uploadRes.data?.secure_url;
      if (!uploadedUrl) throw new Error("Cloud upload did not return URL");

      setPreviewUrl(uploadedUrl);
      if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ""));
      toast.success("Image uploaded to cloud!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl) {
      toast.error("Please generate an AI photo or upload an image first.");
      return;
    }

    setSubmitting(true);
    try {
      if (publishImmediately) {
        // Direct upload to Google now
        const formData = new FormData();
        formData.append("category", category);
        formData.append("description", description);
        formData.append("title", title);
        formData.append("sourceUrl", previewUrl);

        const res = await gbpUploadMedia(location._id, formData);
        toast.success(res.data.message || "Photo uploaded to Google Business Profile! 🚀");
      } else {
        // Schedule for later
        const res = await gbpScheduleMedia(location._id, {
          sourceUrl: previewUrl,
          category,
          title,
          description,
          scheduledAt: new Date(scheduledAt),
          aiGenerated: sourceType === "ai",
        });
        toast.success(res.data.message || "Photo scheduled successfully in your queue! 📅");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to schedule media");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-gradient-to-r from-purple-500/10 to-amber-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/20">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Schedule Business Photo
              </h2>
              <p className="text-xs text-neutral-400">
                Generate or upload a photo to publish automatically on Google Business Profile
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Source Tabs */}
          <div className="flex rounded-xl bg-neutral-800/80 p-1 border border-neutral-700/60">
            <button
              type="button"
              onClick={() => setSourceType("ai")}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition ${
                sourceType === "ai"
                  ? "bg-amber-500 text-neutral-950 shadow"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              AI Photo Generator
            </button>
            <button
              type="button"
              onClick={() => setSourceType("upload")}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition ${
                sourceType === "upload"
                  ? "bg-purple-500 text-white shadow"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              Upload Custom Image
            </button>
          </div>

          {/* AI Tab Controls */}
          {sourceType === "ai" && (
            <div className="space-y-3 p-4 rounded-xl bg-neutral-800/40 border border-neutral-700/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder={`Describe photo (e.g., "Reception classroom in ${location?.address?.locality || 'Lucknow'}")`}
                  className="flex-1 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={generatingAi}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition flex-shrink-0"
                >
                  {generatingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  Generate AI
                </button>
              </div>
            </div>
          )}

          {/* Upload Tab Controls */}
          {sourceType === "upload" && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-6 rounded-xl border-2 border-dashed border-neutral-700 hover:border-purple-500 bg-neutral-800/30 cursor-pointer text-center space-y-2 transition"
            >
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-10 h-10 mx-auto rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center">
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
              </div>
              <p className="text-xs font-semibold text-white">
                {selectedFile ? selectedFile.name : "Click to select a photo from your computer"}
              </p>
              <p className="text-[11px] text-neutral-400">JPG, PNG, or WEBP up to 10MB</p>
            </div>
          )}

          {/* Image Preview Banner if available */}
          {previewUrl && (
            <div className="relative h-44 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-700">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              <span className="absolute top-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-[10px] font-mono">
                1200 x 800 HD
              </span>
            </div>
          )}

          {/* Category & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-300">GBP Photo Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-xs focus:outline-none focus:border-amber-500 font-medium"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-300">Photo Title / Subject</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Center Main Storefront"
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300">Caption / Description (Optional)</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description for Google Business Profile..."
              className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-xs focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Schedule or Instant Toggle */}
          <div className="p-4 rounded-xl bg-neutral-800/50 border border-neutral-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-white">Publish Timing</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={publishImmediately}
                  onChange={(e) => setPublishImmediately(e.target.checked)}
                  className="rounded border-neutral-700 text-amber-500 focus:ring-0"
                />
                <span className="font-semibold text-amber-400">Upload to Google Now 🚀</span>
              </label>
            </div>

            {!publishImmediately && (
              <div className="space-y-1">
                <label className="text-[11px] text-neutral-400">Scheduled Date & Time</label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-medium hover:bg-neutral-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !previewUrl}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg transition flex items-center gap-2 ${
                publishImmediately
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-neutral-950 shadow-amber-500/20"
                  : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white shadow-purple-500/20"
              }`}
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : publishImmediately ? (
                <Zap className="w-4 h-4" />
              ) : (
                <Calendar className="w-4 h-4" />
              )}
              {publishImmediately ? "Upload to Google Now 🚀" : "Add to Scheduled Queue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

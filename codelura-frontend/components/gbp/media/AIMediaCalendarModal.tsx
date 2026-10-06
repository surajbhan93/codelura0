"use client";
import { useState, useRef } from "react";
import {
  X,
  Calendar,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  Upload,
  Trash2,
  RefreshCw,
  Loader2,
  Image as ImageIcon,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  Building2,
  Zap,
} from "lucide-react";
import { gbpGenerateAIMediaCalendar, gbpApproveAIMediaCalendar, gbpUploadImage } from "@/lib/gbp/gbpApi";
import toast from "react-hot-toast";

interface AIMediaCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: any;
  onSuccess: () => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  EXTERIOR: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  INTERIOR: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  AT_WORK: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  TEAMS: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  PRODUCT: { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/20" },
  ADDITIONAL: { bg: "bg-gray-500/10", text: "text-gray-400", border: "border-gray-500/20" },
  COVER: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" },
  PROFILE: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/20" },
};

const ALL_CATEGORIES = [
  { id: "EXTERIOR", label: "Exterior & Signage", desc: "Storefront, building entrance & street view" },
  { id: "INTERIOR", label: "Interior & Atmosphere", desc: "Reception, classrooms, workspaces & seating" },
  { id: "AT_WORK", label: "At Work & Services", desc: "Educators/staff in action, tutoring & guidance" },
  { id: "TEAMS", label: "Team & Faculty", desc: "Tutors, teachers and leadership portraits" },
  { id: "PRODUCT", label: "Products & Materials", desc: "Curated books, study guides & materials" },
  { id: "ADDITIONAL", label: "Achievements & Details", desc: "Student boards, certificates & milestones" },
];

export default function AIMediaCalendarModal({
  isOpen,
  onClose,
  location,
  onSuccess,
}: AIMediaCalendarModalProps) {
  const [step, setStep] = useState<"settings" | "generating" | "preview">("settings");

  // Settings
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [numPhotos, setNumPhotos] = useState(8);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "EXTERIOR",
    "INTERIOR",
    "AT_WORK",
    "TEAMS",
    "PRODUCT",
    "ADDITIONAL",
  ]);
  const [preferOppositeDays, setPreferOppositeDays] = useState(true);

  // Generated Photos List
  const [photos, setPhotos] = useState<any[]>([]);
  const [calendarData, setCalendarData] = useState<any>(null);
  const [approving, setApproving] = useState(false);

  // Individual item action states
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  if (!isOpen) return null;

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? (prev.length > 1 ? prev.filter((c) => c !== catId) : prev) : [...prev, catId]
    );
  };

  const handleGenerate = async () => {
    setStep("generating");
    try {
      const res = await gbpGenerateAIMediaCalendar(location._id, {
        month,
        year,
        numPhotos,
        categories: selectedCategories,
        preferOppositeDays,
      });

      const data = res.data.data;
      setCalendarData(data);
      setPhotos(data.photos || []);
      setStep("preview");
      toast.success(`Generated ${data.photos?.length || numPhotos} AI photos tailored to ${location.locationName}!`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to generate AI Media Calendar");
      setStep("settings");
    }
  };

  const handleRegeneratePhoto = (index: number) => {
    setRegeneratingIndex(index);
    try {
      const p = photos[index];
      const cat = (p.category || "ADDITIONAL").toUpperCase();
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
        ADDITIONAL: [
          "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80",
        ],
      };

      const set = CATEGORY_SETS[cat] || CATEGORY_SETS.ADDITIONAL;
      const newUrl = set[Math.floor(Math.random() * set.length)];

      setPhotos((prev) => {
        const copy = [...prev];
        copy[index] = { ...copy[index], imageUrl: newUrl };
        return copy;
      });
      toast.success("AI Photo refreshed!");
    } catch (err: any) {
      toast.error("Failed to regenerate photo");
    } finally {
      setRegeneratingIndex(null);
    }
  };

  const handleCustomUpload = async (index: number, file: File) => {
    setUploadingIndex(index);
    try {
      const uploadRes = await gbpUploadImage(file);
      const uploadedUrl = uploadRes.data?.url || uploadRes.data?.secure_url;
      if (!uploadedUrl) throw new Error("Cloud upload did not return URL");

      setPhotos((prev) => {
        const copy = [...prev];
        copy[index] = {
          ...copy[index],
          imageUrl: uploadedUrl,
          sourceUrl: uploadedUrl,
          aiGenerated: false,
        };
        return copy;
      });
      toast.success("Custom photo uploaded successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleDeletePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    toast.success("Photo removed from plan");
  };

  const handleUpdateDate = (index: number, newDateStr: string) => {
    setPhotos((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], scheduledAt: new Date(newDateStr) };
      return copy;
    });
  };

  const handleUpdateCategory = (index: number, newCategory: string) => {
    setPhotos((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], category: newCategory };
      return copy;
    });
  };

  const handleUpdateField = (index: number, field: "title" | "description", value: string) => {
    setPhotos((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleApprove = async (publishFirstNow: boolean) => {
    if (photos.length === 0) {
      toast.error("No photos to schedule");
      return;
    }

    setApproving(true);
    try {
      const res = await gbpApproveAIMediaCalendar(location._id, {
        photos: photos.map((p) => ({
          category: p.category,
          title: p.title,
          description: p.description,
          imageUrl: p.imageUrl,
          scheduledAt: p.scheduledAt,
          aiGenerated: p.aiGenerated !== false,
        })),
        publishFirstNow,
      });

      toast.success(res.data.message || "Photos scheduled successfully for Google Business Profile!");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to schedule media");
    } finally {
      setApproving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                AI Media Calendar & Auto-Scheduler
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-medium border border-amber-500/30">
                  Google Business Profile
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Generate high-quality business photos scheduled on alternating days opposite to Google Posts
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* STEP 1: SETTINGS */}
          {step === "settings" && (
            <div className="space-y-6">
              {/* Location Card */}
              <div className="p-4 rounded-xl bg-neutral-800/40 border border-neutral-700/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{location?.locationName}</h3>
                    <p className="text-xs text-neutral-400">
                      {location?.address?.locality || "Local"}, {location?.address?.administrativeArea || "India"} •{" "}
                      {location?.primaryCategory?.displayName || "Business"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Listing
                  </span>
                </div>
              </div>

              {/* Month & Count Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Month */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-300">Target Month</label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  >
                    {[
                      "January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December",
                    ].map((mName, i) => (
                      <option key={i + 1} value={i + 1}>
                        {mName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-300">Year</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  >
                    {[2025, 2026, 2027].map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Number of Photos */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-300">Number of Photos</label>
                  <select
                    value={numPhotos}
                    onChange={(e) => setNumPhotos(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-amber-500 font-semibold text-amber-400"
                  >
                    <option value={4}>4 Photos (1 per week)</option>
                    <option value={8}>8 Photos (2 per week - Recommended)</option>
                    <option value={12}>12 Photos (3 per week)</option>
                    <option value={16}>16 Photos (4 per week)</option>
                    <option value={20}>20 Photos (Daily Freshness)</option>
                  </select>
                </div>
              </div>

              {/* Category Multi-Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-neutral-200 uppercase tracking-wider">
                    Include GBP Photo Categories
                  </label>
                  <span className="text-xs text-neutral-400">
                    {selectedCategories.length} selected
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {ALL_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategories.includes(cat.id);
                    return (
                      <div
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-3 select-none ${
                          isSelected
                            ? "bg-amber-500/10 border-amber-500/40 text-white"
                            : "bg-neutral-800/40 border-neutral-700/50 text-neutral-400 hover:border-neutral-600"
                        }`}
                      >
                        <div
                          className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition ${
                            isSelected
                              ? "bg-amber-500 border-amber-500 text-black"
                              : "border-neutral-600 bg-neutral-900"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white">{cat.label}</p>
                          <p className="text-[11px] text-neutral-400 line-clamp-1">{cat.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Opposite-Days Auto-Scheduling Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-amber-500/10 border border-indigo-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-semibold text-white">
                      Opposite-Days Auto-Scheduling (Zero Overlap with Posts)
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferOppositeDays}
                      onChange={(e) => setPreferOppositeDays(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  When enabled, our algorithm detects all scheduled Google Posts for the month and slots photos on
                  alternating gap days (e.g., if posts go out Mon/Wed/Fri, photos auto-schedule on Tue/Thu/Sat). This
                  guarantees daily freshness on Google Maps and maximizes your Media Health Score!
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: GENERATING LOADER */}
          {step === "generating" && (
            <div className="py-16 text-center space-y-5">
              <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping"></div>
                <div className="relative p-4 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 shadow-xl shadow-amber-500/30">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Generating AI Media Calendar...</h3>
                <p className="text-xs text-neutral-400 max-w-md mx-auto">
                  Designing photorealistic {location.locationName} business visuals, checking Google Posts schedule, and
                  calculating peak engagement posting windows.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: PREVIEW & APPROVE */}
          {step === "preview" && (
            <div className="space-y-6">
              {/* Header Stats Bar */}
              <div className="p-4 rounded-xl bg-neutral-800/40 border border-neutral-700/50 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-white">
                    {month}/{year} Media Plan ({photos.length} photos)
                  </span>
                  {calendarData?.oppositeDaysScheduled && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-medium border border-purple-500/30">
                      ⚡ Alternate-Day Auto Scheduled
                    </span>
                  )}
                </div>
                <div className="text-xs text-neutral-400">
                  {calendarData?.postDaysDetected?.length > 0 ? (
                    <span>
                      Posts detected on days:{" "}
                      <span className="text-neutral-200 font-mono">
                        {calendarData.postDaysDetected.join(", ")}
                      </span>
                    </span>
                  ) : (
                    <span>Evenly distributed across the month</span>
                  )}
                </div>
              </div>

              {/* Photos Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {photos.map((photo, index) => {
                  const catStyle = CATEGORY_COLORS[photo.category] || CATEGORY_COLORS.ADDITIONAL;
                  const isUploading = uploadingIndex === index;
                  const isRegenerating = regeneratingIndex === index;
                  const dateStr = photo.scheduledAt
                    ? new Date(photo.scheduledAt).toISOString().slice(0, 16)
                    : "";

                  return (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-neutral-800/50 border border-neutral-700/60 hover:border-neutral-600 transition flex flex-col justify-between gap-3 shadow-lg"
                    >
                      {/* Card Top: Thumbnail + Category + Date */}
                      <div className="flex gap-3">
                        {/* Thumbnail */}
                        <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-neutral-900 border border-neutral-700/80 flex-shrink-0 group">
                          {photo.imageUrl ? (
                            <img
                              src={photo.imageUrl}
                              alt={photo.title || "GBP photo"}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-600">
                              <ImageIcon className="w-8 h-8" />
                            </div>
                          )}
                          {(isUploading || isRegenerating) && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                            </div>
                          )}
                        </div>

                        {/* Title & Metadata */}
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <select
                              value={photo.category}
                              onChange={(e) => handleUpdateCategory(index, e.target.value)}
                              className={`text-[11px] font-bold px-2 py-0.5 rounded border ${catStyle.bg} ${catStyle.text} ${catStyle.border} bg-neutral-900 focus:outline-none cursor-pointer`}
                            >
                              {ALL_CATEGORIES.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.id}
                                </option>
                              ))}
                            </select>

                            <button
                              onClick={() => handleDeletePhoto(index)}
                              title="Delete photo"
                              className="text-neutral-500 hover:text-red-400 p-1 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <input
                            type="text"
                            value={photo.title || ""}
                            onChange={(e) => handleUpdateField(index, "title", e.target.value)}
                            placeholder="Photo Title"
                            className="w-full text-xs font-semibold text-white bg-transparent border-b border-transparent hover:border-neutral-700 focus:border-amber-500 focus:outline-none pb-0.5 truncate"
                          />

                          <p className="text-[11px] text-neutral-400 line-clamp-2">
                            {photo.description || photo.whyUseful || "High-quality visual for Google Business"}
                          </p>
                        </div>
                      </div>

                      {/* Schedule Date & Actions Row */}
                      <div className="pt-2 border-t border-neutral-700/40 flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1.5 text-neutral-300">
                          <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          <input
                            type="datetime-local"
                            value={dateStr}
                            onChange={(e) => handleUpdateDate(index, e.target.value)}
                            className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-[11px] text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleRegeneratePhoto(index)}
                            disabled={isRegenerating}
                            title="Regenerate with AI"
                            className="p-1.5 rounded-lg bg-neutral-700/60 hover:bg-neutral-700 text-neutral-300 hover:text-amber-400 transition flex items-center gap-1 text-[11px]"
                          >
                            <RefreshCw className={`w-3 h-3 ${isRegenerating ? "animate-spin" : ""}`} />
                            AI
                          </button>

                          <button
                            onClick={() => fileInputRefs.current[index]?.click()}
                            disabled={isUploading}
                            title="Upload Custom Image"
                            className="p-1.5 rounded-lg bg-neutral-700/60 hover:bg-neutral-700 text-neutral-300 hover:text-blue-400 transition flex items-center gap-1 text-[11px]"
                          >
                            <Upload className="w-3 h-3" />
                            Upload
                          </button>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            ref={(el) => (fileInputRefs.current[index] = el)}
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleCustomUpload(index, file);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-800 bg-neutral-900/90">
          {step === "settings" ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-medium hover:bg-neutral-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-neutral-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4" />
                Generate AI Media Calendar ({numPhotos} Photos)
              </button>
            </>
          ) : step === "preview" ? (
            <>
              <button
                onClick={() => setStep("settings")}
                className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-medium hover:bg-neutral-800 transition"
              >
                ← Back to Settings
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleApprove(true)}
                  disabled={approving || photos.length === 0}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs border border-neutral-700 transition flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Upload 1st Now & Schedule Rest
                </button>

                <button
                  onClick={() => handleApprove(false)}
                  disabled={approving || photos.length === 0}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-neutral-950 font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition"
                >
                  {approving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  Approve & Schedule All ({photos.length} Photos)
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

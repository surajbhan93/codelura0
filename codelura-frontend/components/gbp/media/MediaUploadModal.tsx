"use client";
import { useState, useRef } from "react";
import { X, UploadCloud, Image as ImageIcon, Sparkles, CheckCircle2, AlertCircle, Trash2, ArrowRight } from "lucide-react";
import { gbpUploadMedia } from "@/lib/gbp/gbpApi";
import toast from "react-hot-toast";

interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: any;
  onSuccess: () => void;
  defaultCategory?: string;
}

const CATEGORIES = [
  { id: "PROFILE", label: "Profile Photo / Logo", desc: "Square logo or official identity (min 250x250px)" },
  { id: "COVER", label: "Cover Photo", desc: "Primary 16:9 banner displayed at top of listing" },
  { id: "EXTERIOR", label: "Exterior", desc: "Storefront, building entrance, street view & signage" },
  { id: "INTERIOR", label: "Interior", desc: "Reception, study rooms, classrooms, seating & decor" },
  { id: "TEAMS", label: "Team & Staff", desc: "Educators, tutors, founders & key personnel portraits" },
  { id: "AT_WORK", label: "At Work & Services", desc: "Live tutoring, consulting, teaching & customer service" },
  { id: "PRODUCT", label: "Products / Materials", desc: "Curated study modules, books, gear or products" },
  { id: "FOOD_AND_DRINK", label: "Food & Drink", desc: "Dishes, beverages & menu specials" },
  { id: "COMMON_AREA", label: "Common Area", desc: "Lounges, waiting areas, libraries & shared spaces" },
  { id: "ADDITIONAL", label: "Additional / General", desc: "General authentic photos highlighting your business" },
];

export default function MediaUploadModal({ isOpen, onClose, location, onSuccess, defaultCategory = "ADDITIONAL" }: MediaUploadModalProps) {
  const [category, setCategory] = useState(defaultCategory);
  const [description, setDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<Array<{ file: File; preview: string; width?: number; height?: number }>>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const validFiles: Array<{ file: File; preview: string; width?: number; height?: number }> = [];

    Array.from(files).forEach((file) => {
      // Validate format
      if (!["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type)) {
        toast.error(`${file.name}: Only JPG, PNG, and WEBP formats are supported by Google.`);
        return;
      }
      // Validate size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name}: File size exceeds Google limit of 10MB.`);
        return;
      }

      const preview = URL.createObjectURL(file);
      const img = new Image();
      img.src = preview;
      img.onload = () => {
        setSelectedFiles((prev) => [
          ...prev,
          { file, preview, width: img.naturalWidth, height: img.naturalHeight },
        ]);
      };
    });
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const suggestDescription = () => {
    const locName = location?.locationName || "our center";
    const catLabel = CATEGORIES.find((c) => c.id === category)?.label || "Services";
    setDescription(`${catLabel} at ${locName} - Providing dedicated quality support for our local community.`);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one photo to upload.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("category", category);
      if (description) formData.append("description", description);

      selectedFiles.forEach((item) => {
        formData.append("files", item.file);
      });

      const res = await gbpUploadMedia(location._id, formData);
      toast.success(res.data.message || "Photos uploaded successfully!");
      onSuccess();
      onClose();
      setSelectedFiles([]);
      setDescription("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to upload photos to Google Business Profile.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl shadow-2xl my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <UploadCloud className="h-6 w-6 text-violet-400" />
              Upload Photos to Google
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Publishing to: <span className="text-violet-300 font-semibold">{location?.locationName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Category Picker */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              1. Choose Photo Category
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`flex flex-col text-left p-3 rounded-xl border transition ${
                    category === cat.id
                      ? "bg-violet-600/15 border-violet-500 shadow-sm shadow-violet-500/10"
                      : "bg-slate-800/60 border-slate-700/70 hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold ${category === cat.id ? "text-violet-300" : "text-white"}`}>
                      {cat.label}
                    </span>
                    {category === cat.id && <CheckCircle2 className="h-4 w-4 text-violet-400" />}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 line-clamp-1">{cat.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Drag & Drop Zone */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              2. Select or Drop Photos
            </label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center ${
                dragActive
                  ? "border-violet-500 bg-violet-600/10"
                  : "border-slate-700 bg-slate-900/60 hover:border-violet-500/50 hover:bg-slate-800/40"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/jpg"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mb-3">
                <ImageIcon className="h-6 w-6 text-violet-400" />
              </div>
              <p className="text-sm font-semibold text-white">Click to browse or drag & drop photos here</p>
              <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WEBP up to 10MB each (min 250×250px)</p>
            </div>
          </div>

          {/* Selected Previews */}
          {selectedFiles.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Selected Photos ({selectedFiles.length})
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedFiles([])}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {selectedFiles.map((item, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-800">
                    <img src={item.preview} alt="preview" className="w-full h-24 object-cover" />
                    <div className="p-2 text-[10px] text-slate-300 truncate">
                      <p className="font-medium truncate">{item.file.name}</p>
                      <p className="text-slate-400">
                        {(item.file.size / 1024).toFixed(0)} KB {item.width ? `• ${item.width}×${item.height}px` : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-red-600/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description & AI Helper */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                3. Photo Description (Optional)
              </label>
              <button
                type="button"
                onClick={suggestDescription}
                className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
              >
                <Sparkles className="h-3.5 w-3.5" /> Suggest with AI
              </button>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Dedicated tutoring session preparing students for high school exams..."
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-800 bg-slate-900/80">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-violet-600/20"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading to Google...
              </>
            ) : (
              <>
                <UploadCloud className="h-4 w-4" />
                Publish {selectedFiles.length > 0 ? `${selectedFiles.length} Photo(s)` : ""}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

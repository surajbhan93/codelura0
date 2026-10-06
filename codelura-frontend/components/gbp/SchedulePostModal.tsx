"use client";
import { useState, useRef } from "react";
import { X, Calendar, Clock, Image as ImageIcon, Link as LinkIcon, Sparkles, Upload, Trash2, RefreshCw, Loader2 } from "lucide-react";
import { gbpCreatePost, gbpAIPost, gbpAIGenerateImage, gbpUploadImage } from "@/lib/gbp/gbpApi";
import toast from "react-hot-toast";

interface SchedulePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: any;
  onSuccess: () => void;
}

export default function SchedulePostModal({ isOpen, onClose, location, onSuccess }: SchedulePostModalProps) {
  const [postType, setPostType] = useState<"STANDARD" | "EVENT" | "OFFER">("STANDARD");
  const [summary, setSummary] = useState("");
  const [publishType, setPublishType] = useState<"now" | "schedule">("schedule");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("10:00");
  const [imageUrl, setImageUrl] = useState("");
  const [ctaType, setCtaType] = useState("LEARN_MORE");
  const [ctaUrl, setCtaUrl] = useState(location?.websiteUri || "");
  
  // Event fields
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventStartTime, setEventStartTime] = useState("10:00");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventEndTime, setEventEndTime] = useState("17:00");
  
  // Offer fields
  const [offerTitle, setOfferTitle] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [redeemUrl, setRedeemUrl] = useState("");
  const [termsConditions, setTermsConditions] = useState("");
  
  const [aiLoading, setAiLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAIGenerate = async () => {
    if (!summary.trim()) {
      toast.error("Please enter a topic or description first");
      return;
    }
    
    setAiLoading(true);
    try {
      const res = await gbpAIPost({
        businessName: location.locationName,
        category: location.primaryCategory?.displayName || "Business",
        city: location.address?.locality || "",
        topic: summary,
        tone: "professional",
      });
      
      const data = res.data.data;
      if (data.post) setSummary(data.post);
      if (data.imageUrl) setImageUrl(data.imageUrl);
      
      toast.success("AI generated content and banner image!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "AI generation failed");
    } finally {
      setAiLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file size must be less than 10MB");
      return;
    }
    
    setImageLoading(true);
    const toastId = toast.loading("Uploading image to Cloudinary...");
    try {
      const res = await gbpUploadImage(file);
      const uploadedUrl = res.data?.url || res.data?.secure_url;
      if (uploadedUrl) {
        setImageUrl(uploadedUrl);
        toast.success("Image uploaded successfully! 📸", { id: toastId });
      } else {
        toast.error("Upload succeeded but no image URL was returned", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.response?.data?.error || "Image upload failed", { id: toastId });
    } finally {
      setImageLoading(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleGenerateAIImage = async () => {
    const topic = summary.trim() || location?.primaryCategory?.displayName || "Business Services";
    setImageLoading(true);
    const toastId = toast.loading("Generating attractive AI banner image...");
    try {
      const res = await gbpAIGenerateImage({
        topic,
        category: location?.primaryCategory?.displayName || "Business",
        city: location?.address?.locality || "",
        businessName: location?.locationName || "",
      });
      if (res.data?.data?.imageUrl) {
        setImageUrl(res.data.data.imageUrl);
        toast.success("AI image generated! ✨", { id: toastId });
      }
    } catch (err: any) {
      toast.error("Failed to generate AI image", { id: toastId });
    } finally {
      setImageLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!summary.trim() || summary.length < 10) {
      toast.error("Post content must be at least 10 characters");
      return;
    }
    
    if (publishType === "schedule" && !scheduleDate) {
      toast.error("Please select a schedule date");
      return;
    }
    
    // Validate event dates
    if (postType === "EVENT") {
      if (!eventTitle || !eventStartDate || !eventEndDate) {
        toast.error("Please fill all event fields");
        return;
      }
      const start = new Date(`${eventStartDate}T${eventStartTime}`);
      const end = new Date(`${eventEndDate}T${eventEndTime}`);
      if (end <= start) {
        toast.error("Event end time must be after start time");
        return;
      }
    }
    
    setSubmitting(true);
    try {
      const postData: any = {
        topicType: postType,
        summary: summary.trim(),
        callToAction: ctaUrl ? { actionType: ctaType, url: ctaUrl } : undefined,
        media: imageUrl ? [{ mediaFormat: "PHOTO", sourceUrl: imageUrl }] : [],
      };
      
      if (publishType === "schedule") {
        postData.scheduledAt = new Date(`${scheduleDate}T${scheduleTime}:00`).toISOString();
      } else {
        postData.status = "scheduled"; // Will be published immediately by backend
        postData.scheduledAt = new Date().toISOString();
      }
      
      if (postType === "EVENT") {
        postData.event = {
          title: eventTitle,
          schedule: {
            startDate: { year: parseInt(eventStartDate.split('-')[0]), month: parseInt(eventStartDate.split('-')[1]), day: parseInt(eventStartDate.split('-')[2]) },
            startTime: { hours: parseInt(eventStartTime.split(':')[0]), minutes: parseInt(eventStartTime.split(':')[1]) },
            endDate: { year: parseInt(eventEndDate.split('-')[0]), month: parseInt(eventEndDate.split('-')[1]), day: parseInt(eventEndDate.split('-')[2]) },
            endTime: { hours: parseInt(eventEndTime.split(':')[0]), minutes: parseInt(eventEndTime.split(':')[1]) },
          },
        };
      }
      
      if (postType === "OFFER") {
        postData.offer = {
          couponCode: couponCode || undefined,
          redeemOnlineUrl: redeemUrl || ctaUrl || undefined,
          termsConditions: termsConditions || undefined,
        };
      }
      
      await gbpCreatePost(location._id, postData);
      
      toast.success(publishType === "now" ? "Post publishing..." : "Post scheduled successfully!");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const ctaOptions = [
    { value: "LEARN_MORE", label: "Learn More" },
    { value: "SIGN_UP", label: "Sign Up" },
    { value: "CALL", label: "Call" },
    { value: "BOOK", label: "Book" },
    { value: "ORDER", label: "Order" },
    { value: "SHOP", label: "Shop" },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl shadow-2xl my-8">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-violet-400" />
                Schedule Google Post
              </h3>
              <p className="text-sm text-slate-400 mt-0.5">
                {location?.locationName}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            {/* Post Type */}
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">
                Post Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["STANDARD", "EVENT", "OFFER"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPostType(type as any)}
                    className={`px-4 py-2.5 rounded-xl border font-medium text-sm transition ${
                      postType === type
                        ? "bg-violet-600 border-violet-500 text-white"
                        : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Generator */}
            <div className="rounded-xl border border-violet-500/30 bg-violet-950/20 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-violet-300 flex items-center gap-1.5 mb-2">
                    <Sparkles className="h-3.5 w-3.5" /> AI Content Generator
                  </label>
                  <input
                    type="text"
                    placeholder="Enter topic (e.g., 'Special Offer on JEE Classes')"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAIGenerate}
                  disabled={aiLoading || !summary.trim()}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mt-6"
                >
                  {aiLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Event-specific fields */}
            {postType === "EVENT" && (
              <div className="space-y-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <h4 className="text-sm font-semibold text-blue-300">Event Details</h4>
                
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1 block">Event Title</label>
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="e.g., Free JEE Foundation Workshop"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1 block">Start Date</label>
                    <input
                      type="date"
                      value={eventStartDate}
                      onChange={(e) => setEventStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1 block">Start Time</label>
                    <input
                      type="time"
                      value={eventStartTime}
                      onChange={(e) => setEventStartTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1 block">End Date</label>
                    <input
                      type="date"
                      value={eventEndDate}
                      onChange={(e) => setEventEndDate(e.target.value)}
                      min={eventStartDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1 block">End Time</label>
                    <input
                      type="time"
                      value={eventEndTime}
                      onChange={(e) => setEventEndTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Offer-specific fields */}
            {postType === "OFFER" && (
              <div className="space-y-3 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                <h4 className="text-sm font-semibold text-orange-300">Offer Details</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1 block">Coupon Code</label>
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="e.g., SAVE20"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1 block">Redeem URL</label>
                    <input
                      type="url"
                      value={redeemUrl}
                      onChange={(e) => setRedeemUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1 block">Terms & Conditions</label>
                  <textarea
                    value={termsConditions}
                    onChange={(e) => setTermsConditions(e.target.value)}
                    placeholder="Offer valid until..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500 resize-none"
                  />
                </div>
              </div>
            )}

            {/* Content */}
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">
                Post Content {summary.length > 0 && <span className="text-xs text-slate-500">({summary.length}/1500)</span>}
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Write your post content here... (10-1500 characters)"
                rows={6}
                maxLength={1500}
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500 resize-none"
              />
            </div>

            {/* Image Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-violet-400" />
                  Post Image (Recommended for Google SEO)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/png,image/jpeg,image/webp,image/jpg"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imageLoading}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition flex items-center gap-1.5 border border-slate-700"
                  >
                    <Upload className="h-3.5 w-3.5 text-violet-400" />
                    Upload Image
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerateAIImage}
                    disabled={imageLoading}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
                  >
                    {imageLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                    Generate AI Image
                  </button>
                </div>
              </div>

              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Or paste direct image URL (https://...)"
                className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-violet-500 mb-2"
              />

              {imageUrl ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 group max-h-52">
                  <img
                    src={imageUrl}
                    alt="Post Preview"
                    className="w-full h-48 object-cover transition duration-300 group-hover:scale-[1.02]"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-3">
                    <span className="text-xs text-white/90 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm truncate max-w-[70%]">
                      {imageUrl}
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={handleGenerateAIImage}
                        className="p-1.5 rounded-lg bg-violet-600/80 hover:bg-violet-600 text-white transition backdrop-blur-sm"
                        title="Regenerate AI image"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageUrl("")}
                        className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition backdrop-blur-sm"
                        title="Remove image"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-violet-500/50 rounded-xl p-6 text-center cursor-pointer transition bg-slate-900/30 hover:bg-violet-950/10"
                >
                  <ImageIcon className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-xs text-slate-300 font-medium">Click to upload an image, or click "Generate AI Image"</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Supports PNG, JPG, WEBP (Max 10MB)</p>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-slate-300 mb-2 block">Call to Action</label>
                <select
                  value={ctaType}
                  onChange={(e) => setCtaType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                >
                  {ctaOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-300 mb-2 block flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 text-violet-400" />
                  CTA URL
                </label>
                <input
                  type="url"
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            {/* Schedule */}
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">Publish</label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setPublishType("now")}
                  className={`px-4 py-2.5 rounded-xl border font-medium text-sm transition ${
                    publishType === "now"
                      ? "bg-green-600 border-green-500 text-white"
                      : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600"
                  }`}
                >
                  Publish Now
                </button>
                <button
                  type="button"
                  onClick={() => setPublishType("schedule")}
                  className={`px-4 py-2.5 rounded-xl border font-medium text-sm transition ${
                    publishType === "schedule"
                      ? "bg-violet-600 border-violet-500 text-white"
                      : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600"
                  }`}
                >
                  Schedule
                </button>
              </div>

              {publishType === "schedule" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1 block flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Date
                    </label>
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1 block flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Time (IST)
                    </label>
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !summary.trim() || summary.length < 10}
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {publishType === "now" ? "Publishing..." : "Scheduling..."}
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4" />
                  {publishType === "now" ? "Publish Now" : "Schedule Post"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

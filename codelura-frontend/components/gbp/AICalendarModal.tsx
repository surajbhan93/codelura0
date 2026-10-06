"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { X, Calendar, Sparkles, TrendingUp, CheckCircle2, AlertCircle, Info, Upload, Trash2, RefreshCw, Loader2, Image as ImageIcon, Edit3, Check } from "lucide-react";
import { gbpGenerateKeywordCalendar, gbpGetKeywords, gbpCreatePost, gbpAIGenerateImage, gbpUploadImage } from "@/lib/gbp/gbpApi";
import toast from "react-hot-toast";

interface AICalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: any;
  onSuccess: () => void;
}

export default function AICalendarModal({ isOpen, onClose, location, onSuccess }: AICalendarModalProps) {
  const [step, setStep] = useState<"settings" | "generating" | "preview">("settings");
  
  // Settings
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [numPosts, setNumPosts] = useState(12);
  const [autoSchedule, setAutoSchedule] = useState(true);
  const [primaryGoal, setPrimaryGoal] = useState("LOCAL_VISIBILITY");
  const [contentLanguage, setContentLanguage] = useState("english");
  
  // Generated data
  const [calendar, setCalendar] = useState<any>(null);
  const [keywordStats, setKeywordStats] = useState<any>(null);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [approving, setApproving] = useState(false);

  // Edit and Image Upload States
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editSummary, setEditSummary] = useState("");
  const [editDate, setEditDate] = useState("");
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
  
  // Check keyword availability
  const checkKeywordAvailability = useCallback(async () => {
    try {
      // Format month as YYYY-MM for backend
      const monthStr = `${year}-${String(month).padStart(2, '0')}`;
      
      const res = await gbpGetKeywords(location._id, { month: monthStr, limit: 100 });
      // Backend returns { success, data: keywords[], count, source }
      const keywords = res.data.data || [];
      
      console.log('[AI Calendar] Keyword availability check - Location:', location._id, 'Month:', monthStr, 'Count:', keywords.length);
      
      // Sort by threshold (search volume) descending and take top 10
      const topKeywords = keywords
        .sort((a: any, b: any) => {
          const thresholdA = parseInt(a.insightsValue?.threshold || "0");
          const thresholdB = parseInt(b.insightsValue?.threshold || "0");
          return thresholdB - thresholdA;
        })
        .slice(0, 10);
      
      setKeywordStats({
        available: keywords.length > 0,
        count: keywords.length,
        topKeywords: topKeywords,
      });
    } catch (err) {
      console.error('[AI Calendar] Error checking keyword availability:', err);
      setKeywordStats({ available: false, count: 0, topKeywords: [] });
    }
  }, [location, month, year]);
  
  useEffect(() => {
    if (isOpen && location) {
      checkKeywordAvailability();
    }
  }, [isOpen, location, checkKeywordAvailability]);
  
  const handleGenerate = async () => {
    setStep("generating");
    
    try {
      const res = await gbpGenerateKeywordCalendar({
        locationId: location._id,
        month,
        year,
        numPosts,
        autoSchedule,
        contentLanguage,
        primaryGoal,
      });
      
      setCalendar(res.data.data);
      setSelectedPosts(res.data.data.posts.map((_: any, i: number) => `post-${i}`));
      setStep("preview");
      
      toast.success(res.data.message || "AI Calendar generated with high quality images!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to generate AI calendar");
      setStep("settings");
    }
  };

  const handlePostFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file size must be less than 10MB");
      return;
    }

    setUploadingIndex(index);
    const toastId = toast.loading("Uploading image to Cloudinary...");
    try {
      const res = await gbpUploadImage(file);
      const url = res.data?.url || res.data?.secure_url;
      if (url) {
        setCalendar((prev: any) => {
          const newPosts = [...prev.posts];
          newPosts[index] = { ...newPosts[index], imageUrl: url };
          return { ...prev, posts: newPosts };
        });
        toast.success("Image uploaded for post!", { id: toastId });
      }
    } catch (err: any) {
      toast.error("Failed to upload image", { id: toastId });
    } finally {
      setUploadingIndex(null);
      if (e.target) e.target.value = "";
    }
  };

  const handleRegeneratePostImage = async (index: number) => {
    const post = calendar?.posts?.[index];
    if (!post) return;

    setRegeneratingIndex(index);
    const toastId = toast.loading("Generating fresh AI banner image...");
    try {
      const res = await gbpAIGenerateImage({
        topic: post.topic || post.primaryKeyword,
        category: location?.primaryCategory?.displayName || "Business",
        city: post.location || location?.address?.locality || "",
        businessName: location?.locationName || "",
      });
      const url = res.data?.data?.imageUrl;
      if (url) {
        setCalendar((prev: any) => {
          const newPosts = [...prev.posts];
          newPosts[index] = { ...newPosts[index], imageUrl: url };
          return { ...prev, posts: newPosts };
        });
        toast.success("New AI banner generated! ✨", { id: toastId });
      }
    } catch (err: any) {
      toast.error("Failed to generate image", { id: toastId });
    } finally {
      setRegeneratingIndex(null);
    }
  };

  const handleRemovePostImage = (index: number) => {
    setCalendar((prev: any) => {
      const newPosts = [...prev.posts];
      newPosts[index] = { ...newPosts[index], imageUrl: null };
      return { ...prev, posts: newPosts };
    });
    toast.success("Image removed");
  };

  const handleStartEdit = (index: number) => {
    const post = calendar?.posts?.[index];
    if (!post) return;
    setEditingIndex(index);
    setEditSummary(post.summary || "");
    setEditDate(post.suggestedDate ? new Date(post.suggestedDate).toISOString().split("T")[0] : "");
  };

  const handleSaveEdit = (index: number) => {
    setCalendar((prev: any) => {
      const newPosts = [...prev.posts];
      newPosts[index] = {
        ...newPosts[index],
        summary: editSummary.trim(),
        suggestedDate: editDate ? new Date(editDate + "T10:00:00").toISOString() : newPosts[index].suggestedDate,
      };
      return { ...prev, posts: newPosts };
    });
    setEditingIndex(null);
    toast.success("Post updated!");
  };

  const handleSelectAll = () => {
    if (selectedPosts.length === calendar?.posts?.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(calendar.posts.map((_: any, i: number) => `post-${i}`));
    }
  };
  
  const handleApprove = async () => {
    if (selectedPosts.length === 0) {
      toast.error("Please select at least one post to approve");
      return;
    }
    
    setApproving(true);
    
    try {
      const postsToCreate = calendar.posts.filter((_: any, i: number) => 
        selectedPosts.includes(`post-${i}`)
      );
      
      let created = 0;
      for (const post of postsToCreate) {
        try {
          await gbpCreatePost(location._id, {
            topicType: "STANDARD",
            summary: post.summary,
            scheduledAt: post.suggestedDate || undefined,
            status: post.suggestedDate ? "scheduled" : "draft",
            aiGenerated: true,
            primaryKeyword: post.primaryKeyword,
            searchIntent: post.searchIntent,
            contentType: post.contentType,
            media: post.imageUrl ? [{ mediaFormat: "PHOTO", sourceUrl: post.imageUrl }] : [],
          });
          created++;
        } catch (err) {
          console.error("Failed to create post:", err);
        }
      }
      
      toast.success(`${created} post(s) added to scheduler! 🚀`);
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error("Failed to approve calendar");
    } finally {
      setApproving(false);
    }
  };
  
  const togglePostSelection = (postId: string) => {
    setSelectedPosts(prev =>
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };
  
  if (!isOpen) return null;
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-400" />
              Keyword-Driven AI Calendar
            </h3>
            <p className="text-sm text-slate-400 mt-0.5">
              {location?.locationName}
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
        {step === "settings" && (
          <div className="p-6 space-y-5">
            {/* Keyword Availability Notice */}
            {keywordStats && !keywordStats.available && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-amber-300 mb-1">Smart Industry Keywords Mode</h4>
                    <p className="text-xs text-amber-200/80">
                      No Google search keywords synced for this month yet. The AI Calendar will use intelligent localized keywords tailored to {location?.locationName || "your business"} and your primary categories.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Keyword Info */}
            {keywordStats && keywordStats.available && (
              <div className="rounded-xl border border-violet-500/30 bg-violet-950/20 p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-violet-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-violet-300 mb-2">Using Real Google Search Data</h4>
                    <p className="text-xs text-violet-200/80 mb-3">
                      This calendar will be created based on actual customer search queries for {location?.locationName}. Total keywords available: {keywordStats.count}
                    </p>
                    {keywordStats.topKeywords && keywordStats.topKeywords.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-violet-300 mb-2">Top Search Keywords:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {keywordStats.topKeywords.map((kw: any, i: number) => (
                            <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                              <span className="text-xs text-violet-200 font-medium truncate flex-1">
                                {kw.searchKeyword || "—"}
                              </span>
                              <span className="text-xs text-violet-400 ml-2 flex-shrink-0">
                                {kw.insightsValue?.threshold ? `${kw.insightsValue.threshold}+` : "0"} searches
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Month & Year */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-slate-300 mb-2 block">Month</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                >
                  {monthNames.map((m, i) => (
                    <option key={i} value={i + 1}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-300 mb-2 block">Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                >
                  <option value={2024}>2024</option>
                  <option value={2025}>2025</option>
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                </select>
              </div>
            </div>
            
            {/* Number of Posts */}
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">Number of Posts</label>
              <div className="grid grid-cols-4 gap-2">
                {[8, 12, 16, 20].map(n => (
                  <button
                    key={n}
                    onClick={() => setNumPosts(n)}
                    className={`px-4 py-2.5 rounded-lg border font-medium text-sm transition ${
                      numPosts === n
                        ? "bg-violet-600 border-violet-500 text-white"
                        : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600"
                    }`}
                  >
                    {n} posts
                  </button>
                ))}
              </div>
            </div>
            
            {/* Primary Goal */}
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">Primary Goal</label>
              <select
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
              >
                <option value="LOCAL_VISIBILITY">Local Visibility</option>
                <option value="LEADS">Lead Generation</option>
                <option value="BRAND_AWARENESS">Brand Awareness</option>
                <option value="EDUCATION">Education & Information</option>
                <option value="MIXED">Mixed Strategy</option>
              </select>
            </div>
            
            {/* Content Language */}
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">Content Language</label>
              <select
                value={contentLanguage}
                onChange={(e) => setContentLanguage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
              >
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="hinglish">Hinglish (Mix)</option>
              </select>
            </div>
            
            {/* Auto Schedule */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800 border border-slate-700">
              <div>
                <label className="text-sm font-semibold text-slate-300 block">Automatic Scheduling</label>
                <p className="text-xs text-slate-500 mt-0.5">Generate suggested posting dates</p>
              </div>
              <button
                onClick={() => setAutoSchedule(!autoSchedule)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  autoSchedule ? "bg-violet-600" : "bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    autoSchedule ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {step === "generating" && (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mb-6" />
            <h3 className="text-lg font-bold text-white mb-2">Analyzing Keywords & Generating Calendar...</h3>
            <p className="text-sm text-slate-400 max-w-md">
              Fetching real Google search data, analyzing search intent, and creating keyword-driven content topics.
            </p>
          </div>
        )}

        {step === "preview" && calendar && (
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Summary Stats & Action Toolbar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="rounded-xl bg-violet-500/10 border border-violet-500/20 p-3">
                <p className="text-xs text-violet-300 mb-1">Calendar Generated</p>
                <p className="text-xl font-bold text-white">{calendar.posts.length} Posts</p>
              </div>
              <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-3">
                <p className="text-xs text-green-300 mb-1">Keywords Targeted</p>
                <p className="text-xl font-bold text-white">{calendar.keywordCoverage.totalUsed}</p>
              </div>
              <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-3">
                <p className="text-xs text-blue-300 mb-1">AI Banner Images</p>
                <p className="text-xl font-bold text-white">{calendar.posts.filter((p: any) => !!p.imageUrl).length} / {calendar.posts.length}</p>
              </div>
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="w-full h-full min-h-[50px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
                >
                  {selectedPosts.length === calendar.posts.length ? "Deselect All" : "Select All Posts"}
                </button>
              </div>
            </div>
            
            {/* Calendar Posts */}
            <div className="space-y-3">
              {calendar.posts.map((post: any, index: number) => {
                const postId = `post-${index}`;
                const isSelected = selectedPosts.includes(postId);
                const isEditing = editingIndex === index;
                const isUploading = uploadingIndex === index;
                const isRegenerating = regeneratingIndex === index;
                
                return (
                  <div
                    key={index}
                    className={`rounded-2xl border p-4 transition ${
                      isSelected
                        ? "border-violet-500/60 bg-violet-950/15"
                        : "border-slate-800 bg-slate-900/60"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row items-start gap-4">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => togglePostSelection(postId)}
                        className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-800 text-violet-600 focus:ring-violet-500 cursor-pointer shrink-0"
                      />

                      {/* Image Preview & Actions */}
                      <div className="w-full md:w-44 h-32 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative group shrink-0 flex items-center justify-center">
                        <input
                          type="file"
                          ref={(el) => { fileInputRefs.current[index] = el; }}
                          onChange={(e) => handlePostFileUpload(index, e)}
                          accept="image/png,image/jpeg,image/webp,image/jpg"
                          className="hidden"
                        />

                        {isUploading || isRegenerating ? (
                          <div className="flex flex-col items-center justify-center gap-1.5 text-xs text-violet-300">
                            <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
                            <span>{isUploading ? "Uploading..." : "Creating AI image..."}</span>
                          </div>
                        ) : post.imageUrl ? (
                          <>
                            <img
                              src={post.imageUrl}
                              alt={post.topic}
                              className="w-full h-full object-cover transition group-hover:scale-105"
                              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                            />
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                              <button
                                type="button"
                                onClick={() => handleRegeneratePostImage(index)}
                                className="p-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-medium transition"
                                title="Regenerate AI Image"
                              >
                                <RefreshCw className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => fileInputRefs.current[index]?.click()}
                                className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-medium transition"
                                title="Upload Custom Photo"
                              >
                                <Upload className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemovePostImage(index)}
                                className="p-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-medium transition"
                                title="Remove Image"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-2 text-center gap-1.5">
                            <ImageIcon className="h-5 w-5 text-slate-500" />
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() => handleRegeneratePostImage(index)}
                                className="px-2 py-1 rounded bg-violet-600/80 hover:bg-violet-600 text-white text-[10px] font-medium transition"
                              >
                                + AI Image
                              </button>
                              <button
                                type="button"
                                onClick={() => fileInputRefs.current[index]?.click()}
                                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium transition"
                              >
                                Upload
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Post Details & Editor */}
                      <div className="flex-1 w-full">
                        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700">
                              📅 {post.suggestedDate ? new Date(post.suggestedDate).toLocaleDateString() : "Draft"}
                            </span>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                              {post.contentType}
                            </span>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                              {post.searchIntent}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            {isEditing ? (
                              <button
                                type="button"
                                onClick={() => handleSaveEdit(index)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition flex items-center gap-1"
                              >
                                <Check className="h-3 w-3" /> Save
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleStartEdit(index)}
                                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition text-xs flex items-center gap-1"
                                title="Edit post content"
                              >
                                <Edit3 className="h-3.5 w-3.5" /> Edit Copy
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm font-semibold text-white mb-1.5">{post.topic}</p>
                        
                        {isEditing ? (
                          <div className="space-y-2 mb-2">
                            <textarea
                              value={editSummary}
                              onChange={(e) => setEditSummary(e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-violet-500 text-white text-xs focus:outline-none resize-none"
                            />
                            <div className="flex items-center gap-2">
                              <label className="text-[11px] text-slate-400">Scheduled Date:</label>
                              <input
                                type="date"
                                value={editDate}
                                onChange={(e) => setEditDate(e.target.value)}
                                className="px-2 py-1 rounded bg-slate-950 border border-slate-700 text-white text-xs"
                              />
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-300 mb-2.5 leading-relaxed line-clamp-3">{post.summary}</p>
                        )}
                        
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <TrendingUp className="h-3.5 w-3.5 text-violet-400" />
                          <span>Keyword: <strong className="text-violet-300">"{post.primaryKeyword}"</strong></span>
                          {post.location && (
                            <span className="text-slate-500">• {post.location}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        {step === "settings" && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-semibold transition flex items-center gap-2 shadow-lg shadow-violet-600/20"
            >
              <Sparkles className="h-4 w-4" />
              Generate AI Calendar
            </button>
          </div>
        )}

        {step === "preview" && (
          <div className="flex items-center justify-between p-6 border-t border-slate-800">
            <div className="text-sm text-slate-400">
              {selectedPosts.length} of {calendar?.posts.length} posts selected
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep("settings")}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition"
              >
                Back
              </button>
              <button
                onClick={handleApprove}
                disabled={approving || selectedPosts.length === 0}
                className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {approving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Approve & Schedule
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

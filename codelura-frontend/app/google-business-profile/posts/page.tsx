"use client";
import { useEffect, useState, useRef } from "react";
import {
  gbpGetLocations,
  gbpGetPosts,
  gbpCreatePost,
  gbpAIPost,
  gbpDeletePost,
} from "@/lib/gbp/gbpApi";
import {
  FileText,
  Plus,
  Trash2,
  Building2,
  Sparkles,
  Image as ImageIcon,
  Upload,
  RefreshCw,
  X,
  ExternalLink,
  Tag,
  Calendar,
  CheckCircle2,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";

export default function PostsPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [location, setLocation] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const postsPerPage = 20;
  const [summary, setSummary] = useState("");
  const [topicType, setTopicType] = useState("STANDARD");
  const [ctaType, setCtaType] = useState("LEARN_MORE");
  const [ctaUrl, setCtaUrl] = useState("");
  const [aiTopic, setAiTopic] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Post Media / Image State
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageGenerating, setImageGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    gbpGetLocations()
      .then((res) => {
        const locs = res.data.data || [];
        setLocations(locs);
        const loc = locs.find((l: any) => l.isPrimary) || locs[0];
        if (!loc) return;
        setLocation(loc);
        if (loc.websiteUri) setCtaUrl(loc.websiteUri);
        fetchPosts(loc._id);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fetchPosts = async (locId: string, page = 1) => {
    try {
      const r = await gbpGetPosts(locId, { page, limit: postsPerPage });
      
      if (page === 1) {
        setPosts(r.data.posts || []);
      } else {
        setPosts(prev => [...prev, ...(r.data.posts || [])]);
      }
      
      setTotalPages(r.data.totalPages || 1);
      setHasMore(page < (r.data.totalPages || 1));
      setCurrentPage(page);
    } catch {
      setPosts([]);
    }
  };

  const loadMorePosts = async () => {
    if (!hasMore || loading || !location) return;
    setLoading(true);
    await fetchPosts(location._id, currentPage + 1);
    setLoading(false);
  };

  const handleLocationChange = (locId: string) => {
    const loc = locations.find((l) => l._id === locId);
    if (!loc) return;
    setLocation(loc);
    if (loc.websiteUri) setCtaUrl(loc.websiteUri);
    fetchPosts(loc._id);
  };

  const handleAIPost = async () => {
    if (!aiTopic.trim()) return toast.error("Please enter a topic for the AI post.");
    setAiLoading(true);
    try {
      const res = await gbpAIPost({
        businessName: location?.locationName,
        category: location?.primaryCategory?.displayName,
        city: location?.address?.locality || "",
        topic: aiTopic,
      });

      const data = res.data.data;
      if (data.post) setSummary(data.post);
      if (data.imageUrl) setImageUrl(data.imageUrl);

      toast.success("AI Post content and promotional banner generated!");
    } catch {
      toast.error("AI post generation failed.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateAIImageOnly = () => {
    if (!aiTopic.trim() && !summary.trim()) {
      return toast.error("Enter a topic or post content to generate an AI image.");
    }
    setImageGenerating(true);
    const category = location?.primaryCategory?.displayName || "business service";
    const topic = aiTopic || summary.slice(0, 50);
    const cleanPrompt = `${category} ${topic} promotional banner advertising for ${location?.locationName || "business"} high resolution`;
    const seed = Math.floor(Math.random() * 1000000);
    const newImgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=1024&height=680&nologo=true&seed=${seed}`;

    setTimeout(() => {
      setImageUrl(newImgUrl);
      setImageGenerating(false);
      toast.success("New AI Image generated!");
    }, 600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return toast.error("Image file must be under 5MB.");
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      setImageUrl(result);
      toast.success("Image uploaded!");
    };
    reader.readAsDataURL(file);
  };

  const handleCreatePost = async () => {
    if (!summary.trim()) return toast.error("Post content is required.");
    setSubmitting(true);
    try {
      const postPayload: any = {
        summary,
        topicType,
      };

      // Add image if attached
      if (imageUrl) {
        postPayload.media = [
          {
            mediaFormat: "PHOTO",
            sourceUrl: imageUrl,
          },
        ];
      }

      // Add CTA
      if (ctaType && ctaType !== "NONE" && ctaUrl) {
        postPayload.callToAction = {
          actionType: ctaType,
          url: ctaUrl,
        };
      }

      await gbpCreatePost(location._id, postPayload);
      fetchPosts(location._id);
      setShowModal(false);
      setSummary("");
      setImageUrl("");
      setAiTopic("");
      toast.success("Post published to Google Business Profile!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create post.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this Google post?")) return;
    try {
      await gbpDeletePost(location._id, postId);
      fetchPosts(location._id);
      toast.success("Post deleted.");
    } catch {
      toast.error("Failed to delete post.");
    }
  };

  return (
    <div className="flex flex-col h-full overflow-auto bg-slate-950">
      {/* Top Header */}
      <div className="px-6 py-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-md sticky top-0 z-20">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-violet-400" /> Google Business Posts
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Create, manage, and publish AI-powered Google updates with promotional images
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Location Selector */}
          {locations.length > 0 && (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 shadow-inner">
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

          <button
            onClick={() => setShowModal(true)}
            disabled={!location}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition disabled:opacity-50 shadow-lg shadow-violet-600/20"
          >
            <Plus className="h-4 w-4" /> Create Post
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center max-w-lg mx-auto space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto text-violet-400">
              <FileText className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-white">
              No Posts for {location?.locationName || "this Location"}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Google Posts with high-quality images keep your profile active, boost local SEO rankings, and convert searchers into customers.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/20 transition inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Create First Post with Image
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((p) => {
              const postImage = p.media?.[0]?.sourceUrl || p.media?.[0]?.googleUrl;
              return (
                <div
                  key={p._id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden flex flex-col hover:border-slate-700 transition shadow-lg group"
                >
                  {/* Post Image Preview */}
                  {postImage && (
                    <div className="relative h-48 w-full bg-slate-950 overflow-hidden border-b border-slate-800">
                      <img
                        src={postImage}
                        alt="Google Post Image"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                      <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-[10px] font-bold px-2.5 py-1 rounded-full text-violet-300 border border-violet-500/30 flex items-center gap-1">
                        <ImageIcon className="h-3 w-3" /> Image Post
                      </span>
                    </div>
                  )}

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30">
                          {p.topicType || "STANDARD"}
                        </span>
                        <button
                          onClick={() => handleDeletePost(p._id)}
                          className="text-slate-500 hover:text-red-400 p-1 rounded-lg hover:bg-slate-800 transition"
                          title="Delete Post"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="text-sm text-slate-200 line-clamp-4 leading-relaxed whitespace-pre-line">
                        {p.summary}
                      </p>

                      {p.callToAction?.url && (
                        <div className="pt-1">
                          <a
                            href={p.callToAction.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold"
                          >
                            <span>Action: {p.callToAction.actionType || "Visit Website"}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <strong className="text-emerald-400 uppercase tracking-wide">
                          {p.status || "Published"}
                        </strong>
                      </span>
                      <span>{new Date(p.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {!loading && hasMore && posts.length > 0 && (
          <div className="flex justify-center pt-4">
            <button
              onClick={loadMorePosts}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition border border-slate-700 flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Load More Posts ({currentPage} / {totalPages})
            </button>
          </div>
        )}
      </div>

      {/* Create Post Modal with AI Image Generation */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl p-6 space-y-5 shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Create Google Post</h3>
                  <p className="text-xs text-slate-400">
                    Publish updates, special offers, or events with images to Google Maps
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {/* AI Generator Bar */}
              <div className="rounded-xl border border-violet-500/30 bg-violet-950/20 p-3.5 space-y-2">
                <label className="text-xs font-semibold text-violet-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> Auto-Generate with AI (Content & Image Banner)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAIPost();
                    }}
                    placeholder="e.g., Special 20% discount on Home Tuitions for Class 10 & 12..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                  <button
                    onClick={handleAIPost}
                    disabled={aiLoading}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 transition shadow-md shadow-violet-600/20 flex-shrink-0"
                  >
                    <Sparkles className={`h-3.5 w-3.5 ${aiLoading ? "animate-spin" : ""}`} />
                    {aiLoading ? "Generating..." : "AI Generate All"}
                  </button>
                </div>
              </div>

              {/* Image Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5 text-violet-400" /> Post Image / Banner
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleGenerateAIImageOnly}
                      disabled={imageGenerating}
                      className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20"
                    >
                      <Sparkles className={`h-3 w-3 ${imageGenerating ? "animate-spin" : ""}`} />
                      {imageGenerating ? "Generating..." : "Generate AI Image"}
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20"
                    >
                      <Upload className="h-3 w-3" /> Upload Device Image
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Image Preview Box */}
                {imageUrl ? (
                  <div className="relative rounded-xl border border-slate-700 bg-slate-950 overflow-hidden group">
                    <img
                      src={imageUrl}
                      alt="Attached Post Banner"
                      className="w-full h-44 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleGenerateAIImageOnly}
                        className="p-1.5 bg-black/70 hover:bg-black text-white rounded-lg backdrop-blur-md transition"
                        title="Regenerate Image"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageUrl("")}
                        className="p-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg backdrop-blur-md transition"
                        title="Remove Image"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md text-[10px] text-emerald-400 px-2.5 py-0.5 rounded-md font-semibold border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Image Attached for Google Profile
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-xl p-5 text-center cursor-pointer transition bg-slate-950/40 hover:bg-slate-900/40"
                  >
                    <ImageIcon className="h-7 w-7 text-slate-600 mx-auto mb-1.5" />
                    <p className="text-xs font-semibold text-slate-300">
                      Click to upload an image or click "AI Generate All" above
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Supported: JPG, PNG, WEBP (Recommended: 1024x680)
                    </p>
                  </div>
                )}
              </div>

              {/* Post Content */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Post Content / Description
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={4}
                  placeholder="Write your Google post update here..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 resize-none leading-relaxed"
                />
              </div>

              {/* Post Type & CTA Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Post Type</label>
                  <select
                    value={topicType}
                    onChange={(e) => setTopicType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="STANDARD">Standard Update</option>
                    <option value="OFFER">Special Offer</option>
                    <option value="EVENT">Event</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Call to Action (Button)</label>
                  <select
                    value={ctaType}
                    onChange={(e) => setCtaType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="LEARN_MORE">Learn more</option>
                    <option value="CALL">Call now</option>
                    <option value="BOOK">Book</option>
                    <option value="ORDER">Order online</option>
                    <option value="SIGN_UP">Sign up</option>
                    <option value="NONE">No button</option>
                  </select>
                </div>
              </div>

              {ctaType !== "NONE" && (
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Action Button Link (URL)</label>
                  <input
                    type="url"
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    placeholder="https://yourwebsite.com/offer"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreatePost}
                disabled={submitting || !summary.trim()}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl text-xs font-semibold disabled:opacity-50 transition shadow-lg shadow-violet-600/30 flex items-center gap-2"
              >
                {submitting ? "Publishing to Google..." : "Publish Post with Image"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';
import { useEffect, useState } from "react";
import {
  gbpGetLocations,
  gbpGetReviews,
  gbpSyncReviews,
  gbpReplyToReview,
  gbpAIReviewReply,
  gbpAutoReplyAll,
  gbpGetReviewAutomationSettings,
  gbpUpdateReviewAutomationSettings,
  gbpGetStatus,
  gbpGetConnectUrl,
} from "@/lib/gbp/gbpApi";
import {
  Star,
  RefreshCw,
  Bot,
  Send,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Building2,
  Sparkles,
  Settings2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Filter,
  Sliders,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";

const STAR_MAP: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

export default function ReviewsPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLocId, setSelectedLocId] = useState<string>("all");
  const [location, setLocation] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [autoReplying, setAutoReplying] = useState(false);
  const [filter, setFilter] = useState<{ rating?: string; replied?: string; search?: string }>({});
  const [replyMap, setReplyMap] = useState<Record<string, string>>({});
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [isAuthConnected, setIsAuthConnected] = useState<boolean>(true);

  // Automation Settings Modal state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [automationConfig, setAutomationConfig] = useState<any>({
    automaticRepliesEnabled: true,
    autoPublishEnabled: true,
    minimumRating: "all",
    negativeReviewAutoReply: true,
    businessTone: "professional",
  });

  const checkAuthStatus = async () => {
    try {
      const res = await gbpGetStatus();
      setIsAuthConnected(!!res.data.data?.connected);
    } catch {
      setIsAuthConnected(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await gbpGetLocations();
      const locs = res.data.data || [];
      setLocations(locs);
      return locs;
    } catch {
      return [];
    }
  };

  const fetchReviews = async (locId: string, p = page, l = limit, f = filter) => {
    setLoading(true);
    try {
      const res = await gbpGetReviews(locId, { page: p, limit: l, ...f });
      setReviews(res.data.reviews || []);
      setTotal(res.data.total || 0);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setIsAuthConnected(false);
      }
      toast.error("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
    fetchLocations().then(() => {
      fetchReviews("all", 1, 25, {});
    });
  }, []);

  const handleLocationChange = (locId: string) => {
    setSelectedLocId(locId);
    setPage(1);
    const locObj = locations.find((l) => l._id === locId) || null;
    setLocation(locObj);
    fetchReviews(locId, 1, limit, filter);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
    fetchReviews(selectedLocId, 1, newLimit, filter);
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      if (selectedLocId !== "all" && location) {
        const res = await gbpSyncReviews(location._id);
        toast.success(res.data.message || `Synced reviews for ${location.locationName}`);
      } else if (locations.length > 0) {
        let syncedTotal = 0;
        for (const loc of locations) {
          try {
            const r = await gbpSyncReviews(loc._id);
            syncedTotal += r.data.data?.synced || 0;
          } catch (_) {}
        }
        toast.success(`Reviews sync complete (${syncedTotal} reviews processed).`);
      }
      await fetchReviews(selectedLocId, page, limit, filter);
    } catch (err: any) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        setIsAuthConnected(false);
      }
      const msg = err?.response?.data?.message || err?.message;
      if (err?.response?.status === 403) {
        toast.error("Google permission required: Please click 'Reconnect Google Account' and check the 'Manage business profile' box.");
      } else {
        toast.error(msg || "Sync failed. Please check Google authorization.");
      }
    } finally {
      setSyncing(false);
    }
  };

  const handleAutoReplyAll = async () => {
    setAutoReplying(true);
    const toastId = toast.loading("Processing AI auto-replies for unreplied reviews...");
    try {
      const locId = selectedLocId !== "all" ? selectedLocId : undefined;
      const res = await gbpAutoReplyAll(locId, true);
      toast.success(res.data.message || "Auto-replies processed successfully!", { id: toastId });
      await fetchReviews(selectedLocId, page, limit, filter);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Auto-reply failed. Please check settings.", { id: toastId });
    } finally {
      setAutoReplying(false);
    }
  };

  const handleAIReply = async (review: any) => {
    setAiLoading(review._id);
    const locName = review.locationId?.locationName || location?.locationName || "Tutvex";
    try {
      const res = await gbpAIReviewReply({
        businessName: locName,
        reviewerName: review.reviewer?.displayName,
        rating: STAR_MAP[review.starRating] || 5,
        reviewText: review.comment || "",
      });
      const generated = res.data.data?.reply || "";
      setReplyMap((prev) => ({ ...prev, [review._id]: generated }));
      toast.success("AI reply generated. You can edit before publishing!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "AI generation failed.");
    } finally {
      setAiLoading(null);
    }
  };

  const handleSubmitReply = async (review: any) => {
    const text = replyMap[review._id];
    if (!text?.trim()) return;
    setSubmitting(review._id);
    const locId = review.locationId?._id || review.locationId || location?._id;
    try {
      await gbpReplyToReview(locId, review.googleReviewId, text);
      await fetchReviews(selectedLocId, page, limit, filter);
      setReplyMap((prev) => {
        const n = { ...prev };
        delete n[review._id];
        return n;
      });
      toast.success("Reply published successfully to Google!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to publish reply.");
    } finally {
      setSubmitting(null);
    }
  };

  const openSettings = async () => {
    setSettingsOpen(true);
    if (selectedLocId !== "all") {
      setSettingsLoading(true);
      try {
        const res = await gbpGetReviewAutomationSettings(selectedLocId);
        setAutomationConfig(res.data.data || {});
      } catch {
        toast.error("Failed to load automation settings.");
      } finally {
        setSettingsLoading(false);
      }
    }
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    try {
      if (selectedLocId !== "all") {
        await gbpUpdateReviewAutomationSettings(selectedLocId, automationConfig);
        toast.success("Automation settings saved for this location!");
      } else {
        // Save for all locations
        for (const loc of locations) {
          try {
            await gbpUpdateReviewAutomationSettings(loc._id, automationConfig);
          } catch (_) {}
        }
        toast.success("Automation settings applied to all locations!");
      }
      setSettingsOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleReconnect = async () => {
    try {
      const res = await gbpGetConnectUrl();
      if (res.data.data?.url) {
        window.location.href = res.data.data.url;
      }
    } catch {
      toast.error("Failed to get reconnect URL");
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  // Calculate quick stats from loaded reviews
  const unrepliedOnPage = reviews.filter((r) => !r.reviewReply?.comment).length;

  return (
    <div className="flex flex-col h-full overflow-auto bg-slate-950 text-slate-100">
      {/* Reconnect Alert Banner if OAuth expired */}
      {!isAuthConnected && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-medium">
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
            <span>Google authorization expired or disconnected. Reconnect to fetch latest reviews and publish auto-replies directly to Google Maps.</span>
          </div>
          <button
            onClick={handleReconnect}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-sm"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Reconnect Google Account</span>
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between flex-wrap gap-4 bg-slate-900/40">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-white tracking-tight">Reviews & Reputation Manager</h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-violet-500/15 border border-violet-500/30 text-violet-300">
              <Sparkles className="h-3 w-3 text-violet-400" />
              AI Auto-Reply
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {total} total reviews {selectedLocId === "all" ? "across all 10 locations" : `for ${location?.locationName || "selected location"}`}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Location Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 shadow-sm">
            <Building2 className="h-3.5 w-3.5 text-violet-400 shrink-0" />
            <select
              value={selectedLocId}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="bg-transparent text-white text-xs font-medium focus:outline-none cursor-pointer max-w-[200px] truncate"
            >
              <option value="all" className="bg-slate-900 text-white">
                🌐 All Locations ({locations.length})
              </option>
              {locations.map((loc) => (
                <option key={loc._id} value={loc._id} className="bg-slate-900 text-white">
                  📍 {loc.locationName} ({loc.reviewCount || 0})
                </option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <select
            value={filter.rating || ""}
            onChange={(e) => {
              const f = { ...filter, rating: e.target.value || undefined };
              setFilter(f);
              fetchReviews(selectedLocId, 1, limit, f);
            }}
            className="bg-slate-900 border border-slate-800 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-violet-500 cursor-pointer"
          >
            <option value="">⭐ All Ratings</option>
            {["FIVE", "FOUR", "THREE", "TWO", "ONE"].map((r) => (
              <option key={r} value={r}>
                {STAR_MAP[r]}★ Star
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filter.replied || ""}
            onChange={(e) => {
              const f = { ...filter, replied: e.target.value || undefined };
              setFilter(f);
              fetchReviews(selectedLocId, 1, limit, f);
            }}
            className="bg-slate-900 border border-slate-800 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-violet-500 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="false">⏳ Unreplied (Needs Action)</option>
            <option value="true">✓ Replied</option>
            <option value="auto">🤖 Auto-Replied (AI)</option>
          </select>

          {/* Automation Settings Button */}
          <button
            onClick={openSettings}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition shadow-sm"
          >
            <Settings2 className="h-3.5 w-3.5 text-violet-400" />
            <span>Settings</span>
          </button>

          {/* Auto-Reply All Button */}
          <button
            onClick={handleAutoReplyAll}
            disabled={autoReplying}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs font-semibold transition disabled:opacity-60 shadow-lg shadow-violet-600/20"
          >
            <Bot className={`h-3.5 w-3.5 ${autoReplying ? "animate-spin" : ""}`} />
            <span>{autoReplying ? "Replying..." : "Auto-Reply Unreplied"}</span>
          </button>

          {/* Sync Button */}
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold transition disabled:opacity-60 shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
            <span>{syncing ? "Syncing..." : "Sync Google"}</span>
          </button>
        </div>
      </div>

      {/* Review List & Controls */}
      <div className="flex-1 p-6 space-y-4 max-w-7xl mx-auto w-full">
        {/* Sub-bar: Pagination count and page size selector */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <div className="flex items-center gap-2">
            <span>Showing {reviews.length} of {total} reviews</span>
            {filter.replied === "false" && (
              <span className="text-amber-400 font-medium bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                ⚠️ {unrepliedOnPage} pending replies on this page
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span>Per page:</span>
            {[10, 25, 50, 100].map((sz) => (
              <button
                key={sz}
                onClick={() => handleLimitChange(sz)}
                className={`px-2 py-0.5 rounded-md border text-[11px] font-medium transition ${
                  limit === sz
                    ? "bg-violet-600 border-violet-500 text-white"
                    : "border-slate-800 text-slate-400 hover:bg-slate-800"
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-8 h-8 border-3 border-violet-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-400">Loading reviews from database...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-800 rounded-3xl bg-slate-900/20 p-8">
            <MessageSquare className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-300">No reviews found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No reviews match the selected filter. Click &quot;Sync Google&quot; to fetch the latest customer reviews.
            </p>
            <button
              onClick={handleSync}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Sync All Reviews Now</span>
            </button>
          </div>
        ) : (
          /* Review Cards */
          reviews.map((review) => {
            const hasReply = !!(review.reviewReply && review.reviewReply.comment);
            const isAuto = review.isAutoReplied || review.automationStatus === "REPLIED";
            const numRating = STAR_MAP[review.starRating] || 5;

            return (
              <div
                key={review._id}
                className={`rounded-2xl border transition p-5 ${
                  hasReply
                    ? "border-slate-800/80 bg-slate-900/40 hover:border-slate-700"
                    : "border-amber-500/20 bg-slate-900/70 hover:border-amber-500/40"
                }`}
              >
                {/* Header: Reviewer Info, Location & Badges */}
                <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-white text-sm">
                        {review.reviewer?.isAnonymous ? "Anonymous Customer" : review.reviewer?.displayName || "A customer"}
                      </p>

                      {review.locationId?.locationName && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-800 border border-slate-700/80 rounded-md px-2 py-0.5">
                          <MapPin className="h-2.5 w-2.5 text-violet-400" />
                          {review.locationId.locationName}
                        </span>
                      )}

                      {/* Status Badges */}
                      {hasReply ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-md px-2 py-0.5">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          {isAuto ? "AI Auto-Replied" : "Replied"}
                        </span>
                      ) : review.automationStatus === "PUBLISH_FAILED" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-md px-2 py-0.5">
                          <AlertCircle className="h-2.5 w-2.5" />
                          Publish Failed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-md px-2 py-0.5">
                          <Clock className="h-2.5 w-2.5" />
                          Unreplied
                        </span>
                      )}
                    </div>

                    {/* Star Rating Display */}
                    <div className="flex items-center gap-1 mt-1.5">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`h-3.5 w-3.5 ${
                              s <= numRating ? "fill-amber-400 text-amber-400" : "text-slate-700"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-amber-400 ml-1">{numRating}.0</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500">
                    {review.createTime ? new Date(review.createTime).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : ""}
                  </p>
                </div>

                {/* Customer Comment Text */}
                {review.comment ? (
                  <p className="text-sm text-slate-200 leading-relaxed mb-4 bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 italic mb-3">(Rating only, no text provided)</p>
                )}

                {/* Published Reply or Reply Composer */}
                {hasReply ? (
                  <div className="mt-3 pl-4 border-l-2 border-violet-500/40 bg-violet-950/15 p-3 rounded-r-xl">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-violet-400 font-semibold flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        Official Business Reply
                      </p>
                      {review.reviewReply.updateTime && (
                        <span className="text-[10px] text-slate-500">
                          {new Date(review.reviewReply.updateTime).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{review.reviewReply.comment}</p>
                  </div>
                ) : (
                  <div className="mt-3 space-y-2.5 pt-2 border-t border-slate-800/60">
                    <textarea
                      value={replyMap[review._id] || review.aiGeneratedReply || ""}
                      onChange={(e) => setReplyMap((prev) => ({ ...prev, [review._id]: e.target.value }))}
                      rows={2}
                      placeholder="Write your reply or click 'AI Auto-Generate'..."
                      className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-violet-500 resize-none placeholder:text-slate-600"
                    />

                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAIReply(review)}
                          disabled={aiLoading === review._id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs font-semibold hover:bg-violet-600/30 transition disabled:opacity-50"
                        >
                          <Sparkles className="h-3 w-3 text-violet-400" />
                          {aiLoading === review._id ? "Generating..." : "Generate AI Reply"}
                        </button>
                        <button
                          onClick={() => handleSubmitReply(review)}
                          disabled={!(replyMap[review._id] || review.aiGeneratedReply)?.trim() || submitting === review._id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition disabled:opacity-50 shadow-md shadow-violet-600/20"
                        >
                          <Send className="h-3 w-3" />
                          {submitting === review._id ? "Publishing..." : "Publish to Google"}
                        </button>
                      </div>

                      {review.publishError && (
                        <p className="text-[11px] text-rose-400 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {review.publishError}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6 pb-8">
            <button
              onClick={() => {
                const newPage = Math.max(1, page - 1);
                setPage(newPage);
                fetchReviews(selectedLocId, newPage, limit, filter);
              }}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-30 text-xs font-medium transition"
            >
              <ChevronLeft className="h-3.5 w-3.5 inline mr-1" />
              Previous
            </button>
            <span className="text-xs text-slate-400 font-medium px-2">
              Page <span className="text-white font-bold">{page}</span> of <span className="text-white font-bold">{totalPages}</span>
            </span>
            <button
              onClick={() => {
                const newPage = Math.min(totalPages, page + 1);
                setPage(newPage);
                fetchReviews(selectedLocId, newPage, limit, filter);
              }}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-30 text-xs font-medium transition"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5 inline ml-1" />
            </button>
          </div>
        )}
      </div>

      {/* Automation Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-violet-400" />
                <h3 className="text-base font-bold text-white">Review Auto-Reply Automation</h3>
              </div>
              <button
                onClick={() => setSettingsOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 rounded-md"
              >
                ✕ Close
              </button>
            </div>

            {settingsLoading ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading settings...</div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* Toggle 1: Automatic AI Replies */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div>
                    <p className="font-semibold text-white text-sm">Enable AI Auto-Replies</p>
                    <p className="text-slate-400 text-[11px]">Generate intelligent customized replies for new reviews automatically.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={!!automationConfig.automaticRepliesEnabled}
                    onChange={(e) =>
                      setAutomationConfig((prev: any) => ({ ...prev, automaticRepliesEnabled: e.target.checked }))
                    }
                    className="w-4 h-4 accent-violet-600 rounded cursor-pointer"
                  />
                </div>

                {/* Toggle 2: Auto-Publish directly to Google */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div>
                    <p className="font-semibold text-white text-sm">Auto-Publish to Google</p>
                    <p className="text-slate-400 text-[11px]">Publish AI replies automatically to Google Business Profile without waiting.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={!!automationConfig.autoPublishEnabled}
                    onChange={(e) =>
                      setAutomationConfig((prev: any) => ({ ...prev, autoPublishEnabled: e.target.checked }))
                    }
                    className="w-4 h-4 accent-violet-600 rounded cursor-pointer"
                  />
                </div>

                {/* Minimum Rating */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                  <label className="font-semibold text-white block">Auto-Reply Rating Trigger</label>
                  <select
                    value={automationConfig.minimumRating || "all"}
                    onChange={(e) =>
                      setAutomationConfig((prev: any) => ({ ...prev, minimumRating: e.target.value }))
                    }
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-violet-500"
                  >
                    <option value="all">⭐ Reply to All Ratings (1 to 5 Stars)</option>
                    <option value="4+">⭐ Reply to 4★ & 5★ Ratings Only</option>
                    <option value="5only">⭐ Reply to 5★ Only</option>
                  </select>
                </div>

                {/* Business Tone */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                  <label className="font-semibold text-white block">Business Reply Tone</label>
                  <select
                    value={automationConfig.businessTone || "professional"}
                    onChange={(e) =>
                      setAutomationConfig((prev: any) => ({ ...prev, businessTone: e.target.value }))
                    }
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-violet-500"
                  >
                    <option value="professional">👔 Professional & Courteous</option>
                    <option value="friendly">🌟 Warm & Friendly</option>
                    <option value="casual">💬 Casual & Approachable</option>
                  </select>
                </div>

                {/* Negative Review Auto-Reply */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div>
                    <p className="font-semibold text-white text-sm">Auto-Reply to Critical Reviews (1-2★)</p>
                    <p className="text-slate-400 text-[11px]">Send empathetic and professional resolution replies to negative reviews.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={!!automationConfig.negativeReviewAutoReply}
                    onChange={(e) =>
                      setAutomationConfig((prev: any) => ({ ...prev, negativeReviewAutoReply: e.target.checked }))
                    }
                    className="w-4 h-4 accent-violet-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-3">
              <button
                onClick={() => setSettingsOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={saveSettings}
                disabled={savingSettings}
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition disabled:opacity-50 shadow-md shadow-violet-600/20"
              >
                {savingSettings ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';
import { useEffect, useState } from "react";
import { gbpGetLocations, gbpGetReviews, gbpSyncReviews, gbpReplyToReview, gbpAIReviewReply } from "@/lib/gbp/gbpApi";
import { Star, RefreshCw, Bot, Send, ChevronLeft, ChevronRight, MapPin, Building2 } from "lucide-react";
import toast from "react-hot-toast";

const STAR_MAP: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

export default function ReviewsPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLocId, setSelectedLocId] = useState<string>("all");
  const [location, setLocation] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [filter, setFilter] = useState<{ rating?: string; replied?: string }>({});
  const [replyMap, setReplyMap] = useState<Record<string, string>>({});
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<string | null>(null);

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

  const fetchReviews = async (locId: string, p = 1, f = filter) => {
    setLoading(true);
    try {
      const res = await gbpGetReviews(locId, { page: p, limit: 10, ...f });
      setReviews(res.data.reviews || []);
      setTotal(res.data.total || 0);
    } catch {
      toast.error("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations().then(() => {
      fetchReviews("all", 1, {});
    });
  }, []);

  const handleLocationChange = (locId: string) => {
    setSelectedLocId(locId);
    setPage(1);
    const locObj = locations.find(l => l._id === locId) || null;
    setLocation(locObj);
    fetchReviews(locId, 1, filter);
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      if (selectedLocId !== "all" && location) {
        await gbpSyncReviews(location._id);
      } else if (locations.length > 0) {
        for (const loc of locations) {
          try { await gbpSyncReviews(loc._id); } catch (_) {}
        }
      }
      await fetchReviews(selectedLocId, page, filter);
      toast.success("Reviews synced!");
    } catch {
      toast.error("Sync failed.");
    } finally {
      setSyncing(false);
    }
  };

  const handleAIReply = async (review: any) => {
    setAiLoading(review._id);
    const locName = review.locationId?.locationName || location?.locationName || "Tutvex";
    try {
      const res = await gbpAIReviewReply({
        businessName: locName,
        reviewerName: review.reviewer?.displayName,
        rating: STAR_MAP[review.starRating] || 3,
        reviewText: review.comment,
      });
      setReplyMap(prev => ({ ...prev, [review._id]: res.data.data.reply }));
      toast.success("AI reply generated. Please review and edit before posting.");
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
      await fetchReviews(selectedLocId, page, filter);
      setReplyMap(prev => { const n = { ...prev }; delete n[review._id]; return n; });
      toast.success("Reply published!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to publish reply.");
    } finally {
      setSubmitting(null);
    }
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Reviews & Feedback</h1>
          <p className="text-sm text-slate-500">
            {total} total reviews {selectedLocId === "all" ? "across all locations" : ""}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-1.5">
            <Building2 className="h-3.5 w-3.5 text-violet-400" />
            <select
              value={selectedLocId}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="bg-transparent text-white text-xs font-medium focus:outline-none cursor-pointer"
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

          <select
            value={filter.rating || ""}
            onChange={(e) => {
              const f = { ...filter, rating: e.target.value || undefined };
              setFilter(f);
              fetchReviews(selectedLocId, 1, f);
            }}
            className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-violet-500"
          >
            <option value="">All Ratings</option>
            {["FIVE", "FOUR", "THREE", "TWO", "ONE"].map((r) => (
              <option key={r} value={r}>
                {STAR_MAP[r]}★
              </option>
            ))}
          </select>

          <select
            value={filter.replied || ""}
            onChange={(e) => {
              const f = { ...filter, replied: e.target.value || undefined };
              setFilter(f);
              fetchReviews(selectedLocId, 1, f);
            }}
            className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-violet-500"
          >
            <option value="">All Statuses</option>
            <option value="false">Unreplied</option>
            <option value="true">Replied</option>
          </select>

          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition disabled:opacity-60 shadow-lg shadow-violet-600/20"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
            <span>Sync Reviews</span>
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            No reviews found for this selection. Click &quot;Sync Reviews&quot; to pull latest from Google.
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:border-slate-700 transition">
              <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white text-sm">
                      {review.reviewer?.isAnonymous ? "Anonymous" : review.reviewer?.displayName || "A customer"}
                    </p>
                    {review.locationId?.locationName && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-slate-800 border border-slate-700 rounded-md px-2 py-0.5">
                        <MapPin className="h-2.5 w-2.5 text-violet-400" />
                        {review.locationId.locationName}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3.5 w-3.5 ${
                          s <= (STAR_MAP[review.starRating] || 0) ? "fill-amber-400 text-amber-400" : "text-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  {review.createTime ? new Date(review.createTime).toLocaleDateString() : ""}
                </p>
              </div>

              {review.comment && <p className="text-sm text-slate-300 leading-relaxed mb-4">{review.comment}</p>}

              {review.reviewReply?.comment ? (
                <div className="mt-3 pl-4 border-l-2 border-violet-500/30">
                  <p className="text-xs text-violet-400 font-semibold mb-1">Your Reply</p>
                  <p className="text-sm text-slate-400">{review.reviewReply.comment}</p>
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  <textarea
                    value={replyMap[review._id] || ""}
                    onChange={(e) => setReplyMap((prev) => ({ ...prev, [review._id]: e.target.value }))}
                    rows={3}
                    placeholder="Write your reply..."
                    className="w-full bg-slate-800/60 border border-slate-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 resize-none"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAIReply(review)}
                      disabled={!!aiLoading}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-medium hover:bg-purple-600/30 transition disabled:opacity-50"
                    >
                      <Bot className="h-3.5 w-3.5" />
                      {aiLoading === review._id ? "Generating..." : "AI Reply"}
                    </button>
                    <button
                      onClick={() => handleSubmitReply(review)}
                      disabled={!replyMap[review._id]?.trim() || submitting === review._id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition disabled:opacity-50"
                    >
                      <Send className="h-3.5 w-3.5" />
                      {submitting === review._id ? "Publishing..." : "Publish Reply"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              onClick={() => { setPage((p) => p - 1); fetchReviews(selectedLocId, page - 1, filter); }}
              disabled={page === 1}
              className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-slate-400">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => { setPage((p) => p + 1); fetchReviews(selectedLocId, page + 1, filter); }}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

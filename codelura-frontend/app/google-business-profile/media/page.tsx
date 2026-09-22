"use client";
import { useEffect, useState, useCallback, useTransition } from "react";
import {
  gbpGetLocations,
  gbpGetMediaList,
  gbpSyncMedia,
  gbpGetMediaHealth,
  gbpGetOpportunities,
  gbpGetMediaRecommendations,
} from "@/lib/gbp/gbpApi";
import {
  Sparkles,
  UploadCloud,
  RefreshCw,
  Image as ImageIcon,
  Building2,
  Calendar,
  Layers,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Filter,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Camera,
  Trash2,
  Lightbulb,
  User,
  Star,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";
import MediaUploadModal from "@/components/gbp/media/MediaUploadModal";
import MediaDetailModal from "@/components/gbp/media/MediaDetailModal";
import MediaPlanModal from "@/components/gbp/media/MediaPlanModal";
import PhotoIdeasModal from "@/components/gbp/media/PhotoIdeasModal";

export default function AIMediaManagerPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 24, total: 0, totalPages: 1 });
  const [health, setHealth] = useState<any>(null);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [sourceFilter, setSourceFilter] = useState("ALL");
  const [qualityFilter, setQualityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadCategory, setUploadCategory] = useState("ADDITIONAL");
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showIdeasModal, setShowIdeasModal] = useState(false);
  const [syncError, setSyncError] = useState<any>(null);
  const [mediaError, setMediaError] = useState<any>(null);

  useEffect(() => {
    initLocations();
  }, []);

  const initLocations = async () => {
    try {
      const res = await gbpGetLocations();
      const locs = res.data.data || [];
      setLocations(locs);
      const primary = locs.find((l: any) => l.isPrimary) || locs[0];
      if (primary) setLocation(primary);
    } catch (err) {
      toast.error("Failed to load business locations");
    } finally {
      setLoading(false);
    }
  };

  const loadMediaData = useCallback(async () => {
    if (!location) return;
    try {
      setMediaError(null);
      const [mediaRes, healthRes, oppRes, recRes] = await Promise.all([
        gbpGetMediaList(location._id, {
          category: categoryFilter,
          source: sourceFilter,
          quality: qualityFilter,
          status: statusFilter,
          dateRange: dateFilter,
          search: searchQuery,
          page: pagination.page,
          limit: 24,
        }),
        gbpGetMediaHealth(location._id),
        gbpGetOpportunities(location._id),
        gbpGetMediaRecommendations(location._id),
      ]);

      setMediaList(mediaRes.data.data.items || []);
      setPagination(mediaRes.data.data.pagination || { page: 1, limit: 24, total: 0, totalPages: 1 });
      setHealth(healthRes.data.data);
      setOpportunities(oppRes.data.data || []);
      setRecommendations(recRes.data.data || []);
    } catch (err: any) {
      console.error("Failed to load media details:", err);
      const errorData = err.response?.data;
      setMediaError({
        message: errorData?.message || "Failed to load media",
        code: errorData?.errorCode || err.response?.status,
        googleError: errorData?.googleError,
        requestContext: errorData?.requestContext,
      });
      toast.error(errorData?.message || "Failed to load media data");
    }
  }, [location, categoryFilter, sourceFilter, qualityFilter, statusFilter, dateFilter, searchQuery, pagination.page]);

  useEffect(() => {
    if (location) {
      loadMediaData();
    }
  }, [location, loadMediaData]);

  const handleLocationChange = (locId: string) => {
    const found = locations.find((l) => l._id === locId);
    if (found) {
      setLocation(found);
      setPagination((p) => ({ ...p, page: 1 }));
    }
  };

  const handleSync = async () => {
    if (!location) return;
    setSyncing(true);
    setSyncError(null);
    try {
      const res = await gbpSyncMedia(location._id);
      toast.success(res.data.message || "Google Media synchronized successfully!");
      await loadMediaData();
    } catch (err: any) {
      console.error("Sync error:", err);
      const errorData = err.response?.data;
      setSyncError({
        message: errorData?.message || "Failed to sync Google media",
        code: errorData?.errorCode || err.response?.status,
        googleError: errorData?.googleError,
        requestContext: errorData?.requestContext,
      });
      toast.error(errorData?.message || "Failed to sync Google media.");
    } finally {
      setSyncing(false);
    }
  };

  const openUploadWithCategory = (cat: string = "ADDITIONAL") => {
    setUploadCategory(cat);
    setShowUploadModal(true);
  };

  // Find current Profile and Cover photos from mediaList
  const profilePhoto = mediaList.find((m) => m.category === "PROFILE") || null;
  const coverPhoto = mediaList.find((m) => m.category === "COVER") || null;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const healthScore = health?.score || 0;
  const healthLabel = health?.healthLabel || "Needs Attention";

  return (
    <div className="flex flex-col h-full overflow-auto bg-slate-950 text-slate-100">
      {/* 1. Header */}
      <div className="px-6 py-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-md shadow-violet-600/30">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  AI Media Manager
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    Pro
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage, analyze and improve your Google Business Profile media.
                </p>
              </div>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Location Selector */}
            {locations.length > 0 && (
              <div className="relative">
                <select
                  value={location?._id}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="bg-slate-800/90 border border-slate-700/80 text-white text-xs font-semibold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-violet-500 transition shadow-sm"
                >
                  {locations.map((loc) => (
                    <option key={loc._id} value={loc._id}>
                      📍 {loc.locationName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sync Button */}
            <button
              onClick={handleSync}
              disabled={syncing}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 text-violet-400 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing..." : "Sync Google Media"}
            </button>

            {/* Monthly Plan CTA */}
            <button
              onClick={() => setShowPlanModal(true)}
              className="px-4 py-2.5 rounded-xl bg-violet-950/60 hover:bg-violet-900/60 border border-violet-500/40 text-violet-300 text-xs font-bold transition flex items-center gap-2"
            >
              <Calendar className="h-4 w-4 text-violet-400" />
              Monthly Plan
            </button>

            {/* Photo Ideas CTA */}
            <button
              onClick={() => setShowIdeasModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/40 text-amber-300 text-xs font-bold transition flex items-center gap-2"
            >
              <Lightbulb className="h-4 w-4 text-amber-400" />
              Photo Ideas
            </button>

            {/* Upload Button */}
            <button
              onClick={() => openUploadWithCategory("ADDITIONAL")}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold transition shadow-lg shadow-violet-600/25 flex items-center gap-2"
            >
              <UploadCloud className="h-4 w-4" />
              Upload Photos
            </button>
          </div>
        </div>

        {/* Sync Status Badge */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-800/60 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Last synced:{" "}
            <span className="text-slate-200 font-medium">
              {health?.lastSyncedAt ? new Date(health.lastSyncedAt).toLocaleString() : "Never"}
            </span>
          </span>
          <span>•</span>
          <span>
            Total Media: <span className="text-violet-300 font-bold">{health?.totalMedia ?? 0}</span>
          </span>
          <span>•</span>
          <span>
            Quality Avg: <span className="text-emerald-300 font-bold">{health?.averageQuality ?? 0}/100</span>
          </span>
        </div>
      </div>

      {/* Error Display */}
      {(syncError || mediaError) && (
        <div className="mb-6 p-4 rounded-xl bg-red-900/20 border border-red-500/40">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-red-300 font-bold text-sm mb-1">
                {syncError ? "Media Sync Failed" : "Failed to Load Media"}
              </h3>
              <p className="text-red-200 text-sm mb-2">
                {(syncError || mediaError)?.message}
              </p>
              {(syncError || mediaError)?.code && (
                <p className="text-red-300/70 text-xs">
                  Error Code: {(syncError || mediaError).code}
                </p>
              )}
              {(syncError || mediaError)?.requestContext && (
                <details className="mt-2">
                  <summary className="text-xs text-red-300/70 cursor-pointer hover:text-red-300">
                    View Technical Details
                  </summary>
                  <pre className="mt-2 p-2 bg-black/30 rounded text-xs text-red-200 overflow-x-auto">
                    {JSON.stringify((syncError || mediaError).requestContext, null, 2)}
                  </pre>
                </details>
              )}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded-lg transition disabled:opacity-50"
                >
                  Retry Sync
                </button>
                <button
                  onClick={() => {
                    setSyncError(null);
                    setMediaError(null);
                  }}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium rounded-lg transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 space-y-6 flex-1">
        {/* 2. Media Health Gauge & KPI Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Health Score Card */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/80 border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Codelura Media Health Score
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-black uppercase ${
                    healthScore >= 85
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : healthScore >= 70
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      : healthScore >= 50
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-red-500/20 text-red-300 border border-red-500/30"
                  }`}
                >
                  {healthLabel}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-5xl font-black text-white">{healthScore}</span>
                <span className="text-base text-slate-400">/ 100</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Calculated transparently based on profile & cover photo presence, category diversity, freshness, and image quality.
              </p>
            </div>

            {/* Micro Breakdown Bars */}
            <div className="space-y-2 mt-4 pt-4 border-t border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Profile & Cover Coverage:</span>
                <span className="text-emerald-400 font-semibold">
                  {health?.flags?.hasProfilePhoto && health?.flags?.hasCoverPhoto
                    ? "100% Present"
                    : health?.flags?.hasProfilePhoto || health?.flags?.hasCoverPhoto
                    ? "50% Partial"
                    : "Missing"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Fresh Photos (&lt;90 days):</span>
                <span className="text-violet-300 font-semibold">{health?.recentPhotos ?? 0} photos</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Duplicate Penalty:</span>
                <span className={health?.duplicatePhotos > 0 ? "text-amber-400 font-semibold" : "text-emerald-400 font-semibold"}>
                  {health?.duplicatePhotos > 0 ? `${health.duplicatePhotos} Detected` : "0 Duplicates"}
                </span>
              </div>
            </div>
          </div>

          {/* KPI Cards Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Media", count: health?.totalMedia, icon: ImageIcon, color: "text-violet-400" },
              { label: "Profile Photo", count: health?.kpi?.profile, icon: User, color: "text-blue-400" },
              { label: "Cover Photo", count: health?.kpi?.cover, icon: Layers, color: "text-purple-400" },
              { label: "Exterior", count: health?.kpi?.exterior, icon: Building2, color: "text-emerald-400" },
              { label: "Interior", count: health?.kpi?.interior, icon: Building2, color: "text-cyan-400" },
              { label: "Team & Staff", count: health?.kpi?.team, icon: User, color: "text-pink-400" },
              { label: "At Work", count: health?.kpi?.atWork, icon: Camera, color: "text-amber-400" },
              { label: "Customer Photos", count: health?.customerPhotos, icon: Star, color: "text-yellow-400" },
            ].map((kpi, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {kpi.label}
                  </span>
                </div>
                <p className="text-2xl font-black text-white">
                  {kpi.count !== undefined && kpi.count !== null ? kpi.count : "Not available"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Dedicated Profile & Cover Photo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Profile Photo Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-700 bg-slate-800 flex-shrink-0 flex items-center justify-center">
              {profilePhoto?.googleUrl || location?.profile?.description?.profilePhotoUrl ? (
                <img
                  src={profilePhoto?.googleUrl || location?.profile?.description?.profilePhotoUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-slate-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                Official Profile Logo
              </span>
              <h4 className="text-base font-bold text-white truncate">
                {profilePhoto ? "Profile Photo Active" : "Profile Photo Missing"}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Displays as your official business logo avatar across Google Search & Maps.
              </p>
              <button
                type="button"
                onClick={() => openUploadWithCategory("PROFILE")}
                className="mt-3 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-semibold transition"
              >
                {profilePhoto ? "Replace Profile Photo" : "Upload Profile Photo"}
              </button>
            </div>
          </div>

          {/* Cover Photo Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-5">
            <div className="w-28 h-20 rounded-2xl overflow-hidden border border-slate-700 bg-slate-800 flex-shrink-0 flex items-center justify-center">
              {coverPhoto?.googleUrl || location?.profile?.description?.coverPhotoUrl ? (
                <img
                  src={coverPhoto?.googleUrl || location?.profile?.description?.coverPhotoUrl}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Layers className="h-8 w-8 text-slate-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
                Primary Cover Banner
              </span>
              <h4 className="text-base font-bold text-white truncate">
                {coverPhoto ? "Cover Photo Active" : "Cover Photo Missing"}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                The primary 16:9 hero photo displayed at the top of your Google listing.
              </p>
              <button
                type="button"
                onClick={() => openUploadWithCategory("COVER")}
                className="mt-3 px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white text-xs font-semibold transition"
              >
                {coverPhoto ? "Replace Cover Photo" : "Upload Cover Photo"}
              </button>
            </div>
          </div>
        </div>

        {/* 4. Media Opportunities (Missing Photo Categories) */}
        {opportunities.length > 0 && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Camera className="h-5 w-5 text-violet-400" />
                  Media Opportunities & Missing Categories
                </h3>
                <p className="text-xs text-slate-400">
                  Targeted visual gaps analyzed for {location?.primaryCategory?.displayName || "your business category"}.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {opportunities.map((opp, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-violet-500/30 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-violet-500/20 text-violet-300 border border-violet-500/30">
                        {opp.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase ${
                          opp.priority === "CRITICAL"
                            ? "text-red-400"
                            : opp.priority === "HIGH"
                            ? "text-amber-400"
                            : "text-blue-400"
                        }`}
                      >
                        {opp.priority} Priority
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">{opp.title}</h4>
                    <p className="text-xs text-slate-400">{opp.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openUploadWithCategory(opp.category)}
                    className="mt-3 py-1.5 px-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <UploadCloud className="h-3.5 w-3.5" /> {opp.cta || "Upload Photo"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. AI Recommendations */}
        {recommendations.length > 0 && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-950/30 to-purple-950/20 border border-violet-500/20 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-400" />
              AI Media Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recommendations.map((rec, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{rec.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                      {rec.priority || "MEDIUM"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{rec.reason}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-violet-300 font-medium">{rec.action}</span>
                    <button
                      type="button"
                      onClick={() => openUploadWithCategory(rec.category || "ADDITIONAL")}
                      className="text-xs text-violet-400 hover:text-violet-300 font-bold flex items-center gap-1"
                    >
                      {rec.cta || "Add Photos"} <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Filter & Search Controls */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search media by category, description or tags..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Category */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-violet-500"
              >
                <option value="ALL">All Categories</option>
                <option value="PROFILE">Profile</option>
                <option value="COVER">Cover</option>
                <option value="EXTERIOR">Exterior</option>
                <option value="INTERIOR">Interior</option>
                <option value="TEAMS">Teams</option>
                <option value="AT_WORK">At Work</option>
                <option value="PRODUCT">Product</option>
                <option value="FOOD_AND_DRINK">Food & Drink</option>
                <option value="COMMON_AREA">Common Area</option>
                <option value="ADDITIONAL">Additional</option>
              </select>

              {/* Source */}
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-violet-500"
              >
                <option value="ALL">All Sources</option>
                <option value="BUSINESS">Owner / Business</option>
                <option value="CUSTOMER">Customer Uploads</option>
              </select>

              {/* Quality */}
              <select
                value={qualityFilter}
                onChange={(e) => setQualityFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-violet-500"
              >
                <option value="ALL">All Quality</option>
                <option value="EXCELLENT">Excellent (90+)</option>
                <option value="GOOD">Good (75+)</option>
                <option value="NEEDS_IMPROVEMENT">Needs Improvement</option>
              </select>

              {/* Status */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-violet-500"
              >
                <option value="ALL">All Status</option>
                <option value="HEALTHY">Healthy</option>
                <option value="DUPLICATE">Duplicates</option>
                <option value="LOW_QUALITY">Low Quality</option>
              </select>
            </div>
          </div>
        </div>

        {/* 7. Photo Gallery Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">
              Photo Gallery ({pagination.total})
            </h3>
            {pagination.totalPages > 1 && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40"
                >
                  Prev
                </button>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {mediaList.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-center">
              <ImageIcon className="h-12 w-12 text-slate-700 mb-3" />
              <h4 className="text-base font-bold text-white mb-1">No Photos Found</h4>
              <p className="text-xs text-slate-400 max-w-sm mb-4">
                No Google media matching the current filter criteria. Click below to sync from Google or upload new photos.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleSync}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
                >
                  Sync Google Media
                </button>
                <button
                  onClick={() => openUploadWithCategory("ADDITIONAL")}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white"
                >
                  Upload First Photo
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {mediaList.map((media) => (
                <div
                  key={media._id}
                  onClick={() => setSelectedMedia(media)}
                  className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-violet-500/50 transition cursor-pointer shadow-lg flex flex-col"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square w-full bg-slate-950 overflow-hidden">
                    <img
                      src={media.thumbnailUrl || media.googleUrl}
                      alt={media.category}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />

                    {/* Category Badge */}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/20">
                      {media.category}
                    </span>

                    {/* Source Badge */}
                    {media.source === "CUSTOMER" && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/90 text-black">
                        Customer
                      </span>
                    )}

                    {/* Duplicate Badge */}
                    {media.isDuplicate && (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-600/90 text-white flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> Duplicate
                      </span>
                    )}

                    {/* Quality Badge */}
                    <span
                      className={`absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        (media.qualityScore || 85) >= 85
                          ? "bg-emerald-600/90 text-white"
                          : (media.qualityScore || 85) >= 70
                          ? "bg-amber-600/90 text-white"
                          : "bg-red-600/90 text-white"
                      }`}
                    >
                      ★ {media.qualityScore || 85}
                    </span>
                  </div>

                  {/* Card Info */}
                  <div className="p-3 text-[11px] text-slate-300 space-y-1">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>{media.createTime ? new Date(media.createTime).toLocaleDateString() : "Recent"}</span>
                      {media.dimensions && (
                        <span>
                          {media.dimensions.widthPixels}×{media.dimensions.heightPixels}
                        </span>
                      )}
                    </div>
                    {media.description && (
                      <p className="text-slate-300 line-clamp-1 text-[11px]">{media.description}</p>
                    )}
                    {media.attribution && (
                      <p className="text-amber-300/90 truncate text-[10px]">
                        By: {media.attribution.displayName || "Customer"}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <MediaUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        location={location}
        onSuccess={loadMediaData}
        defaultCategory={uploadCategory}
      />

      <MediaDetailModal
        isOpen={!!selectedMedia}
        onClose={() => setSelectedMedia(null)}
        media={selectedMedia}
        locationId={location?._id}
        onRefresh={loadMediaData}
      />

      <MediaPlanModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        location={location}
        onOpenUpload={openUploadWithCategory}
      />

      <PhotoIdeasModal
        isOpen={showIdeasModal}
        onClose={() => setShowIdeasModal(false)}
        location={location}
        onOpenUpload={openUploadWithCategory}
      />
    </div>
  );
}

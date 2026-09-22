"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  gbpGetLocations, 
  gbpGetDashboardData,
  gbpGetSyncStatus,
  gbpTriggerSync,
} from "@/lib/gbp/gbpApi";
import { 
  BarChart2, 
  Star, 
  FileText, 
  Gauge, 
  Bell, 
  Building2, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown,
  Eye,
  MapPin,
  Phone,
  ExternalLink,
  Calendar,
  MessageSquare,
  Search,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Sparkles,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import GbpTopBar from "@/components/gbp/GbpTopBar";
import toast from "react-hot-toast";

// Types
interface DashboardData {
  location: any;
  profileHealth: {
    score: number;
    maxScore: number;
    completedItems: Array<{ field: string; label: string; score: number }>;
    missingItems: Array<{ field: string; label: string; maxScore: number }>;
  };
  performance: {
    totalViews: number;
    totalSearches: number;
    totalActions: number;
    callClicks: number;
    websiteClicks: number;
    directionClicks: number;
    viewsChange: number;
    searchesChange: number;
    actionsChange: number;
  };
  reviews: {
    total: number;
    averageRating: number;
    unrepliedCount: number;
    recentReviews: Array<any>;
    ratingDistribution: { [key: string]: number };
  };
  posts: {
    total: number;
    published: number;
    scheduled: number;
    draft: number;
    lastPublished: string | null;
  };
  searchKeywords: {
    topKeywords: Array<{ keyword: string; impressions: number; rank: number }>;
    totalKeywords: number;
  };
  seoSnapshot: {
    overallScore: number;
    onPageScore: number;
    technicalScore: number;
    contentScore: number;
    lastAuditDate: string | null;
  };
  recommendations: Array<{
    type: string;
    priority: string;
    title: string;
    description: string;
    action: string;
    actionUrl: string;
  }>;
  alerts: Array<{
    type: string;
    severity: string;
    message: string;
    actionUrl: string;
  }>;
  recentActivity: Array<{
    type: string;
    message: string;
    timestamp: string;
  }>;
  syncStatus: {
    isActive: boolean;
    lastSyncAt: string | null;
    nextScheduledSync: string | null;
  };
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [dateRange, setDateRange] = useState<string>("30d");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  const locationIdParam = searchParams.get("locationId");

  // Initialize locations
  useEffect(() => {
    const init = async () => {
      try {
        const locRes = await gbpGetLocations();
        const locs = locRes.data.data || [];
        setLocations(locs);

        const targetLoc = locationIdParam
          ? locs.find((l: any) => l._id === locationIdParam)
          : locs.find((l: any) => l.isPrimary) || locs[0];

        if (targetLoc) {
          setSelectedLocation(targetLoc);
        }
      } catch (err: any) {
        if (err?.response?.status === 401) {
          toast.error("Please connect your Google Business Profile.");
        } else {
          toast.error("Failed to load locations");
        }
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [locationIdParam]);

  // Load dashboard data when location or dateRange changes
  useEffect(() => {
    if (!selectedLocation) return;

    const loadDashboard = async () => {
      setDataLoading(true);
      try {
        const res = await gbpGetDashboardData(selectedLocation._id, dateRange);
        setDashboardData(res.data.data);
      } catch (err: any) {
        console.error("Dashboard load error:", err);
        toast.error(err?.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setDataLoading(false);
      }
    };

    loadDashboard();
  }, [selectedLocation, dateRange]);

  const handleLocationChange = (locationId: string) => {
    const newLoc = locations.find(l => l._id === locationId);
    if (newLoc) {
      setSelectedLocation(newLoc);
      setDashboardData(null); // Clear previous data
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await gbpTriggerSync();
      toast.success("Sync started successfully");
      // Reload dashboard after a delay
      setTimeout(async () => {
        if (selectedLocation) {
          const res = await gbpGetDashboardData(selectedLocation._id, dateRange);
          setDashboardData(res.data.data);
        }
      }, 3000);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to trigger sync");
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!selectedLocation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
        <AlertCircle className="h-12 w-12 text-violet-400 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">No Business Location Found</h2>
        <p className="text-slate-400 text-sm mb-6">Connect your Google Business Profile to get started.</p>
        <Link href="/google-business-profile/oauth" className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition">
          Connect Google
        </Link>
      </div>
    );
  }

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-emerald-400" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-400" />;
    return <Minus className="h-4 w-4 text-slate-400" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return "text-emerald-400";
    if (change < 0) return "text-red-400";
    return "text-slate-400";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 50) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "from-emerald-500/20 to-emerald-500/0";
    if (score >= 50) return "from-amber-500/20 to-amber-500/0";
    return "from-red-500/20 to-red-500/0";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-400 bg-red-500/10 border-red-500/20";
      case "warning": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "info": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      default: return "text-slate-400 bg-slate-500/10 border-slate-500/20";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400";
      case "medium": return "text-amber-400";
      case "low": return "text-blue-400";
      default: return "text-slate-400";
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Never";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-slate-600"}`}
      />
    ));
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      <GbpTopBar
        googleEmail={undefined}
        locationName={selectedLocation?.locationName}
        lastSynced={dashboardData?.syncStatus?.lastSyncAt}
      />

      <div className="flex-1 p-4 md:p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white mb-1">GBP Command Center</h1>
            <p className="text-sm text-slate-400">Real-time insights and performance metrics</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Date Range Selector */}
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-violet-500"
              disabled={dataLoading}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>

            {/* Location Selector */}
            {locations.length > 1 && (
              <select
                value={selectedLocation._id}
                onChange={e => handleLocationChange(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-violet-500"
                disabled={dataLoading}
              >
                {locations.map(l => <option key={l._id} value={l._id}>{l.locationName}</option>)}
              </select>
            )}

            {/* Sync Button */}
            <button
              onClick={handleSync}
              disabled={syncing || dataLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing..." : "Sync Now"}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {dataLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Dashboard Content */}
        {!dataLoading && dashboardData && (
          <>
            {/* Alerts Section - Priority at Top */}
            {dashboardData.alerts && dashboardData.alerts.length > 0 && (
              <div className="space-y-2">
                {dashboardData.alerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-4 rounded-xl border ${getSeverityColor(alert.severity)}`}
                  >
                    {alert.severity === "critical" && <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />}
                    {alert.severity === "warning" && <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />}
                    {alert.severity === "info" && <Bell className="h-5 w-5 flex-shrink-0 mt-0.5" />}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                    </div>
                    {alert.actionUrl && (
                      <Link
                        href={alert.actionUrl}
                        className="text-sm font-medium hover:underline flex items-center gap-1"
                      >
                        Fix <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Profile Health Section */}
            {dashboardData.profileHealth && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">Profile Health</h2>
                  <p className="text-xs text-slate-400">Completeness and optimization score</p>
                </div>
                <Link
                  href="/google-business-profile/audit"
                  className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
                >
                  Full Audit <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                {/* Score Circle */}
                <div className="relative flex items-center justify-center w-32 h-32">
                  <svg className="w-32 h-32 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e293b" strokeWidth="2.5" />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9"
                      fill="none"
                      stroke={
                        dashboardData.profileHealth.score >= 80
                          ? "#10b981"
                          : dashboardData.profileHealth.score >= 50
                          ? "#f59e0b"
                          : "#ef4444"
                      }
                      strokeWidth="2.5"
                      strokeDasharray={`${(dashboardData.profileHealth.score / dashboardData.profileHealth.maxScore) * 100} 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span
                      className={`text-2xl font-black ${getScoreColor(
                        (dashboardData.profileHealth.score / dashboardData.profileHealth.maxScore) * 100
                      )}`}
                    >
                      {Math.round((dashboardData.profileHealth.score / dashboardData.profileHealth.maxScore) * 100)}
                    </span>
                    <span className="text-xs text-slate-500">/ 100</span>
                  </div>
                </div>

                {/* Health Items */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dashboardData.profileHealth.completedItems?.slice(0, 4).map(item => (
                    <div key={item.field} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-slate-300">{item.label}</span>
                    </div>
                  ))}
                  {dashboardData.profileHealth.missingItems?.slice(0, 4).map(item => (
                    <div key={item.field} className="flex items-center gap-2 text-sm">
                      <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                      <span className="text-slate-400">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            )}

            {/* Performance Overview */}
            {dashboardData.performance && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">Performance Overview</h2>
                  <p className="text-xs text-slate-400">Views, searches, and actions</p>
                </div>
                <Link
                  href="/google-business-profile/performance"
                  className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
                >
                  Details <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Views */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-transparent border border-violet-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <Eye className="h-5 w-5 text-violet-400" />
                    {getTrendIcon(dashboardData.performance?.viewsChange || 0)}
                  </div>
                  <p className="text-2xl font-black text-white mb-1">
                    {(dashboardData.performance?.totalViews || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-400 mb-1">Total Views</p>
                  <p className={`text-xs font-medium ${getTrendColor(dashboardData.performance?.viewsChange || 0)}`}>
                    {(dashboardData.performance?.viewsChange || 0) > 0 && "+"}
                    {(dashboardData.performance?.viewsChange || 0).toFixed(1)}% vs previous period
                  </p>
                </div>

                {/* Total Searches */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <Search className="h-5 w-5 text-blue-400" />
                    {getTrendIcon(dashboardData.performance?.searchesChange || 0)}
                  </div>
                  <p className="text-2xl font-black text-white mb-1">
                    {(dashboardData.performance?.totalSearches || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-400 mb-1">Total Searches</p>
                  <p className={`text-xs font-medium ${getTrendColor(dashboardData.performance?.searchesChange || 0)}`}>
                    {(dashboardData.performance?.searchesChange || 0) > 0 && "+"}
                    {(dashboardData.performance?.searchesChange || 0).toFixed(1)}% vs previous period
                  </p>
                </div>

                {/* Total Actions */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="h-5 w-5 text-emerald-400" />
                    {getTrendIcon(dashboardData.performance?.actionsChange || 0)}
                  </div>
                  <p className="text-2xl font-black text-white mb-1">
                    {(dashboardData.performance?.totalActions || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-400 mb-1">Total Actions</p>
                  <p className={`text-xs font-medium ${getTrendColor(dashboardData.performance?.actionsChange || 0)}`}>
                    {(dashboardData.performance?.actionsChange || 0) > 0 && "+"}
                    {(dashboardData.performance?.actionsChange || 0).toFixed(1)}% vs previous period
                  </p>
                </div>
              </div>

              {/* Action Breakdown */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/50">
                  <Phone className="h-4 w-4 text-emerald-400" />
                  <div className="flex-1">
                    <p className="text-lg font-bold text-white">{dashboardData.performance?.callClicks || 0}</p>
                    <p className="text-xs text-slate-500">Calls</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/50">
                  <ExternalLink className="h-4 w-4 text-blue-400" />
                  <div className="flex-1">
                    <p className="text-lg font-bold text-white">{dashboardData.performance?.websiteClicks || 0}</p>
                    <p className="text-xs text-slate-500">Website</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/50">
                  <MapPin className="h-4 w-4 text-violet-400" />
                  <div className="flex-1">
                    <p className="text-lg font-bold text-white">{dashboardData.performance?.directionClicks || 0}</p>
                    <p className="text-xs text-slate-500">Directions</p>
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Reviews and Posts Row */}
            {dashboardData.reviews && dashboardData.posts && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Reviews Section */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white mb-1">Reviews</h2>
                    <p className="text-xs text-slate-400">Customer feedback overview</p>
                  </div>
                  <Link
                    href="/google-business-profile/reviews"
                    className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
                  >
                    Manage <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>

                {/* Review Stats */}
                <div className="flex items-center gap-6 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-3xl font-black text-white">
                        {dashboardData.reviews.averageRating.toFixed(1)}
                      </span>
                      <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                    </div>
                    <p className="text-xs text-slate-400">{dashboardData.reviews.total} reviews</p>
                  </div>

                  {dashboardData.reviews.unrepliedCount > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <MessageSquare className="h-4 w-4 text-amber-400" />
                      <span className="text-sm font-medium text-amber-400">
                        {dashboardData.reviews.unrepliedCount} need reply
                      </span>
                    </div>
                  )}
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2 mb-4">
                  {[5, 4, 3, 2, 1].map(rating => {
                    const count = dashboardData.reviews.ratingDistribution[rating] || 0;
                    const percentage = dashboardData.reviews.total > 0 
                      ? (count / dashboardData.reviews.total) * 100 
                      : 0;
                    return (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 w-8">{rating}★</span>
                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500 w-12 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Recent Reviews */}
                {dashboardData.reviews.recentReviews?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500 font-medium mb-2">Recent Reviews</p>
                    {dashboardData.reviews.recentReviews.slice(0, 2).map((review: any) => (
                      <div key={review._id} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex gap-0.5">
                            {renderStars(review.starRating)}
                          </div>
                          <span className="text-xs text-slate-500">{formatDate(review.createTime)}</span>
                        </div>
                        <p className="text-xs text-slate-300 line-clamp-2">{review.comment}</p>
                        <p className="text-xs text-slate-500 mt-1">- {review.reviewer?.displayName || "Anonymous"}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Posts Section */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white mb-1">Posts & Content</h2>
                    <p className="text-xs text-slate-400">Publishing activity</p>
                  </div>
                  <Link
                    href="/google-business-profile/posts"
                    className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
                  >
                    Create <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>

                {/* Post Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <FileText className="h-5 w-5 text-emerald-400 mb-2" />
                    <p className="text-2xl font-black text-white">{dashboardData.posts.published}</p>
                    <p className="text-xs text-slate-400">Published</p>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <Calendar className="h-5 w-5 text-blue-400 mb-2" />
                    <p className="text-2xl font-black text-white">{dashboardData.posts.scheduled}</p>
                    <p className="text-xs text-slate-400">Scheduled</p>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <FileText className="h-5 w-5 text-amber-400 mb-2" />
                    <p className="text-2xl font-black text-white">{dashboardData.posts.draft}</p>
                    <p className="text-xs text-slate-400">Drafts</p>
                  </div>
                  <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                    <BarChart2 className="h-5 w-5 text-violet-400 mb-2" />
                    <p className="text-2xl font-black text-white">{dashboardData.posts.total}</p>
                    <p className="text-xs text-slate-400">Total</p>
                  </div>
                </div>

                {/* Last Published */}
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Last Published</p>
                      <p className="text-sm font-medium text-white">
                        {dashboardData.posts.lastPublished
                          ? formatDate(dashboardData.posts.lastPublished)
                          : "No posts yet"}
                      </p>
                    </div>
                    <Clock className="h-5 w-5 text-slate-600" />
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Search Keywords Section */}
            {dashboardData.searchKeywords?.topKeywords?.length > 0 && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white mb-1">Search Visibility</h2>
                    <p className="text-xs text-slate-400">
                      Top {dashboardData.searchKeywords.topKeywords.length} of{" "}
                      {dashboardData.searchKeywords.totalKeywords} keywords
                    </p>
                  </div>
                  <Link
                    href="/google-business-profile/performance"
                    className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
                  >
                    View All <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dashboardData.searchKeywords.topKeywords.map((kw, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white mb-1">{kw.keyword}</p>
                        <p className="text-xs text-slate-500">{kw.impressions.toLocaleString()} impressions</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Rank</span>
                        <span className="text-lg font-bold text-violet-400">#{kw.rank}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SEO Snapshot */}
            {dashboardData.seoSnapshot?.lastAuditDate && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white mb-1">Local SEO Snapshot</h2>
                    <p className="text-xs text-slate-400">
                      Last audit: {formatDate(dashboardData.seoSnapshot.lastAuditDate)}
                    </p>
                  </div>
                  <Link
                    href="/google-business-profile/audit"
                    className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
                  >
                    Run Audit <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Overall", score: dashboardData.seoSnapshot.overallScore },
                    { label: "On-Page", score: dashboardData.seoSnapshot.onPageScore },
                    { label: "Technical", score: dashboardData.seoSnapshot.technicalScore },
                    { label: "Content", score: dashboardData.seoSnapshot.contentScore },
                  ].map(({ label, score }) => (
                    <div key={label} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <Gauge className={`h-5 w-5 ${getScoreColor(score)} mb-2`} />
                      <p className={`text-2xl font-black ${getScoreColor(score)}`}>{score}</p>
                      <p className="text-xs text-slate-400">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Recommendations */}
            {dashboardData.recommendations?.length > 0 && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="h-5 w-5 text-violet-400" />
                  <div>
                    <h2 className="text-lg font-bold text-white">AI Recommendations</h2>
                    <p className="text-xs text-slate-400">Personalized actions to improve performance</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {dashboardData.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-violet-500/30 transition"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs font-bold uppercase ${getPriorityColor(rec.priority)}`}>
                              {rec.priority}
                            </span>
                            <span className="text-xs text-slate-500">•</span>
                            <span className="text-xs text-slate-500 capitalize">{rec.type}</span>
                          </div>
                          <h3 className="text-sm font-bold text-white mb-1">{rec.title}</h3>
                          <p className="text-xs text-slate-400 mb-3">{rec.description}</p>
                          <Link
                            href={rec.actionUrl}
                            className="inline-flex items-center gap-1 text-xs font-medium text-violet-400 hover:text-violet-300"
                          >
                            {rec.action} <ArrowUpRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            {dashboardData.recentActivity?.length > 0 && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Activity className="h-5 w-5 text-blue-400" />
                  <div>
                    <h2 className="text-lg font-bold text-white">Recent Activity</h2>
                    <p className="text-xs text-slate-400">Latest updates and changes</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {dashboardData.recentActivity.slice(0, 5).map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30">
                      <div className="w-2 h-2 rounded-full bg-violet-400 mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-slate-300">{activity.message}</p>
                        <p className="text-xs text-slate-500 mt-1">{formatDate(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Media Manager Dashboard Widget */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-600/20 flex-shrink-0">
                  <ImageIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">AI Media Manager</h2>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      Live
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Sync Google Business photos, inspect image quality scores, detect duplicates, and generate monthly media plans.
                  </p>
                </div>
              </div>
              <Link
                href="/google-business-profile/media"
                className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-violet-600/25 flex-shrink-0"
              >
                Manage Media <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Quick Actions Grid */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { href: "/google-business-profile/media", label: "Media Manager", Icon: ImageIcon, color: "text-fuchsia-400" },
                  { href: "/google-business-profile/posts", label: "Create Post", Icon: FileText, color: "text-blue-400" },
                  { href: "/google-business-profile/reviews", label: "Reply to Reviews", Icon: Star, color: "text-amber-400" },
                  { href: "/google-business-profile/performance", label: "View Analytics", Icon: BarChart2, color: "text-violet-400" },
                  { href: "/google-business-profile/audit", label: "Run SEO Audit", Icon: Gauge, color: "text-emerald-400" },
                ].map(({ href, label, Icon, color }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-violet-500/30 hover:bg-slate-900 transition"
                  >
                    <Icon className={`h-6 w-6 ${color}`} />
                    <span className="text-xs font-medium text-slate-300 group-hover:text-white text-center">
                      {label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!dataLoading && !dashboardData && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No Data Available</h3>
            <p className="text-sm text-slate-400 mb-6">Try syncing your Google Business Profile data</p>
            <button
              onClick={handleSync}
              className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition"
            >
              Sync Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GbpDashboard() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

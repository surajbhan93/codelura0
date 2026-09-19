"use client";
import { useEffect, useState } from "react";
import {
  gbpGetLocations,
  gbpGetPerformanceDashboard,
  gbpGetPerformanceStats,
  gbpGetPerformanceTrend,
  gbpGetAIAnalysis,
  gbpGetPerformanceAlerts,
  gbpGetLocationComparison,
  gbpGetQuickStats,
  gbpGetActionCenter,
  gbpGetIntegratedStats,
  gbpSyncPerformanceData,
} from "@/lib/gbp/gbpApi";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Building2,
  Eye,
  Phone,
  Globe,
  Navigation,
  Star,
  FileText,
  Search,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Zap,
  Calendar,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

// Period selector options with month-based selection
const generateMonthOptions = () => {
  const months = [];
  const now = new Date();
  
  // Generate last 12 months
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      month: date.getMonth(),
      year: date.getFullYear(),
    });
  }
  
  return months;
};

const MONTH_OPTIONS = generateMonthOptions();

export default function PerformanceDashboardPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<string>("all");
  
  // Month-based period selection (like Google)
  const [startMonth, setStartMonth] = useState(() => {
    const months = MONTH_OPTIONS;
    return months[months.length - 2]; // Previous month
  });
  const [endMonth, setEndMonth] = useState(() => {
    const months = MONTH_OPTIONS;
    return months[months.length - 1]; // Current month
  });
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  
  // Dashboard data
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [aiAnalysis, setAIAnalysis] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [quickStats, setQuickStats] = useState<any>(null);
  const [actionCenter, setActionCenter] = useState<any>(null);
  const [integratedStats, setIntegratedStats] = useState<any>(null);
  
  const [selectedMetric, setSelectedMetric] = useState<string>("totalImpressions");
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (locations.length > 0) {
      loadDashboardData();
    }
  }, [selectedLocationId, startMonth, endMonth, locations]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const locRes = await gbpGetLocations();
      const locs = locRes.data.data || [];
      setLocations(locs);
      
      // Set initial location
      if (locs.length > 0) {
        const primary = locs.find((l: any) => l.isPrimary);
        setSelectedLocationId(primary?._id || locs[0]._id);
      }
    } catch (error: any) {
      console.error("[Performance] Load error:", error);
      toast.error(error?.response?.data?.message || "Failed to load locations");
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Calculate dates from month selection
      const startDate = new Date(startMonth.year, startMonth.month, 1);
      const endDate = new Date(endMonth.year, endMonth.month + 1, 0); // Last day of end month
      
      const startDateStr = startDate.toISOString().split("T")[0];
      const endDateStr = endDate.toISOString().split("T")[0];

      console.log("[Performance] Loading dashboard data:", {
        locationId: selectedLocationId,
        startDate: startDateStr,
        endDate: endDateStr,
        startMonth: startMonth.label,
        endMonth: endMonth.label,
      });

      // Get dashboard data with date range
      try {
        const dashboardRes = await gbpGetPerformanceDashboard({
          locationId: selectedLocationId,
          startDate: startDateStr,
          endDate: endDateStr,
        });
        
        console.log("[Performance] Dashboard response:", dashboardRes.data);
        
        // Check if we have data
        if (dashboardRes.data && (dashboardRes.data.snapshot || dashboardRes.data.locations)) {
          setDashboardData(dashboardRes.data);
          
          // Load additional data
          const promises: any = {};

          // Quick stats with date range
          promises.quickStats = gbpGetQuickStats(selectedLocationId === "all" ? undefined : selectedLocationId);
          
          // Alerts with date range
          promises.alerts = gbpGetPerformanceAlerts({
            locationId: selectedLocationId,
            startDate: startDateStr,
            endDate: endDateStr,
          });

          // Single location specific data
          if (selectedLocationId && selectedLocationId !== "all") {
            promises.trend = gbpGetPerformanceTrend({
              locationId: selectedLocationId,
              startDate: startDateStr,
              endDate: endDateStr,
            });
            promises.actionCenter = gbpGetActionCenter(selectedLocationId);
            promises.integratedStats = gbpGetIntegratedStats(selectedLocationId);
          }

          const results = await Promise.allSettled(Object.values(promises));
          const keys = Object.keys(promises);

          results.forEach((result, index) => {
            const key = keys[index];
            if (result.status === "fulfilled") {
              const data = (result.value as any)?.data;
              
              switch (key) {
                case "quickStats":
                  setQuickStats(data?.stats);
                  break;
                case "trend":
                  setTrendData(data?.data || []);
                  break;
                case "alerts":
                  setAlerts(data?.alerts || []);
                  break;
                case "actionCenter":
                  setActionCenter(data);
                  break;
                case "integratedStats":
                  console.log("[Performance] Integrated stats received:", data);
                  setIntegratedStats(data);
                  break;
              }
            } else {
              console.warn(`[Performance] ${key} failed:`, (result as PromiseRejectedResult).reason);
            }
          });
        } else {
          // No data - need to sync first
          console.log("[Performance] No snapshot found, showing sync prompt");
          setDashboardData(null);
        }
      } catch (dashboardError: any) {
        console.error("[Performance] Dashboard API error:", dashboardError);
        
        // If 404, means no data - show sync prompt
        if (dashboardError?.response?.status === 404) {
          console.log("[Performance] 404 - No data available, need to sync");
          setDashboardData(null);
        } else {
          toast.error(dashboardError?.response?.data?.message || "Failed to load performance data");
        }
      }

    } catch (error: any) {
      console.error("[Performance] Dashboard error:", error);
      toast.error("Failed to load performance data");
    } finally {
      setLoading(false);
    }
  };

  const loadAIAnalysis = async () => {
    if (!selectedLocationId || selectedLocationId === "all") return;
    
    try {
      setShowAIInsights(true);
      
      // Use month picker dates instead of selectedPeriod
      const startDate = new Date(startMonth.year, startMonth.month, 1);
      const endDate = new Date(endMonth.year, endMonth.month + 1, 0);
      
      const res = await gbpGetAIAnalysis({
        locationId: selectedLocationId,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      });
      
      setAIAnalysis(res.data?.analysis);
    } catch (error: any) {
      console.error("[Performance] AI Analysis error:", error);
      toast.error("Failed to generate AI insights");
      setShowAIInsights(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      
      const startDate = new Date(startMonth.year, startMonth.month, 1);
      const endDate = new Date(endMonth.year, endMonth.month + 1, 0);
      
      await gbpSyncPerformanceData({
        locationId: selectedLocationId,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      });
      
      toast.success("Performance data synced successfully");
      setLastSyncTime(new Date());
      await loadDashboardData();
    } catch (error: any) {
      console.error("[Performance] Sync error:", error);
      toast.error(error?.response?.data?.message || "Failed to sync data");
    } finally {
      setSyncing(false);
    }
  };

  // Get trend icon and color
  const getTrendDisplay = (trend: any) => {
    if (!trend) return { icon: Minus, color: "text-slate-400", bgColor: "bg-slate-500/10", text: "Stable" };
    
    switch (trend.status) {
      case "IMPROVING":
        return {
          icon: TrendingUp,
          color: "text-emerald-400",
          bgColor: "bg-emerald-500/10",
          text: "Improving",
        };
      case "DECLINING":
        return {
          icon: TrendingDown,
          color: "text-red-400",
          bgColor: "bg-red-500/10",
          text: "Declining",
        };
      case "STABLE":
        return {
          icon: Minus,
          color: "text-blue-400",
          bgColor: "bg-blue-500/10",
          text: "Stable",
        };
      default:
        return {
          icon: Activity,
          color: "text-slate-400",
          bgColor: "bg-slate-500/10",
          text: "Monitoring",
        };
    }
  };

  // Format number with change
  const formatMetricChange = (current: number, change: number) => {
    const isPositive = change > 0;
    const Icon = isPositive ? ArrowUpRight : ArrowDownRight;
    const colorClass = isPositive ? "text-emerald-400" : "text-red-400";
    
    return (
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-white">
          {current?.toLocaleString() || 0}
        </span>
        {change !== 0 && (
          <span className={`flex items-center gap-1 text-xs font-semibold ${colorClass}`}>
            <Icon className="h-3 w-3" />
            {Math.abs(change).toFixed(1)}%
          </span>
        )}
      </div>
    );
  };

  // Get snapshot data
  const snapshot = dashboardData?.snapshot || dashboardData?.locations?.[0];
  const performanceScore = snapshot?.performanceScore?.score || quickStats?.score || 0;
  const trend = snapshot?.trend || {};
  const trendDisplay = getTrendDisplay(trend);
  
  // Get metrics with comparison
  const metrics = snapshot?.metrics || {};
  const comparison = snapshot?.comparison?.metricChanges || {};

  return (
    <div className="flex flex-col h-full overflow-auto bg-slate-950">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-violet-400" />
              Local Performance Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time insights powered by Google Business Profile data
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Location Selector */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">
              <Building2 className="h-4 w-4 text-violet-400" />
              <select
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                className="bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer"
                disabled={loading}
              >
                {locations.length > 1 && (
                  <option value="all" className="bg-slate-900">
                    All Locations
                  </option>
                )}
                {locations.map((loc: any) => (
                  <option key={loc._id} value={loc._id} className="bg-slate-900">
                    {loc.locationName}
                  </option>
                ))}
              </select>
            </div>

            {/* Period Selector - Google Style */}
            <div className="relative">
              <button
                onClick={() => setShowMonthPicker(!showMonthPicker)}
                className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 hover:bg-slate-800 transition"
              >
                <Calendar className="h-4 w-4 text-violet-400" />
                <span className="text-white text-sm font-medium">
                  {startMonth.label} - {endMonth.label}
                </span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {/* Month Picker Dropdown */}
              {showMonthPicker && (
                <div className="absolute right-0 top-12 w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 z-50">
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase mb-3">
                      Time Period
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {MONTH_OPTIONS.map((month) => {
                        const isStart = month.value === startMonth.value;
                        const isEnd = month.value === endMonth.value;
                        const isInRange =
                          month.value >= startMonth.value && month.value <= endMonth.value;

                        return (
                          <button
                            key={month.value}
                            onClick={() => {
                              if (month.value < startMonth.value) {
                                setStartMonth(month);
                              } else if (month.value > endMonth.value) {
                                setEndMonth(month);
                              } else {
                                // Toggle selection
                                if (isStart) {
                                  setStartMonth(month);
                                  setEndMonth(month);
                                } else {
                                  setEndMonth(month);
                                }
                              }
                            }}
                            className={`py-2 px-3 rounded-lg text-xs font-semibold transition ${
                              isStart || isEnd
                                ? "bg-blue-500 text-white"
                                : isInRange
                                ? "bg-blue-500/20 text-blue-200 border border-blue-500/40"
                                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                            }`}
                          >
                            {month.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => setShowMonthPicker(false)}
                      className="px-4 py-1.5 text-xs text-slate-400 hover:text-white transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        setShowMonthPicker(false);
                        setLoading(true);
                        setDashboardData(null); // Clear old data
                        await loadDashboardData();
                      }}
                      className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sync Button */}
            <button
              onClick={handleSync}
              disabled={syncing || loading}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing..." : "Sync"}
            </button>
            
            {/* Sync Status Indicator */}
            {lastSyncTime && !syncing && (
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                Synced {new Date(lastSyncTime).toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-6 space-y-6">
        {loading && !dashboardData ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : locations.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center max-w-md mx-auto space-y-3">
            <Building2 className="h-10 w-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">
              No Google Business Profile Connected
            </h3>
            <p className="text-xs text-slate-400">
              Connect your GBP location to view performance analytics
            </p>
            <Link
              href="/google-business-profile"
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-lg transition mt-4"
            >
              Connect Now
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        ) : !dashboardData ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center max-w-md mx-auto space-y-4">
            <Activity className="h-12 w-12 text-violet-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">
              No Performance Data Available Yet
            </h3>
            <p className="text-sm text-slate-400">
              Click "Sync" to fetch your Google Business Profile performance data for the first time. 
              This will analyze your impressions, clicks, calls, and more.
            </p>
            <div className="bg-slate-800/50 rounded-xl p-4 text-left space-y-2">
              <p className="text-xs text-slate-300">📊 What you'll get:</p>
              <ul className="text-xs text-slate-400 space-y-1 ml-4">
                <li>• Search & Maps impressions</li>
                <li>• Website clicks & phone calls</li>
                <li>• Direction requests</li>
                <li>• Performance score & trends</li>
                <li>• AI-powered recommendations</li>
              </ul>
            </div>
            <button
              onClick={handleSync}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50 shadow-lg shadow-violet-600/20"
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing from Google..." : "Sync Now"}
            </button>
            {syncing && (
              <p className="text-xs text-slate-500">
                Fetching data from Google Business Profile API...
              </p>
            )}
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Performance Overview Card */}
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-900/50 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
                    Local Performance
                  </h2>
                  <div className="flex items-center gap-3 mt-2">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${trendDisplay.bgColor}`}>
                      <trendDisplay.icon className={`h-4 w-4 ${trendDisplay.color}`} />
                      <span className={`text-sm font-semibold ${trendDisplay.color}`}>
                        {trendDisplay.text}
                      </span>
                    </div>
                    {trend.scoreChange && (
                      <span className="text-sm text-slate-400">
                        {trend.scoreChange > 0 ? "+" : ""}
                        {trend.scoreChange} points vs previous period
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400 mb-1">
                    Codelura Performance Score
                  </div>
                  <div className="text-5xl font-bold text-white">
                    {performanceScore}
                    <span className="text-2xl text-slate-500">/100</span>
                  </div>
                </div>
              </div>

              {trend.message && (
                <p className="text-sm text-slate-300 mb-4">
                  {trend.message}
                </p>
              )}

              {/* Score Breakdown */}
              {snapshot?.performanceScore?.breakdown && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="bg-slate-800/50 rounded-xl p-3">
                    <div className="text-xs text-slate-400 mb-1">Visibility</div>
                    <div className="text-xl font-bold text-white">
                      {snapshot.performanceScore.breakdown.visibility}
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-3">
                    <div className="text-xs text-slate-400 mb-1">Engagement</div>
                    <div className="text-xl font-bold text-white">
                      {snapshot.performanceScore.breakdown.engagement}
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-3">
                    <div className="text-xs text-slate-400 mb-1">Conversion Rate</div>
                    <div className="text-xl font-bold text-white">
                      {snapshot.performanceScore.breakdown.conversionRate}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Alerts Section */}
            {alerts && alerts.length > 0 && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  Performance Alerts
                </h3>
                <div className="space-y-2">
                  {alerts.slice(0, 5).map((alert: any) => {
                    const severityColors = {
                      critical: "bg-red-500/10 border-red-500/30 text-red-400",
                      warning: "bg-amber-500/10 border-amber-500/30 text-amber-400",
                      positive: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
                      info: "bg-blue-500/10 border-blue-500/30 text-blue-400",
                    };

                    return (
                      <div
                        key={alert.id}
                        className={`p-3 rounded-xl border ${
                          severityColors[alert.severity as keyof typeof severityColors]
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-semibold text-sm mb-1">{alert.title}</div>
                            <div className="text-xs opacity-80">{alert.message}</div>
                          </div>
                          {alert.action && (
                            <Link
                              href={alert.action.link}
                              className="text-xs font-semibold hover:underline flex items-center gap-1"
                            >
                              {alert.action.label}
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Multi-Location Comparison Table */}
            {selectedLocationId === "all" && dashboardData?.locations && dashboardData.locations.length > 0 && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white">Location Performance Comparison</h3>
                  <div className="text-xs text-slate-400">
                    {dashboardData.locations.length} locations
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-800">
                        <th className="text-left text-xs font-semibold text-slate-400 pb-3 pr-4">
                          Location
                        </th>
                        <th className="text-center text-xs font-semibold text-slate-400 pb-3 px-3">
                          Score
                        </th>
                        <th className="text-center text-xs font-semibold text-slate-400 pb-3 px-3">
                          Trend
                        </th>
                        <th className="text-right text-xs font-semibold text-slate-400 pb-3 px-3">
                          Impressions
                        </th>
                        <th className="text-right text-xs font-semibold text-slate-400 pb-3 px-3">
                          Clicks
                        </th>
                        <th className="text-right text-xs font-semibold text-slate-400 pb-3 px-3">
                          Calls
                        </th>
                        <th className="text-right text-xs font-semibold text-slate-400 pb-3 px-3">
                          Reviews
                        </th>
                        <th className="text-center text-xs font-semibold text-slate-400 pb-3 pl-3">
                          Health
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.locations.map((loc: any, index: number) => {
                        const locationTrend = getTrendDisplay(loc.trend);
                        const isTopPerformer = index === 0;
                        
                        return (
                          <tr
                            key={loc.locationId}
                            className="border-b border-slate-800/50 hover:bg-slate-800/30 transition cursor-pointer"
                            onClick={() => setSelectedLocationId(loc.locationId)}
                          >
                            <td className="py-3 pr-4">
                              <div className="flex items-center gap-2">
                                {isTopPerformer && (
                                  <span className="text-yellow-400">🏆</span>
                                )}
                                <div>
                                  <div className="text-sm font-medium text-white">
                                    {loc.location?.name || "Unknown"}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    {loc.location?.address?.locality || ""}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="text-center py-3 px-3">
                              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-purple-600">
                                <span className="text-sm font-bold text-white">
                                  {loc.performanceScore?.score || 0}
                                </span>
                              </div>
                            </td>
                            <td className="text-center py-3 px-3">
                              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${locationTrend.bgColor}`}>
                                <locationTrend.icon className={`h-3 w-3 ${locationTrend.color}`} />
                                <span className={`text-xs font-semibold ${locationTrend.color}`}>
                                  {locationTrend.text}
                                </span>
                              </div>
                            </td>
                            <td className="text-right py-3 px-3">
                              <div className="text-sm font-medium text-white">
                                {(loc.metrics?.totalImpressions || 0).toLocaleString()}
                              </div>
                              {loc.trend?.improvingMetrics > 0 && (
                                <div className="text-xs text-emerald-400 flex items-center justify-end gap-0.5">
                                  <ArrowUpRight className="h-3 w-3" />
                                </div>
                              )}
                            </td>
                            <td className="text-right py-3 px-3">
                              <div className="text-sm font-medium text-white">
                                {(loc.metrics?.websiteClicks || 0).toLocaleString()}
                              </div>
                            </td>
                            <td className="text-right py-3 px-3">
                              <div className="text-sm font-medium text-white">
                                {(loc.metrics?.callClicks || 0).toLocaleString()}
                              </div>
                            </td>
                            <td className="text-right py-3 px-3">
                              <div className="flex items-center justify-end gap-1">
                                <span className="text-sm font-medium text-white">
                                  {loc.reviews?.total || 0}
                                </span>
                                <span className="text-xs text-slate-400">
                                  ({loc.reviews?.average || 0}⭐)
                                </span>
                              </div>
                            </td>
                            <td className="text-center py-3 pl-3">
                              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${
                                (loc.health?.score || 0) >= 80
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : (loc.health?.score || 0) >= 60
                                  ? "bg-amber-500/20 text-amber-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}>
                                <span className="text-xs font-bold">
                                  {loc.health?.score || 0}
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Summary Stats Below Table */}
                {dashboardData.summary && (
                  <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
                    <div className="text-center">
                      <div className="text-xs text-slate-400 mb-1">Average Score</div>
                      <div className="text-xl font-bold text-white">
                        {dashboardData.summary.avgScore}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-400 mb-1">Improving</div>
                      <div className="text-xl font-bold text-emerald-400">
                        {dashboardData.summary.improving}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-400 mb-1">Stable</div>
                      <div className="text-xl font-bold text-blue-400">
                        {dashboardData.summary.stable}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-400 mb-1">Declining</div>
                      <div className="text-xl font-bold text-red-400">
                        {dashboardData.summary.declining}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Main Metrics Grid - Real Google API Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  label: "Business Impressions",
                  sublabel: "Times shown on Google (Search + Maps)",
                  tooltip: "Business impressions from Google Business Profile Performance API. Multiple views by same user on same day count as 1.",
                  value: metrics.totalImpressions || quickStats?.impressions || 0,
                  change: comparison.totalImpressions?.percentChange || 0,
                  icon: Eye,
                  color: "text-indigo-400",
                  bgColor: "bg-indigo-500/10",
                },
                {
                  label: "Customer Actions",
                  sublabel: "Total interactions with your profile",
                  tooltip: "Sum of website clicks, phone calls, direction requests, and bookings",
                  value: metrics.totalInteractions || 0,
                  change: comparison.totalInteractions?.percentChange || 0,
                  icon: Target,
                  color: "text-pink-400",
                  bgColor: "bg-pink-500/10",
                },
                {
                  label: "Action Rate",
                  sublabel: "% of impressions that led to action",
                  tooltip: "Percentage calculated as (Customer Actions / Business Impressions) × 100",
                  value: metrics.actionRate !== null && metrics.actionRate !== undefined && !isNaN(parseFloat(metrics.actionRate))
                    ? `${parseFloat(metrics.actionRate).toFixed(2)}%`
                    : "N/A",
                  change: 0,
                  icon: TrendingUp,
                  color: "text-emerald-400",
                  bgColor: "bg-emerald-500/10",
                  isPercentage: true,
                },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 hover:bg-slate-900/70 transition group"
                  title={metric.tooltip}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                      <metric.icon className={`h-4 w-4 ${metric.color}`} />
                    </div>
                    {metric.change !== 0 && !metric.isPercentage && (
                      <span
                        className={`text-xs font-semibold flex items-center gap-1 ${
                          metric.change > 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {metric.change > 0 ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        {Math.abs(metric.change).toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mb-1">{metric.label}</div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {metric.isPercentage || metric.value === "N/A" 
                      ? metric.value 
                      : (typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value)}
                  </div>
                  <div className="text-xs text-slate-500">{metric.sublabel}</div>
                </div>
              ))}
            </div>

            {/* Action Breakdown - What customers do */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "Website Clicks",
                  sublabel: "Visited your website",
                  value: metrics.websiteClicks || quickStats?.websiteClicks || 0,
                  change: comparison.websiteClicks?.percentChange || 0,
                  icon: Globe,
                  color: "text-blue-400",
                  bgColor: "bg-blue-500/10",
                },
                {
                  label: "Phone Calls",
                  sublabel: "Called your business",
                  value: metrics.callClicks || quickStats?.callClicks || 0,
                  change: comparison.callClicks?.percentChange || 0,
                  icon: Phone,
                  color: "text-emerald-400",
                  bgColor: "bg-emerald-500/10",
                },
                {
                  label: "Direction Requests",
                  sublabel: "Got directions",
                  value: metrics.directions || quickStats?.directions || 0,
                  change: comparison.directions?.percentChange || 0,
                  icon: Navigation,
                  color: "text-amber-400",
                  bgColor: "bg-amber-500/10",
                },
                {
                  label: "Bookings",
                  sublabel: "Made a booking",
                  value: metrics.bookings || 0,
                  change: comparison.bookings?.percentChange || 0,
                  icon: Calendar,
                  color: "text-purple-400",
                  bgColor: "bg-purple-500/10",
                },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 hover:bg-slate-900/70 transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                      <metric.icon className={`h-4 w-4 ${metric.color}`} />
                    </div>
                    {metric.change !== 0 && (
                      <span
                        className={`text-xs font-semibold flex items-center gap-1 ${
                          metric.change > 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {metric.change > 0 ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        {Math.abs(metric.change).toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mb-1">{metric.label}</div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {metric.value.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500">{metric.sublabel}</div>
                </div>
              ))}
            </div>

            {/* Trend Chart */}
            {trendData && trendData.length > 0 && selectedLocationId !== "all" && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white">Performance Trend</h3>
                  <select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                  >
                    <option value="totalImpressions">Business Impressions</option>
                    <option value="totalInteractions">Customer Actions</option>
                    <option value="websiteClicks">Website Clicks</option>
                    <option value="callClicks">Phone Calls</option>
                    <option value="directions">Direction Requests</option>
                    <option value="bookings">Bookings</option>
                  </select>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#94a3b8", fontSize: 11 }}
                      stroke="#475569"
                    />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} stroke="#475569" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #334155",
                        borderRadius: 12,
                        color: "#fff",
                        fontSize: 12,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey={selectedMetric}
                      stroke="#8b5cf6"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#trendGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Where Are We Headed - Per-Metric Trend Analysis */}
            {snapshot && comparison && selectedLocationId !== "all" && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Target className="h-4 w-4 text-violet-400" />
                  Where Are We Headed?
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      label: "Visibility",
                      metrics: ["totalImpressions", "searchImpressions", "mapsImpressions"],
                      icon: Eye,
                    },
                    {
                      label: "Customer Actions",
                      metrics: ["totalInteractions", "websiteClicks", "callClicks"],
                      icon: Target,
                    },
                    {
                      label: "Directions & Bookings",
                      metrics: ["directions", "bookings"],
                      icon: Navigation,
                    },
                    {
                      label: "Content & Reviews",
                      metrics: [],
                      icon: Star,
                      custom: true,
                    },
                  ].map((category) => {
                    let categoryTrend = "stable";
                    let categoryColor = "text-blue-400";
                    let categoryBg = "bg-blue-500/10";
                    let CategoryIcon = Minus;

                    if (category.custom) {
                      // Reviews and posts trend
                      const reviewChange = snapshot.reviews?.total || 0;
                      const postChange = snapshot.posts?.total || 0;
                      if (reviewChange > 5 || postChange > 8) {
                        categoryTrend = "improving";
                        categoryColor = "text-emerald-400";
                        categoryBg = "bg-emerald-500/10";
                        CategoryIcon = TrendingUp;
                      } else if (postChange < 4) {
                        categoryTrend = "needs attention";
                        categoryColor = "text-amber-400";
                        categoryBg = "bg-amber-500/10";
                        CategoryIcon = TrendingDown;
                      }
                    } else {
                      // Calculate average trend for metrics in category
                      const metricTrends = category.metrics.map((m) => {
                        const change = comparison[m];
                        return change ? change.percentChange : 0;
                      });

                      const avgChange =
                        metricTrends.reduce((sum, c) => sum + c, 0) / metricTrends.length;

                      if (avgChange > 5) {
                        categoryTrend = "improving";
                        categoryColor = "text-emerald-400";
                        categoryBg = "bg-emerald-500/10";
                        CategoryIcon = TrendingUp;
                      } else if (avgChange < -5) {
                        categoryTrend = "declining";
                        categoryColor = "text-red-400";
                        categoryBg = "bg-red-500/10";
                        CategoryIcon = TrendingDown;
                      } else {
                        categoryTrend = "stable";
                        categoryColor = "text-blue-400";
                        categoryBg = "bg-blue-500/10";
                        CategoryIcon = Minus;
                      }
                    }

                    return (
                      <div
                        key={category.label}
                        className={`p-4 rounded-xl ${categoryBg} border border-slate-700/50`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <category.icon className={`h-4 w-4 ${categoryColor}`} />
                            <span className="text-sm font-semibold text-white">
                              {category.label}
                            </span>
                          </div>
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${categoryBg}`}>
                            <CategoryIcon className={`h-3 w-3 ${categoryColor}`} />
                            <span className={`text-xs font-semibold ${categoryColor} capitalize`}>
                              {categoryTrend}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400">
                          {categoryTrend === "improving"
                            ? `Your ${category.label.toLowerCase()} metrics are performing well`
                            : categoryTrend === "declining"
                            ? `${category.label} metrics need attention`
                            : categoryTrend === "needs attention"
                            ? `Increase your ${category.label.toLowerCase()} activity`
                            : `${category.label} metrics are stable`}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Overall Status Message */}
                {trend.message && (
                  <div className="mt-4 p-4 bg-slate-800/50 rounded-xl">
                    <p className="text-sm text-slate-300">{trend.message}</p>
                  </div>
                )}
              </div>
            )}

            {/* Action Center - continued in next part */}
            {actionCenter && actionCenter.actions && actionCenter.actions.length > 0 && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    Improve My GBP
                  </h3>
                  <div className="text-xs text-slate-400">
                    {actionCenter.summary.highPriority} high priority
                  </div>
                </div>

                <div className="space-y-3">
                  {actionCenter.actions.slice(0, 5).map((action: any) => {
                    const priorityColors = {
                      high: "bg-red-500/10 border-red-500/30 text-red-400",
                      medium: "bg-amber-500/10 border-amber-500/30 text-amber-400",
                      low: "bg-blue-500/10 border-blue-500/30 text-blue-400",
                    };

                    return (
                      <div
                        key={action.id}
                        className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                  priorityColors[action.priority as keyof typeof priorityColors]
                                }`}
                              >
                                {action.priority.toUpperCase()}
                              </span>
                              <span className="text-sm font-semibold text-white">
                                {action.title}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mb-2">{action.description}</p>
                            <div className="flex items-center gap-4 text-xs">
                              <span className="text-slate-500">
                                Impact: {action.impact}
                              </span>
                              {action.estimatedTime && (
                                <span className="text-slate-500">⏱ {action.estimatedTime}</span>
                              )}
                            </div>
                          </div>
                          {action.action && (
                            <Link
                              href={action.action.link}
                              className="ml-4 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1"
                            >
                              {action.action.label}
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Integrated Stats - Keywords, Reviews, Posts */}
            {selectedLocationId && selectedLocationId !== "all" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Search Keywords */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Search className="h-4 w-4 text-blue-400" />
                      Top Search Queries
                    </h4>
                    <Link
                      href={`/google-business-profile/keywords?locationId=${selectedLocationId}`}
                      className="text-xs text-violet-400 hover:text-violet-300"
                    >
                      View All
                    </Link>
                  </div>
                  {integratedStats?.keywords?.topQueries?.length > 0 ? (
                    <div className="space-y-2">
                      {integratedStats.keywords.topQueries.slice(0, 5).map((kw: any, i: number) => (
                        <div key={i} className="text-xs text-slate-300">
                          <span className="text-slate-500 mr-2">{i + 1}.</span>
                          {kw.keyword}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 py-2">
                      {loading ? "Loading..." : "No keyword data available"}
                    </div>
                  )}
                </div>

                {/* Reviews */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400" />
                      Reviews
                    </h4>
                    <Link
                      href={`/google-business-profile/reviews?locationId=${selectedLocationId}`}
                      className="text-xs text-violet-400 hover:text-violet-300"
                    >
                      Manage
                    </Link>
                  </div>
                  {integratedStats?.reviews ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Average Rating</span>
                        <span className="text-white font-semibold">
                          {integratedStats.reviews.average} ⭐
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Total Reviews</span>
                        <span className="text-white font-semibold">
                          {integratedStats.reviews.total}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Response Rate</span>
                        <span className="text-white font-semibold">
                          {integratedStats.reviews.responseRate}%
                        </span>
                      </div>
                      {integratedStats.reviews.unanswered > 0 && (
                        <div className="mt-2 p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                          <span className="text-xs text-amber-400 font-semibold">
                            {integratedStats.reviews.unanswered} unanswered reviews
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 py-2">
                      {loading ? "Loading..." : "No review data"}
                    </div>
                  )}
                </div>

                {/* Posts */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                      <FileText className="h-4 w-4 text-violet-400" />
                      Post Activity
                    </h4>
                    <Link
                      href={`/google-business-profile/post-scheduler?locationId=${selectedLocationId}`}
                      className="text-xs text-violet-400 hover:text-violet-300"
                    >
                      Create
                    </Link>
                  </div>
                  {integratedStats?.posts ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Published</span>
                        <span className="text-white font-semibold">
                          {integratedStats.posts.published}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Scheduled</span>
                        <span className="text-white font-semibold">
                          {integratedStats.posts.scheduled}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Recent Activity</span>
                        <span className="text-white font-semibold">
                          {integratedStats.posts.recentActivity} posts (30d)
                        </span>
                      </div>
                      {integratedStats.posts.recentActivity < 8 && (
                        <div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                          <span className="text-xs text-blue-400 font-semibold">
                            Post 2-3x per week for optimal engagement
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 py-2">
                      {loading ? "Loading..." : "No post data"}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AI Insights Button */}
            {selectedLocationId && selectedLocationId !== "all" && (
              <div className="text-center">
                {!showAIInsights ? (
                  <button
                    onClick={loadAIAnalysis}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold rounded-xl transition shadow-lg shadow-violet-600/20"
                  >
                    <Zap className="h-4 w-4" />
                    Generate AI Performance Analysis
                  </button>
                ) : aiAnalysis ? (
                  <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-violet-900/20 to-purple-900/20 p-6 text-left">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-violet-400" />
                      AI Performance Insights
                    </h3>
                    
                    {aiAnalysis.summary && (
                      <div className="mb-4 p-4 bg-slate-900/50 rounded-xl">
                        <p className="text-sm text-slate-200">{aiAnalysis.summary}</p>
                      </div>
                    )}

                    {aiAnalysis.keyInsights && aiAnalysis.keyInsights.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">
                          Key Insights
                        </h4>
                        <div className="space-y-2">
                          {aiAnalysis.keyInsights.map((insight: any, i: number) => {
                            const typeColors = {
                              positive: "text-emerald-400 bg-emerald-500/10",
                              negative: "text-red-400 bg-red-500/10",
                              neutral: "text-blue-400 bg-blue-500/10",
                            };
                            return (
                              <div
                                key={i}
                                className={`p-3 rounded-lg ${
                                  typeColors[insight.type as keyof typeof typeColors]
                                }`}
                              >
                                <div className="text-xs font-semibold mb-1">{insight.metric}</div>
                                <div className="text-xs opacity-90">{insight.insight}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {aiAnalysis.recommendations && aiAnalysis.recommendations.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">
                          Recommendations
                        </h4>
                        <div className="space-y-2">
                          {aiAnalysis.recommendations.map((rec: any, i: number) => (
                            <div key={i} className="p-3 bg-slate-900/50 rounded-lg">
                              <div className="flex items-start gap-2">
                                <span className="text-xs font-semibold text-violet-400 mt-0.5">
                                  {i + 1}.
                                </span>
                                <div className="flex-1">
                                  <div className="text-xs font-semibold text-white mb-1">
                                    {rec.action}
                                  </div>
                                  <div className="text-xs text-slate-400">{rec.reason}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {aiAnalysis.priorities && aiAnalysis.priorities.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">
                          Top Priorities
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {aiAnalysis.priorities.map((priority: string, i: number) => (
                            <div
                              key={i}
                              className="px-3 py-1.5 bg-violet-500/20 border border-violet-500/30 rounded-full text-xs text-violet-300"
                            >
                              {priority}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-4">
                    <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-slate-400 mt-2">Analyzing performance...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

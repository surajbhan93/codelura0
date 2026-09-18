"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  Lightbulb,
  MapPin,
  MessageSquare,
  RefreshCw,
  Search,
  Star,
  TrendingDown,
  TrendingUp,
  Image as ImageIcon,
  Globe,
  Navigation,
  Zap,
  Target,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  gbpGetLocations,
  gbpRunLocalSEOAudit,
  gbpGetLatestAudit,
  gbpGetAuditHistory,
  gbpGetActionPlan,
  gbpCompareAudits,
  gbpGetFixQueue,
} from "@/lib/gbp/gbpApi";
import { useRouter } from "next/navigation";

interface AuditCheck {
  id: string;
  category: string;
  title: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  status: "PASS" | "WARNING" | "CRITICAL" | "NOT_AVAILABLE";
  description: string;
  whyItMatters: string;
  currentValue?: string;
  expectedValue?: string;
  recommendation?: string;
  actionRoute?: string;
  evidence?: any;
}

interface AuditSummary {
  total: number;
  critical: number;
  warnings: number;
  passed: number;
  notAvailable: number;
}

interface Audit {
  id: string;
  score: number;
  summary: AuditSummary;
  checks: AuditCheck[];
  breakdown: {
    profile: AuditCheck[];
    reviews: AuditCheck[];
    media: AuditCheck[];
    posts: AuditCheck[];
    website: AuditCheck[];
    nap: AuditCheck[];
    performance: AuditCheck[];
    visibility: AuditCheck[];
    competitors: AuditCheck[];
  };
  auditedAt: string;
}

interface ActionPlanItem {
  id: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  category: string;
  issue: string;
  description: string;
  whyItMatters: string;
  recommendation: string;
  actionRoute?: string;
  evidence?: any;
  estimatedImpact: string;
}

const LocalSEOAuditPage = () => {
  const router = useRouter();
  
  // Local state for locations
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");

  const [audit, setAudit] = useState<Audit | null>(null);
  const [actionPlan, setActionPlan] = useState<ActionPlanItem[]>([]);
  const [auditHistory, setAuditHistory] = useState<any[]>([]);
  const [comparison, setComparison] = useState<any>(null);
  const [fixQueue, setFixQueue] = useState<any>(null);
  const [showFixModal, setShowFixModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [runningAudit, setRunningAudit] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["Critical Issues", "AI Action Plan"])
  );

  const selectedLocation = locations.find((loc) => loc._id === selectedLocationId);

  // Load locations on mount
  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const response = await gbpGetLocations();
      const locs = response.data.data || [];
      setLocations(locs);
      
      if (locs.length > 0) {
        const primary = locs.find((l: any) => l.isPrimary);
        setSelectedLocationId(primary?._id || locs[0]._id);
      }
    } catch (error) {
      console.error("Failed to load locations:", error);
      toast.error("Failed to load locations");
    }
  };

  // Load latest audit when location changes
  useEffect(() => {
    if (selectedLocationId) {
      loadLatestAudit();
      loadAuditHistory();
      loadFixQueue();
    }
  }, [selectedLocationId]);

  const loadLatestAudit = async () => {
    if (!selectedLocationId) return;

    try {
      setLoading(true);
      const response = await gbpGetLatestAudit(selectedLocationId);
      
      if (response.data.success && response.data.audit) {
        setAudit(response.data.audit);
        loadActionPlan();
        loadComparison();
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        // No audit found - that's okay
        setAudit(null);
      } else {
        console.error("Failed to load audit:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadAuditHistory = async () => {
    if (!selectedLocationId) return;

    try {
      const response = await gbpGetAuditHistory(selectedLocationId, 10);
      if (response.data.success) {
        setAuditHistory(response.data.audits || []);
      }
    } catch (error: any) {
      // Silently fail - history is optional
    }
  };

  const loadActionPlan = async () => {
    if (!selectedLocationId) return;

    try {
      const response = await gbpGetActionPlan(selectedLocationId);
      if (response.data.success && response.data.actionPlan) {
        setActionPlan(response.data.actionPlan.actions || []);
      }
    } catch (error) {
      console.error("Failed to load action plan:", error);
    }
  };

  const loadFixQueue = async () => {
    if (!selectedLocationId) return;

    try {
      const response = await gbpGetFixQueue(selectedLocationId);
      if (response.data.success && response.data.fixQueue) {
        setFixQueue(response.data.fixQueue);
      }
    } catch (error) {
      console.error("Failed to load fix queue:", error);
    }
  };

  const loadComparison = async () => {
    if (!selectedLocationId) return;

    try {
      const response = await gbpCompareAudits(selectedLocationId);
      if (response.data.success && response.data.comparison) {
        setComparison(response.data.comparison);
      }
    } catch (error) {
      // Silently fail - comparison is optional
    }
  };

  const runAudit = async () => {
    if (!selectedLocationId) {
      toast.error("Please select a location");
      return;
    }

    try {
      setRunningAudit(true);
      toast.loading("Running Local SEO audit...", { id: "audit-run" });

      const response = await gbpRunLocalSEOAudit(selectedLocationId);

      if (response.data.success && response.data.audit) {
        setAudit(response.data.audit);
        toast.success(`Audit complete! Score: ${response.data.audit.score}/100`, {
          id: "audit-run",
        });
        
        // Reload related data
        loadAuditHistory();
        loadActionPlan();
        loadComparison();
        loadFixQueue();
      }
    } catch (error: any) {
      console.error("Audit failed:", error);
      toast.error(error.response?.data?.message || "Failed to run audit", {
        id: "audit-run",
      });
    } finally {
      setRunningAudit(false);
    }
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleFixNow = (actionRoute: string | undefined) => {
    if (actionRoute) {
      router.push(actionRoute);
    } else {
      toast("This action requires manual attention", { icon: "ℹ️" });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PASS":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "WARNING":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "CRITICAL":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "GBP Profile":
        return <MapPin className="w-5 h-5" />;
      case "Reviews":
        return <MessageSquare className="w-5 h-5" />;
      case "Media":
        return <ImageIcon className="w-5 h-5" />;
      case "Posts":
        return <FileText className="w-5 h-5" />;
      case "Website SEO":
        return <Globe className="w-5 h-5" />;
      case "NAP Consistency":
        return <Navigation className="w-5 h-5" />;
      case "Performance":
        return <BarChart3 className="w-5 h-5" />;
      case "Visibility":
        return <Search className="w-5 h-5" />;
      case "Competitors":
        return <Target className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-600";
    if (score >= 60) return "from-yellow-500 to-orange-500";
    if (score >= 40) return "from-orange-500 to-red-500";
    return "from-red-500 to-rose-600";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "MEDIUM":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "LOW":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  if (!selectedLocationId) {
    return (
      <div className="p-6">
        <div className="bg-[#1a1625] border border-purple-500/20 rounded-xl p-8 text-center">
          <MapPin className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No Location Selected
          </h3>
          <p className="text-gray-400 mb-4">
            Please select a location to view Local SEO Audit
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Local SEO Audit Center
          </h1>
          <p className="text-gray-400">
            Comprehensive audit powered by real Google Business Profile data
          </p>
        </div>

        <div className="flex items-center gap-3">
          {audit && fixQueue && fixQueue.totalIssues > 0 && (
            <button
              onClick={() => setShowFixModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-medium transition-all"
            >
              <Zap className="w-5 h-5" />
              Fix Everything ({fixQueue.totalIssues})
            </button>
          )}
          
          <button
            onClick={runAudit}
            disabled={runningAudit || loading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-medium transition-all"
          >
            <RefreshCw
              className={`w-5 h-5 ${runningAudit ? "animate-spin" : ""}`}
            />
            {runningAudit ? "Running Audit..." : "Run Audit"}
          </button>
        </div>
      </div>

      {/* Location Info */}
      {selectedLocation && (
        <div className="bg-[#1a1625] border border-purple-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-purple-500" />
              <div>
                <div className="text-white font-medium">
                  {selectedLocation.locationName}
                </div>
                <div className="text-sm text-gray-400">
                  {selectedLocation.storefrontAddress?.locality},{" "}
                  {selectedLocation.storefrontAddress?.administrativeArea}
                </div>
              </div>
            </div>
            
            {/* Location Selector */}
            {locations.length > 1 && (
              <select
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                className="px-4 py-2 bg-[#251835] border border-purple-500/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500/50"
              >
                {locations.map((loc) => (
                  <option key={loc._id} value={loc._id}>
                    {loc.locationName}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      )}

      {loading && !audit ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
      ) : !audit ? (
        <div className="bg-[#1a1625] border border-purple-500/20 rounded-xl p-12 text-center">
          <Target className="w-16 h-16 text-purple-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">
            No Audit Data Available
          </h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Run your first Local SEO audit to get comprehensive insights about your
            Google Business Profile optimization.
          </p>
          <button
            onClick={runAudit}
            disabled={runningAudit}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium transition-all"
          >
            <Zap className="w-5 h-5" />
            Run First Audit
          </button>
        </div>
      ) : (
        <>
          {/* Score Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Score */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-[#1a1625] to-[#251835] border border-purple-500/30 rounded-xl p-6">
                <div className="text-center">
                  <div className="text-gray-400 text-sm font-medium mb-4">
                    Codelura Local SEO Health Score
                  </div>
                  <div
                    className={`text-7xl font-bold mb-2 bg-gradient-to-r ${getScoreGradient(
                      audit.score
                    )} bg-clip-text text-transparent`}
                  >
                    {audit.score}
                  </div>
                  <div className="text-gray-500 text-lg mb-4">out of 100</div>

                  {comparison && (
                    <div className="flex items-center justify-center gap-2 text-sm">
                      {comparison.scoreChange > 0 ? (
                        <>
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-green-500">
                            +{comparison.scoreChange} points
                          </span>
                        </>
                      ) : comparison.scoreChange < 0 ? (
                        <>
                          <TrendingDown className="w-4 h-4 text-red-500" />
                          <span className="text-red-500">
                            {comparison.scoreChange} points
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-400">No change</span>
                      )}
                      <span className="text-gray-500">vs last audit</span>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-purple-500/20 text-xs text-gray-500">
                    Last audited:{" "}
                    {new Date(audit.auditedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#1a1625] border border-red-500/20 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="text-3xl font-bold text-red-500">
                    {audit.summary.critical}
                  </div>
                </div>
                <div className="text-sm text-gray-400">Critical Issues</div>
              </div>

              <div className="bg-[#1a1625] border border-yellow-500/20 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="text-3xl font-bold text-yellow-500">
                    {audit.summary.warnings}
                  </div>
                </div>
                <div className="text-sm text-gray-400">Warnings</div>
              </div>

              <div className="bg-[#1a1625] border border-green-500/20 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-green-500">
                    {audit.summary.passed}
                  </div>
                </div>
                <div className="text-sm text-gray-400">Passed</div>
              </div>

              <div className="bg-[#1a1625] border border-gray-500/20 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gray-500/10 rounded-lg">
                    <Clock className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="text-3xl font-bold text-gray-400">
                    {audit.summary.notAvailable}
                  </div>
                </div>
                <div className="text-sm text-gray-400">Not Available</div>
              </div>
            </div>
          </div>

          {/* Critical Issues Section */}
          {audit.summary.critical > 0 && (
            <div className="bg-[#1a1625] border border-red-500/30 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleCategory("Critical Issues")}
                className="w-full flex items-center justify-between p-6 hover:bg-red-500/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <div>
                    <h3 className="text-xl font-bold text-white text-left">
                      Critical Issues
                    </h3>
                    <p className="text-sm text-gray-400 text-left">
                      {audit.summary.critical} issues require immediate attention
                    </p>
                  </div>
                </div>
                {expandedCategories.has("Critical Issues") ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {expandedCategories.has("Critical Issues") && (
                <div className="border-t border-red-500/20 p-6 space-y-4">
                  {audit.checks
                    .filter((check) => check.status === "CRITICAL")
                    .map((check) => (
                      <CheckCard
                        key={check.id}
                        check={check}
                        onFixNow={handleFixNow}
                      />
                    ))}
                </div>
              )}
            </div>
          )}

          {/* AI Action Plan */}
          {actionPlan.length > 0 && (
            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleCategory("AI Action Plan")}
                className="w-full flex items-center justify-between p-6 hover:bg-purple-500/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-6 h-6 text-purple-400" />
                  <div>
                    <h3 className="text-xl font-bold text-white text-left">
                      AI Local SEO Action Plan
                    </h3>
                    <p className="text-sm text-gray-400 text-left">
                      {actionPlan.length} prioritized actions to improve your score
                    </p>
                  </div>
                </div>
                {expandedCategories.has("AI Action Plan") ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {expandedCategories.has("AI Action Plan") && (
                <div className="border-t border-purple-500/20 p-6 space-y-4">
                  {actionPlan.map((action, index) => (
                    <ActionCard
                      key={action.id}
                      action={action}
                      index={index}
                      onFixNow={handleFixNow}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Audit Categories */}
          {Object.entries(audit.breakdown).map(([category, checks]) => {
            const categoryName =
              category === "profile"
                ? "GBP Profile"
                : category === "reviews"
                ? "Reviews"
                : category === "media"
                ? "Media"
                : category === "posts"
                ? "Posts"
                : category === "website"
                ? "Website SEO"
                : category === "nap"
                ? "NAP Consistency"
                : category === "performance"
                ? "Performance"
                : category === "visibility"
                ? "Visibility"
                : category === "competitors"
                ? "Competitors"
                : category;

            const categoryChecks = checks as AuditCheck[];
            const criticalCount = categoryChecks.filter(
              (c) => c.status === "CRITICAL"
            ).length;
            const warningCount = categoryChecks.filter(
              (c) => c.status === "WARNING"
            ).length;
            const passCount = categoryChecks.filter(
              (c) => c.status === "PASS"
            ).length;

            return (
              <div
                key={category}
                className="bg-[#1a1625] border border-purple-500/20 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleCategory(categoryName)}
                  className="w-full flex items-center justify-between p-6 hover:bg-purple-500/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(categoryName)}
                    <div>
                      <h3 className="text-lg font-semibold text-white text-left">
                        {categoryName}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        {criticalCount > 0 && (
                          <span className="text-red-500">
                            {criticalCount} critical
                          </span>
                        )}
                        {warningCount > 0 && (
                          <span className="text-yellow-500">
                            {warningCount} warnings
                          </span>
                        )}
                        {passCount > 0 && (
                          <span className="text-green-500">
                            {passCount} passed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {expandedCategories.has(categoryName) ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {expandedCategories.has(categoryName) && (
                  <div className="border-t border-purple-500/20 p-6 space-y-4">
                    {categoryChecks.map((check) => (
                      <CheckCard
                        key={check.id}
                        check={check}
                        onFixNow={handleFixNow}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Audit History */}
          {auditHistory.length > 1 && (
            <div className="bg-[#1a1625] border border-purple-500/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-purple-500" />
                <div>
                  <h3 className="text-xl font-bold text-white">Audit History</h3>
                  <p className="text-sm text-gray-400">
                    Track your Local SEO improvements over time
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {auditHistory.map((histAudit, index) => (
                  <div
                    key={histAudit.id}
                    className="flex items-center justify-between p-4 bg-[#251835] rounded-lg border border-purple-500/10"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`text-2xl font-bold ${getScoreColor(
                          histAudit.score
                        )}`}
                      >
                        {histAudit.score}
                      </div>
                      <div>
                        <div className="text-sm text-white font-medium">
                          {new Date(histAudit.auditedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                        <div className="text-xs text-gray-400">
                          {histAudit.summary.critical} critical •{" "}
                          {histAudit.summary.warnings} warnings •{" "}
                          {histAudit.summary.passed} passed
                        </div>
                      </div>
                    </div>
                    {index === 0 && (
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-full">
                        Latest
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Fix Everything Modal */}
      {showFixModal && fixQueue && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-[#1a1625] border border-purple-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-purple-500/20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Fix Everything
                  </h2>
                  <p className="text-gray-400">
                    {fixQueue.totalIssues} fixable issues found • Potential score
                    increase: +{fixQueue.potentialScoreIncrease} points
                  </p>
                </div>
                <button
                  onClick={() => setShowFixModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <span className="text-red-400 font-medium">
                    {fixQueue.criticalCount} Critical
                  </span>
                </div>
                <div className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <span className="text-yellow-400 font-medium">
                    {fixQueue.warningCount} Warnings
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {Object.entries(fixQueue.groupedByCategory).map(
                ([category, issues]: [string, any]) => (
                  <div
                    key={category}
                    className="bg-[#251835] border border-purple-500/20 rounded-xl p-5"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      {getCategoryIcon(category)}
                      <h3 className="text-lg font-semibold text-white">
                        {category}
                      </h3>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded">
                        {issues.length} issues
                      </span>
                    </div>

                    <div className="space-y-3">
                      {issues.map((issue: any) => (
                        <div
                          key={issue.id}
                          className="flex items-start justify-between p-4 bg-[#1a1625] border border-white/10 rounded-lg hover:border-purple-500/30 transition-colors"
                        >
                          <div className="flex items-start gap-3 flex-1">
                            {getStatusIcon(issue.status)}
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-white">
                                  {issue.title}
                                </h4>
                                <span
                                  className={`px-2 py-0.5 text-xs rounded ${
                                    issue.severity === "HIGH"
                                      ? "bg-red-500/20 text-red-400"
                                      : issue.severity === "MEDIUM"
                                      ? "bg-yellow-500/20 text-yellow-400"
                                      : "bg-blue-500/20 text-blue-400"
                                  }`}
                                >
                                  {issue.severity}
                                </span>
                              </div>
                              <p className="text-sm text-gray-400 mb-2">
                                {issue.description}
                              </p>
                              <div className="text-xs text-gray-500">
                                <strong>Current:</strong> {issue.currentValue} →{" "}
                                <strong>Expected:</strong> {issue.expectedValue}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setShowFixModal(false);
                              handleFixNow(issue.actionRoute);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors flex-shrink-0 ml-4"
                          >
                            Fix
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-purple-500/20">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  Click "Fix" on each issue to navigate to the relevant module
                </p>
                <button
                  onClick={() => setShowFixModal(false)}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Check Card Component
const CheckCard: React.FC<{
  check: AuditCheck;
  onFixNow: (route: string | undefined) => void;
}> = ({ check, onFixNow }) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = () => {
    switch (check.status) {
      case "PASS":
        return "border-green-500/20 bg-green-500/5";
      case "WARNING":
        return "border-yellow-500/20 bg-yellow-500/5";
      case "CRITICAL":
        return "border-red-500/20 bg-red-500/5";
      default:
        return "border-gray-500/20 bg-gray-500/5";
    }
  };

  const getStatusIcon = () => {
    switch (check.status) {
      case "PASS":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "WARNING":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "CRITICAL":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className={`border rounded-lg ${getStatusColor()}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-start gap-3 flex-1">
          {getStatusIcon()}
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-white">{check.title}</h4>
              <span className="px-2 py-0.5 bg-white/10 text-xs text-gray-300 rounded">
                {check.severity}
              </span>
            </div>
            <p className="text-sm text-gray-400">{check.description}</p>
          </div>
        </div>
        {expanded ? (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-white/10 p-4 space-y-3">
          <div>
            <div className="text-xs font-medium text-gray-400 mb-1">
              Why it matters
            </div>
            <div className="text-sm text-gray-300">{check.whyItMatters}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-medium text-gray-400 mb-1">
                Current
              </div>
              <div className="text-sm text-white">{check.currentValue}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-400 mb-1">
                Expected
              </div>
              <div className="text-sm text-white">{check.expectedValue}</div>
            </div>
          </div>

          {check.recommendation && (
            <div>
              <div className="text-xs font-medium text-gray-400 mb-1">
                Recommendation
              </div>
              <div className="text-sm text-gray-300">{check.recommendation}</div>
            </div>
          )}

          {check.actionRoute && check.status !== "PASS" && (
            <button
              onClick={() => onFixNow(check.actionRoute)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Fix Now
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Action Card Component
const ActionCard: React.FC<{
  action: ActionPlanItem;
  index: number;
  onFixNow: (route: string | undefined) => void;
}> = ({ action, index, onFixNow }) => {
  const [expanded, setExpanded] = useState(index < 3); // Auto-expand top 3

  const getPriorityColor = () => {
    switch (action.priority) {
      case "HIGH":
        return "border-red-500/30 bg-red-500/10";
      case "MEDIUM":
        return "border-yellow-500/30 bg-yellow-500/10";
      case "LOW":
        return "border-blue-500/30 bg-blue-500/10";
      default:
        return "border-gray-500/30 bg-gray-500/10";
    }
  };

  const getPriorityBadge = () => {
    switch (action.priority) {
      case "HIGH":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "MEDIUM":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "LOW":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className={`border rounded-lg ${getPriorityColor()}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-start gap-3 flex-1">
          <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 font-bold text-sm">
            {index + 1}
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-white">{action.issue}</h4>
              <span
                className={`px-2 py-0.5 text-xs border rounded ${getPriorityBadge()}`}
              >
                {action.priority}
              </span>
            </div>
            <p className="text-sm text-gray-400">{action.description}</p>
            <div className="mt-1 text-xs text-gray-500">
              {action.estimatedImpact}
            </div>
          </div>
        </div>
        {expanded ? (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-white/10 p-4 space-y-3">
          <div>
            <div className="text-xs font-medium text-gray-400 mb-1">
              Why it matters
            </div>
            <div className="text-sm text-gray-300">{action.whyItMatters}</div>
          </div>

          <div>
            <div className="text-xs font-medium text-gray-400 mb-1">
              Recommended Action
            </div>
            <div className="text-sm text-gray-300">{action.recommendation}</div>
          </div>

          <div className="flex items-center gap-3">
            {action.actionRoute && (
              <button
                onClick={() => onFixNow(action.actionRoute)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Zap className="w-4 h-4" />
                Fix Now
              </button>
            )}
            <div className="text-xs text-gray-500">
              Category: {action.category}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalSEOAuditPage;

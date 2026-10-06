"use client";
import React, { useEffect, useState, useCallback, ReactNode } from "react";
import {
  gbpGetLocations,
  gbpGetServices,
  gbpSyncServices,
  gbpGetSupportedServices,
  gbpAnalyzeServices,
  gbpAddService,
  gbpDeleteService,
  gbpGetServiceRecommendations,
  gbpApproveRecommendation,
  gbpRejectRecommendation,
  gbpBulkApplyServices,
  gbpGetServiceActivity,
  gbpGetServiceHealth,
  gbpBulkAnalyzeLocations,
  gbpApplyServices,
} from "@/lib/gbp/gbpApi";
import {
  Wrench, Bot, Building2, RefreshCw, Plus, Trash2, CheckCircle,
  XCircle, Clock, AlertCircle, Sparkles,
  Activity, Layers, Zap, Search,
  CheckSquare, Square, ArrowRight, Tag, Check, X, Edit3, FolderTree
} from "lucide-react";
import toast from "react-hot-toast";

const ACTION_COLORS: Record<string, string> = {
  ADD: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  MODIFY: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  REMOVE: "text-red-400 bg-red-500/10 border-red-500/30",
  KEEP: "text-slate-400 bg-slate-500/10 border-slate-500/30",
  REVIEW: "text-violet-400 bg-violet-500/10 border-violet-500/30",
};

const ACTION_ICONS: Record<string, ReactNode> = {
  ADD: <Plus className="h-3.5 w-3.5" />,
  MODIFY: <ArrowRight className="h-3.5 w-3.5" />,
  REMOVE: <XCircle className="h-3.5 w-3.5" />,
  KEEP: <CheckCircle className="h-3.5 w-3.5" />,
  REVIEW: <AlertCircle className="h-3.5 w-3.5" />,
};

export default function ServicesPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [location, setLocation] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"services" | "suggestions" | "supported" | "history">("services");
  const [loading, setLoading] = useState(true);

  // Data states
  const [services, setServices] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [supportedServices, setSupportedServices] = useState<any[]>([]);
  const [supportedServicesGrouped, setSupportedServicesGrouped] = useState<any[]>([]);
  const [health, setHealth] = useState<any>(null);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);

  // UI states
  const [syncing, setSyncing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [applyingIds, setApplyingIds] = useState<Set<string>>(new Set());
  const [selectedRecs, setSelectedRecs] = useState<Set<string>>(new Set());
  const [bulkApplying, setBulkApplying] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [targetModalCategory, setTargetModalCategory] = useState<string>("");
  const [newServiceName, setNewServiceName] = useState("");
  const [addingService, setAddingService] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Inline Recommendation Editing
  const [editingRecId, setEditingRecId] = useState<string | null>(null);
  const [editedRecName, setEditedRecName] = useState("");

  // Add Services Modal selection state
  const [modalSelectedServices, setModalSelectedServices] = useState<Set<string>>(new Set());
  const [loadingSupportedModal, setLoadingSupportedModal] = useState(false);
  const [aiSuggestingModal, setAiSuggestingModal] = useState(false);

  // Bulk locations UI
  const [showBulk, setShowBulk] = useState(false);
  const [bulkSelected, setBulkSelected] = useState<Set<string>>(new Set());
  const [bulkAnalyzing, setBulkAnalyzing] = useState(false);
  const [bulkResults, setBulkResults] = useState<any[]>([]);

  // Load locations on mount
  useEffect(() => {
    const init = async () => {
      try {
        const res = await gbpGetLocations();
        const locs = res.data.data || [];
        setLocations(locs);
        const loc = locs.find((l: any) => l.isPrimary) || locs[0] || null;
        if (loc) setLocation(loc);
      } catch {
        toast.error("Failed to load locations.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Load all data when location changes
  const loadLocationData = useCallback(async (loc: any) => {
    if (!loc) return;
    setLoading(true);
    try {
      const [svcRes, recRes, healthRes, suppRes] = await Promise.allSettled([
        gbpGetServices(loc._id),
        gbpGetServiceRecommendations(loc._id),
        gbpGetServiceHealth(loc._id),
        gbpGetSupportedServices(loc._id),
      ]);
      if (svcRes.status === "fulfilled") setServices(svcRes.value.data.data?.dbServices || []);
      if (recRes.status === "fulfilled") setRecommendations(recRes.value.data.data || []);
      if (healthRes.status === "fulfilled") setHealth(healthRes.value.data.data);
      if (suppRes.status === "fulfilled") {
        setSupportedServices(suppRes.value.data.data?.supportedServices || []);
        setSupportedServicesGrouped(suppRes.value.data.data?.supportedServicesGrouped || []);
      }
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    loadLocationData(location);
  }, [location, loadLocationData]);

  const ensureSupportedServices = useCallback(async (force = false) => {
    if (!location) return;
    if (!force && supportedServicesGrouped.length > 0) return;
    setLoadingSupportedModal(true);
    try {
      const r = await gbpGetSupportedServices(location._id);
      setSupportedServices(r.data.data?.supportedServices || []);
      setSupportedServicesGrouped(r.data.data?.supportedServicesGrouped || []);
    } catch {
      toast.error("Could not load Google category services.");
    } finally {
      setLoadingSupportedModal(false);
    }
  }, [location, supportedServicesGrouped.length]);

  useEffect(() => {
    if (!location) return;
    if (activeTab === "supported") {
      ensureSupportedServices();
    }
    if (activeTab === "history" && activityLogs.length === 0) {
      gbpGetServiceActivity(location._id)
        .then((r) => setActivityLogs(r.data.data || []))
        .catch(() => {});
      gbpGetServiceRecommendations(location._id, "history")
        .then((r) => setHistory(r.data.data || []))
        .catch(() => {});
    }
  }, [activeTab, location, ensureSupportedServices, activityLogs.length]);

  const openAddModal = (categoryName?: string) => {
    setModalSelectedServices(new Set());
    setNewServiceName("");
    setTargetModalCategory(categoryName || location?.primaryCategory?.displayName || location?.primaryCategory?.name || location?.locationName || "Primary Category");
    setShowAddModal(true);
    ensureSupportedServices(true);
  };

  const handleLocationChange = (locId: string) => {
    const loc = locations.find((l) => l._id === locId);
    if (loc) {
      setLocation(loc);
      setRecommendations([]);
      setServices([]);
      setSupportedServices([]);
      setSupportedServicesGrouped([]);
      setActivityLogs([]);
      setHistory([]);
      setHealth(null);
      setSelectedRecs(new Set());
    }
  };

  const handleSync = async () => {
    if (!location) return;
    setSyncing(true);
    try {
      const res = await gbpSyncServices(location._id);
      setServices(res.data.data?.dbServices || []);
      toast.success("Services synced from Google.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Sync failed.");
    } finally {
      setSyncing(false);
    }
  };

  const handleAnalyze = async () => {
    if (!location) return;
    setAnalyzing(true);
    toast.loading("Grok AI is analyzing your business context...", { id: "analyze" });
    try {
      const res = await gbpAnalyzeServices(location._id);
      const recs = res.data.data?.recommendations || [];
      setRecommendations(recs);
      const score = res.data.data?.serviceHealthScore;
      if (score !== undefined) setHealth((h: any) => ({ ...h, score }));
      toast.success(`Grok AI generated ${recs.length} service recommendations!`, { id: "analyze" });
      setActiveTab("suggestions");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "AI analysis failed.", { id: "analyze" });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleModalAISuggest = async () => {
    if (!location) return;
    setAiSuggestingModal(true);
    toast.loading("Grok AI is picking the best services for your category...", { id: "modal-ai" });
    try {
      const res = await gbpAnalyzeServices(location._id);
      const recs = res.data.data?.recommendations || [];
      
      const autoSelected = new Set<string>();
      recs.forEach((r: any) => {
        if (r.action === "ADD" && r.proposedServiceTypeId) {
          autoSelected.add(r.proposedServiceTypeId);
        }
      });

      const customAdd = recs.find((r: any) => r.action === "ADD" && !r.proposedServiceTypeId && r.proposedServiceName);
      if (customAdd) {
        setNewServiceName(customAdd.proposedServiceName);
      }

      setModalSelectedServices(autoSelected);
      toast.success(`Grok AI auto-selected ${autoSelected.size} top services!`, { id: "modal-ai" });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Grok AI suggestion failed.", { id: "modal-ai" });
    } finally {
      setAiSuggestingModal(false);
    }
  };

  const handleApprove = async (rec: any, customDisplayName?: string) => {
    const targetName = customDisplayName || rec.proposedServiceName;
    setApplyingIds((s) => new Set(s).add(rec._id));
    try {
      if (customDisplayName && customDisplayName !== rec.proposedServiceName) {
        await gbpApplyServices(location._id, {
          additions: rec.action === "ADD" ? [{ displayName: targetName, serviceTypeId: rec.proposedServiceTypeId, categoryName: targetModalCategory }] : [],
          modifications: rec.action === "MODIFY" ? [{ fromDisplayName: rec.existingServiceName, toDisplayName: targetName, categoryName: targetModalCategory }] : [],
          removals: rec.action === "REMOVE" ? [{ displayName: rec.existingServiceName }] : [],
        });
      } else {
        await gbpApproveRecommendation(location._id, rec._id);
      }
      toast.success(`Applied: ${targetName}`);
      setRecommendations((prev) => prev.map((r) => r._id === rec._id ? { ...r, status: "APPLIED", proposedServiceName: targetName } : r));
      setEditingRecId(null);
      const svcRes = await gbpGetServices(location._id);
      setServices(svcRes.data.data?.dbServices || []);
      const hRes = await gbpGetServiceHealth(location._id);
      setHealth(hRes.data.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to apply recommendation.");
    } finally {
      setApplyingIds((s) => { const n = new Set(s); n.delete(rec._id); return n; });
    }
  };

  const handleReject = async (rec: any) => {
    setApplyingIds((s) => new Set(s).add(rec._id + "_reject"));
    try {
      await gbpRejectRecommendation(location._id, rec._id);
      toast.success("Recommendation rejected.");
      setRecommendations((prev) => prev.map((r) => r._id === rec._id ? { ...r, status: "REJECTED" } : r));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to reject.");
    } finally {
      setApplyingIds((s) => { const n = new Set(s); n.delete(rec._id + "_reject"); return n; });
    }
  };

  const handleBulkApply = async () => {
    if (!selectedRecs.size) return;
    setBulkApplying(true);
    toast.loading(`Applying ${selectedRecs.size} changes to Google...`, { id: "bulk" });
    try {
      await gbpBulkApplyServices(location._id, Array.from(selectedRecs));
      toast.success(`Applied ${selectedRecs.size} service changes!`, { id: "bulk" });
      setSelectedRecs(new Set());
      const [svcRes, recRes, healthRes] = await Promise.allSettled([
        gbpGetServices(location._id),
        gbpGetServiceRecommendations(location._id),
        gbpGetServiceHealth(location._id),
      ]);
      if (svcRes.status === "fulfilled") setServices(svcRes.value.data.data?.dbServices || []);
      if (recRes.status === "fulfilled") setRecommendations(recRes.value.data.data || []);
      if (healthRes.status === "fulfilled") setHealth(healthRes.value.data.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Bulk apply failed.", { id: "bulk" });
    } finally {
      setBulkApplying(false);
    }
  };

  const handleSaveModalServices = async () => {
    const selectedList = Array.from(modalSelectedServices);
    const hasCustom = newServiceName.trim().length > 0;
    if (selectedList.length === 0 && !hasCustom) {
      toast.error("Please select at least one service or enter a custom service.");
      return;
    }

    setAddingService(true);
    toast.loading("Saving services to Google...", { id: "add-modal" });

    try {
      const additions: any[] = [];

      selectedList.forEach((typeId) => {
        const found = supportedServices.find((s) => s.serviceTypeId === typeId);
        if (found) {
          additions.push({
            serviceTypeId: found.serviceTypeId,
            displayName: found.displayName,
            categoryName: targetModalCategory,
          });
        }
      });

      if (hasCustom) {
        additions.push({
          displayName: newServiceName.trim(),
          categoryName: targetModalCategory,
        });
      }

      await gbpApplyServices(location._id, { additions, modifications: [], removals: [] });
      toast.success(`Added ${additions.length} service(s) to Google!`, { id: "add-modal" });
      setShowAddModal(false);
      setNewServiceName("");
      setModalSelectedServices(new Set());

      const svcRes = await gbpGetServices(location._id);
      setServices(svcRes.data.data?.dbServices || []);
      const hRes = await gbpGetServiceHealth(location._id);
      setHealth(hRes.data.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add services.", { id: "add-modal" });
    } finally {
      setAddingService(false);
    }
  };

  const handleDeleteService = async (svc: any) => {
    setDeletingId(svc._id);
    try {
      await gbpDeleteService(location._id, svc._id);
      toast.success(`"${svc.displayName}" removed from Google.`);
      setDeleteConfirm(null);
      const svcRes = await gbpGetServices(location._id);
      setServices(svcRes.data.data?.dbServices || []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to remove service.");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleModalPillSelect = (serviceTypeId: string) => {
    setModalSelectedServices((prev) => {
      const next = new Set(prev);
      if (next.has(serviceTypeId)) next.delete(serviceTypeId);
      else next.add(serviceTypeId);
      return next;
    });
  };

  const toggleRecSelect = (id: string) => {
    setSelectedRecs((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const pendingRecs = recommendations.filter((r) => r.status === "PENDING");
  const addRecs = pendingRecs.filter((r) => r.action === "ADD");
  const modifyRecs = pendingRecs.filter((r) => r.action === "MODIFY");
  const removeRecs = pendingRecs.filter((r) => r.action === "REMOVE");
  const keepRecs = pendingRecs.filter((r) => r.action === "KEEP");
  const reviewRecs = pendingRecs.filter((r) => r.action === "REVIEW");

  const healthColor = !health ? "text-slate-400" : health.score >= 80 ? "text-emerald-400" : health.score >= 60 ? "text-amber-400" : "text-red-400";

  // Build category list for location dynamically
  const primaryCatName = location?.primaryCategory?.displayName || location?.primaryCategory?.name || location?.rawData?.categories?.primaryCategory?.displayName || "Primary Category";
  const additionalCatNames = (location?.additionalCategories || location?.rawData?.categories?.additionalCategories || []).map((c: any) => c.displayName || c.name).filter(Boolean);
  const allCategoryNames = Array.from(new Set([primaryCatName, ...additionalCatNames].filter(Boolean)));

  // Group services by category for Current Services tab
  const groupedCurrentServices: Record<string, any[]> = {};
  allCategoryNames.forEach((cat) => { groupedCurrentServices[cat] = []; });
  services.forEach((svc) => {
    const cat = svc.categoryName || primaryCatName;
    if (!groupedCurrentServices[cat]) groupedCurrentServices[cat] = [];
    groupedCurrentServices[cat].push(svc);
  });

  if (loading && !location) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Wrench className="h-5 w-5 text-violet-400" /> AI Services Optimizer
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Category-grouped Google Business Profile services manager & Grok AI optimizer.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {locations.length > 0 && (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">
              <Building2 className="h-4 w-4 text-violet-400 flex-shrink-0" />
              <select
                value={location?._id || ""}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer max-w-[200px] truncate"
              >
                {locations.map((l: any) => (
                  <option key={l._id} value={l._id} className="bg-slate-900 text-white">
                    📍 {l.locationName || l.googleLocationId}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button
            onClick={handleSync}
            disabled={syncing || !location}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition border border-slate-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing..." : "Sync"}
          </button>
          <button
            onClick={handleAnalyze}
            disabled={analyzing || !location}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-semibold transition disabled:opacity-50 shadow-md shadow-violet-600/20"
          >
            <Sparkles className={`h-3.5 w-3.5 ${analyzing ? "animate-spin" : ""}`} />
            {analyzing ? "Grok AI Analyzing..." : "Grok Auto-Suggest Best Services"}
          </button>
          <button
            onClick={() => setShowBulk(!showBulk)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition border border-slate-700"
          >
            <Layers className="h-3.5 w-3.5" /> Bulk
          </button>
        </div>
      </div>

      {/* Health Score Cards */}
      {location && (
        <div className="px-6 py-4 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 flex-shrink-0">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs text-slate-500 mb-1">Service Health</p>
            <p className={`text-2xl font-bold ${healthColor}`}>{health?.score ?? "—"}<span className="text-sm text-slate-500">/100</span></p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs text-slate-500 mb-1">Current Services</p>
            <p className="text-2xl font-bold text-white">{services.length}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs text-slate-500 mb-1">AI Suggestions</p>
            <p className="text-2xl font-bold text-violet-400">{pendingRecs.length}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs text-slate-500 mb-1">Google Synced</p>
            <p className="text-2xl font-bold text-emerald-400">{services.filter((s: any) => s.googleSynced).length}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="px-6 border-b border-slate-800 flex gap-1 flex-shrink-0">
        {(["services", "suggestions", "supported", "history"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition capitalize ${
              activeTab === tab
                ? "border-violet-500 text-violet-400"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            {tab === "suggestions" && pendingRecs.length > 0 ? (
              <span className="flex items-center gap-1.5">
                AI Suggestions <span className="bg-violet-600 text-white text-xs rounded-full px-1.5 py-0.5">{pendingRecs.length}</span>
              </span>
            ) : (
              tab === "services" ? "Current Services" :
              tab === "supported" ? "Google Services Catalog" :
              tab === "suggestions" ? "AI Suggestions" : "History"
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-6 overflow-auto">
        {!location ? (
          <div className="text-center py-20 text-slate-500">No location found. Please connect your Google Business Profile.</div>
        ) : (
          <>
            {/* CURRENT SERVICES TAB GROUPED BY CATEGORY */}
            {activeTab === "services" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-white flex items-center gap-2">
                      <FolderTree className="h-4 w-4 text-violet-400" /> Current Services Grouped by Category
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Manage services under Primary and Additional Categories.</p>
                  </div>
                  <button
                    onClick={() => openAddModal()}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition shadow-md shadow-violet-600/20"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Service
                  </button>
                </div>

                {services.length === 0 ? (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-10 text-center">
                    <Wrench className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm mb-4">No services found on Google. Click Sync or Add Service.</p>
                    <div className="flex justify-center gap-3">
                      <button onClick={handleSync} disabled={syncing} className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition">
                        {syncing ? "Syncing..." : "Sync from Google"}
                      </button>
                      <button onClick={handleAnalyze} disabled={analyzing} className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm transition">
                        ⚡ Grok Auto-Suggest Services
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {allCategoryNames.map((catName) => {
                      const catSvcs = groupedCurrentServices[catName] || [];
                      const isPrimary = catName === primaryCatName;

                      return (
                        <div key={catName} className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
                          {/* Category Header Banner */}
                          <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <span className="text-base font-bold text-white">{catName}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                                isPrimary
                                  ? "bg-violet-500/10 text-violet-300 border-violet-500/30"
                                  : "bg-slate-800 text-slate-400 border-slate-700"
                              }`}>
                                {isPrimary ? "Primary category" : "Additional category"}
                              </span>
                              <span className="text-xs text-slate-500">({catSvcs.length} items)</span>
                            </div>
                            <button
                              onClick={() => openAddModal(catName)}
                              className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 font-medium px-2.5 py-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 transition"
                            >
                              <Plus className="h-3 w-3" /> Add to {catName}
                            </button>
                          </div>

                          {/* Category Services List */}
                          {catSvcs.length === 0 ? (
                            <div className="p-4 text-center text-xs text-slate-500">
                              No services added under {catName} yet. Click "+ Add to {catName}" to add services.
                            </div>
                          ) : (
                            <div className="divide-y divide-slate-800/60">
                              {catSvcs.map((svc: any) => (
                                <div key={svc._id} className="p-4 hover:bg-slate-900/40 transition flex items-start justify-between gap-4">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <Tag className="h-3.5 w-3.5 text-violet-400 flex-shrink-0" />
                                      <span className="text-sm font-bold text-white">{svc.displayName}</span>
                                      {svc.price && (
                                        <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                                          {svc.price}
                                        </span>
                                      )}
                                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                                        svc.serviceType === "STRUCTURED"
                                          ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                                          : "text-amber-400 bg-amber-500/10 border-amber-500/30"
                                      }`}>{svc.serviceType}</span>
                                    </div>
                                    {svc.description && (
                                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed pl-5.5">
                                        {svc.description}
                                      </p>
                                    )}
                                    {svc.serviceTypeId && (
                                      <p className="text-[10px] text-slate-500 ml-5.5 mt-1">{svc.serviceTypeId}</p>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-3 flex-shrink-0 mt-0.5">
                                    {svc.googleSynced ? (
                                      <span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> Synced</span>
                                    ) : (
                                      <span className="text-xs text-amber-400 flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Pending Sync</span>
                                    )}

                                    {deleteConfirm === svc._id ? (
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() => handleDeleteService(svc)}
                                          disabled={deletingId === svc._id}
                                          className="text-xs px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-medium"
                                        >{deletingId === svc._id ? "..." : "Confirm Delete"}</button>
                                        <button onClick={() => setDeleteConfirm(null)} className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300">Cancel</button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => setDeleteConfirm(svc._id)}
                                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition"
                                        title="Remove service from Google"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* AI SUGGESTIONS TAB */}
            {activeTab === "suggestions" && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base font-semibold text-white flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-violet-400" /> Grok AI Recommendations
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Review, edit, or approve recommendations generated by Grok AI.</p>
                  </div>
                  <div className="flex gap-2">
                    {selectedRecs.size > 0 && (
                      <button
                        onClick={handleBulkApply}
                        disabled={bulkApplying}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition disabled:opacity-50"
                      >
                        <Zap className="h-3.5 w-3.5" />
                        {bulkApplying ? "Applying..." : `Apply ${selectedRecs.size} Selected`}
                      </button>
                    )}
                    <button
                      onClick={handleAnalyze}
                      disabled={analyzing}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition border border-slate-700 disabled:opacity-50"
                    >
                      <Bot className={`h-3.5 w-3.5 ${analyzing ? "animate-spin" : ""}`} />
                      {analyzing ? "Grok Analyzing..." : "Re-Run Grok AI"}
                    </button>
                  </div>
                </div>

                {pendingRecs.length === 0 ? (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-10 text-center">
                    <Bot className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm mb-4">No AI suggestions generated yet.</p>
                    <button
                      onClick={handleAnalyze}
                      disabled={analyzing}
                      className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition shadow-lg shadow-violet-600/20"
                    >
                      ⚡ Grok Auto-Suggest Best Services
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[["ADD", addRecs], ["MODIFY", modifyRecs], ["REMOVE", removeRecs], ["REVIEW", reviewRecs], ["KEEP", keepRecs]].map(
                      ([action, recs]: any) => recs.length > 0 && (
                        <div key={action}>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                            {action === "ADD" ? "Recommended Additions" :
                             action === "MODIFY" ? "Recommended Modifications" :
                             action === "REMOVE" ? "Recommended Removals" :
                             action === "REVIEW" ? "Needs Review" : "Keep As-Is"}
                          </p>
                          <div className="space-y-2">
                            {recs.map((rec: any) => {
                              const isEditing = editingRecId === rec._id;

                              return (
                                <div
                                  key={rec._id}
                                  className={`rounded-xl border p-4 transition ${
                                    rec.status === "APPLIED" ? "border-emerald-500/30 bg-emerald-500/5 opacity-60" :
                                    rec.status === "REJECTED" ? "border-slate-700 bg-slate-900/40 opacity-40" :
                                    "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                                  }`}
                                >
                                  <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-semibold ${ACTION_COLORS[rec.action]}`}>
                                          {ACTION_ICONS[rec.action]} {rec.action}
                                        </span>

                                        {isEditing ? (
                                          <div className="flex items-center gap-2 mt-1 w-full max-w-md">
                                            <input
                                              type="text"
                                              value={editedRecName}
                                              onChange={(e) => setEditedRecName(e.target.value)}
                                              onKeyDown={(e) => e.key === "Enter" && handleApprove(rec, editedRecName)}
                                              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-violet-500 text-white text-sm focus:outline-none flex-1"
                                              autoFocus
                                            />
                                            <button
                                              onClick={() => handleApprove(rec, editedRecName)}
                                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                                            >
                                              Save & Apply
                                            </button>
                                            <button
                                              onClick={() => setEditingRecId(null)}
                                              className="px-2 py-1.5 rounded-lg bg-slate-700 text-slate-300 text-xs"
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        ) : (
                                          <span className="text-sm font-semibold text-white">
                                            {rec.action === "MODIFY" ? (
                                              <>{rec.existingServiceName} <ArrowRight className="inline h-3 w-3 text-slate-500" /> {rec.proposedServiceName}</>
                                            ) : rec.proposedServiceName}
                                          </span>
                                        )}

                                        {rec.googleSupported && (
                                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">✓ Google Supported</span>
                                        )}
                                        {rec.confidence && (
                                          <span className="text-[10px] text-slate-500">{rec.confidence}% confidence</span>
                                        )}
                                      </div>

                                      <p className="text-xs text-slate-400 mt-1.5">{rec.reason}</p>

                                      {rec.evidence?.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                          {rec.evidence.map((e: string, i: number) => (
                                            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                                              ✓ {e}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                    </div>

                                    {rec.status === "PENDING" && !isEditing && (
                                      <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                          onClick={() => toggleRecSelect(rec._id)}
                                          className={`p-1.5 rounded-lg border transition ${
                                            selectedRecs.has(rec._id)
                                              ? "bg-violet-600/20 border-violet-500/50 text-violet-400"
                                              : "border-slate-700 text-slate-500 hover:text-white hover:border-slate-600"
                                          }`}
                                          title="Select for bulk apply"
                                        >
                                          {selectedRecs.has(rec._id) ? <CheckSquare className="h-3.5 w-3.5" /> : <Square className="h-3.5 w-3.5" />}
                                        </button>
                                        <button
                                          onClick={() => {
                                            setEditingRecId(rec._id);
                                            setEditedRecName(rec.proposedServiceName);
                                          }}
                                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
                                          title="Edit service name before approving"
                                        >
                                          <Edit3 className="h-3 w-3" /> Edit
                                        </button>
                                        <button
                                          onClick={() => handleApprove(rec)}
                                          disabled={applyingIds.has(rec._id)}
                                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition disabled:opacity-50"
                                        >
                                          {applyingIds.has(rec._id) ? <RefreshCw className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                                          Approve
                                        </button>
                                        <button
                                          onClick={() => handleReject(rec)}
                                          disabled={applyingIds.has(rec._id + "_reject")}
                                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-xs font-medium transition disabled:opacity-50"
                                        >
                                          <XCircle className="h-3 w-3" /> Reject
                                        </button>
                                      </div>
                                    )}
                                    {rec.status === "APPLIED" && (
                                      <span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> Applied</span>
                                    )}
                                    {rec.status === "REJECTED" && (
                                      <span className="text-xs text-slate-500 flex items-center gap-1"><XCircle className="h-3.5 w-3.5" /> Rejected</span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            )}

            {/* GOOGLE SUPPORTED SERVICES TAB GROUPED BY CATEGORY */}
            {activeTab === "supported" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-white flex items-center gap-2">
                      <FolderTree className="h-4 w-4 text-violet-400" /> Predefined Google Services by Category
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Google's canonical services catalog available for your business categories.</p>
                  </div>
                  <span className="text-xs text-slate-500">{supportedServices.length} total services</span>
                </div>

                {supportedServicesGrouped.length === 0 ? (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-10 text-center">
                    <Search className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">Loading supported services from Google...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {supportedServicesGrouped.map((catGroup: any) => (
                      <div key={catGroup.categoryName} className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
                        <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="text-base font-bold text-white">{catGroup.categoryName}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                              catGroup.isPrimary
                                ? "bg-violet-500/10 text-violet-300 border-violet-500/30"
                                : "bg-slate-800 text-slate-400 border-slate-700"
                            }`}>
                              {catGroup.isPrimary ? "Primary category" : "Additional category"}
                            </span>
                            <span className="text-xs text-slate-500">({catGroup.services?.length || 0} services)</span>
                          </div>
                        </div>

                        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {catGroup.services.map((svc: any, i: number) => {
                            const alreadyAdded = services.some((s: any) => s.serviceTypeId === svc.serviceTypeId || s.displayName?.toLowerCase() === svc.displayName?.toLowerCase());
                            return (
                              <div key={svc.serviceTypeId || i} className={`rounded-xl border p-3 ${
                                alreadyAdded ? "border-emerald-500/30 bg-emerald-500/5" : "border-slate-800 bg-slate-900/60"
                              }`}>
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white">{svc.displayName}</p>
                                    <p className="text-[10px] text-slate-500 mt-0.5 truncate">{svc.serviceTypeId}</p>
                                  </div>
                                  {alreadyAdded ? (
                                    <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setModalSelectedServices(new Set([svc.serviceTypeId]));
                                        setTargetModalCategory(catGroup.categoryName);
                                        handleSaveModalServices();
                                      }}
                                      className="text-[10px] px-2 py-1 rounded bg-violet-600 hover:bg-violet-700 text-white font-medium flex-shrink-0"
                                    >
                                      + Add
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* HISTORY TAB */}
            {activeTab === "history" && (
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-white">Activity & Recommendation History</h2>

                {activityLogs.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Recent Activity</p>
                    {activityLogs.map((log: any) => (
                      <div key={log._id} className="flex items-start gap-3 p-3 rounded-xl border border-slate-800 bg-slate-900/40">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          log.googleSuccess ? "bg-emerald-500/10" : log.googleSuccess === false ? "bg-red-500/10" : "bg-violet-500/10"
                        }`}>
                          <Activity className={`h-4 w-4 ${
                            log.googleSuccess ? "text-emerald-400" : log.googleSuccess === false ? "text-red-400" : "text-violet-400"
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white">{log.description}</p>
                          <div className="flex flex-wrap gap-3 mt-1">
                            <span className="text-[10px] text-slate-500">{new Date(log.createdAt).toLocaleString()}</span>
                            <span className="text-[10px] text-slate-500">{log.trigger}</span>
                            {log.googleSuccess === true && <span className="text-[10px] text-emerald-400">✓ Google Success</span>}
                            {log.googleSuccess === false && <span className="text-[10px] text-red-400">✗ Google Failed</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {history.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-4">Recommendation History</p>
                    {history.map((rec: any) => (
                      <div key={rec._id} className="flex items-start gap-3 p-3 rounded-xl border border-slate-800 bg-slate-900/40">
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium self-start mt-0.5 ${ACTION_COLORS[rec.action] || "text-slate-400"}`}>
                          {rec.action}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white">{rec.proposedServiceName}</p>
                          <div className="flex flex-wrap gap-3 mt-0.5">
                            <span className={`text-xs ${
                              rec.status === "APPLIED" ? "text-emerald-400" :
                              rec.status === "REJECTED" ? "text-red-400" :
                              "text-slate-400"
                            }`}>{rec.status}</span>
                            <span className="text-[10px] text-slate-500">{new Date(rec.createdAt).toLocaleString()}</span>
                            {rec.confidence && <span className="text-[10px] text-slate-500">{rec.confidence}% confidence</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activityLogs.length === 0 && history.length === 0 && (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-10 text-center">
                    <Clock className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No activity history yet. Run AI analysis or sync services to start tracking.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Enhanced Native Google-Style Add Services Modal with Category Selector */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-slate-900/80">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Plus className="h-5 w-5 text-violet-400" /> Add services
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Add services you offer and get discovered by customers
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleModalAISuggest}
                  disabled={aiSuggestingModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-semibold transition disabled:opacity-50 shadow-md shadow-violet-600/20"
                >
                  <Sparkles className={`h-3.5 w-3.5 ${aiSuggestingModal ? "animate-spin" : ""}`} />
                  {aiSuggestingModal ? "Grok AI Selecting..." : "⚡ Grok Auto-Select Best Services"}
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Category Selector Banner */}
              <div className="border-b border-slate-800 pb-4">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Target Business Category
                </label>
                <select
                  value={targetModalCategory}
                  onChange={(e) => setTargetModalCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-semibold focus:outline-none focus:border-violet-500 cursor-pointer"
                >
                  {allCategoryNames.map((cat) => (
                    <option key={cat} value={cat} className="bg-slate-900 text-white">
                      {cat} {cat === primaryCatName ? "(Primary Category)" : "(Additional Category)"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grouped Supported Services in Modal */}
              <div className="space-y-5">
                {(supportedServicesGrouped.length > 0 ? supportedServicesGrouped : [{ categoryName: targetModalCategory, services: supportedServices }]).map(
                  (group: any) => (
                    <div key={group.categoryName} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                          {group.categoryName} Services ({group.services?.length || 0})
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2.5 max-h-48 overflow-y-auto pr-1">
                        {group.services?.map((svc: any) => {
                          const isAlreadyOnGoogle = services.some(
                            (s: any) => s.serviceTypeId === svc.serviceTypeId || s.displayName?.toLowerCase() === svc.displayName?.toLowerCase()
                          );
                          const isSelected = modalSelectedServices.has(svc.serviceTypeId);

                          return (
                            <button
                              key={svc.serviceTypeId}
                              disabled={isAlreadyOnGoogle}
                              onClick={() => toggleModalPillSelect(svc.serviceTypeId)}
                              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition-all ${
                                isAlreadyOnGoogle
                                  ? "bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed opacity-60"
                                  : isSelected
                                  ? "bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-600/30 font-semibold"
                                  : "bg-slate-900/90 border-slate-700 text-slate-300 hover:border-violet-500 hover:text-white hover:bg-slate-800"
                              }`}
                            >
                              {isAlreadyOnGoogle ? (
                                <Check className="h-3.5 w-3.5 text-slate-500" />
                              ) : isSelected ? (
                                <Check className="h-3.5 w-3.5 text-white" />
                              ) : (
                                <Plus className="h-3.5 w-3.5 text-slate-400" />
                              )}
                              <span>{svc.displayName}</span>
                              {isAlreadyOnGoogle && <span className="text-[10px] text-slate-600">(Added)</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Custom Service Input */}
              <div className="border-t border-slate-800 pt-5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Or Add a Custom Service to {targetModalCategory} (Free-Form)
                </p>
                <input
                  type="text"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveModalServices()}
                  placeholder={`e.g. Custom ${targetModalCategory} Solution`}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                {modalSelectedServices.size > 0
                  ? `${modalSelectedServices.size} service(s) selected under ${targetModalCategory}`
                  : newServiceName.trim()
                  ? `Custom service ready for ${targetModalCategory}`
                  : "Select pills above or enter custom service"}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition border border-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveModalServices}
                  disabled={addingService || (modalSelectedServices.size === 0 && !newServiceName.trim())}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition disabled:opacity-50 shadow-lg shadow-violet-600/20"
                >
                  {addingService && <RefreshCw className="h-4 w-4 animate-spin" />}
                  {addingService ? "Saving to Google..." : "Save to Google"}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import { useEffect, useState, useRef } from "react";
import { gbpGetLocations, gbpGetKeywords } from "@/lib/gbp/gbpApi";
import {
  Search,
  RefreshCw,
  TrendingUp,
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  KeyRound,
  Eye,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

interface MonthOption {
  year: number;
  monthIndex: number;
  label: string; // "Aug 2026"
  shortLabel: string; // "Aug"
  ymStr: string; // "2026-08"
}

export default function KeywordsPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [location, setLocation] = useState<any>(null);
  const [keywords, setKeywords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>("cached");
  const [showDemoData, setShowDemoData] = useState(false);

  // Time Period Dropdown Modal
  const [showTimeModal, setShowTimeModal] = useState(false);
  const timeModalRef = useRef<HTMLDivElement>(null);

  // Generate available past 12 months list
  const generatePastMonths = (): MonthOption[] => {
    const list: MonthOption[] = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const monthIndex = d.getMonth();
      const shortLabel = d.toLocaleString("en-US", { month: "short" });
      const label = `${shortLabel} ${year}`;
      const ymStr = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
      list.push({ year, monthIndex, label, shortLabel, ymStr });
    }
    return list;
  };

  const availableMonths = generatePastMonths();
  // Default to previous month
  const defaultMonth = availableMonths[Math.max(0, availableMonths.length - 2)] || availableMonths[0];

  const [selectedMonth, setSelectedMonth] = useState<MonthOption>(defaultMonth);
  const [tempMonth, setTempMonth] = useState<MonthOption>(defaultMonth);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timeModalRef.current && !timeModalRef.current.contains(event.target as Node)) {
        setShowTimeModal(false);
      }
    };
    if (showTimeModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTimeModal]);

  // Demo keywords
  const demoKeywords = [
    { searchKeyword: "home tutor near me", insightsValue: { value: "HIGH", threshold: "250" } },
    { searchKeyword: "best tuition classes in prayagraj", insightsValue: { value: "HIGH", threshold: "180" } },
    { searchKeyword: "online tutoring services", insightsValue: { value: "MEDIUM", threshold: "120" } },
    { searchKeyword: "private tutor for icse cbse", insightsValue: { value: "MEDIUM", threshold: "95" } },
    { searchKeyword: "math home tutor", insightsValue: { value: "MEDIUM", threshold: "85" } },
    { searchKeyword: "physics chemistry tutor", insightsValue: { value: "LOW", threshold: "60" } },
    { searchKeyword: "home tuition bureau", insightsValue: { value: "LOW", threshold: "45" } },
    { searchKeyword: "top home tutor provider", insightsValue: { value: "LOW", threshold: "30" } },
  ];

  const fetchKeywords = async (locId: string, monthStr: string, forceRefresh = false) => {
    try {
      const res = await gbpGetKeywords(locId, {
        month: monthStr,
        refresh: forceRefresh ? "true" : undefined,
      });

      const data = res.data.data || [];
      setKeywords(data);
      setLastUpdated(res.data.lastUpdated || new Date().toISOString());
      setDataSource(res.data.source || "cached");

      if (forceRefresh) {
        if (data.length === 0) {
          toast.error("No keyword data available from Google. Your location may need more search impressions.");
        } else {
          toast.success(`Refreshed ${data.length} keywords from Google`);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load keyword data.");
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const locRes = await gbpGetLocations();
        const locs = locRes.data.data || [];

        if (locs.length === 0) {
          setLoading(false);
          return;
        }

        setLocations(locs);
        const primaryLoc = locs.find((l: any) => l.isPrimary) || locs[0];
        setLocation(primaryLoc);
        await fetchKeywords(primaryLoc._id, selectedMonth.ymStr, false);
      } catch {
        toast.error("Failed to load locations.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleLocationChange = async (locId: string) => {
    const selected = locations.find((l) => l._id === locId);
    if (!selected) return;
    setLocation(selected);
    setLoading(true);
    setKeywords([]);
    await fetchKeywords(selected._id, selectedMonth.ymStr, false);
    setLoading(false);
  };

  const handleApplyMonth = async () => {
    setSelectedMonth(tempMonth);
    setShowTimeModal(false);
    if (!location) return;
    setLoading(true);
    setKeywords([]);
    await fetchKeywords(location._id, tempMonth.ymStr, false);
    setLoading(false);
  };

  const handleRefresh = async () => {
    if (!location || refreshing) return;
    setRefreshing(true);
    await fetchKeywords(location._id, selectedMonth.ymStr, true);
    setRefreshing(false);
  };

  const displayKeywords = showDemoData && keywords.length === 0 ? demoKeywords : keywords;
  const filtered = displayKeywords.filter((k) =>
    k.searchKeyword?.toLowerCase().includes(search.toLowerCase())
  );
  const sorted = [...filtered].sort((a, b) => {
    const valA = a.insightsValue?.threshold ? parseInt(a.insightsValue.threshold) : 0;
    const valB = b.insightsValue?.threshold ? parseInt(b.insightsValue.threshold) : 0;
    return valB - valA;
  });

  const maxThreshold = sorted[0]?.insightsValue?.threshold
    ? parseInt(sorted[0].insightsValue.threshold)
    : 1;

  const hasKeywords = keywords.length > 0;
  const hasFilteredResults = sorted.length > 0;

  return (
    <div className="flex flex-col h-full overflow-auto bg-slate-950">
      {/* Clean Top Header */}
      <div className="px-6 py-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-violet-400" /> Search Keywords
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {selectedMonth.label} — Google-provided customer search queries
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

          {/* Google-Style Time Period Button */}
          <div className="relative" ref={timeModalRef}>
            <button
              onClick={() => {
                setTempMonth(selectedMonth);
                setShowTimeModal(!showTimeModal);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-700 hover:border-slate-600 text-white text-xs font-semibold transition shadow-sm"
            >
              <Calendar className="h-3.5 w-3.5 text-blue-400" />
              <span>{selectedMonth.label}</span>
              {showTimeModal ? (
                <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              )}
            </button>

            {/* Google Business Profile Styled Month Picker Modal Popup */}
            {showTimeModal && (
              <div className="absolute right-0 top-12 w-80 sm:w-96 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl p-5 z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* Time period outlined header */}
                <div className="relative border border-blue-400/80 rounded-xl px-3.5 py-2.5 mb-4 bg-slate-950/40 flex items-center justify-between">
                  <span className="absolute -top-2.5 left-3 px-1.5 bg-slate-900 text-[10px] font-semibold text-blue-400">
                    Time period
                  </span>
                  <div className="flex items-center gap-2 text-white text-xs font-semibold">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <span>{tempMonth.label}</span>
                  </div>
                  <ChevronUp className="h-4 w-4 text-blue-400" />
                </div>

                {/* Months Grid (Past 6 to 12 months) */}
                <div className="grid grid-cols-3 gap-2.5 my-4">
                  {availableMonths.slice(-6).map((m) => {
                    const isSelected = m.ymStr === tempMonth.ymStr;

                    return (
                      <button
                        key={m.ymStr}
                        onClick={() => setTempMonth(m)}
                        className={`py-2 px-3 rounded-full text-xs font-semibold transition flex items-center justify-center ${
                          isSelected
                            ? "bg-blue-500 text-white shadow-md shadow-blue-500/30"
                            : "bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        {m.label}
                      </button>
                    );
                  })}
                </div>

                {/* Modal Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => setShowTimeModal(false)}
                    className="px-4 py-1.5 rounded-full border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApplyMonth}
                    className="px-5 py-1.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold transition shadow-md shadow-blue-500/20"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading || !location}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition disabled:opacity-50 shadow-md shadow-violet-600/20"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 p-6 space-y-6 max-w-6xl mx-auto w-full">
        {/* Active Profile Info Banner */}
        {location && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">
                  {location.locationName || "Google Business Profile"}
                </h2>
                <p className="text-xs text-slate-400">
                  {location.address?.locality || location.address?.administrativeArea || "Local Business Location"}
                </p>
              </div>
            </div>

            {lastUpdated && (
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Last updated: {new Date(lastUpdated).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        )}

        {/* Search Input Filter */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search keywords... (e.g., home tutor, tuition near me)"
            className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Keywords List / Loading / Empty State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-7 h-7 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-400">Loading keyword search insights from Google...</p>
          </div>
        ) : !hasKeywords && !showDemoData ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center max-w-lg mx-auto space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto text-violet-400">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">No Search Keywords Data for {selectedMonth.label}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Google requires a minimum threshold of search impressions during a calendar month to report exact search terms.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
                {refreshing ? "Syncing..." : "Refresh from Google"}
              </button>
              <button
                onClick={() => setShowDemoData(true)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                View Demo Data
              </button>
            </div>
          </div>
        ) : !hasFilteredResults ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center text-slate-400">
            No keywords match "<strong className="text-white">{search}</strong>".
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <p>
                Showing <strong className="text-white">{sorted.length}</strong> keywords for {selectedMonth.label}
                {showDemoData && !hasKeywords && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                    Demo Data
                  </span>
                )}
              </p>
              {showDemoData && (
                <button
                  onClick={() => setShowDemoData(false)}
                  className="text-slate-400 hover:text-white underline text-[11px]"
                >
                  Hide Demo Data
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {sorted.map((kw, i) => {
                const threshold = parseInt(kw.insightsValue?.threshold || "0");
                const value = (kw.insightsValue?.value || "LOW").toUpperCase();
                const pct = maxThreshold > 0 ? Math.round((threshold / maxThreshold) * 100) : 0;

                const getBadgeStyle = (val: string) => {
                  switch (val) {
                    case "HIGH":
                      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
                    case "MEDIUM":
                      return "bg-violet-500/20 text-violet-300 border-violet-500/30";
                    default:
                      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
                  }
                };

                const getBarStyle = (val: string) => {
                  switch (val) {
                    case "HIGH":
                      return "bg-emerald-500";
                    case "MEDIUM":
                      return "bg-violet-500";
                    default:
                      return "bg-blue-500";
                  }
                };

                return (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 hover:border-slate-700 transition space-y-2.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-500 w-6">#{i + 1}</span>
                        <Search className="h-4 w-4 text-violet-400" />
                        <span className="text-sm font-semibold text-white">{kw.searchKeyword}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-md font-bold border ${getBadgeStyle(
                            value
                          )}`}
                        >
                          {value}
                        </span>
                        <span className="text-xs font-bold text-slate-200">
                          {threshold > 0 ? `${threshold.toLocaleString()}+ searches` : "—"}
                        </span>
                      </div>
                    </div>

                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getBarStyle(value)}`}
                        style={{ width: `${Math.max(5, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

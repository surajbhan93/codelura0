"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Calendar, 
  TrendingUp,
  Filter,
  X,
  ChevronDown,
  Clock,
  Sparkles,
  Building2,
  DollarSign,
  Tag,
  ExternalLink
} from "lucide-react";
import JobSearch from "@/components/jobs/JobSearch";

export interface Job {
  _id: string;
  title: string;
  slug: string;
  company: string;
  bannerImage?: string;
  location: string;
  // type: "internship" | "full-time" | "part-time" | "contract";
   type:
    | "internship"
    | "full-time"
    | "part-time"
    | "contract"
    | "off-campus"
    | "walk-in"
    | "codelura";
  salary?: string;
  tags: string[];
  careerPageUrl: string;
  description: string;
  isFeatured: boolean;
  isExpired: boolean;
  postedAt?: string;
  deadline?: string;
}

const TABS = [
  { key: "latest", label: "Latest Opportunities", icon: Sparkles, color: "#2563eb" },
  { key: "expired", label: "Archived", icon: Clock, color: "#dc2626" },
] as const;

type TabKey = typeof TABS[number]["key"];
const JOBS_PER_PAGE = 12;

const TYPE_CONFIG: Record<string, { label: string; icon: typeof Briefcase; color: string; bg: string }> = {
  internship: { 
    label: "Internship", 
    icon: Briefcase, 
    color: "text-blue-700", 
    bg: "bg-blue-50" 
  },
  "full-time": { 
    label: "Full Time", 
    icon: Briefcase, 
    color: "text-emerald-700", 
    bg: "bg-emerald-50" 
  },
  "part-time": { 
    label: "Part Time", 
    icon: Briefcase, 
    color: "text-amber-700", 
    bg: "bg-amber-50" 
  },
  contract: { 
    label: "Contract", 
    icon: Briefcase, 
    color: "text-purple-700", 
    bg: "bg-purple-50" 
  },
   "off-campus": {
    label: "Off Campus",
    icon: Briefcase,
    color: "text-indigo-700",
    bg: "bg-indigo-50",
  },

  "walk-in": {
    label: "Walk-In",
    icon: Briefcase,
    color: "text-orange-700",
    bg: "bg-orange-50",
  },

  codelura: {
    label: "Codelura",
    icon: Briefcase,
    color: "text-violet-700",
    bg: "bg-violet-50",
  },
};

function formatDate(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getTimeAgo(date?: string) {
  if (!date) return "";
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return formatDate(date);
}

/* ── SKELETON LOADER ── */
function JobCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gray-200" />
        <div className="flex-1">
          <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
          <div className="h-5 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-20" />
          <div className="h-6 bg-gray-200 rounded-full w-24" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="flex gap-1.5">
          <div className="h-5 bg-gray-200 rounded w-16" />
          <div className="h-5 bg-gray-200 rounded w-20" />
          <div className="h-5 bg-gray-200 rounded w-14" />
        </div>
        <div className="h-px bg-gray-100" />
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

/* ── JOB CARD ── */
function JobCardUI({ job, expired = false, featured = false }: { job: Job; expired?: boolean; featured?: boolean }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const typeConfig = TYPE_CONFIG[job.type] || TYPE_CONFIG["full-time"];

  const handleClick = () => {
    router.push(`/career/jobs/latest/${job.slug}`);
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
        expired 
          ? "border-gray-200 opacity-60 hover:opacity-80" 
          : "border-gray-100 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1"
      }`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient accent bar */}
      {!expired && featured && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      )}
      {!expired && !featured && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400/50 to-purple-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 flex-shrink-0 overflow-hidden border border-gray-200">
            {job.bannerImage ? (
              <img src={job.bannerImage} alt={job.company} className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-bold text-gray-700">{job.company.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3 h-3" />
              {job.company}
            </p>
            <h3 className="text-base font-semibold text-gray-900 leading-snug mt-0.5 group-hover:text-blue-600 transition-colors">
              {job.title}
            </h3>
          </div>
          {!expired && (
            <div className="flex gap-1.5 flex-shrink-0">
              {featured && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200">
                  <Sparkles className="w-3 h-3" />
                  Featured
                </span>
              )}
              {isHovered && !expired && (
                <span className="text-blue-600 transition-all duration-300">
                  <ExternalLink className="w-4 h-4" />
                </span>
              )}
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${typeConfig.bg} ${typeConfig.color}`}>
            <typeConfig.icon className="w-3.5 h-3.5" />
            {typeConfig.label}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
            <MapPin className="w-3.5 h-3.5" />
            {job.location}
          </span>
          {job.salary && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              <DollarSign className="w-3.5 h-3.5" />
              {job.salary}
            </span>
          )}
          {expired && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
              <Clock className="w-3.5 h-3.5" />
              Expired
            </span>
          )}
        </div>

        {/* Description */}
        {job.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
            {job.description}
          </p>
        )}

        {/* Tags */}
        {job.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {job.tags.slice(0, 3).map((t) => (
              <span key={t} className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                <Tag className="w-3 h-3 text-gray-400" />
                {t}
              </span>
            ))}
            {job.tags.length > 3 && (
              <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                +{job.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
            <Calendar className="w-3.5 h-3.5" />
            {expired
              ? `Expired ${formatDate(job.deadline)}`
              : getTimeAgo(job.postedAt)}
          </span>
          {!expired && (
            <span className="text-sm font-medium text-blue-600 group-hover:text-blue-800 transition-colors inline-flex items-center gap-1">
              Apply Now
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── EMPTY STATE ── */
function EmptyState({ tab, searchQuery }: { tab: TabKey; searchQuery?: string }) {
  const messages: Record<TabKey, { icon: any; title: string; sub: string; action?: string }> = {
    latest: {
      icon: Search,
      title: "No jobs match your criteria",
      sub: searchQuery 
        ? `No results found for "${searchQuery}"` 
        : "Check back soon for new opportunities.",
      action: searchQuery ? "Try adjusting your filters" : undefined,
    },
    expired: {
      icon: Clock,
      title: "No archived listings",
      sub: "All current listings are still active.",
    },
  };
  const { icon: Icon, title, sub, action } = messages[tab];

  return (
    <div className="col-span-full text-center py-20">
      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mb-6 border border-gray-200">
        <Icon className="w-10 h-10 text-gray-400" />
      </div>
      <p className="text-xl font-semibold text-gray-700">{title}</p>
      <p className="text-sm text-gray-400 mt-1.5">{sub}</p>
      {action && (
        <p className="text-sm text-blue-600 mt-3 font-medium">{action}</p>
      )}
    </div>
  );
}

/* ── FILTER DROPDOWN ── */
function FilterDropdown({
  filters,
  onFilterChange,
}: {
  filters: { type: string; location: string; salary: string };
  onFilterChange: (key: string, value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const locations = ["All Locations", "Remote", "Hybrid", "Bangalore", "Mumbai", "Delhi"];
  const types = ["All Types", "Full-Time", "Internship", "Part-Time", "Contract"];
  const salaryRanges = ["All Salaries", "0-5 LPA", "5-10 LPA", "10-20 LPA", "20+ LPA"];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors text-sm font-medium text-gray-700"
      >
        <Filter className="w-4 h-4" />
        Filters
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-20 p-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Job Type</label>
              <select
                value={filters.type}
                onChange={(e) => onFilterChange("type", e.target.value)}
                className="w-full mt-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {types.map((t) => (
                  <option key={t} value={t.toLowerCase()}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</label>
              <select
                value={filters.location}
                onChange={(e) => onFilterChange("location", e.target.value)}
                className="w-full mt-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {locations.map((l) => (
                  <option key={l} value={l === "All Locations" ? "" : l}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Salary Range</label>
              <select
                value={filters.salary}
                onChange={(e) => onFilterChange("salary", e.target.value)}
                className="w-full mt-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {salaryRanges.map((s) => (
                  <option key={s} value={s === "All Salaries" ? "" : s}>{s}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                onFilterChange("type", "all types");
                onFilterChange("location", "");
                onFilterChange("salary", "");
                setIsOpen(false);
              }}
              className="w-full text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ── PAGINATION ── */
function Pagination({
  page,
  total,
  perPage,
  onChange,
}: {
  page: number;
  total: number;
  perPage: number;
  onChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        Previous
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            className={`min-w-[40px] h-10 px-3 text-sm font-medium rounded-xl transition-all ${
              page === p
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
            onClick={() => onChange(p as number)}
          >
            {p}
          </button>
        )
      )}
      <button
        className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}

/* ── MAIN PAGE ── */
export default function JobsPageClient({ jobs }: { jobs: Job[] }) {
  const [activeTab, setActiveTab] = useState<TabKey>("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({ type: "all types", location: "", salary: "" });
  const [pages, setPages] = useState<Record<TabKey, number>>({
    latest: 1,
    expired: 1,
  });

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let result = jobs;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(job => 
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.description?.toLowerCase().includes(query) ||
        job.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Type filter
    if (filters.type && filters.type !== "all types") {
      result = result.filter(job => job.type === filters.type);
    }

    // Location filter
    if (filters.location) {
      const loc = filters.location.toLowerCase();
      result = result.filter(job => 
        job.location.toLowerCase().includes(loc) || 
        (loc === "remote" && job.location.toLowerCase().includes("remote"))
      );
    }

    // Salary filter (simplified)
    if (filters.salary) {
      // This is simplified - in real app, you'd parse salary ranges
      result = result.filter(job => job.salary);
    }

    return result;
  }, [jobs, searchQuery, filters]);

  const activeJobs = filteredJobs.filter((j) => !j.isExpired);
  const expiredJobs = filteredJobs.filter((j) => j.isExpired);
  const latestJobs = [...activeJobs].sort(
    (a, b) => new Date(b.postedAt ?? "").getTime() - new Date(a.postedAt ?? "").getTime()
  );

  const tabData: Record<TabKey, Job[]> = {
    latest: latestJobs,
    expired: expiredJobs,
  };

  const counts: Record<TabKey, number> = {
    latest: latestJobs.length,
    expired: expiredJobs.length,
  };

  const currentPage = pages[activeTab];
  const allForTab = tabData[activeTab];
  const paginated = allForTab.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE
  );

  const handlePageChange = (p: number) => {
    setPages((prev) => ({ ...prev, [activeTab]: p }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPages(prev => ({ ...prev, [activeTab]: 1 }));
  };

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [activeTab, searchQuery, filters]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-sans">
      {/* ── HERO ── */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                {activeJobs.length} opportunities available
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
                Discover Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Next Career Move
                </span>
              </h1>
              <p className="text-gray-500 mt-3 text-lg max-w-2xl">
                Curated opportunities from top companies across India. 
                Find the perfect role that matches your skills and aspirations.
              </p>
            </div>
            <div className="w-full lg:w-96 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, or keywords..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPages(prev => ({ ...prev, [activeTab]: 1 }));
                  }}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setPages(prev => ({ ...prev, [activeTab]: 1 }));
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-xs text-gray-400">Popular:</span>
                {["Remote", "Full-Time", "Internship", "Bangalore"].map(term => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="text-xs px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-100">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-4">
              <div className="text-2xl font-bold text-gray-900">{activeJobs.length}</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Active Jobs</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-4">
              <div className="text-2xl font-bold text-gray-900">{expiredJobs.length}</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Archived</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-4">
              <div className="text-2xl font-bold text-gray-900">
                {jobs.filter(j => j.isFeatured && !j.isExpired).length}
              </div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Featured</div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-4">
              <div className="text-2xl font-bold text-gray-900">
                {[...new Set(jobs.map(j => j.company))].length}
              </div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Companies</div>
            </div>
          </div>
        </div>
      </header>

      {/* ── TABS & FILTERS ── */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 py-2">
            <div className="flex gap-1 overflow-x-auto">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                      activeTab === tab.key
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    <Icon className={`w-4 h-4 ${activeTab === tab.key ? "text-blue-600" : "text-gray-400"}`} />
                    {tab.label}
                    <span className={`ml-1 text-xs px-2.5 py-0.5 rounded-full ${
                      activeTab === tab.key 
                        ? "bg-blue-50 text-blue-600" 
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {counts[tab.key]}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-3">
              <FilterDropdown filters={filters} onFilterChange={handleFilterChange} />
              {(filters.type !== "all types" || filters.location || filters.salary) && (
                <button
                  onClick={() => {
                    setFilters({ type: "all types", location: "", salary: "" });
                    setPages(prev => ({ ...prev, [activeTab]: 1 }));
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            {allForTab.length > 0 ? (
              <>
                Showing <span className="font-medium text-gray-700">
                  {Math.min((currentPage - 1) * JOBS_PER_PAGE + 1, allForTab.length)}–{Math.min(
                    currentPage * JOBS_PER_PAGE,
                    allForTab.length
                  )}
                </span> of <span className="font-medium text-gray-700">{allForTab.length}</span> jobs
              </>
            ) : (
              "No jobs found"
            )}
          </p>
          {searchQuery && (
            <p className="text-sm text-gray-400">
              Results for "{searchQuery}"
            </p>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)
          ) : paginated.length === 0 ? (
            <EmptyState tab={activeTab} searchQuery={searchQuery} />
          ) : (
            paginated.map((job) => (
              <JobCardUI 
                key={job._id} 
                job={job} 
                expired={activeTab === "expired"}
                featured={job.isFeatured && !job.isExpired}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        <Pagination
          page={currentPage}
          total={allForTab.length}
          perPage={JOBS_PER_PAGE}
          onChange={handlePageChange}
        />
      </main>
    </div>
  );
}
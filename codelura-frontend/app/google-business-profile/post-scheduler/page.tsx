"use client";
import { useEffect, useState } from "react";
import {
  gbpGetLocations,
  gbpGetScheduledPosts,
  gbpGetSchedulerStats,
  gbpGetCampaigns,
  gbpBulkUpdatePosts,
  gbpGetSchedulerHealth,
} from "@/lib/gbp/gbpApi";
import {
  CalendarClock,
  Plus,
  Calendar,
  List,
  Sparkles,
  Building2,
  Play,
  Pause,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
  Settings,
  Rocket,
  RefreshCw,
  Eye,
  Edit,
} from "lucide-react";
import toast from "react-hot-toast";
import SchedulePostModal from "@/components/gbp/SchedulePostModal";
import AICalendarModal from "@/components/gbp/AICalendarModal";

export default function PostSchedulerPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [location, setLocation] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "calendar">("list");
  
  // Stats
  const [stats, setStats] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  
  // Modals
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showAICalendarModal, setShowAICalendarModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("scheduled");
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);

  useEffect(() => {
    initScheduler();
    loadHealth();
    const interval = setInterval(loadHealth, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (location) {
      loadScheduledPosts();
      loadStats();
      loadCampaigns();
    }
  }, [location, statusFilter]);

  const initScheduler = async () => {
    try {
      const res = await gbpGetLocations();
      const locs = res.data.data || [];
      setLocations(locs);
      const loc = locs.find((l: any) => l.isPrimary) || locs[0];
      if (loc) setLocation(loc);
    } catch (err) {
      toast.error("Failed to load locations");
    } finally {
      setLoading(false);
    }
  };

  const loadScheduledPosts = async () => {
    if (!location) return;
    try {
      const res = await gbpGetScheduledPosts(location._id, { status: statusFilter });
      setPosts(res.data.posts || []);
    } catch (err) {
      toast.error("Failed to load scheduled posts");
    }
  };

  const loadStats = async () => {
    try {
      const res = await gbpGetSchedulerStats(location?._id);
      setStats(res.data.stats);
    } catch (err) {
      console.error("Failed to load stats");
    }
  };

  const loadHealth = async () => {
    try {
      const res = await gbpGetSchedulerHealth();
      setHealth(res.data.data);
    } catch (err) {
      console.error("Failed to load health");
    }
  };

  const loadCampaigns = async () => {
    try {
      const res = await gbpGetCampaigns({ locationId: location?._id, status: "active" });
      setCampaigns(res.data.data || []);
    } catch (err) {
      console.error("Failed to load campaigns");
    }
  };

  const handleLocationChange = (locId: string) => {
    const loc = locations.find((l) => l._id === locId);
    if (loc) setLocation(loc);
  };

  const handleBulkAction = async (action: string) => {
    if (selectedPosts.length === 0) {
      toast.error("Please select posts first");
      return;
    }
    
    try {
      await gbpBulkUpdatePosts(selectedPosts, action);
      toast.success(`${selectedPosts.length} post(s) ${action}`);
      setSelectedPosts([]);
      loadScheduledPosts();
      loadStats();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Bulk action failed");
    }
  };

  const togglePostSelection = (postId: string) => {
    setSelectedPosts(prev =>
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      draft: "bg-slate-500/10 text-slate-400 border-slate-500/20",
      scheduled: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      processing: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      published: "bg-green-500/10 text-green-400 border-green-500/20",
      failed: "bg-red-500/10 text-red-400 border-red-500/20",
      cancelled: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    };
    return colors[status] || colors.draft;
  };

  const getStatusIcon = (status: string) => {
    const icons: any = {
      draft: Edit,
      scheduled: Clock,
      processing: RefreshCw,
      published: CheckCircle2,
      failed: AlertCircle,
      cancelled: Pause,
    };
    const Icon = icons[status] || Clock;
    return <Icon className="h-3 w-3" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-auto bg-slate-950">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-violet-400" />
              Post Scheduler
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Automate Google Business Profile content by location
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Health Status */}
            {health && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className={`w-2 h-2 rounded-full ${health.status === "running" ? "bg-green-500 animate-pulse" : "bg-gray-500"}`} />
                <span className="text-xs text-slate-400">
                  {health.status === "running" ? "Active" : "Idle"}
                </span>
              </div>
            )}
            
            {/* Location Selector */}
            {locations.length > 0 && (
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">
                <Building2 className="h-4 w-4 text-violet-400" />
                <select
                  value={location?._id || ""}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer max-w-[200px] truncate"
                >
                  {locations.map((l: any) => (
                    <option key={l._id} value={l._id} className="bg-slate-900">
                      {l.locationName}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Action Buttons */}
            <button
              onClick={() => setShowAICalendarModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-semibold transition shadow-lg shadow-violet-600/20"
            >
              <Sparkles className="h-4 w-4" /> AI Calendar
            </button>
            
            <button
              onClick={() => setShowScheduleModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition shadow-lg shadow-violet-600/20"
            >
              <Plus className="h-4 w-4" /> Schedule Post
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <StatCard
            label="Scheduled"
            value={stats.scheduled}
            icon={Clock}
            color="blue"
          />
          <StatCard
            label="Processing"
            value={stats.processing}
            icon={RefreshCw}
            color="yellow"
            animate={stats.processing > 0}
          />
          <StatCard
            label="Published Today"
            value={stats.publishedToday}
            icon={CheckCircle2}
            color="green"
          />
          <StatCard
            label="Failed"
            value={stats.failed}
            icon={AlertCircle}
            color="red"
          />
          <StatCard
            label="Overdue"
            value={stats.overdue}
            icon={AlertCircle}
            color="orange"
          />
          <StatCard
            label="Recurring"
            value={stats.recurringSchedules}
            icon={TrendingUp}
            color="purple"
          />
          <StatCard
            label="Campaigns"
            value={stats.activeCampaigns}
            icon={Rocket}
            color="violet"
          />
        </div>
      )}

      {/* Toolbar */}
      <div className="px-6 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/30">
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition ${
                view === "list"
                  ? "bg-violet-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <List className="h-3.5 w-3.5" /> List
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition ${
                view === "calendar"
                  ? "bg-violet-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Calendar className="h-3.5 w-3.5" /> Calendar
            </button>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-violet-500"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="processing">Processing</option>
            <option value="published">Published</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedPosts.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{selectedPosts.length} selected</span>
            <button
              onClick={() => handleBulkAction("scheduled")}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition"
            >
              <Play className="h-3 w-3 inline mr-1" /> Activate
            </button>
            <button
              onClick={() => handleBulkAction("cancelled")}
              className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium transition"
            >
              <Pause className="h-3 w-3 inline mr-1" /> Pause
            </button>
            <button
              onClick={() => handleBulkAction("deleted")}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition"
            >
              <Trash2 className="h-3 w-3 inline mr-1" /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
              <CalendarClock className="h-8 w-8 text-violet-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No Scheduled Posts</h3>
            <p className="text-sm text-slate-400 mb-6 max-w-md">
              Start automating your Google Business Profile by scheduling posts or generating an AI-powered content calendar.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowScheduleModal(true)}
                className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition"
              >
                <Plus className="h-4 w-4 inline mr-2" /> Schedule Post
              </button>
              <button
                onClick={() => setShowAICalendarModal(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-semibold transition"
              >
                <Sparkles className="h-4 w-4 inline mr-2" /> Generate AI Calendar
              </button>
            </div>
          </div>
        ) : view === "list" ? (
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post._id}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedPosts.includes(post._id)}
                      onChange={() => togglePostSelection(post._id)}
                      className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-800 text-violet-600 focus:ring-violet-500"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full border flex items-center gap-1 ${getStatusColor(post.status)}`}>
                          {getStatusIcon(post.status)}
                          {post.status.toUpperCase()}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                          {post.topicType}
                        </span>
                        {post.campaignId && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                            Campaign
                          </span>
                        )}
                        {post.aiGenerated && (
                          <Sparkles className="h-3 w-3 text-violet-400" />
                        )}
                      </div>
                      
                      <p className="text-sm text-slate-300 mb-2 line-clamp-2">{post.summary}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.scheduledAtLocal?.formatted || new Date(post.scheduledAt).toLocaleString()}
                        </span>
                        {post.retryCount > 0 && (
                          <span className="text-yellow-400">
                            Retry {post.retryCount}/{post.maxRetries}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-slate-800 text-red-400 hover:text-red-300 transition">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">
            Calendar view coming soon
          </div>
        )}
      </div>

      {/* Modals */}
      {showScheduleModal && (
        <SchedulePostModal
          isOpen={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          location={location}
          onSuccess={() => {
            loadScheduledPosts();
            loadStats();
          }}
        />
      )}

      {showAICalendarModal && (
        <AICalendarModal
          isOpen={showAICalendarModal}
          onClose={() => setShowAICalendarModal(false)}
          location={location}
          onSuccess={() => {
            loadScheduledPosts();
            loadStats();
          }}
        />
      )}
    </div>
  );
}

const StatCard = ({ label, value, icon: Icon, color, animate }: any) => {
  const colors: any = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    green: "bg-green-500/10 text-green-400 border-green-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  };

  return (
    <div className={`rounded-xl border p-3 ${colors[color]}`}>
      <div className="flex items-center justify-between mb-1">
        <Icon className={`h-4 w-4 ${animate ? "animate-spin" : ""}`} />
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <div className="text-xs opacity-80">{label}</div>
    </div>
  );
};

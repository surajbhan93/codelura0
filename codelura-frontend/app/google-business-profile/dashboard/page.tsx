"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { gbpGetLocations, gbpGetAudit, gbpGetNotifications, gbpGetSyncStatus } from "@/lib/gbp/gbpApi";
import { BarChart2, Star, FileText, Gauge, Bell, Building2, AlertCircle } from "lucide-react";
import Link from "next/link";
import GbpTopBar from "@/components/gbp/GbpTopBar";
import toast from "react-hot-toast";

function DashboardContent() {
  const searchParams = useSearchParams();
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [audit, setAudit] = useState<any>(null);
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const locationIdParam = searchParams.get("locationId");

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
          try {
            const auditRes = await gbpGetAudit(targetLoc._id);
            setAudit(auditRes.data.data);
          } catch (_) {}
        }

        try {
          const syncRes = await gbpGetSyncStatus();
          setSyncStatus(syncRes.data.data);
        } catch (_) {}

        try {
          const notifRes = await gbpGetNotifications({ unreadOnly: true });
          setUnreadCount(notifRes.data.unreadCount || 0);
        } catch (_) {}
      } catch (err: any) {
        if (err?.response?.status === 401) {
          toast.error("Please connect your Google Business Profile.");
        }
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [locationIdParam]);

  const QUICK_LINKS = [
    { href: "/google-business-profile/reviews", label: "Reviews", Icon: Star, color: "text-amber-400" },
    { href: "/google-business-profile/posts", label: "Posts", Icon: FileText, color: "text-blue-400" },
    { href: "/google-business-profile/performance", label: "Performance", Icon: BarChart2, color: "text-violet-400" },
    { href: "/google-business-profile/audit", label: "SEO Audit", Icon: Gauge, color: "text-emerald-400" },
    { href: "/google-business-profile/ai-seo", label: "AI SEO", Icon: Building2, color: "text-purple-400" },
    { href: "/google-business-profile/notifications", label: `Notifications${unreadCount > 0 ? ` (${unreadCount})` : ""}`, Icon: Bell, color: "text-red-400" },
  ];

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

  const scoreColor = (s?: number) => s == null ? "text-slate-400" : s >= 80 ? "text-emerald-400" : s >= 50 ? "text-amber-400" : "text-red-400";

  return (
    <div className="flex flex-col h-full overflow-auto">
      <GbpTopBar
        googleEmail={undefined}
        locationName={selectedLocation?.locationName}
        lastSynced={syncStatus?.completedAt}
      />

      <div className="flex-1 p-6 space-y-6">
        {locations.length > 1 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">Location:</span>
            <select
              value={selectedLocation._id}
              onChange={e => setSelectedLocation(locations.find(l => l._id === e.target.value))}
              className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-violet-500"
            >
              {locations.map(l => <option key={l._id} value={l._id}>{l.locationName}</option>)}
            </select>
          </div>
        )}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Profile Health</h2>
            <Link href="/google-business-profile/audit" className="text-xs text-violet-400 hover:text-violet-300">Run Audit →</Link>
          </div>
          <div className="flex items-center gap-8">
            <div className="relative flex items-center justify-center w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e293b" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#7c3aed" strokeWidth="3"
                  strokeDasharray={`${audit?.overallScore || selectedLocation?.profileCompleteness || 0} 100`}
                  strokeLinecap="round" />
              </svg>
              <span className={`absolute text-xl font-black ${scoreColor(audit?.overallScore || selectedLocation?.profileCompleteness)}`}>
                {audit?.overallScore || selectedLocation?.profileCompleteness || 0}%
              </span>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-2">
                {audit?.completedItems?.slice(0, 4).map((item: any) => (
                  <div key={item.field} className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <span className="text-emerald-500">✓</span> {item.label}
                  </div>
                ))}
                {audit?.criticalIssues?.slice(0, 2).map((issue: any) => (
                  <div key={issue.field} className="flex items-center gap-1.5 text-xs text-red-400">
                    <span>✗</span> {issue.issue}
                  </div>
                ))}
                {audit?.warnings?.slice(0, 2).map((w: any) => (
                  <div key={w.field} className="flex items-center gap-1.5 text-xs text-amber-400">
                    <span>⚠</span> {w.issue}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Reviews", value: selectedLocation.reviewCount || 0, Icon: Star, color: "text-amber-400" },
            { label: "Rating", value: selectedLocation.averageRating?.toFixed(1) || "—", Icon: Star, color: "text-amber-400" },
            { label: "Profile Score", value: `${selectedLocation.profileCompleteness || 0}%`, Icon: Gauge, color: "text-violet-400" },
            { label: "Status", value: selectedLocation.openInfo?.status === "OPEN" ? "Open" : "—", Icon: Building2, color: "text-emerald-400" },
          ].map(({ label, value, Icon, color }) => (
            <div key={label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <Icon className={`h-5 w-5 ${color} mb-2`} />
              <p className="text-2xl font-black text-white">{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-base font-bold text-white mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {QUICK_LINKS.map(({ href, label, Icon, color }) => (
              <Link key={href} href={href}
                className="group flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-violet-500/30 hover:bg-slate-900 transition">
                <Icon className={`h-5 w-5 ${color}`} />
                <span className="text-sm font-medium text-slate-300 group-hover:text-white">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GbpDashboard() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}

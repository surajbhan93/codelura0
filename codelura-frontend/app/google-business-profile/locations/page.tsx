"use client";
import { useEffect, useState } from "react";
import { gbpGetLocations, gbpSyncLocations, gbpSetPrimary } from "@/lib/gbp/gbpApi";
import { MapPin, RefreshCw, Star, Phone, Globe, CheckCircle, Crown } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Location {
  _id: string;
  locationName: string;
  googleLocationId: string;
  primaryCategory?: { displayName: string };
  address?: { addressLines?: string[]; locality?: string; administrativeArea?: string };
  primaryPhone?: string;
  websiteUri?: string;
  averageRating?: number;
  reviewCount?: number;
  verificationState?: string;
  profileCompleteness?: number;
  isPrimary?: boolean;
  lastSyncedAt?: string;
  openInfo?: { status?: string };
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchLocations = async () => {
    try {
      const res = await gbpGetLocations();
      setLocations(res.data.data || []);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      if (err?.response?.status === 401) {
        toast.error(msg || "Please connect your Google Business Profile first.");
      } else {
        toast.error(msg || "Failed to load locations.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await gbpSyncLocations();
      await fetchLocations();
      toast.success("Locations synced!");
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      toast.error(msg || "Sync failed. Please connect your Google account.");
    } finally {
      setSyncing(false);
    }
  };

  const handleSetPrimary = async (id: string) => {
    try {
      await gbpSetPrimary(id);
      await fetchLocations();
      toast.success("Primary location updated.");
    } catch {
      toast.error("Failed to update.");
    }
  };

  useEffect(() => { fetchLocations(); }, []);

  const formatAddress = (addr?: Location["address"]) => {
    if (!addr) return "";
    return [addr.addressLines?.join(", "), addr.locality, addr.administrativeArea].filter(Boolean).join(", ");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Business Locations</h1>
          <p className="text-sm text-slate-500 mt-0.5">{locations.length} authorized location{locations.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={handleSync} disabled={syncing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition disabled:opacity-60">
          <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
          Sync
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1,2,3].map(i => (
              <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 animate-pulse">
                <div className="h-5 w-48 bg-slate-800 rounded mb-3" />
                <div className="h-4 w-32 bg-slate-800 rounded mb-2" />
                <div className="h-4 w-full bg-slate-800 rounded" />
              </div>
            ))}
          </div>
        ) : locations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <MapPin className="h-12 w-12 text-slate-700 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Locations Found</h3>
            <p className="text-slate-500 text-sm mb-6">Connect your Google Business Profile to see your locations.</p>
            <Link href="/google-business-profile/oauth" className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition">
              Connect Google
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {locations.map(loc => (
              <div key={loc._id} className={`group relative rounded-2xl border bg-slate-900/60 p-5 hover:border-violet-500/30 transition flex flex-col ${
                loc.isPrimary ? "border-violet-500/40 ring-1 ring-violet-500/20" : "border-slate-800"
              }`}>
                {loc.isPrimary && (
                  <div className="absolute -top-3 left-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-violet-600 px-3 py-0.5 text-[10px] font-bold text-white">
                      <Crown className="h-3 w-3" /> Primary
                    </span>
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate">{loc.locationName}</h3>
                    {loc.primaryCategory && (
                      <p className="text-xs text-violet-400 mt-0.5">{loc.primaryCategory.displayName}</p>
                    )}
                  </div>
                  {loc.verificationState === "VERIFIED" && (
                    <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 ml-2" />
                  )}
                </div>

                <div className="space-y-1.5 mb-4">
                  {formatAddress(loc.address) && (
                    <div className="flex items-start gap-2 text-xs text-slate-400">
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-slate-600 mt-0.5" />
                      <span>{formatAddress(loc.address)}</span>
                    </div>
                  )}
                  {loc.primaryPhone && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Phone className="h-3.5 w-3.5 text-slate-600" />
                      <span>{loc.primaryPhone}</span>
                    </div>
                  )}
                  {loc.websiteUri && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Globe className="h-3.5 w-3.5 text-slate-600" />
                      <span className="truncate">{loc.websiteUri}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4 pt-3 border-t border-slate-800">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-white">{loc.averageRating?.toFixed(1) || "—"}</span>
                    <span className="text-xs text-slate-500">({loc.reviewCount || 0})</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Profile Score</p>
                    <p className={`text-sm font-bold ${
                      (loc.profileCompleteness || 0) >= 80 ? "text-emerald-400" :
                      (loc.profileCompleteness || 0) >= 50 ? "text-amber-400" : "text-red-400"
                    }`}>{loc.profileCompleteness || 0}%</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-auto">
                  <Link
                    href={`/google-business-profile/dashboard?locationId=${loc._id}`}
                    className="flex-1 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold text-center transition"
                  >
                    Open Dashboard
                  </Link>
                  {!loc.isPrimary && (
                    <button
                      onClick={() => handleSetPrimary(loc._id)}
                      className="px-3 py-2 rounded-lg border border-slate-700 text-slate-400 text-xs hover:border-violet-500/40 hover:text-violet-300 transition"
                    >
                      Set Primary
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

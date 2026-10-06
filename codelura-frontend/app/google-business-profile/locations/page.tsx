"use client";
import { useEffect, useState } from "react";
import { gbpGetLocations, gbpSyncLocations, gbpSetPrimary, gbpGetStatus, gbpGetConnectUrl } from "@/lib/gbp/gbpApi";
import { MapPin, RefreshCw, Star, Phone, Globe, CheckCircle, Crown, AlertCircle, Zap, ShieldCheck } from "lucide-react";
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
  const [isConnected, setIsConnected] = useState(true);
  const [connecting, setConnecting] = useState(false);

  const checkStatus = async () => {
    try {
      const res = await gbpGetStatus();
      setIsConnected(!!res.data.data?.connected);
    } catch {
      setIsConnected(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await gbpGetLocations();
      setLocations(res.data.data || []);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      if (err?.response?.status === 401) {
        setIsConnected(false);
        toast.error(msg || "Please connect your Google Business Profile first.");
      } else {
        toast.error(msg || "Failed to load locations.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const res = await gbpGetConnectUrl();
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch {
      toast.error("Failed to start Google connection.");
      setConnecting(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await gbpSyncLocations();
      await fetchLocations();
      setIsConnected(true);
      toast.success("Locations synced successfully!");
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      if (err?.response?.status === 401) {
        setIsConnected(false);
      }
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

  useEffect(() => {
    checkStatus();
    fetchLocations();
  }, []);

  const formatAddress = (addr?: Location["address"]) => {
    if (!addr) return "";
    return [addr.addressLines?.join(", "), addr.locality, addr.administrativeArea].filter(Boolean).join(", ");
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-auto">
      {/* Reconnect Banner if Disconnected */}
      {!isConnected && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3.5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5 text-amber-300 text-xs font-medium">
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
            <span>Google authorization expired or disconnected. Reconnect your Google account to sync live locations and reviews.</span>
          </div>
          <button
            onClick={handleConnect}
            disabled={connecting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-sm disabled:opacity-60"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>{connecting ? "Connecting..." : "Reconnect Google Account"}</span>
          </button>
        </div>
      )}

      <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between flex-wrap gap-4 bg-slate-900/40">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Business Locations</h1>
          <p className="text-xs text-slate-400 mt-1">{locations.length} authorized location{locations.length !== 1 ? "s" : ""}</p>
        </div>

        <div className="flex items-center gap-2.5">
          {!isConnected && (
            <button
              onClick={handleConnect}
              disabled={connecting}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition shadow-md shadow-violet-600/20"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>{connecting ? "Redirecting..." : "Connect Google"}</span>
            </button>
          )}

          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold transition disabled:opacity-60 shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
            <span>{syncing ? "Syncing..." : "Sync Locations"}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 animate-pulse">
                <div className="h-5 w-48 bg-slate-800 rounded mb-3" />
                <div className="h-4 w-32 bg-slate-800 rounded mb-2" />
                <div className="h-4 w-full bg-slate-800 rounded" />
              </div>
            ))}
          </div>
        ) : locations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-800 rounded-3xl bg-slate-900/20 p-8">
            <MapPin className="h-12 w-12 text-slate-700 mb-4" />
            <h3 className="text-base font-semibold text-white mb-1">No Locations Found</h3>
            <p className="text-slate-500 text-xs mb-6 max-w-sm">Connect your Google Business Profile to import and manage your locations.</p>
            <button
              onClick={handleConnect}
              className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition shadow-lg shadow-violet-600/30"
            >
              Connect Google Account
            </button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {locations.map((loc) => (
              <div
                key={loc._id}
                className={`group relative rounded-2xl border bg-slate-900/60 p-5 hover:border-violet-500/40 transition flex flex-col justify-between ${
                  loc.isPrimary ? "border-violet-500/50 ring-1 ring-violet-500/30 bg-slate-900/80" : "border-slate-800/80"
                }`}
              >
                {loc.isPrimary && (
                  <div className="absolute -top-3 left-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-3 py-0.5 text-[10px] font-bold text-white shadow-sm">
                      <Crown className="h-3 w-3" /> Primary
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-sm truncate">{loc.locationName}</h3>
                      {loc.primaryCategory && (
                        <p className="text-xs text-violet-400 mt-0.5">{loc.primaryCategory.displayName}</p>
                      )}
                    </div>
                    {loc.verificationState === "VERIFIED" && (
                      <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0 ml-2" />
                    )}
                  </div>

                  <div className="space-y-1.5 mb-4">
                    {formatAddress(loc.address) && (
                      <div className="flex items-start gap-2 text-xs text-slate-400">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-slate-500 mt-0.5" />
                        <span className="line-clamp-2">{formatAddress(loc.address)}</span>
                      </div>
                    )}
                    {loc.primaryPhone && (
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Phone className="h-3.5 w-3.5 flex-shrink-0 text-slate-500" />
                        <span>{loc.primaryPhone}</span>
                      </div>
                    )}
                    {loc.websiteUri && (
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Globe className="h-3.5 w-3.5 flex-shrink-0 text-slate-500" />
                        <a
                          href={loc.websiteUri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate hover:text-violet-400 transition"
                        >
                          {loc.websiteUri}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 mt-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3.5">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-white">{loc.averageRating ? loc.averageRating.toFixed(1) : "0.0"}</span>
                      <span className="text-[11px] text-slate-500">({loc.reviewCount || 0})</span>
                    </div>
                    {loc.profileCompleteness !== undefined && (
                      <span className="text-[11px] font-medium text-emerald-400">
                        Profile Score: {loc.profileCompleteness}%
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/google-business-profile/dashboard?locationId=${loc._id}`}
                      className="flex-1 text-center py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition shadow-sm"
                    >
                      Open Dashboard
                    </Link>

                    {!loc.isPrimary && (
                      <button
                        onClick={() => handleSetPrimary(loc._id)}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                      >
                        Set Primary
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

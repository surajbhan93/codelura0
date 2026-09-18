"use client";
import { useState } from "react";
import { RefreshCw, LogOut, Building2 } from "lucide-react";
import { gbpTriggerSync, gbpDisconnect } from "@/lib/gbp/gbpApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Props {
  googleEmail?: string;
  locationName?: string;
  lastSynced?: string | null;
}

export default function GbpTopBar({ googleEmail, locationName, lastSynced }: Props) {
  const [syncing, setSyncing] = useState(false);
  const router = useRouter();

  const handleSync = async () => {
    setSyncing(true);
    try {
      await gbpTriggerSync();
      toast.success("Sync started! Data will refresh shortly.");
    } catch {
      toast.error("Sync failed. Please try again.");
    } finally {
      setTimeout(() => setSyncing(false), 2000);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Disconnect your Google Business Profile?")) return;
    try {
      await gbpDisconnect();
      toast.success("Google account disconnected.");
      router.push("/google-business-profile/oauth");
    } catch {
      toast.error("Failed to disconnect.");
    }
  };

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-violet-400" />
        <span className="text-sm font-semibold text-white">{locationName || "Select Location"}</span>
        {lastSynced && (
          <span className="text-xs text-slate-500 ml-2">
            Synced {new Date(lastSynced).toLocaleTimeString()}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {googleEmail && (
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/60 border border-slate-700 rounded-full px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {googleEmail}
          </span>
        )}
        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium hover:text-white hover:border-violet-500/50 transition disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">{syncing ? "Syncing..." : "Sync"}</span>
        </button>
        <button
          onClick={handleDisconnect}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/20 transition"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Disconnect</span>
        </button>
      </div>
    </header>
  );
}

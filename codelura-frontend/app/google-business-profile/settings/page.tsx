"use client";
import { useState } from "react";
import { gbpDisconnect } from "@/lib/gbp/gbpApi";
import { Settings, LogOut, Shield } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [disconnecting, setDisconnecting] = useState(false);
  const router = useRouter();

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect your Google account? Your local data will be kept but API access will cease.")) return;
    setDisconnecting(true);
    try {
      await gbpDisconnect();
      toast.success("Disconnected.");
      router.push("/google-business-profile/oauth");
    } catch { toast.error("Failed to disconnect."); }
    finally { setDisconnecting(false); }
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="px-6 py-5 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white flex items-center gap-2"><Settings className="h-5 w-5 text-violet-400" /> Module Settings</h1>
        <p className="text-sm text-slate-500">Manage connections and preferences for Google Business Profile & Local SEO</p>
      </div>
      <div className="flex-1 p-6 max-w-xl space-y-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-violet-400" />
            <div>
              <h2 className="text-base font-bold text-white">Google OAuth Connection</h2>
              <p className="text-xs text-slate-400 mt-0.5">Tokens are stored with AES-256 encryption at rest.</p>
            </div>
          </div>
          <button onClick={handleDisconnect} disabled={disconnecting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition disabled:opacity-50">
            <LogOut className="h-4 w-4" />
            {disconnecting ? "Disconnecting..." : "Disconnect Google Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

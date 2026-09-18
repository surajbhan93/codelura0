"use client";
import { useEffect, useState } from "react";
import { gbpGetLocations } from "@/lib/gbp/gbpApi";
import { ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";

export default function VerificationPage() {
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gbpGetLocations().then(res => {
      const locs = res.data.data || [];
      setLocation(locs.find((l: any) => l.isPrimary) || locs[0] || null);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex-1 flex items-center justify-center"><div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>;

  const isVerified = location?.verificationState === "VERIFIED";

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="px-6 py-5 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-violet-400" /> Verification Status</h1>
        <p className="text-sm text-slate-500">Official Google Business Profile verification status</p>
      </div>
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
        {isVerified ? (
          <div className="max-w-md space-y-3">
            <CheckCircle2 className="h-16 w-16 text-emerald-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">Verified Location</h2>
            <p className="text-slate-400 text-sm">Your location <span className="text-white font-semibold">{location?.locationName}</span> is officially verified on Google.</p>
          </div>
        ) : (
          <div className="max-w-md space-y-3">
            <AlertCircle className="h-16 w-16 text-amber-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">Unverified Location</h2>
            <p className="text-slate-400 text-sm">Verification actions must be initiated directly through your Google account according to Google API policies.</p>
          </div>
        )}
      </div>
    </div>
  );
}

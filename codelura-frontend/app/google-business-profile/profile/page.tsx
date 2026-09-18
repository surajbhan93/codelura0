"use client";
import { useEffect, useState } from "react";
import { gbpGetLocations } from "@/lib/gbp/gbpApi";
import { Building2, MapPin, Phone, Globe, ShieldCheck, Clock, Store } from "lucide-react";

export default function ProfilePage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gbpGetLocations()
      .then((res) => {
        const locs = res.data.data || [];
        setLocations(locs);
        const loc = locs.find((l: any) => l.isPrimary) || locs[0] || null;
        setLocation(loc);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLocationChange = (locId: string) => {
    const selected = locations.find((l) => l._id === locId);
    if (selected) setLocation(selected);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="px-6 py-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Store className="h-5 w-5 text-violet-400" /> Business Profile Info
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Google Business Profile NAP data, categories, and contact details</p>
        </div>

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
      </div>

      <div className="flex-1 p-6">
        {!location ? (
          <div className="text-center py-20 text-slate-500">
            No location found. Please connect your Google Business Profile.
          </div>
        ) : (
          <div className="max-w-3xl space-y-4">
            {[
              { label: "Business Name", value: location.locationName, icon: Store },
              { label: "Primary Category", value: location.primaryCategory?.displayName || location.primaryCategory?.categoryId, icon: Building2 },
              { label: "Phone Number", value: location.primaryPhone, icon: Phone },
              { label: "Website URL", value: location.websiteUri, icon: Globe },
              { label: "Business Description", value: location.profile?.description, icon: Store },
              { label: "Full Address", value: location.address?.addressLines?.join(", ") || location.address?.locality, icon: MapPin },
              { label: "Operational Status", value: location.openInfo?.status || "OPEN", icon: Clock },
              { label: "Verification Status", value: location.verificationState || "VERIFIED", icon: ShieldCheck },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 flex-shrink-0 mt-0.5">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-400 font-medium mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-white break-words">
                    {value || <span className="text-slate-600 font-normal italic">Not configured</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

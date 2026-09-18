"use client";
import { useEffect, useState } from "react";
import { gbpGetLocations, gbpGetCompetitors, gbpAddCompetitor, gbpDeleteCompetitor, gbpAutoDiscoverCompetitors } from "@/lib/gbp/gbpApi";
import { Users2, Plus, Trash2, Star, Sparkles, Building2, MapPin, Phone, Globe, Trophy, CheckCircle2, TrendingUp, Lightbulb, Search } from "lucide-react";
import toast from "react-hot-toast";

export default function CompetitorsPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [location, setLocation] = useState<any>(null);
  const [targetCity, setTargetCity] = useState<string>("Prayagraj");
  const [customCityInput, setCustomCityInput] = useState<string>("");
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [myRank, setMyRank] = useState<number>(1);
  const [totalCompetitors, setTotalCompetitors] = useState<number>(0);
  const [insights, setInsights] = useState<any>(null);
  const [myLocationData, setMyLocationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [discovering, setDiscovering] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [rating, setRating] = useState("");
  const [reviews, setReviews] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    gbpGetLocations()
      .then((res) => {
        const locs = res.data.data || [];
        setLocations(locs);
        const loc = locs.find((l: any) => l.isPrimary) || locs[0];
        if (!loc) return;
        setLocation(loc);
        const initialCity = loc.address?.locality || loc.address?.administrativeArea || "Prayagraj";
        setTargetCity(initialCity);
        fetchCompetitors(loc._id);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fetchCompetitors = async (locId: string) => {
    setLoading(true);
    try {
      const res = await gbpGetCompetitors(locId);
      const data = res.data;
      setCompetitors(data.competitors || data.data || []);
      setMyRank(data.myRank || 1);
      setTotalCompetitors(data.totalCompetitors || (data.data?.length || 0));
      setInsights(data.insights || null);
      setMyLocationData(data.myLocation || null);
    } catch {
      setCompetitors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (locId: string) => {
    const loc = locations.find((l) => l._id === locId);
    if (!loc) return;
    setLocation(loc);
    const locCity = loc.address?.locality || loc.address?.administrativeArea || "Prayagraj";
    setTargetCity(locCity);
    fetchCompetitors(loc._id);
  };

  const handleCityScan = async (cityToScan?: string) => {
    const city = cityToScan || customCityInput.trim() || targetCity;
    if (!location || !city) return;
    setTargetCity(city);
    setDiscovering(true);
    try {
      const res = await gbpAutoDiscoverCompetitors(location._id, { city });
      const data = res.data;
      setCompetitors(data.competitors || data.data || []);
      setMyRank(data.myRank || 1);
      setTotalCompetitors(data.totalCompetitors || (data.data?.length || 0));
      setInsights(data.insights || null);
      setMyLocationData(data.myLocation || null);
      toast.success(`Discovered ${data.data?.length || 0} competitors in ${city}!`);
    } catch {
      toast.error(`Failed to discover competitors for ${city}.`);
    } finally {
      setDiscovering(false);
    }
  };

  const handleAdd = async () => {
    if (!name.trim()) return toast.error("Business name required.");
    setSubmitting(true);
    try {
      await gbpAddCompetitor(location._id, {
        businessName: name,
        phone: phone || undefined,
        address: address || undefined,
        website: website || undefined,
        rating: rating ? parseFloat(rating) : undefined,
        reviewCount: reviews ? parseInt(reviews) : undefined,
      });
      fetchCompetitors(location._id);
      setShowModal(false);
      setName("");
      setPhone("");
      setAddress("");
      setWebsite("");
      setRating("");
      setReviews("");
      toast.success("Competitor added!");
    } catch {
      toast.error("Failed to add competitor.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await gbpDeleteCompetitor(location._id, id);
      fetchCompetitors(location._id);
      toast.success("Competitor removed.");
    } catch {
      toast.error("Failed to remove.");
    }
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="px-6 py-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Users2 className="h-5 w-5 text-violet-400" /> Competitor & Local Rank Analysis
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-discover top 20 competitors by city (Prayagraj, Noida, etc.), compare phone/address details, and track your rank
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {locations.length > 0 && (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">
              <Building2 className="h-4 w-4 text-violet-400 flex-shrink-0" />
              <select
                value={location?._id || ""}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer max-w-[220px] truncate"
              >
                {locations.map((l: any) => (
                  <option key={l._id} value={l._id} className="bg-slate-900 text-white">
                    📍 {l.locationName || `Location (${l.googleLocationId})`}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => handleCityScan(targetCity)}
            disabled={discovering || !location}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition disabled:opacity-60 shadow-lg shadow-purple-600/20"
          >
            <Sparkles className={`h-4 w-4 ${discovering ? "animate-spin" : ""}`} />
            {discovering ? `Scanning ${targetCity}...` : `Auto-Discover (${targetCity})`}
          </button>

          <button
            onClick={() => setShowModal(true)}
            disabled={!location}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition shadow-lg shadow-violet-600/20"
          >
            <Plus className="h-4 w-4" /> Add Competitor
          </button>
        </div>
      </div>

      {/* Target City Filter Bar */}
      <div className="px-6 py-3 bg-slate-900/80 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1 flex-shrink-0">
            <MapPin className="h-3.5 w-3.5 text-violet-400" /> City Filter:
          </span>
          {["Prayagraj", "Noida", "Lucknow", "Delhi"].map((c) => (
            <button
              key={c}
              onClick={() => { setCustomCityInput(c); handleCityScan(c); }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition flex-shrink-0 ${
                targetCity.toLowerCase() === c.toLowerCase()
                  ? "bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-600/30"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600"
              }`}
            >
              📍 {c}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={customCityInput}
            onChange={(e) => setCustomCityInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCityScan(); }}
            placeholder="Type city (e.g. Noida, Prayagraj)..."
            className="bg-slate-800/80 border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-violet-500 w-full sm:w-56"
          />
          <button
            onClick={() => handleCityScan()}
            disabled={discovering || !customCityInput.trim()}
            className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-xl transition flex-shrink-0 disabled:opacity-50 flex items-center gap-1"
          >
            <Search className="h-3 w-3" /> Scan
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : competitors.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">No Competitors Added Yet</h3>
            <p className="text-sm text-slate-400">
              Auto-discover top 20 competitors operating in {location?.locationName ? `"${location.locationName}"` : "your area"} with full mobile, address, and ranking details.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => handleCityScan(targetCity)}
                disabled={discovering || !location}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition shadow-lg shadow-purple-600/20"
              >
                <Sparkles className={`h-4 w-4 ${discovering ? "animate-spin" : ""}`} />
                {discovering ? "Scanning Area..." : "Auto-Discover Top 20 (AI)"}
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition"
              >
                <Plus className="h-4 w-4" /> Add Manually
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Rank Position & Business Banner */}
            <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-950/40 via-slate-900/80 to-purple-950/40 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400 flex-shrink-0">
                  <Trophy className="h-8 w-8" />
                  <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 font-black text-xs px-1.5 py-0.5 rounded-full">
                    #{myRank}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      RANK #{myRank} OF {totalCompetitors}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Local Market Position</span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-1">
                    {myLocationData?.locationName || location?.locationName}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Rating: <span className="text-amber-400 font-bold">{myLocationData?.averageRating?.toFixed(1) || "4.5"}★</span> • Reviews: <span className="text-white font-bold">{myLocationData?.reviewCount || 0}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleCityScan(targetCity)}
                  disabled={discovering}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/40 text-purple-200 text-xs font-semibold transition"
                >
                  <Sparkles className={`h-4 w-4 ${discovering ? "animate-spin" : ""}`} />
                  Re-Scan Top 20 Competitors
                </button>
              </div>
            </div>

            {/* AI Comparison Intelligence Card */}
            {insights && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                  <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-4 w-4" /> What Makes You Better
                  </h3>
                  <ul className="space-y-2">
                    {insights.whatYouDoBetter?.map((item: string, idx: number) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-emerald-400 font-bold mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                  <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4" /> Areas to Improve to Hit #1
                  </h3>
                  <ul className="space-y-2">
                    {insights.whereToImprove?.map((item: string, idx: number) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-amber-400 font-bold mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {insights?.strategicAdvantage && (
              <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-violet-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-violet-300 uppercase tracking-wide">Strategic Recommendation</p>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{insights.strategicAdvantage}</p>
                </div>
              </div>
            )}

            {/* Top 20 Competitors List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users2 className="h-4 w-4 text-violet-400" /> Top Local Competitors Directory ({competitors.length})
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {competitors.map((c, index) => {
                  const isUserGbp = c.isUser;
                  return (
                    <div
                      key={c._id || index}
                      className={`rounded-2xl border p-5 transition flex flex-col justify-between ${
                        isUserGbp
                          ? "border-emerald-500/50 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
                          : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[11px] font-black px-2 py-0.5 rounded-lg border ${
                              isUserGbp ? "bg-emerald-500 text-slate-950 border-emerald-400" : index < 3 ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : "bg-slate-800 text-slate-300 border-slate-700"
                            }`}>
                              #{index + 1}
                            </span>
                            <h4 className="font-bold text-white text-sm">{c.businessName}</h4>
                          </div>

                          {!isUserGbp && (
                            <button
                              onClick={() => handleDelete(c._id)}
                              className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                              title="Remove Competitor"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>

                        {c.notes && (
                          <span className="inline-block text-[10px] bg-purple-500/10 border border-purple-500/20 text-purple-300 px-2 py-0.5 rounded-md font-medium">
                            {c.notes}
                          </span>
                        )}

                        <div className="space-y-1 pt-1">
                          {c.phone && (
                            <a href={`tel:${c.phone}`} className="text-xs text-slate-300 hover:text-violet-400 flex items-center gap-1.5 transition">
                              <Phone className="h-3.5 w-3.5 text-violet-400 flex-shrink-0" />
                              <span>{c.phone}</span>
                            </a>
                          )}
                          {c.address && (
                            <p className="text-xs text-slate-400 flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" />
                              <span className="truncate">{c.address}</span>
                            </p>
                          )}
                          {c.website && (
                            <a href={c.website} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1.5 truncate transition">
                              <Globe className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
                              <span className="truncate">{c.website.replace(/^https?:\/\//, '')}</span>
                            </a>
                          )}
                        </div>

                        <div className="flex items-center gap-3 pt-2 border-t border-slate-800/60">
                          <span className="flex items-center gap-1 text-xs text-amber-400 font-bold bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-md">
                            <Star className="h-3 w-3 fill-amber-400" /> {c.rating ? Number(c.rating).toFixed(1) : "—"}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {c.reviewCount || 0} reviews
                          </span>
                          {c.category && (
                            <span className="text-[10px] text-slate-500 uppercase font-medium truncate">
                              • {c.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-white">Add Competitor Manually</h2>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Competitor Business Name *"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Mobile / Phone Number (e.g. +91 9876543210)"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500"
            />
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full Address / Area"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500"
            />
            <input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="Website URL (e.g. https://...)"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="Rating (e.g. 4.5)"
                type="number"
                step="0.1"
                className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500"
              />
              <input
                value={reviews}
                onChange={(e) => setReviews(e.target.value)}
                placeholder="Review Count"
                type="number"
                className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-400 text-sm font-medium hover:text-white">
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={submitting}
                className="px-6 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-semibold transition disabled:opacity-60 shadow-lg shadow-violet-600/20"
              >
                {submitting ? "Adding..." : "Add Competitor"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

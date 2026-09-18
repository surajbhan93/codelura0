"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { gbpGetStatus, gbpGetConnectUrl } from "@/lib/gbp/gbpApi";
import { Chrome, ShieldCheck, Zap, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

function OAuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const error = searchParams.get("error");
  const connected = searchParams.get("connected");

  useEffect(() => {
    if (connected) {
      toast.success("Google Business Profile connected!");
      router.replace("/google-business-profile/locations");
      return;
    }
    gbpGetStatus()
      .then((res) => {
        if (res.data?.data?.connected) {
          router.replace("/google-business-profile/dashboard");
        }
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [connected, router]);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const res = await gbpGetConnectUrl();
      window.location.href = res.data.url;
    } catch {
      toast.error("Failed to initiate Google connection. Please try again.");
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050714]">
        <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050714] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 shadow-xl shadow-violet-600/30 mb-4">
            <Chrome className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Connect Google Business Profile</h1>
          <p className="text-slate-400 text-sm mt-2">Manage your business, reviews, posts, and SEO in one place</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-300">Connection Error</p>
              <p className="text-xs text-red-400 mt-0.5">{decodeURIComponent(error)}</p>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 mb-6">
          {[
            { Icon: ShieldCheck, title: "Secure OAuth 2.0", desc: "We never ask for your password. Google authorizes access directly." },
            { Icon: Zap, title: "Full GBP Access", desc: "Reviews, posts, performance, media and SEO insights in one dashboard." },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <Icon className="h-4 w-4 text-violet-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleConnect}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-violet-600/30 hover:from-violet-500 hover:to-purple-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Chrome className="h-5 w-5" />
          )}
          {loading ? "Redirecting to Google..." : "Connect with Google"}
        </button>

        <p className="text-center text-xs text-slate-600 mt-4">
          By connecting, you authorize this app to access your authorized Google Business Profile locations.
          You can disconnect at any time.
        </p>
      </div>
    </div>
  );
}

export default function OAuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#050714]"><div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <OAuthContent />
    </Suspense>
  );
}

"use client";
import { useEffect, useState } from "react";
import { gbpGetNotifications, gbpMarkAllRead } from "@/lib/gbp/gbpApi";
import { Bell, CheckCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    try {
      const res = await gbpGetNotifications();
      setNotifications(res.data.data || []);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNotifs(); }, []);

  const handleMarkAllRead = async () => {
    try {
      await gbpMarkAllRead();
      await fetchNotifs();
      toast.success("All notifications marked as read.");
    } catch { toast.error("Failed."); }
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2"><Bell className="h-5 w-5 text-violet-400" /> Notifications</h1>
          <p className="text-sm text-slate-500">In-app notifications for review updates, posts, and Google updates</p>
        </div>
        <button onClick={handleMarkAllRead} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 text-xs hover:border-violet-500/40 transition">
          <CheckCheck className="h-3.5 w-3.5" /> Mark All Read
        </button>
      </div>
      <div className="flex-1 p-6">
        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20 text-slate-500">No notifications yet.</div>
        ) : (
          <div className="space-y-3">
            {notifications.map(n => (
              <div key={n._id} className={`rounded-xl border p-4 transition ${n.isRead ? "border-slate-800 bg-slate-900/40" : "border-violet-500/30 bg-violet-500/5"}`}>
                <p className="text-sm font-semibold text-white">{n.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>
                <span className="text-[10px] text-slate-600 mt-2 block">{new Date(n.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

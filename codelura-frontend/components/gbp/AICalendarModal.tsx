"use client";
import { useState } from "react";
import { X, Sparkles, Calendar, CheckCircle2, Loader } from "lucide-react";
import { gbpGenerateAICalendar, gbpApproveCalendarPosts } from "@/lib/gbp/gbpApi";
import toast from "react-hot-toast";

interface AICalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: any;
  onSuccess: () => void;
}

export default function AICalendarModal({ isOpen, onClose, location, onSuccess }: AICalendarModalProps) {
  const [step, setStep] = useState<"configure" | "review">("configure");
  const [generating, setGenerating] = useState(false);
  const [approving, setApproving] = useState(false);
  
  // Configuration
  const [postsPerWeek, setPostsPerWeek] = useState(3);
  const [duration, setDuration] = useState(30);
  const [allowedTypes, setAllowedTypes] = useState<string[]>(["STANDARD", "EVENT", "OFFER"]);
  const [tone, setTone] = useState("professional");
  
  // Generated calendar
  const [calendar, setCalendar] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await gbpGenerateAICalendar(location._id, {
        postsPerWeek,
        duration,
        allowedTypes,
        tone,
        timezone: "Asia/Kolkata",
      });
      
      setCalendar(res.data.calendar || []);
      setPosts(res.data.posts || []);
      setSelectedPosts((res.data.posts || []).map((p: any) => p._id));
      setStep("review");
      
      toast.success(`Generated ${res.data.posts?.length || 0} posts!`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to generate calendar");
    } finally {
      setGenerating(false);
    }
  };

  const handleApprove = async () => {
    if (selectedPosts.length === 0) {
      toast.error("Please select at least one post to approve");
      return;
    }
    
    setApproving(true);
    try {
      const res = await gbpApproveCalendarPosts(selectedPosts);
      toast.success(`Approved ${res.data.approved} posts for scheduling!`);
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to approve posts");
    } finally {
      setApproving(false);
    }
  };

  const togglePostSelection = (postId: string) => {
    setSelectedPosts(prev =>
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const toggleType = (type: string) => {
    setAllowedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-gradient-to-r from-violet-600/10 to-purple-600/10">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-400" />
              AI Monthly Calendar Generator
            </h3>
            <p className="text-sm text-slate-400 mt-0.5">
              {step === "configure" 
                ? "Generate 30 days of SEO-optimized content with AI"
                : `Review ${calendar.length} AI-generated posts`
              }
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === "configure" ? (
          // Configuration Step
          <div className="p-6 space-y-5">
            {/* Location Info */}
            <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-600 flex items-center justify-center text-white font-bold">
                  {location?.locationName?.charAt(0) || "L"}
                </div>
                <div>
                  <div className="font-semibold text-white">{location?.locationName}</div>
                  <div className="text-sm text-slate-400">
                    {location?.primaryCategory?.displayName} • {location?.address?.locality}
                  </div>
                </div>
              </div>
            </div>

            {/* Posts per Week */}
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">
                Posts per Week
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPostsPerWeek(num)}
                    className={`px-4 py-2.5 rounded-xl border font-medium text-sm transition ${
                      postsPerWeek === num
                        ? "bg-violet-600 border-violet-500 text-white"
                        : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">
                Duration (Days)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                min={7}
                max={90}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
              />
              <p className="text-xs text-slate-500 mt-1">
                Total posts: ~{Math.floor((duration / 7) * postsPerWeek)}
              </p>
            </div>

            {/* Allowed Post Types */}
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">
                Allowed Post Types
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["STANDARD", "EVENT", "OFFER"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleType(type)}
                    className={`px-4 py-2.5 rounded-xl border font-medium text-sm transition ${
                      allowedTypes.includes(type)
                        ? "bg-violet-600 border-violet-500 text-white"
                        : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone */}
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">
                Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="casual">Casual</option>
                <option value="formal">Formal</option>
                <option value="enthusiastic">Enthusiastic</option>
              </select>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generating || allowedTypes.length === 0}
              className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Generate {Math.floor((duration / 7) * postsPerWeek)}-Post Calendar
                </>
              )}
            </button>
          </div>
        ) : (
          // Review Step
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-slate-400">
                {selectedPosts.length} of {posts.length} posts selected
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedPosts(posts.map(p => p._id))}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Select All
                </button>
                <button
                  onClick={() => setSelectedPosts([])}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Deselect All
                </button>
              </div>
            </div>

            <div className="max-h-[500px] overflow-y-auto space-y-3 mb-4">
              {posts.map((post: any) => (
                <div
                  key={post._id}
                  className={`p-4 rounded-xl border transition cursor-pointer ${
                    selectedPosts.includes(post._id)
                      ? "bg-violet-500/5 border-violet-500/30"
                      : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                  }`}
                  onClick={() => togglePostSelection(post._id)}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedPosts.includes(post._id)}
                      onChange={() => togglePostSelection(post._id)}
                      className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-700 text-violet-600 focus:ring-violet-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 border border-slate-600">
                          Day {Math.floor((posts.indexOf(post) / posts.length) * duration) + 1}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                          {post.topicType}
                        </span>
                        <Sparkles className="h-3 w-3 text-violet-400" />
                      </div>
                      
                      <p className="text-sm text-slate-300 line-clamp-2 mb-2">
                        {post.summary}
                      </p>
                      
                      {post.media?.[0]?.sourceUrl && (
                        <img
                          src={post.media[0].sourceUrl}
                          alt="Post preview"
                          className="w-full h-32 object-cover rounded-lg mt-2"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setStep("configure")}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition"
              >
                Back
              </button>
              <button
                onClick={handleApprove}
                disabled={approving || selectedPosts.length === 0}
                className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {approving ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Approve & Schedule {selectedPosts.length} Posts
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

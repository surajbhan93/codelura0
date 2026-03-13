"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Send, LogIn, Sparkles, Lock, AlertCircle } from "lucide-react";

interface Props {
  blogId: string;
  parentCommentId?: string | null;
  onCommentAdded?: () => void;
}

interface ErrorResponse {
  message: string;
}

export default function CommentBox({
  blogId,
  parentCommentId = null,
  onCommentAdded,
}: Props) {
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [charCount, setCharCount] = useState<number>(0);
  const [wordCount, setWordCount] = useState<number>(0);

  const router = useRouter();

  /* ============ LOGIN CHECK ============ */
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }
  }, []);

  /* ============ UPDATE COUNTS ============ */
  useEffect(() => {
    setCharCount(comment.length);
    setWordCount(comment.trim() ? comment.trim().split(/\s+/).length : 0);
  }, [comment]);

  /* ============ SUBMIT COMMENT ============ */
  const submit = async (): Promise<void> => {
    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      setLoading(true);

      await api.post(
        "/comments",
        {
          blogId,
          comment: comment.trim(),
          parentCommentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        parentCommentId
          ? "Reply added successfully"
          : "Comment added successfully"
      );

      setComment("");

      if (onCommentAdded) {
        onCommentAdded();
      }

    } catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;

      toast.error(
        err.response?.data?.message ||
          "Failed to post comment"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ============ UI ============ */
  return (
    <div
      className={`
        transition-all duration-300
        ${parentCommentId 
          ? "mt-4" 
          : "mt-12"
        }
      `}
    >
      {!parentCommentId && (
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              Share Your Insight
            </h3>
          </div>
          <p className="text-slate-500 ml-7 text-sm leading-relaxed">
            Contribute thoughtfully to the discussion. Your perspective matters.
          </p>
        </div>
      )}

      {!isLoggedIn ? (
        <div className="relative group">
          {/* GRADIENT BORDER EFFECT */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-2xl p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-white to-slate-50 border border-slate-200 p-8 text-center backdrop-blur-sm">
            {/* ANIMATED BACKGROUND ELEMENTS */}
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-100 rounded-full opacity-20 blur-3xl -mr-20 -mt-20 animate-pulse" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-100 rounded-full opacity-20 blur-3xl -ml-20 -mb-20 animate-pulse" style={{ animationDelay: "1s" }} />
            </div>
            
            <div className="relative z-10">
              {/* ICON */}
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 mb-4 shadow-lg">
                <LogIn className="w-7 h-7 text-indigo-600" />
              </div>
              
              {/* TEXT */}
              <p className="text-slate-900 font-semibold text-lg mb-2">
                Join the Conversation
              </p>
              
              <p className="text-slate-600 text-sm mb-6 max-w-sm mx-auto">
                Sign in to share your thoughts and contribute to this discussion
              </p>
              
              {/* CTA BUTTON */}
              <button
                onClick={() => router.push("/login")}
                className="
                  inline-flex items-center gap-2 px-7 py-3
                  bg-gradient-to-r from-indigo-600 to-purple-600
                  text-white text-sm font-semibold
                  rounded-lg
                  hover:shadow-lg hover:shadow-indigo-500/30
                  transition-all duration-300
                  shadow-md
                  active:scale-95
                  hover:from-indigo-700 hover:to-purple-700
                "
              >
                <LogIn className="w-4 h-4" />
                Sign In to Comment
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* TEXTAREA WRAPPER */}
          <div className={`relative group rounded-xl overflow-hidden transition-all duration-300 ${isFocused ? "ring-2 ring-indigo-500 ring-offset-2" : ""}`}>
            {/* GRADIENT BORDER */}
            <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-0.5 opacity-0 transition-opacity duration-300 ${isFocused ? "opacity-100" : "group-hover:opacity-50"}`} />
            
            <div className="relative">
              <textarea
                className="
                  w-full px-5 py-4 text-slate-900 placeholder-slate-400
                  border border-slate-200 rounded-xl
                  focus:outline-none
                  disabled:opacity-50 disabled:bg-slate-50
                  resize-none min-h-[120px] max-h-[320px]
                  transition-all duration-200
                  bg-white
                  font-medium text-base
                  leading-relaxed
                  shadow-sm
                "
                placeholder={
                  parentCommentId
                    ? "Write a thoughtful reply..."
                    : "Share your perspective..."
                }
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={loading}
              />

              {/* CHARACTER & WORD COUNT */}
              <div className="absolute bottom-3 right-4 flex items-center gap-4 text-xs font-medium text-slate-500">
                <span className={charCount > 500 ? "text-amber-600 font-semibold" : ""}>
                  {charCount} chars
                </span>
                <span className="text-slate-400">•</span>
                <span>{wordCount} words</span>
              </div>
            </div>
          </div>

          {/* HELPER TEXT & ACTIONS */}
          <div className="flex items-center justify-between">
            {/* LEFT SIDE - HINTS */}
            <div className="flex items-center gap-2">
              {charCount > 500 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="text-xs text-amber-700 font-medium">
                    Getting long
                  </span>
                </div>
              )}
              
              {!parentCommentId && comment.trim() && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-lg animate-pulse">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs text-indigo-700 font-medium">
                    Ready to share
                  </span>
                </div>
              )}
            </div>

            {/* RIGHT SIDE - BUTTON */}
            <button
              onClick={submit}
              disabled={loading || !comment.trim()}
              className="
                inline-flex items-center gap-2 px-6 py-2.5
                bg-gradient-to-r from-indigo-600 to-purple-600
                text-white text-sm font-semibold
                rounded-lg
                hover:shadow-lg hover:shadow-indigo-500/30
                hover:from-indigo-700 hover:to-purple-700
                disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                transition-all duration-200
                shadow-md
                active:scale-95
              "
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>{parentCommentId ? "Replying..." : "Posting..."}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{parentCommentId ? "Reply" : "Post"}</span>
                </>
              )}
            </button>
          </div>

          {/* FOOTER TEXT */}
          {!parentCommentId && (
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              Your comment will be visible to all community members
            </p>
          )}
        </div>
      )}
    </div>
  );
}
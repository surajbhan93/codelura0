"use client";
import { useEffect, useState, useCallback } from "react";
import { ChevronUp, Share2, Bookmark, Heart } from "lucide-react";
import api from "@/lib/api";

interface Props {
  blogId: string;
  title: string;
}

export default function BlogInteractiveBar({ blogId, title }: Props) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Track view once on mount
  useEffect(() => {
    api.post(`/blogs/${blogId}/view`).catch(() => {});
  }, [blogId]);

  // Restore bookmark state from localStorage
  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    setIsBookmarked(bookmarks.includes(blogId));
  }, [blogId]);

  // Scroll progress + back-to-top visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      setShowBackToTop(scrollTop > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(
    () => window.scrollTo({ top: 0, behavior: "smooth" }),
    []
  );

  const handleLike = useCallback(async () => {
    try {
      await api.post(`/blogs/${blogId}/like`);
      setIsLiked((prev) => !prev);
    } catch (err) {
      console.error("Like failed", err);
    }
  }, [blogId]);

  const handleBookmark = useCallback(() => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    const updated = isBookmarked
      ? bookmarks.filter((id: string) => id !== blogId)
      : [...bookmarks, blogId];
    localStorage.setItem("bookmarks", JSON.stringify(updated));
    setIsBookmarked(!isBookmarked);
  }, [isBookmarked, blogId]);

  const handleShare = useCallback(() => {
    navigator.share?.({ title, url: window.location.href });
  }, [title]);

  return (
    <>
      <div
        className="fixed top-0 left-0 h-[3px] z-50"
        style={{
          width: `${scrollProgress}%`,
          background: "linear-gradient(90deg, #7c3aed, #a855f7, #ec4899)",
          boxShadow: "0 0 20px rgba(168,85,247,0.4)",
          transition: "width 0.1s linear",
        }}
      />

      <div className="fixed right-6 bottom-24 z-40 flex flex-col gap-3">
        <button
          onClick={handleBookmark}
          className="w-11 h-11 rounded-xl bg-[#0f0f17] border border-white/10 flex items-center justify-center text-[#94a3b8] hover:text-white hover:border-violet-500/50 hover:bg-violet-500/10 transition-all shadow-xl shadow-black/50 backdrop-blur-sm"
          aria-label="Bookmark"
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-violet-400 text-violet-400" : ""}`} />
        </button>
        <button
          onClick={handleLike}
          className="w-11 h-11 rounded-xl bg-[#0f0f17] border border-white/10 flex items-center justify-center text-[#94a3b8] hover:text-white hover:border-violet-500/50 hover:bg-violet-500/10 transition-all shadow-xl shadow-black/50 backdrop-blur-sm"
          aria-label="Like"
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-400 text-rose-400" : ""}`} />
        </button>
        <button
          onClick={handleShare}
          className="w-11 h-11 rounded-xl bg-[#0f0f17] border border-white/10 flex items-center justify-center text-[#94a3b8] hover:text-white hover:border-violet-500/50 hover:bg-violet-500/10 transition-all shadow-xl shadow-black/50 backdrop-blur-sm"
          aria-label="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-6 z-40 w-11 h-11 rounded-xl bg-[#0f0f17] border border-white/10 flex items-center justify-center text-[#94a3b8] hover:text-white hover:border-violet-500/50 hover:bg-violet-500/10 transition-all shadow-xl shadow-black/50 backdrop-blur-sm"
          aria-label="Back to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
}
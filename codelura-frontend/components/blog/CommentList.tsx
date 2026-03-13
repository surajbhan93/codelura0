"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import CommentBox from "./CommentBox";
import { Heart, MessageCircle } from "lucide-react";

interface Comment {
  _id: string;
  comment: string;
  userId: {
    name: string;
  };
  parentCommentId?: string | null;
  likes: string[];
  createdAt: string;
}

export default function CommentList({
  blogId,
  refreshKey,
}: {
  blogId: string;
  refreshKey: number;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  /* ============ FETCH COMMENTS ============ */
  useEffect(() => {
    let ignore = false;

    const fetchComments = async () => {
      const { data } = await api.get(
        `/comments/${blogId}?page=${page}`
      );

      if (!ignore) {
        setComments(data.comments);
        setTotalPages(data.totalPages);
      }
    };

    if (blogId) fetchComments();

    return () => {
      ignore = true;
    };
  }, [blogId, refreshKey, page]);

  /* ============ TOGGLE LIKE ============ */
  const toggleLike = async (commentId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLikedComments((prev) => {
        const newSet = new Set(prev);
        newSet.has(commentId)
          ? newSet.delete(commentId)
          : newSet.add(commentId);
        return newSet;
      });

      const { data } = await api.put(
        `/comments/like/${commentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId
            ? { ...c, likes: data.likes }
            : c
        )
      );
    } catch (error) {
      setLikedComments((prev) => {
        const newSet = new Set(prev);
        newSet.has(commentId)
          ? newSet.delete(commentId)
          : newSet.add(commentId);
        return newSet;
      });
    }
  };

  /* ============ FORMAT DATE ============ */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  /* ============ GROUP COMMENTS ============ */
  const rootComments = comments.filter((c) => !c.parentCommentId);
  const getReplies = (parentId: string) =>
    comments.filter((c) => c.parentCommentId === parentId);

  return (
    <div className="mt-16 max-w-4xl mx-auto px-4">
      {/* ========== HEADER SECTION ========== */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-1 bg-gradient-to-b from-indigo-600 to-indigo-400 rounded-full" />
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Discussion
          </h2>
          {rootComments.length > 0 && (
            <span className="ml-auto inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium">
              {rootComments.length}{" "}
              {rootComments.length === 1 ? "comment" : "comments"}
            </span>
          )}
        </div>
        <p className="text-slate-500 ml-4 text-sm">
          Thoughtful insights from the community
        </p>
      </div>

      {/* ========== COMMENTS CONTAINER ========== */}
      <div className="space-y-8">
        {rootComments.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-slate-100 mb-4">
              <MessageCircle className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium mb-2">No comments yet</p>
            <p className="text-slate-400 text-sm">
              Be the first to share your thoughts
            </p>
          </div>
        ) : (
          rootComments.map((comment, index) => (
            <div
              key={comment._id}
              className="group animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* ========== MAIN COMMENT CARD ========== */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-slate-300">
                {/* COMMENT HEADER */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {comment.userId?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate">
                        {comment.userId?.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* COMMENT TEXT */}
                <div className="mb-4 pl-13">
                  <p className="text-slate-700 leading-relaxed text-base whitespace-pre-wrap break-words">
                    {comment.comment}
                  </p>
                </div>

                {/* COMMENT ACTIONS */}
                <div className="flex items-center gap-6 pl-13">
                  <button
                    onClick={() => toggleLike(comment._id)}
                    className="group/btn flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition-all duration-200 active:scale-95"
                  >
                    <div className="relative">
                      <Heart
                        className={`w-5 h-5 transition-all duration-200 ${
                          likedComments.has(comment._id)
                            ? "fill-indigo-600 text-indigo-600"
                            : "group-hover/btn:scale-110"
                        }`}
                      />
                    </div>
                    <span className="font-medium">{comment.likes.length}</span>
                  </button>

                  <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span>Reply</span>
                  </button>
                </div>
              </div>

              {/* ========== REPLIES SECTION ========== */}
              {getReplies(comment._id).length > 0 && (
                <div className="mt-4 ml-6 space-y-3 pl-4 border-l-2 border-slate-200">
                  {getReplies(comment._id).map((reply, replyIndex) => (
                    <div
                      key={reply._id}
                      className="animate-in fade-in slide-in-from-bottom-2 duration-400"
                      style={{
                        animationDelay: `${index * 50 + replyIndex * 30}ms`,
                      }}
                    >
                      <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4 hover:bg-slate-50 transition-all duration-200 group/reply">
                        {/* REPLY HEADER */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 flex-1">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                              {reply.userId?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-900 truncate">
                                {reply.userId?.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {formatDate(reply.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* REPLY TEXT */}
                        <p className="text-sm text-slate-700 leading-relaxed mb-3 whitespace-pre-wrap break-words">
                          {reply.comment}
                        </p>

                        {/* REPLY ACTIONS */}
                        <button
                          onClick={() => toggleLike(reply._id)}
                          className="group/btn-reply flex items-center gap-2 text-xs text-slate-600 hover:text-indigo-600 transition-all duration-200 active:scale-95"
                        >
                          <Heart
                            className={`w-4 h-4 transition-all duration-200 ${
                              likedComments.has(reply._id)
                                ? "fill-indigo-600 text-indigo-600"
                                : "group-hover/btn-reply:scale-110"
                            }`}
                          />
                          <span className="font-medium">{reply.likes.length}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ========== REPLY BOX ========== */}
              <div className="mt-4 ml-6 pl-4 border-l-2 border-slate-200">
                <CommentBox
                  blogId={blogId}
                  parentCommentId={comment._id}
                  onCommentAdded={() => setPage(1)}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* ========== PAGINATION ========== */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-600 mr-4">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            {/* PREVIOUS BUTTON */}
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-2 text-sm font-medium text-slate-700 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              ← Prev
            </button>

            {/* PAGE NUMBERS */}
            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const isActive = page === pageNum;
                const isNear =
                  Math.abs(page - pageNum) <= 1 ||
                  pageNum === 1 ||
                  pageNum === totalPages;

                if (!isNear && totalPages > 5) return null;

                if (!isNear) {
                  return (
                    <span
                      key={`ellipsis-${i}`}
                      className="px-2 py-2 text-slate-400"
                    >
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`h-10 w-10 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* NEXT BUTTON */}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-2 text-sm font-medium text-slate-700 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
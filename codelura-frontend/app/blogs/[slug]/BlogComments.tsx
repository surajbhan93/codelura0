"use client";
import { useState, useCallback } from "react";
import CommentBox from "@/components/blog/CommentBox";
import CommentList from "@/components/blog/CommentList";

export default function BlogComments({ blogId }: { blogId: string }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const handleRefresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  return (
    <div className="space-y-10">
      <CommentBox blogId={blogId} onCommentAdded={handleRefresh} />
      <CommentList blogId={blogId} refreshKey={refreshKey} />
    </div>
  );
}
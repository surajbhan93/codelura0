"use client";

import { useState } from "react";
import api from "@/lib/api";

interface Props {
  content: string;
  onTagsGenerated: (tags: string[]) => void;
}

export default function BlogTagGenerator({
  content,
  onTagsGenerated
}: Props) {
  const [loading, setLoading] = useState(false);

  const generateTags = async () => {
    if (!content) return;

    try {
      setLoading(true);

      const { data } = await api.post("/ai/blog-tags", {
        content
      });

      console.log("🏷 Tag API Response:", data);

      if (data.tags && Array.isArray(data.tags)) {
        onTagsGenerated(data.tags);
      }

    } catch (error) {
      console.error("Tag generation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50 my-6">
      <h3 className="font-semibold mb-3">
        🏷 AI Tag Generator
      </h3>

      <button
        onClick={generateTags}
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Tags"}
      </button>
    </div>
  );
}
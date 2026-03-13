"use client";

import { useState } from "react";
import api from "@/lib/api";
import BlogCard from "./BlogCard";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  authorName: string;
  readingTime: string;
  tags: string[];
  isFeatured: boolean;
  relevanceScore?: number;
}

export default function BlogSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);

      const { data } = await api.post("/ai/search", { query });

      console.log("AI Response:", data);

      setResults(data.blogs || []);
      setSearched(true);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-12 w-full">

      {/* Search Box Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-6 mb-6">

        {/* Label */}
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-3">
          ✦ AI-Powered Semantic Search
        </p>

        {/* Input Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="e.g. node backend authentication..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition placeholder:text-gray-400"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors duration-200"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Searching...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                Search
              </>
            )}
          </button>
        </div>

        {/* Suggestion Chips */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-400">Try:</span>
          {["jwt login system", "secure express api", "node backend authentication"].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setQuery(suggestion)}
              className="text-xs bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 text-gray-500 px-3 py-1 rounded-full border border-gray-200 hover:border-indigo-200 transition-colors duration-150"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {searched && !loading && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-800">
              Search Results
              {results.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-400">
                  ({results.length} found)
                </span>
              )}
            </h2>
          </div>

          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mb-3 text-gray-300" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium">No related blogs found.</p>
              <p className="text-xs mt-1 text-gray-400">Try a different keyword or phrase.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
              {results.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
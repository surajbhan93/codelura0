"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import BlogCard from "./BlogCard";
import { Sparkles, ArrowRight, Zap } from "lucide-react";

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
}

interface Recommendation {
  blogId: string;
  slug?: string;
  title: string;
  finalScore: number;
}

interface RecommendationResponse {
  recommendations: Recommendation[];
}

interface Props {
  blogId: string;
  category?: string;
}

export default function BlogRecommendations({ blogId, category }: Props) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        console.log("🔹 Fetching recommendations for:", blogId);

        setLoading(true);

        // 1️⃣ Get recommendations
        const { data } = await api.post<RecommendationResponse>(
          "/ai/recommendations",
          { blogId, category }
        );

        console.log("📦 Recommendation API Response:", data);

        const recs = data.recommendations ?? [];

        if (!recs.length) {
          console.log("⚠️ No recommendations returned from API");
          setBlogs([]);
          return;
        }

        console.log("✅ Recommendation IDs:", recs);

        // 2️⃣ Fetch full blog data using slug
        const validRecs = recs.filter((rec) => {
          if (!rec.slug) {
            console.warn("❌ Missing slug for:", rec);
            return false;
          }
          return true;
        });

        if (!validRecs.length) {
          console.warn("⚠️ No valid slugs found");
          setBlogs([]);
          return;
        }

        const blogPromises = validRecs.map((rec) =>
          api.get<Blog>(`/blogs/${rec.slug}`)
        );

        const blogResponses = await Promise.all(blogPromises);

        console.log("📘 Full Blog Responses:", blogResponses);

        const fullBlogs = blogResponses.map((res) => res.data);

        console.log("🎯 Final Blogs Set:", fullBlogs);

        setBlogs(fullBlogs);

      } catch (error) {
        console.error("❌ Recommendation error:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    if (blogId) {
      fetchRecommendations();
    }
  }, [blogId, category]);

  if (loading) {
    return (
      <div className="mt-16 py-12">
        <div className="space-y-6">
          {/* HEADER SKELETON */}
          <div className="space-y-3">
            <div className="h-8 w-48 bg-gradient-to-r from-slate-200 to-slate-100 rounded-lg animate-pulse" />
            <div className="h-4 w-96 bg-gradient-to-r from-slate-100 to-transparent rounded-lg animate-pulse" />
          </div>

          {/* CARDS SKELETON */}
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="rounded-xl overflow-hidden bg-slate-50 border border-slate-200">
                  <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-100 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                    <div className="h-5 w-full bg-slate-200 rounded animate-pulse" />
                    <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!blogs.length) {
    console.log("🚫 No blogs to render in recommendations");
    return null;
  }

  return (
    <div className="mt-16 py-12">
      {/* ========== HEADER SECTION ========== */}
      <div className="mb-12 space-y-4">
        <div className="flex items-center gap-3">
          {/* GRADIENT ACCENT LINE */}
          <div className="h-1 w-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-full" />
          
          {/* TITLE WITH AI BADGE */}
          <div className="flex items-center gap-3">
            <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900 bg-clip-text text-transparent">
              Curated for You
            </h2>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 group">
              <Sparkles className="w-4 h-4 text-indigo-600 group-hover:animate-spin" />
              <span className="text-xs font-semibold text-indigo-600">AI Powered</span>
            </div>
          </div>
        </div>

        {/* SUBTITLE */}
        <div className="flex items-center gap-2 text-slate-600 ml-15">
          <Zap className="w-4 h-4 text-amber-500" />
          <p className="text-sm">
            Recommended based on content relevance and engagement
          </p>
        </div>
      </div>

      {/* ========== BLOG GRID ========== */}
      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        {blogs.map((blog, index) => (
          <div
            key={blog._id}
            className="group animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* CARD WRAPPER WITH GRADIENT BORDER ON HOVER */}
            <div className="relative h-full">
              {/* ANIMATED GRADIENT BORDER */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative h-full bg-white rounded-2xl overflow-hidden shadow-sm group-hover:shadow-lg transition-shadow duration-300">
                {/* CONTENT */}
                <BlogCard blog={blog} />

                {/* HOVER INDICATOR */}
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* SCORE BADGE - OPTIONAL IF NEEDED */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="text-xs font-semibold text-indigo-600">
                    Match Score: 95%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========== FOOTER SECTION ========== */}
      <div className="mt-12 pt-8 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <p className="text-slate-600 text-sm">
            {blogs.length} articles recommended • Updated in real-time
          </p>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors font-medium text-sm border border-indigo-200">
            View All Recommendations
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
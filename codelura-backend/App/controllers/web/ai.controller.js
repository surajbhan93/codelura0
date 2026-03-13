import natural from "natural";
import { removeStopwords } from "stopword";
import Blog from "../../models/Blog.js";
import { getRecommendations } from "../../services/recommendation.service.js";
import { generateSummary } from "../../services/ai.service.js";

const TfIdf = natural.TfIdf;

/* -----------------------------
   Synonym Mapping
----------------------------- */
const synonymMap = {
  authentication: "auth",
  authenticate: "auth",
  login: "auth",
  signin: "auth",
  node: "nodejs",
  js: "nodejs",
};

/* -----------------------------
   Text Preprocessing
----------------------------- */
const preprocessText = (text) => {
  if (!text) return "";

  let words = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ");

  // Apply synonym mapping
  words = words.map((w) => synonymMap[w] || w);

  // Remove stopwords
  words = removeStopwords(words);

  return words.join(" ");
};

/* -----------------------------
   Cosine Similarity
----------------------------- */
const cosineSimilarity = (vecA, vecB) => {
  const allTerms = new Set([
    ...Object.keys(vecA),
    ...Object.keys(vecB),
  ]);

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  allTerms.forEach((term) => {
    const a = vecA[term] || 0;
    const b = vecB[term] || 0;

    dotProduct += a * b;
    magnitudeA += a * a;
    magnitudeB += b * b;
  });

  if (magnitudeA === 0 || magnitudeB === 0) return 0;

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
};

/* -----------------------------
   Convert TFIDF to Vector
----------------------------- */
const getVector = (tfidf, index) => {
  const vector = {};
  tfidf.listTerms(index).forEach(({ term, tfidf: score }) => {
    vector[term] = score;
  });
  return vector;
};

/* =========================================================
   SEMANTIC SEARCH CONTROLLER
========================================================= */
export const semanticSearch = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Query is required" });
    }

    // Fetch published blogs
    const blogs = await Blog.find({ isPublished: true });

    if (!blogs.length) {
      return res.json({ blogs: [] });
    }

    const tfidf = new TfIdf();

    /* -----------------------------
       Add Blogs to TFIDF
    ----------------------------- */
    blogs.forEach((blog) => {
      const combinedText = preprocessText(
        `${blog.title} 
         ${blog.excerpt || ""} 
         ${blog.content || ""} 
         ${(blog.tags || []).join(" ")}`
      );

      tfidf.addDocument(combinedText);
    });

    /* -----------------------------
       Add Query as Last Document
    ----------------------------- */
    const cleanQuery = preprocessText(query);
    tfidf.addDocument(cleanQuery);

    const queryIndex = blogs.length;
    const queryVector = getVector(tfidf, queryIndex);

    /* -----------------------------
       Compute Similarity
    ----------------------------- */
    const scoredBlogs = blogs
      .map((blog, index) => {
        const blogVector = getVector(tfidf, index);
        const score = cosineSimilarity(queryVector, blogVector);

        return {
          blog,
          score,
        };
      })
      .filter((item) => item.score >= 0.4) // Lower threshold for better recall
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    /* -----------------------------
       Preserve Ranking + Add Score
    ----------------------------- */
    const rankedBlogs = scoredBlogs.map((item) => ({
      ...item.blog.toObject(),
      relevanceScore: parseFloat(item.score.toFixed(2)),
    }));

    return res.status(200).json({ blogs: rankedBlogs });

  } catch (error) {
    console.error("Semantic Search Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


/* =======================
   Content Recommendation API
   POST /ai/recommendations
   (STRICT SPEC BASED)
======================= */

export const contentRecommendations = async (req, res) => {
  try {
    const { blogId, category } = req.body;

    // ✅ blogId validation (Mongo ObjectId)
    if (!blogId || typeof blogId !== "string") {
      return res.status(400).json({
        message: "blogId is required",
      });
    }

    const objectIdRegex = /^[a-f\d]{24}$/i;
    if (!objectIdRegex.test(blogId)) {
      return res.status(400).json({
        message: "Invalid blogId format",
      });
    }

    // 🔁 Delegate logic to service
    const recommendations = await getRecommendations(blogId, category || null, {
      contentWeight: 0.7,
      categoryWeight: 0.3,
      minScore: 0.1,
      limit: 5,
    });

    return res.status(200).json({ recommendations });
  } catch (error) {
    console.error("Content Recommendation Error:", error);

    if (error.message === "Source blog not found") {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (
      error.message ===
      "Source blog has insufficient content for recommendations"
    ) {
      return res.status(400).json({
        message: "Blog has insufficient content for recommendations",
      });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};


/**
 * POST /api/ai/blog-summary
 * Input: { content: "...", blogId: "...", force: false }
 */
export const getBlogSummary = async (req, res) => {
  try {
    const { content, blogId, force } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    // Validation: Minimum 200 words
    const wordCount = content.trim().split(/\s+/).length;
    if (wordCount < 200) {
      return res.status(400).json({ 
        message: "Blog content must be at least 200 words long to generate a summary." 
      });
    }

    const summary = await generateSummary(content, blogId, force);

    res.json({ summary });
  } catch (error) {
    console.error("AI Controller Error:", error);
    res.status(500).json({ message: "Internal server error during summary generation" });
  }
};
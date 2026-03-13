import natural from "natural";
import { removeStopwords } from "stopword";

const TfIdf = natural.TfIdf;

// ❌ Generic words blacklist (as per spec)
const GENERIC_WORDS = new Set([
  "blog",
  "article",
  "post",
  "content",
  "guide",
  "learn",
]);

// Text preprocessing
const preprocessText = (text) => {
  if (!text) return "";

  let words = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .replace(/\d+/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ");

  words = removeStopwords(words);

  return words.join(" ");
};

// ✅ Auto Blog Tag Generator
export const generateBlogTags = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Blog content is required" });
    }

    const cleanedText = preprocessText(content);

    const tfidf = new TfIdf();
    tfidf.addDocument(cleanedText);

    // Extract terms with scores
    const terms = tfidf.listTerms(0);

    // Sort by TF-IDF score (desc)
    const sorted = terms
      .filter(
        (t) =>
          !GENERIC_WORDS.has(t.term) &&
          t.term.length > 2
      )
      .slice(0, 8); // max 8 tags

    // Ensure minimum 5 tags
    const tags =
      sorted.length >= 5
        ? sorted.map((t) => t.term)
        : terms
            .filter((t) => !GENERIC_WORDS.has(t.term))
            .slice(0, 5)
            .map((t) => t.term);

    return res.status(200).json({ tags });
  } catch (error) {
    console.error("Blog Tag Generator Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
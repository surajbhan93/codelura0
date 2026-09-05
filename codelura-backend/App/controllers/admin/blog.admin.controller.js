import Blog from "../../models/Blog.js";
import BlogAnalytics from "../../models/BlogAnalytics.js";
import { generateSlug } from "../../utils/slugify.js";
import TurndownService from "turndown";
import sanitizeHtml from "sanitize-html";
/**
 * CREATE BLOG (ADVANCED CMS LEVEL)
 */
export const createBlog = async (req, res) => {
    
  try {
  const {
      title,
      slug,
      excerpt,
      content: content,
      summary,

      faqs,                    // 👈 NEW

      coverImage,
      coverImageAlt,           // 👈 NEW
      ogImage,

      metaTitle,
      metaDescription,
      focusKeyword,            // 👈 NEW
      secondaryKeywords,       // 👈 NEW

      tags,
      category,
      authorName,
      authorBio,                // 👈 NEW
      authorImage,               // 👈 NEW

      isFeatured,
      allowComments,
      noIndex,                  // 👈 NEW
      readingTime,

      schemaType,                // 👈 NEW

      publishNow
    } = req.body;

    // ✅ Basic validation
    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required"
      });
    }
    

    // 🔗 Slug logic (custom or auto)
    const finalSlug = slug
      ? generateSlug(slug)
      : generateSlug(title);

    // 🚫 Prevent duplicate slug
    const slugExists = await Blog.findOne({ slug: finalSlug });
    if (slugExists) {
      return res.status(409).json({
        message: "Slug already exists"
      });
    }

     // 🔁 HTML → Markdown (API level = BEST)
    const turndown = new TurndownService();
    const contentMarkdown = turndown.turndown(content);

    // 🔥 Clean HTML (Allow code blocks, styling, pre, code, iframe, images)
    const cleanContent = sanitizeHtml(content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        "img", "h1", "h2", "h3", "h4", "h5", "h6", "pre", "code", "span", "div", "iframe", "blockquote", "p", "br", "u", "s", "sub", "sup", "section", "article"
      ]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ["src", "alt", "width", "height", "class", "style"],
        a: ["href", "name", "target", "rel", "class", "style"],
        code: ["class", "style"],
        pre: ["class", "style"],
        span: ["class", "style"],
        div: ["class", "style"],
        iframe: ["src", "width", "height", "frameborder", "allow", "allowfullscreen", "class", "style"],
        "*": ["style", "class", "id"]
      }
    });

    // 🕒 Publish logic
    const isPublished = publishNow === true;
    const publishedAt = isPublished ? new Date() : null;

    // 📝 Create blog
const blog = await Blog.create({
      title,
      slug: finalSlug,
      excerpt,
      content: cleanContent,
      summary: summary || "",
      contentMarkdown,

      faqs: faqs || [],                          // 👈 NEW

      coverImage,
      coverImageAlt: coverImageAlt || title,      // 👈 NEW (fallback title)
      ogImage: ogImage || coverImage,

      metaTitle: metaTitle || title,
      metaDescription,
      canonicalUrl: `https://codelura.com/blogs/${finalSlug}`,   // ⚠️ domain fix bhi kiya, niche note dekho
      focusKeyword: focusKeyword || "",           // 👈 NEW
      secondaryKeywords: secondaryKeywords || [], // 👈 NEW

      tags,
      category,
      authorName,
      authorBio: authorBio || "",                 // 👈 NEW
      authorImage: authorImage || "",             // 👈 NEW

      isFeatured: isFeatured || false,
      allowComments: allowComments !== false,
      noIndex: noIndex || false,                  // 👈 NEW

      readingTime,
      schemaType: schemaType || "BlogPosting",    // 👈 NEW

      isPublished,
      publishedAt,
      lastModifiedAt: new Date()                  // 👈 NEW
    });

    res.status(201).json({
      message: "Blog created successfully",
      blog
    });
  } catch (error) {
    console.error("Create blog error:", error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

/**
 * PUBLISH BLOG
 */
export const publishBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        isPublished: true,
        publishedAt: new Date()
      },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    res.json({
      message: "Blog published successfully",
      blog
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

/**
 * GET POPULAR BLOGS (ANALYTICS)
 */
export const getPopularBlogs = async (req, res) => {
  try {
    let blogs = await BlogAnalytics.aggregate([
      {
        $group: {
          _id: "$blogId",
          views: { $sum: "$views" },
          likes: { $sum: "$likes" },
          comments: { $sum: "$comments" },
          shares: { $sum: "$shares" }
        }
      },
      {
        $addFields: {
          score: {
            $add: [
              "$views",
              { $multiply: ["$likes", 2] },
              { $multiply: ["$comments", 3] },
              { $multiply: ["$shares", 4] }
            ]
          }
        }
      },
      { $sort: { score: -1 } },
      { $limit: 5 }
    ]);

    if (!blogs || blogs.length === 0) {
      const recentBlogs = await Blog.find().sort({ views: -1, createdAt: -1 }).limit(5);
      blogs = recentBlogs.map((b) => ({
        _id: b._id,
        title: b.title,
        slug: b.slug,
        score: b.views || 1,
      }));
    } else {
      blogs = await Promise.all(
        blogs.map(async (b) => {
          const blogDoc = await Blog.findById(b._id).select("title slug");
          return {
            _id: b._id,
            title: blogDoc ? blogDoc.title : "Untitled Blog",
            slug: blogDoc ? blogDoc.slug : "",
            score: b.score || 0,
          };
        })
      );
    }

    res.json(blogs);
  } catch (error) {
    console.error("GET POPULAR BLOGS ERROR 👉", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


/**
 * ✅ ADMIN: GET ALL BLOGS (WITH FILTER)
 */
export const getAllAdminBlogs = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};

    if (status === "published") filter.isPublished = true;
    if (status === "draft") filter.isPublished = false;

    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .select("-contentMarkdown -contentHtml"); // list me full content nahi bhejna

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

/**
 * ✅ ADMIN: GET SINGLE BLOG (FOR EDIT)
 */
export const getAdminBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blog" });
  }
};

/**
 * ✅ ADMIN: UPDATE BLOG
 */
export const updateBlog = async (req, res) => {
  try {
   const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastModifiedAt: new Date() },   // 👈 lastModifiedAt hamesha update ho
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({
      message: "Blog updated successfully",
      blog: updated
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update blog" });
  }
};

/**
 * ✅ ADMIN: DELETE BLOG
 */
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete blog" });
  }
};
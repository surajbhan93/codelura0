import Blog from "../../models/Blog.js";
import BlogAnalytics from "../../models/BlogAnalytics.js";

/**
 * ✅ GET ALL PUBLISHED BLOGS (LIST)
 */
export const getAllBlogs = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const { category, tag } = req.query;

    const query = { isPublished: true };

    if (category) query.category = category;
    if (tag) query.tags = tag;

    const blogs = await Blog.find(query)
     .select(
  "title slug excerpt summary coverImage authorName readingTime tags category isFeatured createdAt publishedAt"
)
      .sort({ isFeatured: -1, publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(); // 🔥 performance boost

    const total = await Blog.countDocuments(query);

    res.json({
      blogs,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("GET BLOGS ERROR 👉", error);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};


/**
 * ✅ GET SINGLE BLOG BY SLUG
 */
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
      isPublished: true
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // 🔥 Increment view
    blog.views = (blog.views || 0) + 1;
    await blog.save();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await BlogAnalytics.findOneAndUpdate(
      { blogId: blog._id, date: today },
      { $inc: { views: 1 } },
      { upsert: true }
    );

    res.json(blog);
  } catch (error) {
    console.error("GET BLOG DETAIL ERROR 👉", error);
    res.status(500).json({ message: "Failed to fetch blog" });
  }
};


/**
 * ✅ LIKE / UNLIKE BLOG
 */
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const userId = req.user.id;

    if (blog.likes.includes(userId)) {
      blog.likes.pull(userId);
    } else {
      blog.likes.push(userId);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await BlogAnalytics.findOneAndUpdate(
        { blogId: blog._id, date: today },
        { $inc: { likes: 1 } },
        { upsert: true }
      );
    }

    blog.likesCount = blog.likes.length;
    await blog.save();

    res.json({ likesCount: blog.likesCount });
  } catch (error) {
    console.error("LIKE BLOG ERROR 👉", error);
    res.status(500).json({ message: "Failed to like blog" });
  }
};
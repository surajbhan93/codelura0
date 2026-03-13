import Comment from "../../models/Comment.js";
import BlogAnalytics from "../../models/BlogAnalytics.js";

export const addComment = async (req, res) => {
  const comment = await Comment.create({
    blogId: req.body.blogId,
    userId: req.user.id,
    comment: req.body.comment,
    parentCommentId: req.body.parentCommentId || null
  });

  const today = new Date().setHours(0, 0, 0, 0);
  await BlogAnalytics.findOneAndUpdate(
    { blogId: req.body.blogId, date: today },
    { $inc: { comments: 1 } },
    { upsert: true }
  );

  res.status(201).json(comment);
};

export const getComments = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  const comments = await Comment.find({
    blogId: req.params.blogId,
  })
    .populate("userId", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Comment.countDocuments({
    blogId: req.params.blogId,
  });

  res.json({
    comments,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
};

export const toggleLike = async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  const userId = req.user.id;

  const alreadyLiked = comment.likes.includes(userId);

  if (alreadyLiked) {
    comment.likes.pull(userId);
  } else {
    comment.likes.push(userId);
  }

  await comment.save();

  res.json({
    likes: comment.likes,
  });
};
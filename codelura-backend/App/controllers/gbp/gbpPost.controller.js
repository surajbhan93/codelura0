import { createPost, updatePost, deletePost, getPosts, publishPost } from "../../services/gbp/gbpPost.service.js";

export const listPosts = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const result = await getPosts(req.user._id, req.params.locationId, { status, page: Number(page), limit: Number(limit) });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(typeof err.status === "number" ? err.status : (typeof err.code === "number" ? err.code : 500)).json({ success: false, message: err.message });
  }
};

export const createNewPost = async (req, res) => {
  try {
    const post = await createPost(req.user._id, req.params.locationId, req.body);
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    res.status(typeof err.status === "number" ? err.status : (typeof err.code === "number" ? err.code : 500)).json({ success: false, message: err.message });
  }
};

export const updateExistingPost = async (req, res) => {
  try {
    const post = await updatePost(req.user._id, req.params.locationId, req.params.postId, req.body);
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(typeof err.status === "number" ? err.status : (typeof err.code === "number" ? err.code : 500)).json({ success: false, message: err.message });
  }
};

export const removePost = async (req, res) => {
  try {
    await deletePost(req.user._id, req.params.locationId, req.params.postId);
    res.json({ success: true, message: "Post deleted." });
  } catch (err) {
    res.status(typeof err.status === "number" ? err.status : (typeof err.code === "number" ? err.code : 500)).json({ success: false, message: err.message });
  }
};

export const publishExistingPost = async (req, res) => {
  try {
    const post = await publishPost(req.user._id, req.params.locationId, req.params.postId);
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(typeof err.status === "number" ? err.status : (typeof err.code === "number" ? err.code : 500)).json({ success: false, message: err.message });
  }
};

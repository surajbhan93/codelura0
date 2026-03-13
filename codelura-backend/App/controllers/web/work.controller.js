import Work from "../../models/Work.js";
import slugify from "slugify";

export const createWork = async (req, res) => {
  try {
    const slug = slugify(req.body.title, {
      lower: true,
      strict: true,
    });

    const work = await Work.create({
      ...req.body,
      slug,
    });

    res.status(201).json({
      success: true,
      data: work,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getAllWorks = async (req, res) => {
  const works = await Work.find({ isPublished: true })
    .sort({ isFeatured: -1, createdAt: -1 });

  res.json({ success: true, data: works });
};

export const getWorkBySlug = async (req, res) => {
  const work = await Work.findOne({
    slug: req.params.slug,
    isPublished: true,
  });

  if (!work) {
    return res.status(404).json({ message: "Work not found" });
  }

  res.json({
    success: true,
    data: work,
  });
};

export const updateWork = async (req, res) => {
  const work = await Work.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json({ success: true, data: work });
};

export const deleteWork = async (req, res) => {
  await Work.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Work deleted" });
};

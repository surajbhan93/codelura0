// import { Request, Response } from "express";
import Job from "../../models/Job.model.js";
// import Job from "../../models/Job.js";

export const getAllJobs = async (req, res) => {
  try {
    const page  = Number(req.query.page)  || 1;
    const limit = Number(req.query.limit) || 9;
    const { q, type, featured, expired, admin } = req.query;

    // ── Auto-expire: deadline past ho gayi jobs ko DB mein expire karo ──
    await Job.updateMany(
      {
        isExpired: false,
        deadline: { $lt: new Date() },  // deadline already past
      },
      { $set: { isExpired: true } }
    );

    const query = {};
    const conditions = [];

    // ── Expired filter ──────────────────────────────
    if (expired === "true") {
      query.isExpired = true;
    } else {
      query.isExpired = false;
      // Admin panel mein deadline filter mat lagao
      if (admin !== "true") {
        conditions.push({
          $or: [{ deadline: null }, { deadline: { $gte: new Date() } }],
        });
      }
    }

    if (type)                query.type       = type;
    if (featured === "true") query.isFeatured = true;

    if (q) {
      const regex = new RegExp(q, "i");
      conditions.push({
        $or: [
          { title:       regex },
          { company:     regex },
          { description: regex },
          { tags:        regex },
        ],
      });
    }

    if (conditions.length > 0) {
      query.$and = conditions;
    }

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .select(
          "title slug company bannerImage location type salary description tags careerPageUrl isFeatured isExpired views postedAt deadline createdAt"
        )
        .sort({ isFeatured: -1, postedAt: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Job.countDocuments(query),
    ]);

    res.json({
      jobs,
      pagination: { total, page, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET JOBS ERROR 👉", error);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};
/* ─────────────────────────────────────────────────
   ✅ GET SINGLE JOB BY SLUG (with view tracking)
───────────────────────────────────────────────── */
export const getJobBySlug = async (req, res) => {
  try {
    const job = await Job.findOne({ slug: req.params.slug });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 🔥 Track views
    job.views = (job.views || 0) + 1;
    await job.save();

    res.json(job);
  } catch (error) {
    console.error("GET JOB DETAIL ERROR 👉", error);
    res.status(500).json({ message: "Failed to fetch job" });
  }
};

/* ─────────────────────────────────────────────────
   ✅ CREATE JOB  (Admin)
───────────────────────────────────────────────── */
export const createJob = async (req, res) => {
  try {
    const {
      title, slug, company, bannerImage, location, type,
      salary, description, content, tags, careerPageUrl,seo,

      isFeatured, isExpired, postedAt, deadline,
    } = req.body;

    if (slug) {
      const exists = await Job.findOne({ slug });
      if (exists) return res.status(409).json({ message: "Slug already exists" });
    }

    const job = await Job.create({
      title, slug, company,
      bannerImage: bannerImage || "",
      location, type, salary, description,
      content: content || "",
      tags: Array.isArray(tags) ? tags : [],
      careerPageUrl,
      // SEO
  seo: {
    metaTitle: seo?.metaTitle || "",
    metaDescription: seo?.metaDescription || "",

    keywords: Array.isArray(seo?.keywords)
      ? seo.keywords
      : [],

    canonicalUrl: seo?.canonicalUrl || "",
    ogImage: seo?.ogImage || "",
    noIndex: seo?.noIndex ?? false,
  },
      isFeatured:  isFeatured  ?? false,
      isExpired:   isExpired   ?? false,
      postedAt:    postedAt    ?? new Date(),
      deadline:    deadline    ?? null,
    });

    res.status(201).json({ message: "Job created successfully", job });
  } catch (error) {
    console.error("CREATE JOB ERROR 👉", error);
    if (error.name === "ValidationError") return res.status(400).json({ message: error.message });
    res.status(500).json({ message: "Failed to create job" });
  }
};

/* ─────────────────────────────────────────────────
   ✅ UPDATE JOB  (Admin)
───────────────────────────────────────────────── */
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { slug: req.params.slug },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job updated successfully", job });
  } catch (error) {
    console.error("UPDATE JOB ERROR 👉", error);
    if (error.name === "ValidationError") return res.status(400).json({ message: error.message });
    res.status(500).json({ message: "Failed to update job" });
  }
};

/* ─────────────────────────────────────────────────
   ✅ EXPIRE JOB  (Admin quick action)
───────────────────────────────────────────────── */
export const expireJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { slug: req.params.slug },
      { $set: { isExpired: true } },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job marked as expired", job });
  } catch (error) {
    console.error("EXPIRE JOB ERROR 👉", error);
    res.status(500).json({ message: "Failed to expire job" });
  }
};

/* ─────────────────────────────────────────────────
   ✅ DELETE JOB  (Admin)
───────────────────────────────────────────────── */
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ slug: req.params.slug });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("DELETE JOB ERROR 👉", error);
    res.status(500).json({ message: "Failed to delete job" });
  }
};



/* ─────────────────────────────────────────────────
   ✅ GET RELATED JOBS
   Query: exclude, tags, company, limit
───────────────────────────────────────────────── */
export const getRelatedJobs = async (req, res) => {
  try {
    const { exclude, tags, company } = req.query;
    const limit = Math.min(parseInt(req.query.limit) || 4, 12);

    if (!exclude) {
      return res.status(400).json({ message: "exclude (slug) is required" });
    }

    /* ── Parse tags ───────────────── */
    const tagList = tags
      ? tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const poolSize = limit * 5;

    const query = {
      slug: { $ne: exclude },
      isExpired: { $ne: true },
    };

    if (tagList.length || company) {
      const orClauses = [];

      if (tagList.length) {
        orClauses.push({ tags: { $in: tagList } });
      }

      if (company) {
        orClauses.push({
          company: { $regex: new RegExp(company, "i") },
        });
      }

      query.$or = orClauses;
    }

    let candidates = await Job.find(query)
      .select(
        "title slug company bannerImage location type salary tags postedAt createdAt isFeatured"
      )
      .sort({ postedAt: -1, createdAt: -1 })
      .limit(poolSize)
      .lean();

    /* ── Fallback: recent jobs ───────────────── */
    if (candidates.length < limit) {
      const fallback = await Job.find({
        slug: { $ne: exclude },
        isExpired: { $ne: true },
        _id: { $nin: candidates.map((c) => c._id) },
      })
        .select(
          "title slug company bannerImage location type salary tags postedAt createdAt isFeatured"
        )
        .sort({ isFeatured: -1, postedAt: -1, createdAt: -1 })
        .limit(limit - candidates.length)
        .lean();

      candidates = [...candidates, ...fallback];
    }

    /* ── Score system ───────────────── */
    const tagSet = new Set(tagList.map((t) => t.toLowerCase()));

    const scored = candidates.map((job) => {
      let score = 0;

      if (tagSet.size && Array.isArray(job.tags)) {
        for (const t of job.tags) {
          if (tagSet.has(t.toLowerCase())) score += 2;
        }
      }

      if (
        company &&
        job.company?.toLowerCase().includes(company.toLowerCase())
      ) {
        score += 1;
      }

      if (job.isFeatured) score += 0.5;

      return { ...job, _score: score };
    });

    scored.sort((a, b) => {
      if (b._score !== a._score) return b._score - a._score;

      const dateA = new Date(a.postedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.postedAt || b.createdAt || 0).getTime();

      return dateB - dateA;
    });

    const result = scored.slice(0, limit).map(({ _score, ...job }) => job);
  console.log("EXCLUDE:", exclude);
console.log("TAGS:", tagList);
console.log("COMPANY:", company);
console.log("CANDIDATES:", candidates.length);
    res.json(result);
  } catch (error) {
    console.error("RELATED JOB ERROR 👉", error);
    res.status(500).json({ message: "Failed to fetch related jobs" });
  }
};
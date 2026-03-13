import Testimonial from "../../models/Testimonial.js";

// import Testimonial from "../../models/Testimonial.js";

export const createTestimonial = async (req, res) => {
  try {
    const { name, email, profileImage, message, rating, category } =
      req.body;

    if (!name || !email || !message || !category) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // ✅ Rating validation
    let finalRating = 5; // default

    if (rating !== undefined) {
      const parsedRating = Number(rating);

      if (parsedRating < 1 || parsedRating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }

      finalRating = parsedRating;
    }

    const testimonial = await Testimonial.create({
      name,
      email,
      profileImage,
      message,
      rating: finalRating,
      category,
    });

    res.status(201).json({
      success: true,
      message: "Submitted. Awaiting approval.",
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

export const getApprovedTestimonials = async (req, res) => {
  try {
    const { category } = req.params;

    const testimonials = await Testimonial.find({
      category,
      isApproved: true,
    });

    res.status(200).json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

export const approveTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Approved",
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, message, rating, category, role } = req.body;

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    // ✅ Rating validation
    if (rating !== undefined) {
      const parsedRating = Number(rating);

      if (parsedRating < 1 || parsedRating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }

      testimonial.rating = parsedRating;
    }

    // ✅ Update fields if provided
    if (name) testimonial.name = name;
    if (message) testimonial.message = message;
    if (category) testimonial.category = category;
    if (role) testimonial.role = role;

    await testimonial.save();

    res.status(200).json({
      success: true,
      message: "Testimonial updated successfully",
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
import Service from "../../models/Service.js";
import Enquiry from "../../models/Enquiry.js";
export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .select("-__v");

    res.json({
      success: true,
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
    });
  }
};

export const getServiceBySlug = async (req, res) => {
  const service = await Service.findOneAndUpdate(
    { slug: req.params.slug, isActive: true },
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!service) {
    return res.status(404).json({ success: false });
  }

  res.json({ success: true, data: service });
};

// User create enqury 

/* ================= CREATE ENQUIRY ================= */

export const createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, message, budget, serviceSlug } = req.body;

    // Service find by slug
    const service = await Service.findOne({ slug: serviceSlug });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // Create enquiry
   const enquiry = await Enquiry.create({
  name,
  email,
  phone,
  message,
  budget,
  service: service._id,
});

    // Increase enquiry count in Service
    service.enquiries += 1;
    await service.save();

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: enquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
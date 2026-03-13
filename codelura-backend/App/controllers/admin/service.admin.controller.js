import Service from "../../models/Service.js";
import Enquiry from "../../models/Enquiry.js";
import slugify from "slugify";

/**
 * CREATE
 */
export const createService = async (req, res) => {
  try {
    const service = await Service.create({
      ...req.body,
      slug: slugify(req.body.title, { lower: true }),
    });

    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
/**
 * READ (Admin)
 */
export const getAllServices = async (req, res) => {
  const services = await Service.find().sort({ order: 1 });
  res.json({ success: true, data: services });
};

/**
 * UPDATE
 */
export const updateService = async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


/**
 * DELETE
 */
export const deleteService = async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Service deleted" });
};


//service enquiryController.js

/* ================= GET ALL ENQUIRIES (ADMIN) ================= */

export const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .populate("service", "title slug")
      .select(
        "name email phone budget message status service createdAt"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["new", "contacted", "closed"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("service", "title slug");

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: enquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const enquiry = await Enquiry.findByIdAndDelete(id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
import ProjectPayment from "../models/ProjectPayment.js";
import EMI from "../models/EMI.js";

/**
 * Create new project payment (admin only)
 */
export const createProjectPayment = async (req, res) => {
  try {
    const {
      userId,
      projectName,
      projectDescription,
      totalProjectAmount,
      emiAmount,
      numberOfEmis,
      emiStartDate,
      emiFrequency,
      notes,
    } = req.body;

    // Validate
    if (!userId || !projectName || !totalProjectAmount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Create project payment
    const projectPayment = new ProjectPayment({
      userId,
      projectName,
      projectDescription,
      totalProjectAmount,
      remainingAmount: totalProjectAmount,
      emiAmount: emiAmount || 0,
      numberOfEmis: numberOfEmis || 0,
      emiStartDate: emiStartDate || null,
      emiFrequency: emiFrequency || "monthly",
      notes,
    });

    await projectPayment.save();

    // Create EMI schedule if EMI details provided
    if (numberOfEmis > 0 && emiAmount > 0 && emiStartDate) {
      const emis = [];
      let currentDate = new Date(emiStartDate);

      for (let i = 1; i <= numberOfEmis; i++) {
        const emi = new EMI({
          projectPaymentId: projectPayment._id,
          userId,
          emiNumber: i,
          emiAmount,
          remainingAmount: emiAmount,
          dueDate: new Date(currentDate),
        });

        emis.push(emi);

        // Calculate next due date based on frequency
        if (emiFrequency === "monthly") {
          currentDate.setMonth(currentDate.getMonth() + 1);
        } else if (emiFrequency === "weekly") {
          currentDate.setDate(currentDate.getDate() + 7);
        }
      }

      await EMI.insertMany(emis);
    }

    const populatedProject = await ProjectPayment.findById(projectPayment._id).populate(
      "userId",
      "name email"
    );

    res.status(201).json({
      success: true,
      message: "Project payment created successfully",
      projectPayment: populatedProject,
    });
  } catch (error) {
    console.error("Error creating project payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create project payment",
      error: error.message,
    });
  }
};

/**
 * Get user's project payment with EMI details
 */
export const getUserProjectPayment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { projectPaymentId } = req.params;

    const projectPayment = await ProjectPayment.findOne({
      _id: projectPaymentId,
      userId,
    }).populate("userId", "name email phone");

    if (!projectPayment) {
      return res.status(404).json({
        success: false,
        message: "Project payment not found",
      });
    }

    // Get EMIs
    const emis = await EMI.find({
      projectPaymentId: projectPayment._id,
    }).sort({ emiNumber: 1 });

    // Get next upcoming EMI
    const nextEmi = await EMI.findOne({
      projectPaymentId: projectPayment._id,
      status: { $in: ["PENDING", "PARTIALLY_PAID", "OVERDUE"] },
    })
      .sort({ dueDate: 1 })
      .limit(1);

    res.json({
      success: true,
      projectPayment,
      emis,
      nextEmi,
    });
  } catch (error) {
    console.error("Error fetching project payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch project payment",
      error: error.message,
    });
  }
};

/**
 * Get all project payments for a user
 */
export const getUserProjects = async (req, res) => {
  try {
    const userId = req.user._id;

    const projects = await ProjectPayment.find({ userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("Error fetching user projects:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};

/**
 * Get all projects (admin only)
 */
export const getAllProjects = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    const projects = await ProjectPayment.find(query)
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await ProjectPayment.countDocuments(query);

    res.json({
      success: true,
      projects,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};

/**
 * Get EMI calendar for a project
 */
export const getEmiCalendar = async (req, res) => {
  try {
    const userId = req.user._id;
    const { projectPaymentId } = req.params;

    // Verify project belongs to user
    const projectPayment = await ProjectPayment.findOne({
      _id: projectPaymentId,
      userId,
    });

    if (!projectPayment) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const emis = await EMI.find({
      projectPaymentId,
    })
      .populate("relatedPayments.paymentId", "receiptNumber amount")
      .sort({ dueDate: 1 });

    // Group by month for calendar view
    const calendar = {};
    emis.forEach((emi) => {
      const monthKey = emi.dueDate.toISOString().substring(0, 7); // YYYY-MM
      if (!calendar[monthKey]) {
        calendar[monthKey] = [];
      }
      calendar[monthKey].push(emi);
    });

    res.json({
      success: true,
      emis,
      calendar,
    });
  } catch (error) {
    console.error("Error fetching EMI calendar:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch EMI calendar",
      error: error.message,
    });
  }
};

/**
 * Delete project payment (admin only)
 */
export const deleteProjectPayment = async (req, res) => {
  try {
    const { projectPaymentId } = req.params;

    // Find the project
    const projectPayment = await ProjectPayment.findById(projectPaymentId);

    if (!projectPayment) {
      return res.status(404).json({
        success: false,
        message: "Project payment not found",
      });
    }

    // Check if there are any payments made
    if (projectPayment.totalPaidAmount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete project with existing payments. Please cancel or refund payments first.",
      });
    }

    // Delete all related EMIs
    await EMI.deleteMany({ projectPaymentId: projectPayment._id });

    // Delete the project
    await ProjectPayment.findByIdAndDelete(projectPaymentId);

    res.json({
      success: true,
      message: "Project payment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete project payment",
      error: error.message,
    });
  }
};

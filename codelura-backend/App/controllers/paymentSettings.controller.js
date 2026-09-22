import PaymentSettings from "../models/PaymentSettings.js";
import cloudinary from "../config/cloudinary.js";

/**
 * Get payment settings (public - for payment page)
 */
export const getPaymentSettings = async (req, res) => {
  try {
    let settings = await PaymentSettings.findOne({ isActive: true });

    // Create default settings if none exist
    if (!settings) {
      settings = new PaymentSettings({
        upiNumber: "9336289192",
        isActive: true,
      });
      await settings.save();
    }

    res.json({
      success: true,
      settings: {
        upiNumber: settings.upiNumber,
        qrCodeUrl: settings.qrCodeUrl,
      },
    });
  } catch (error) {
    console.error("Error fetching payment settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment settings",
      error: error.message,
    });
  }
};

/**
 * Update UPI number (admin only)
 */
export const updateUpiNumber = async (req, res) => {
  try {
    const adminId = req.user._id;
    const { upiNumber } = req.body;

    if (!upiNumber) {
      return res.status(400).json({
        success: false,
        message: "UPI number is required",
      });
    }

    // Validate UPI format (basic validation)
    const upiRegex = /^[0-9]{10}$/;
    if (!upiRegex.test(upiNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid UPI/mobile number format. Must be 10 digits.",
      });
    }

    let settings = await PaymentSettings.findOne({ isActive: true });

    if (!settings) {
      settings = new PaymentSettings({
        upiNumber,
        isActive: true,
        updatedBy: adminId,
      });
    } else {
      settings.upiNumber = upiNumber;
      settings.updatedBy = adminId;
    }

    await settings.save();

    res.json({
      success: true,
      message: "UPI number updated successfully",
      settings,
    });
  } catch (error) {
    console.error("Error updating UPI number:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update UPI number",
      error: error.message,
    });
  }
};

/**
 * Upload/Update QR code (admin only)
 */
export const uploadQrCode = async (req, res) => {
  try {
    const adminId = req.user._id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No QR code image provided",
      });
    }

    let settings = await PaymentSettings.findOne({ isActive: true });

    // Delete old QR code from cloudinary if exists
    if (settings && settings.qrCodePublicId) {
      try {
        await cloudinary.uploader.destroy(settings.qrCodePublicId);
      } catch (err) {
        console.error("Error deleting old QR code:", err);
      }
    }

    // Upload new QR code to cloudinary (from buffer)
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "codelura/payment-qr",
          transformation: [
            { width: 800, height: 800, crop: "limit" },
            { quality: "auto:good" },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      // Write buffer to stream
      uploadStream.end(req.file.buffer);
    });

    const result = await uploadPromise;

    if (!settings) {
      settings = new PaymentSettings({
        upiNumber: "9336289192",
        isActive: true,
      });
    }

    settings.qrCodeUrl = result.secure_url;
    settings.qrCodePublicId = result.public_id;
    settings.updatedBy = adminId;

    await settings.save();

    res.json({
      success: true,
      message: "QR code uploaded successfully",
      settings: {
        upiNumber: settings.upiNumber,
        qrCodeUrl: settings.qrCodeUrl,
      },
    });
  } catch (error) {
    console.error("Error uploading QR code:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload QR code",
      error: error.message,
    });
  }
};

/**
 * Delete QR code (admin only)
 */
export const deleteQrCode = async (req, res) => {
  try {
    const adminId = req.user._id;
    const settings = await PaymentSettings.findOne({ isActive: true });

    if (!settings || !settings.qrCodePublicId) {
      return res.status(404).json({
        success: false,
        message: "No QR code found",
      });
    }

    // Delete from cloudinary
    try {
      await cloudinary.uploader.destroy(settings.qrCodePublicId);
    } catch (err) {
      console.error("Error deleting QR code from cloudinary:", err);
    }

    settings.qrCodeUrl = null;
    settings.qrCodePublicId = null;
    settings.updatedBy = adminId;

    await settings.save();

    res.json({
      success: true,
      message: "QR code deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting QR code:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete QR code",
      error: error.message,
    });
  }
};

/**
 * Get admin view of payment settings (includes updatedBy info)
 */
export const getAdminPaymentSettings = async (req, res) => {
  try {
    let settings = await PaymentSettings.findOne({ isActive: true }).populate(
      "updatedBy",
      "name email"
    );

    if (!settings) {
      settings = new PaymentSettings({
        upiNumber: "9336289192",
        isActive: true,
      });
      await settings.save();
    }

    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Error fetching admin payment settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment settings",
      error: error.message,
    });
  }
};

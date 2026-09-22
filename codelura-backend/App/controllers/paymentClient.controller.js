import PaymentClient from "../models/PaymentClient.js";
import jwt from "jsonwebtoken";

/**
 * Admin creates payment client (separate from main users)
 */
export const createPaymentClient = async (req, res) => {
  try {
    const adminId = req.user._id;
    const { name, email, password, phone, username } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // Check if email already exists
    const existingClient = await PaymentClient.findOne({ email });
    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: "Client with this email already exists",
      });
    }

    // Create payment client
    const paymentClient = new PaymentClient({
      name,
      email,
      username: username || email.split("@")[0], // Default username from email
      password, // Will be hashed by pre-save hook
      phone,
      createdBy: adminId,
    });

    await paymentClient.save();

    // Return client without password
    const clientData = {
      _id: paymentClient._id,
      name: paymentClient.name,
      email: paymentClient.email,
      username: paymentClient.username,
      phone: paymentClient.phone,
    };

    res.status(201).json({
      success: true,
      message: "Payment client created successfully",
      client: clientData,
      credentials: {
        email: paymentClient.email,
        username: paymentClient.username,
        password: password, // Send original password in response (admin will share with client)
      },
    });
  } catch (error) {
    console.error("Error creating payment client:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment client",
      error: error.message,
    });
  }
};

/**
 * Payment client login (separate from main auth)
 */
export const loginPaymentClient = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find client by email or username
    const client = await PaymentClient.findOne({
      $or: [{ email: email.toLowerCase() }, { username: email }],
    });

    if (!client) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if client is active
    if (!client.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Contact admin.",
      });
    }

    // Verify password
    const isMatch = await client.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: client._id,
        email: client.email,
        type: "payment_client", // Important: distinguish from regular users
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      client: {
        _id: client._id,
        name: client.name,
        email: client.email,
        username: client.username,
        phone: client.phone,
      },
    });
  } catch (error) {
    console.error("Payment client login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

/**
 * Get all payment clients (admin only)
 */
export const getAllPaymentClients = async (req, res) => {
  try {
    const clients = await PaymentClient.find()
      .select("name email username phone isActive createdAt")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      clients,
      total: clients.length,
    });
  } catch (error) {
    console.error("Error fetching payment clients:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment clients",
    });
  }
};

/**
 * Get payment client info (authenticated)
 */
export const getPaymentClientInfo = async (req, res) => {
  try {
    const clientId = req.user.id;
    
    const client = await PaymentClient.findById(clientId).select("-password");
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.json({
      success: true,
      client,
    });
  } catch (error) {
    console.error("Error fetching client info:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch client info",
    });
  }
};

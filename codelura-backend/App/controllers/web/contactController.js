import ContactMessage from "../../models/ContactMessage.js";
// import Course from "../../models/Course.js";
export const createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const contact = await ContactMessage.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["new", "replied", "closed"];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const updated = await ContactMessage.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

export const deleteContactMessage = async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};
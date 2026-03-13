const Payment = require("../models/Payment");

exports.getAllPayments = async (req, res) => {
  const payments = await Payment.find()
    .populate("user", "name email")
    .populate("plan", "title price")
    .sort({ createdAt: -1 });

  res.json(payments);
};
import GbpNotification from "../../models/gbp/GbpNotification.js";

export const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;
    const query = { userId: req.user._id };
    if (unreadOnly === "true") query.isRead = false;
    const skip = (Number(page) - 1) * Number(limit);
    const [notifications, total, unreadCount] = await Promise.all([
      GbpNotification.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      GbpNotification.countDocuments(query),
      GbpNotification.countDocuments({ userId: req.user._id, isRead: false }),
    ]);
    res.json({ success: true, data: notifications, total, unreadCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const markRead = async (req, res) => {
  try {
    await GbpNotification.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const markAllRead = async (req, res) => {
  try {
    await GbpNotification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true, message: "All notifications marked as read." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

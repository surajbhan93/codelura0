import { runFullSync, getLastSyncLog } from "../../services/gbp/gbpSync.service.js";

export const triggerSync = async (req, res) => {
  try {
    // Don't await — run in background
    runFullSync(req.user._id).catch(err => console.error("[GBP Full Sync Error]", err.message));
    res.json({ success: true, message: "Sync started in background." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getSyncStatus = async (req, res) => {
  try {
    const log = await getLastSyncLog(req.user._id);
    res.json({ success: true, data: log });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

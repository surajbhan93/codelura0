import { runProfileAudit } from "../../services/gbp/gbpAudit.service.js";
import GbpSEOAudit from "../../models/gbp/GbpSEOAudit.js";

export const runAudit = async (req, res) => {
  try {
    const audit = await runProfileAudit(req.user._id, req.params.locationId);
    res.json({ success: true, data: audit });
  } catch (err) {
    res.status(typeof err.status === "number" ? err.status : (typeof err.code === "number" ? err.code : 500)).json({ success: false, message: err.message });
  }
};

export const getLatestAudit = async (req, res) => {
  try {
    const audit = await GbpSEOAudit.findOne({ userId: req.user._id, locationId: req.params.locationId }).sort({ createdAt: -1 });
    res.json({ success: true, data: audit });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

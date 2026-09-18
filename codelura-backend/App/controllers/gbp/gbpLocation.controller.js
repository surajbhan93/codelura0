import { syncAccountsAndLocations, getUserLocations, getLocationById, setPrimaryLocation } from "../../services/gbp/gbpLocation.service.js";

export const listLocations = async (req, res) => {
  try {
    const locations = await getUserLocations(req.user._id);
    res.json({ success: true, data: locations });
  } catch (err) {
    res.status(typeof err.status === "number" ? err.status : (typeof err.code === "number" ? err.code : 500)).json({ success: false, message: err.message });
  }
};

export const getLocation = async (req, res) => {
  try {
    const loc = await getLocationById(req.user._id, req.params.id);
    res.json({ success: true, data: loc });
  } catch (err) {
    res.status(typeof err.status === "number" ? err.status : (typeof err.code === "number" ? err.code : 500)).json({ success: false, message: err.message });
  }
};

export const syncLocations = async (req, res) => {
  try {
    await syncAccountsAndLocations(req.user._id);
    const locations = await getUserLocations(req.user._id);
    res.json({ success: true, message: "Locations synced.", data: locations });
  } catch (err) {
    res.status(typeof err.status === "number" ? err.status : (typeof err.code === "number" ? err.code : 500)).json({ success: false, message: err.message });
  }
};

export const setLocationPrimary = async (req, res) => {
  try {
    await setPrimaryLocation(req.user._id, req.params.id);
    res.json({ success: true, message: "Primary location updated." });
  } catch (err) {
    res.status(typeof err.status === "number" ? err.status : (typeof err.code === "number" ? err.code : 500)).json({ success: false, message: err.message });
  }
};

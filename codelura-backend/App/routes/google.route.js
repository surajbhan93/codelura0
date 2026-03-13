import express from "express";
import {
  googleAuth,
  googleCallback,
  getAccounts,
  getLocations
} from "../controllers/google.controller.js";

const router = express.Router();

router.get("/auth", googleAuth);
router.get("/callback", googleCallback);

router.get("/accounts", getAccounts);
router.get("/locations/:accountId", getLocations);

export default router;
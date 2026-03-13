import express from "express";

import {
  generatePost,
  publishPost,
  saveSettings,
  getSettings,
  runAutoPost
} from "../../controllers/web/autogbp.controller.js";

const router = express.Router();


router.post("/generate", generatePost);

router.post("/publish", publishPost);

router.post("/settings", saveSettings);

router.get("/settings", getSettings);

router.get("/run", runAutoPost);


export default router;
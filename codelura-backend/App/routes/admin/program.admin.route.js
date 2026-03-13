import express from "express";
import {
  createProgram,
  getAllPrograms,
  updateProgram,
  deleteProgram,
} from "../../controllers/admin/program.admin.controller.js";

const router = express.Router();

router.post("/", createProgram);
router.get("/", getAllPrograms);
router.put("/:id", updateProgram);
router.delete("/:id", deleteProgram);

export default router;
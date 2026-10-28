import express from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
  addReply,
  reorderNotes
} from "../controllers/notesController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // Require authentication for all notes routes

router.get("/", getAllNotes);
router.get("/:id", getNoteById);

router.post("/", createNote);
router.post("/:id/replies", addReply);

router.put("/reorder", reorderNotes);
router.put("/:id", updateNote);

router.delete("/:id", deleteNote);

export default router;

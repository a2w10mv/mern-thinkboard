import express from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
  addReply,
  reorderNotes,
  seedWidgets
} from "../controllers/notesController.js";

const router = express.Router();

router.get("/", getAllNotes);
router.post("/seed", seedWidgets);
router.get("/:id", getNoteById);

router.post("/", createNote);
router.post("/:id/replies", addReply);

router.put("/reorder", reorderNotes);
router.put("/:id", updateNote);

router.delete("/:id", deleteNote);

export default router;

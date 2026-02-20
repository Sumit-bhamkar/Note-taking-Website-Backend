import express from "express";
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  toggleFavorite,
} from "../controllers/note.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-note", verifyToken, createNote);
router.get("/get-notes", verifyToken, getNotes);
router.put("/update-note/:id", verifyToken, updateNote);
router.delete("/delete-note/:id", verifyToken, deleteNote);
router.put("/toggle-favorite/:id", verifyToken, toggleFavorite);

export default router;

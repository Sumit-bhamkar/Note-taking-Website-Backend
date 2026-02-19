import prisma from "../prismaClient.js";
import { z } from "zod";

const noteSchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }).min(1, "Title is required"),

  content: z.string({
    required_error: "Content is required",
  }).min(1, "Content is required"),
});



/* =========================
   CREATE NOTE
========================= */
export const createNote = async (req, res) => {
  try {
    const parseResult = noteSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        errors: parseResult.error.errors,
      });
      
    }

    const note = await prisma.note.create({
      data: parseResult.data,
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET ALL NOTES
========================= */
export const getNotes = async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   UPDATE NOTE
========================= */
export const updateNote = async (req, res) => {
  try {
    const id = Number(req.params.id);

if (isNaN(id)) {
  return res.status(400).json({
    message: "Invalid note ID",
  });
}


    const parseResult = noteSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        errors: parseResult.error.errors,
      });
    }

    const updatedNote = await prisma.note.update({
      where: { id },
      data: parseResult.data,
    });

    res.status(200).json(updatedNote);
  } catch (error) {
    // Prisma error when record not found
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(500).json({ message: error.message });
  }
};

/* =========================
   DELETE NOTE
========================= */
export const deleteNote = async (req, res) => {
  try {
    const id = Number(req.params.id);

if (isNaN(id)) {
  return res.status(400).json({
    message: "Invalid note ID",
  });
}


    await prisma.note.delete({
      where: { id },
    });

    res.status(200).json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(500).json({ message: error.message });
  }
};

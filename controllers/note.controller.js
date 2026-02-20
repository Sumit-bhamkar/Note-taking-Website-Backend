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

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const note = await prisma.note.create({
      data: { ...parseResult.data, userId: req.user.id },
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
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const notes = await prisma.note.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(notes);
  } catch (error) {
    // If the favorite column does not exist in the DB, fall back to a raw query
    if (typeof error.message === "string" && error.message.includes("Note.favorite")) {
      try {
        const rows = await prisma.$queryRaw`
          SELECT "id", "title", "content", "createdAt", "updatedAt", "userId"
          FROM "Note"
          WHERE "userId" = ${req.user.id}
          ORDER BY "createdAt" DESC
        `;

        // add default favorite:false for backward compatibility
        const notes = rows.map((r) => ({
          id: r.id,
          title: r.title,
          content: r.content,
          createdAt: r.createdat || r.createdAt,
          updatedAt: r.updatedat || r.updatedAt,
          userId: r.userid || r.userId,
          favorite: false,
        }));

        return res.status(200).json(notes);
      } catch (rawErr) {
        return res.status(500).json({ message: rawErr.message });
      }
    }

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

    // ensure note belongs to user
    const existing = await prisma.note.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Note not found" });
    if (existing.userId !== req.user.id) return res.status(403).json({ message: "Forbidden" });

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


    const existing = await prisma.note.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Note not found" });
    if (existing.userId !== req.user.id) return res.status(403).json({ message: "Forbidden" });

    await prisma.note.delete({ where: { id } });

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

/* =========================
   TOGGLE FAVORITE
========================= */
export const toggleFavorite = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid note ID",
      });
    }

    const existing = await prisma.note.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Note not found" });
    if (existing.userId !== req.user.id) return res.status(403).json({ message: "Forbidden" });

    const updatedNote = await prisma.note.update({
      where: { id },
      data: { favorite: !existing.favorite },
    });

    res.status(200).json(updatedNote);
  } catch (error) {
    // If favorite column missing, return informative error
    if (typeof error.message === "string" && error.message.includes("Note.favorite")) {
      return res.status(501).json({ message: "Favorite feature not enabled in database. Run the migration to add the 'favorite' column." });
    }

    res.status(500).json({ message: error.message });
  }
};

import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const register = async (req, res) => {
  try {
    const parse = registerSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ errors: parse.error.errors });

    const { name, email, password } = parse.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashed },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const parse = loginSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ errors: parse.error.errors });

    const { email, password } = parse.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const secret = process.env.JWT_SECRET || "change_this_secret";
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "7d" });

    res.status(200).json({ token, name: user.name, email: user.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

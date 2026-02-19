import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import noteRoutes from "./routes/note.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4001;

app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://note-taking-website-frontend.vercel.app"
  ],
  credentials: true
}));
app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});


app.use("/api/v1/noteapp", noteRoutes);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

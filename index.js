import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import noteRoutes from "./routes/note.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4001;

app.use(express.json());
app.use(cors());

app.use("/api/v1/noteapp", noteRoutes);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from 'path'
import connectDB from "./server/config/db.js";
import router from "./server/routes/index.js";
import songs from "./server/routes/songs.js";
import playlists from "./server/routes/playlists.js";
import { fileURLToPath } from "url";
import { notFound, errorHandler } from "./server/middleware/errorMiddleware.js";
import compression from "compression";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const corsOptions = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 200,
};

dotenv.config();

connectDB();

app.use(express.json());

app.use(cors(corsOptions));

app.use(compression())
app.use("/api", router, songs, playlists);

if (process.env.NODE_ENV === 'production') {
  const root = path.join(__dirname, 'dist', 'client')
  app.use(express.static(root));
  app.get("*", (req, res) => {
    res.sendFile('index.html', { root })
  })
}

app.use(notFound);

app.use(errorHandler);

app.listen(process.env.PORT || 8080, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`)
);
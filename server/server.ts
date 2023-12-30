import express, { Express } from "express";
import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import path from 'path'
import connectDB from "./config/db.js";
import router from "./routes/index.js";
import songs from "./routes/songs.js";
import playlists from "./routes/playlists.js";
import { fileURLToPath } from "url";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import compression from "compression";

const app: Express = express();
let __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);
const corsOptions: CorsOptions = {
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
  const root = path.join(__dirname, '../client/dist/client/browser')
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
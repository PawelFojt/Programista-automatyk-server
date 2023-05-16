import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/posts.js";
import categoryRoutes from "./routes/categories.js";
import Multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { bucket } from "./GCS api/bucket.js";
import cookieParser from "cookie-parser";
import { corsOptions } from "./config/corsOptions.js";


dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

app.get("/", (req, res) => {
  res.send("serwer uruchomiony!");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log("backend uruchomiony http://localhost:" + PORT);
    });
  })
  .catch((error) => console.error(error));

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

app.post("/upload", multer.single("file"), (req, res) => {
  const { file, body } = req;
  try {
    if (file) {
      const blob = bucket.file(body.name);
      const blobStream = blob.createWriteStream();

      blobStream.on("finish", () => {
        res.status(200).send("Success");
      });
      blobStream.end(file.buffer);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json({ limit: "15kb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "15kb", extended: true }));
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/posts", postRoutes);
app.use("/categories", categoryRoutes);
app.use("/images", express.static(path.join(__dirname, "/images")));
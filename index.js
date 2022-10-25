import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import postRoutes from './routes/posts.js';
import categoryRoutes from './routes/categories.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { port } from './config.js';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);


app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}))
app.use(cors());

const PORT = 5000;
const CONNECTION_URL = "mongodb+srv://Pawel:Pawel23@pawelfojt.lzqxi.mongodb.net/blog?retryWrites=true&w=majority";

//MongoDB connection
mongoose
  .connect(CONNECTION_URL)
  .then(() => {
    console.log("połączono z bazą danych");
    app.listen(port, () => {
      console.log("backend uruchomiony http://localhost:" + PORT);
    });
  })
  .catch((err) => console.log(err));

  

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "images");
    }, 
    filename:(req, file, cb) => {
      cb(null, req.body.name);
    }
  });

  const upload = multer({storage:storage});
  app.post("/upload", upload.single("file"), (req, res) => {
    res.status(200).json("Plik został zapisany na serwerze");
  });

  app.use("/auth", authRoutes);
  app.use("/user", userRoutes);
  app.use("/posts", postRoutes);
  app.use("/categories", categoryRoutes);
  app.use("/images", express.static(path.join(__dirname,"/images")));
  
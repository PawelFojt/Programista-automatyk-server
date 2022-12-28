import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import postRoutes from './routes/posts.js';
import categoryRoutes from './routes/categories.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import AWS from 'aws-sdk';


dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);


app.use(bodyParser.json({limit: '16mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '16mb', extended: true}));
app.use(cors());
app.get('/', (req, res) => {
  res.send('serwer uruchomiony!');
});

const PORT = process.env.PORT || 5000;
//MongoDB connection
mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() => {
    console.log("połączono z bazą danych");
    app.listen(PORT, () => {
      console.log("backend uruchomiony http://localhost:" + PORT);
    });
  })
  .catch((err) => console.log(err));

  //creating storage
  const storage = multer.memoryStorage();
  const upload = multer({storage}).single("file");

  //sending files to aws s3
  app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    const { file, body } = req;
    if (!file || !body) return res.status(400).json({message: "Bad request"});
    if (err) {
      return res.status(400).send(err);
    }
    const s3 = new AWS.S3();
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${body.name}`,
      Body: file.buffer,
    };
    const options = {partSize: 10 * 1024 * 1024, queueSize: 1};

    s3.upload(params, options, (err, data) => {
      if (err) {
        return res.status(400).send(err);
      }
      return res.send(data);
    });
  });
});

  app.use("/auth", authRoutes);
  app.use("/user", userRoutes);
  app.use("/posts", postRoutes);
  app.use("/categories", categoryRoutes);
  app.use("/images", express.static(path.join(__dirname,"/images")));
  
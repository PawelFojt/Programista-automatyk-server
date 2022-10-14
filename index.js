const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path");
const { port } = require('./config');
require("dotenv").config();
app.use(express.static(path.join(__dirname + '/public')));
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));


mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("połączono z bazą danych"))
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

  app.use("/auth", authRoute);
  app.use("/users", userRoute);
  app.use("/posts", postRoute);
  app.use("/categories", categoryRoute);
  
  app.listen(port, () => {
    console.log("backend uruchomiony http://localhost:" + port);
  });
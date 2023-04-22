import * as dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response, application } from "express";
const port = 8000;
import cors from "cors";
import mongoose from "mongoose";
import User from "./models/User";
import Post from "./models/Post";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import multer from "multer";
const uploadMiddleware = multer({ dest: "uploads/" });
import fs from "fs";

const app: Express = express();

const salt = bcrypt.genSaltSync(10);
const secret = "sdadjanfjknfnqeiwdhd123245";

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());
// app.use('/uploads', path.join(__dirname + 'uploads'))
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use(express.static('uploads'))
app.use('/uploads', express.static('uploads'))


const databaseSecret = process.env.DATABASE_SECRET;

if (!databaseSecret) {
  throw new Error("DATABASE_SECRET is not defined");
}

mongoose.connect(databaseSecret);

app.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});

app.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  if (!userDoc) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // logged in
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("wrong credentials");
  }
});

app.get("/profile", (req: Request, res: Response) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post("/logout", (req: Request, res: Response) => {
  res.cookie("token", "").json("ok");
});

app.post(
  "/post",
  uploadMiddleware.single("file"),
  async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const { originalname, path } = file;
    if (!originalname || !path) {
      return res.status(400).json({ error: "File name or path is missing" });
    }
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path+"."+ ext;
    fs.renameSync(path, newPath);

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      const { title, summary, content } = req.body;
      if (!info || typeof info === "string") {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        author: info.id as string,
      });
      res.json(postDoc);
    });
  }
);

// app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
//   if (req.file) {

//   }
// })

app.get("/post", async (req, res) => {
  res.json(
    await Post.find().populate("author", ["username"]).sort({ createdAt: -1 }).limit(20)
  );
});

app.get('/post/:id', async (req, res) => {
  const { id } = req.params
  const postDoc = await Post.findById(id).populate('author', ['username'])
  res.json(postDoc)
})

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

import * as dotenv from 'dotenv'
dotenv.config()
import express, { Express, Request, Response } from "express";
const port = 8000;
import cors from "cors";
import mongoose from "mongoose";
import User from "./models/User";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

const app: Express = express();

const salt = bcrypt.genSaltSync(10)
const secret = 'sdadjanfjknfnqeiwdhd123245'

app.use(cors({credentials: true, origin: 'http://localhost:5173'}));
app.use(express.json());
app.use(cookieParser())

const databaseSecret = process.env.DATABASE_SECRET

if (!databaseSecret) {
    throw new Error("DATABASE_SECRET is not defined")
}

mongoose.connect(databaseSecret)

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

app.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({username})
    if (!userDoc) {
        return res.status(401).json({message: 'Invalid username or password'})
    }
    const passOk = bcrypt.compareSync(password, userDoc.password) 
    if (passOk) {
        // logged in
        jwt.sign({username, id: userDoc._id}, secret, {}, (err, token) => {
            if (err) throw err
            res.cookie('token', token).json({
                id: userDoc._id,
                username
            })
        })
    } else {
        res.status(400).json('wrong credentials')
    }
})

app.get('/profile', (req: Request, res: Response) => {
    const {token} = req.cookies
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err
        res.json(info)
    })
})

app.post('/logout', (req: Request, res: Response) => {
    res.cookie('token', '').json('ok')
})

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

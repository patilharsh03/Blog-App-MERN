"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_1 = __importDefault(require("express"));
const port = 8000;
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("./models/User"));
const Post_1 = __importDefault(require("./models/Post"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const multer_1 = __importDefault(require("multer"));
const uploadMiddleware = (0, multer_1.default)({ dest: "uploads/" });
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const salt = bcrypt_1.default.genSaltSync(10);
const secret = "sdadjanfjknfnqeiwdhd123245";
app.use((0, cors_1.default)({ credentials: true, origin: "http://localhost:5173" }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// app.use('/uploads', path.join(__dirname + 'uploads'))
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use(express.static('uploads'))
app.use('/uploads', express_1.default.static('uploads'));
const databaseSecret = process.env.DATABASE_SECRET;
if (!databaseSecret) {
    throw new Error("DATABASE_SECRET is not defined");
}
mongoose_1.default.connect(databaseSecret);
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const userDoc = yield User_1.default.create({
            username,
            password: bcrypt_1.default.hashSync(password, salt),
        });
        res.json(userDoc);
    }
    catch (e) {
        res.status(400).json(e);
    }
}));
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const userDoc = yield User_1.default.findOne({ username });
    if (!userDoc) {
        return res.status(401).json({ message: "Invalid username or password" });
    }
    const passOk = bcrypt_1.default.compareSync(password, userDoc.password);
    if (passOk) {
        // logged in
        jsonwebtoken_1.default.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
            if (err)
                throw err;
            res.cookie("token", token).json({
                id: userDoc._id,
                username,
            });
        });
    }
    else {
        res.status(400).json("wrong credentials");
    }
}));
app.get("/profile", (req, res) => {
    const { token } = req.cookies;
    jsonwebtoken_1.default.verify(token, secret, {}, (err, info) => {
        if (err)
            throw err;
        res.json(info);
    });
});
app.post("/logout", (req, res) => {
    res.cookie("token", "").json("ok");
});
app.post("/post", uploadMiddleware.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const newPath = path + "." + ext;
    fs_1.default.renameSync(path, newPath);
    const { token } = req.cookies;
    jsonwebtoken_1.default.verify(token, secret, {}, (err, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            throw err;
        const { title, summary, content } = req.body;
        if (!info || typeof info === "string") {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const postDoc = yield Post_1.default.create({
            title,
            summary,
            content,
            cover: newPath,
            author: info.id,
        });
        res.json(postDoc);
    }));
}));
app.put('/post', uploadMiddleware.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let newPath = null;
    if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs_1.default.renameSync(path, newPath);
    }
    const { token } = req.cookies;
    jsonwebtoken_1.default.verify(token, secret, {}, (err, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            throw err;
        const { id, title, summary, content } = req.body;
        const postDoc = yield Post_1.default.findById(id);
        const isAuthor = JSON.stringify(postDoc === null || postDoc === void 0 ? void 0 : postDoc.author) === JSON.stringify(info === null || info === void 0 ? void 0 : info.id);
        if (!isAuthor) {
            return res.json(400).json('you are not the author');
        }
        yield (postDoc === null || postDoc === void 0 ? void 0 : postDoc.updateOne({
            title,
            summary,
            content,
            cover: newPath ? newPath : postDoc === null || postDoc === void 0 ? void 0 : postDoc.cover
        }));
        res.json(postDoc);
    }));
}));
app.get("/post", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield Post_1.default.find().populate("author", ["username"]).sort({ createdAt: -1 }).limit(20));
}));
app.get('/post/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const postDoc = yield Post_1.default.findById(id).populate('author', ['username']);
    res.json(postDoc);
}));
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

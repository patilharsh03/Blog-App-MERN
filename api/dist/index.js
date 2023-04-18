"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const port = 8000;
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    res.json({ requestData: { username, password } });
});
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
// mongodb+srv://harsh:phQNuY5fZ2090IVj@blog-app.jwi8beg.mongodb.net/?retryWrites=true&w=majority

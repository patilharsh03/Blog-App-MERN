import express, { Express, Request, Response } from 'express'
const port = 8000;
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

app.post('/register', (req, res) => {
    const { username, password } = req.body
    res.json({requestData: {username, password}})
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})
// mongodb+srv://harsh:phQNuY5fZ2090IVj@blog-app.jwi8beg.mongodb.net/?retryWrites=true&w=majority
import express from "express"
import dotenv from 'dotenv'
import cors from 'cors'

import connectDB from "./config/db.js"
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"
import router from "./routes/index.js"

const app = express()
dotenv.config()
const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
}

connectDB()

app.use(express.json())

app.use(cors(corsOptions))

app.use('/', router)

app.use(notFound)
app.use(errorHandler)

app.listen(process.env.PORT || 5000, () => console.log(`Server running on http://localhost:${process.env.PORT}`))
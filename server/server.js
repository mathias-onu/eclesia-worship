import express from "express"
import dotenv from 'dotenv'

import connectDB from "./config/db.js"
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"
import router from "./routes/index.js"

const app = express()
dotenv.config()

connectDB()

app.use(express.json())

app.use('/', router)

app.use(notFound)
app.use(errorHandler)

app.listen(process.env.PORT || 5000, () => console.log('Server running'))
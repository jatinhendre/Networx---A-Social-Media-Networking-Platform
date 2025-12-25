import { config } from 'dotenv'
config()

import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import postRoutes from './routes/posts.routes.js'
import userRoutes from './routes/users.routes.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('uploads'))

// ROUTES
app.use(postRoutes)
app.use(userRoutes)

const start = async () => {
  try {
    const port = process.env.PORT || 5000
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  }
}

start()

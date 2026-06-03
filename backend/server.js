import { config } from 'dotenv'
config()

import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import http from 'http'
import postRoutes from './routes/posts.routes.js'
import userRoutes from './routes/users.routes.js'
import notificationRoutes from './routes/notifications.routes.js'
import conversationRoutes from './routes/conversations.routes.js'
import { initializeSocket } from './utils/socket.js'

const app = express()
const server = http.createServer(app)

const corsOptions = {
  origin: [
    "https://networx-a-social-media-networking-p.vercel.app",
    "http://localhost:3000"
  ],
  credentials: true,
}

initializeSocket(server, corsOptions)

app.use(cors(corsOptions));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('uploads'))

// ROUTES
app.use(postRoutes)
app.use(userRoutes)
app.use(notificationRoutes)
app.use(conversationRoutes)

const start = async () => {
  try {
    const port = process.env.PORT || 5000
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  }
}

start()

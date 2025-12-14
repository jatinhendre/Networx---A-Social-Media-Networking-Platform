import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import postRoutes from './routes/posts.routes.js'
import userRoutes from './routes/users.routes.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('uploads'))
app.use(postRoutes)
app.use(userRoutes)


const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB') 
    app.listen(5000, () => {
      console.log('Server is running on port 5000')
    })
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  } 
}

start() 
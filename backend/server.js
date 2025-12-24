import { config } from 'dotenv'
config()
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import postRoutes from './routes/posts.routes.js'
import userRoutes from './routes/users.routes.js'
import cloudinary from './config/cloudinary.js';


const app = express()

app.use(cors())
app.use('/create_post', postRoutes);
app.use(express.json())  // Parse JSON FIRST
app.use(express.urlencoded({ extended: true }))  // Parse form data
app.use(express.static('uploads'))
console.log("in server.js")
console.log("🔍 Checking environment variables...");
console.log("Current directory:", process.cwd());
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME || "❌ NOT FOUND");
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "✅ EXISTS" : "❌ NOT FOUND");
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "✅ EXISTS" : "❌ NOT FOUND");

// If env vars are missing, exit
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("❌ CRITICAL: Environment variables missing!");
  console.error("Make sure .env file exists in:", process.cwd());
  process.exit(1);
}
// Then routes
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
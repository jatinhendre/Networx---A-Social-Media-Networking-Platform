import { Router } from 'express';
import multer from 'multer';
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import { createPost, getAllPosts, deletePost, toggleLike, getComments, postComment } from '../controllers/posts.controller.js';
import { config } from "dotenv";
config()

const router = Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "networx/posts",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif", "mp4"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }]
  },
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log("📎 File received:", file.originalname, file.mimetype);
    cb(null, true);
  }
});

// Add error handling middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("❌ Multer Error:", err);
    return res.status(400).json({ message: err.message });
  } else if (err) {
    console.error("❌ Upload Error:", err);
    return res.status(500).json({ message: err.message });
  }
  next();
};

router.route('/create_post').post(upload.single('media'), handleMulterError, createPost);
router.route('/posts').get(getAllPosts);
router.route('/delete_post').post(deletePost);
router.route('/toggle_Like').post(toggleLike);
router.route('/getComments').get(getComments);
router.route('/comment').post(postComment);

export default router;
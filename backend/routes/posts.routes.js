import { Router } from 'express';
import { createPost, deletePost, getAllPosts, getComments, postComment, delete_comment, incrementLike} from '../controllers/posts.controller.js';
import multer from 'multer';

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    }
});

const upload = multer({ storage: storage });

const router = Router();

router.route('/create_post').post(upload.single('media'), createPost);
router.route('/posts').get(getAllPosts);
router.route('/delete_post').post(deletePost);
router.route('/comment').post(postComment);
router.route('/getComments').get(getComments);
router.route('/delete_comment').post(delete_comment);
router.route('/incrementLikes').post(incrementLike)

export default router;
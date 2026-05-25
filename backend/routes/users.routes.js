import {Router}from 'express';
import {acceptConnectionRequest, addTestimonial, connectionRequest, downloadProfile, getAllUserProfiles, getConnectionStatus, getMyConnections, getUserProfileBasedOnUsername, myConnectionRequests, register, updateUser} from '../controllers/user.controller.js';
import {login} from '../controllers/user.controller.js';
import multer from 'multer';
import {updateProfilePicture} from '../controllers/user.controller.js';
import { getProfile ,updateProfileData} from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
const router = Router();
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "networx/posts",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });


router.route('/update_profile_picture').post(upload.single('profile_picture'), updateProfilePicture);
router.route('/register').post(register)
router.route('/login').post(login)
router.route('/update_profile').post(updateUser)
router.route('/get_user_profile').get(getProfile)
router.route('/update_profile_data').post(updateProfileData)
router.route('/user/getAllProfiles').get(getAllUserProfiles)
router.route('/user/downloadResume').get(downloadProfile)
router.route('/user/sendConnectionRequest').post(connectionRequest)
router.route('/user/getMyConnections').get(getMyConnections)
router.route('/user/myConnectionRequest').get(myConnectionRequests)
router.route('/user/getConnectionStatus').get(getConnectionStatus)
router.route('/user/acceptConnectionRequest').post(acceptConnectionRequest)
router.route('/user/getProfileOnUsername').get(getUserProfileBasedOnUsername)

router.route('/add_testimonial').post(requireAuth, addTestimonial)
export default router;

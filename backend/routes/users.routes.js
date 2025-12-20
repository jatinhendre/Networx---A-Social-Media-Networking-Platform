import {Router}from 'express';
import {acceptConnectionRequest, connectionRequest, downloadProfile, getAllUserProfiles, getMyConnections, getUserProfileBasedOnUsername, myConnectionRequests, register, updateUser} from '../controllers/user.controller.js';
import {login} from '../controllers/user.controller.js';
import multer from 'multer';
import {updateProfilePicture} from '../controllers/user.controller.js';
import { getProfile ,updateProfileData} from '../controllers/user.controller.js';
const router = Router();

const storage = multer.diskStorage({
    filename: (req, file, cb)=>{
        cb(null, Date.now() + '-' + file.originalname);
    },
    destination: (req, file, cb)=>{
        cb(null, 'uploads/');
    }
});

const upload = multer({storage:storage});


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
router.route('/user/acceptConnectionRequest').post(acceptConnectionRequest)
router.route('/user/getProfileOnUsername').get(getUserProfileBasedOnUsername)
export default router;
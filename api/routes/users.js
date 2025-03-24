import express from'express';
const router = express.Router();

import ROLES_LIST from '../config/roles.js';
import verifyRoles from '../middleware/verifyrole.js';
import {   deleteUserProfile, getAllUsers,  getUserProfile,  updateProfilePicture,  updateUserProfile } from '../controllers/usercontroller.js';

import multer from "multer";








const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${req.user.id}-${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });





router.get("/",verifyRoles(ROLES_LIST.Admin),getAllUsers)
router.delete("/:id",verifyRoles(ROLES_LIST.User),deleteUserProfile);

router.put("/:id",verifyRoles(ROLES_LIST.User),updateUserProfile);
router.put('/picture/:id',verifyRoles(ROLES_LIST.User), upload.single('profilePicture'), updateProfilePicture);

router.get('/:id',verifyRoles(ROLES_LIST.User),getUserProfile);

export default router;
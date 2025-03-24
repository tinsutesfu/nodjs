import express from 'express';
import { login, register, requestPasswordReset, resetPassword } from '../controllers/authcontroller.js';

const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.post('/password-reset', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);


export default router;
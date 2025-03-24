import express from'express';
import { handleNewUser } from '../controllers/registercontroller.js';
const router = express.Router();


router.post('/', handleNewUser);

export default router;
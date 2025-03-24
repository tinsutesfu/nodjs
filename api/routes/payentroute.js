import express from 'express';
import { initiatePayment, verifyPayment } from '../controllers/verifypaymentcontroller.js';

import verifyJWT from "../middleware/verifyjwt.js";
const router = express.Router();

// Route to initiate payment (Chapa or PayPal)
router.post('/initiate', verifyJWT, initiatePayment);

// Route to verify payment (Chapa or PayPal)
router.post('/verify/:transactionId',verifyJWT,  verifyPayment);
// For Chapa callback (GET request from Chapa's callback_url)
router.get('/verify/:transactionId', verifyPayment);

export default router;
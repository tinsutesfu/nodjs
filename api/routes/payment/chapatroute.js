import express from 'express';
import { initiatePayment, verifyPayment } from '../../controllers/verifypaymentcontroller.js';



const router = express.Router();

// Initiate payment
router.post('/initiate', initiatePayment);

// Chapa return route
router.get('/verify/vi/:id', verifyPayment);



export default router;
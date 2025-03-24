// paymentRoutes.js
import express from 'express';
import { initiatePayment } from '../../controllers/verifypaymentcontroller.js';
import { capturePayment } from '../../controllers/paypalcontroller.js';

const router = express.Router();
router.post('/initiate', initiatePayment);
router.get('/capture', capturePayment); // PayPal return URL



export default router;
import express from 'express';
const router = express.Router();
import paypalRoute from './paypalroute.js';
import chapaRoute from './chapatroute.js';

router.use('/chapa',chapaRoute)
router.use('/paypal',paypalRoute)

export default router;
import express from 'express';
import {  getOrderById, getOrderByTxRef, getUserOrders, listorder, orderstatus} from '../controllers/ordercontroller.js';






const router = express.Router();








router.get('/userorder', getUserOrders);
router.get('/:tx_ref', getOrderByTxRef);
router.get('/list',listorder)
router.post('/status',orderstatus)
router.get('/orders/:orderId',  getOrderById);
export default router;
import axios from 'axios';
import paypal from '../utils/paypal.js';
import Order from '../models/orders.js';
import User from '../models/user.js';
import { v4 as uuidv4 } from 'uuid';

const CHAPA_API_URL = 'https://api.chapa.co/v1';

export const initiatePayment = async (req, res) => {
  try {
    const { items, address, totalAmount, paymentMethod, deliveryId } = req.body;
    const userId = req.user;

    if (!items || !Array.isArray(items) || items.length === 0 || !address || !totalAmount || !paymentMethod || !deliveryId) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    console.log('Received totalAmount (with tax/shipping):', totalAmount);
    console.log('Items:', JSON.stringify(items, null, 2));

    // Check for duplicate pending order
    const existingOrder = await Order.findOne({
      userId,
      deliveryId,
      items: { $eq: items }, // Exact match on items array (including price)
      paymentStatus: 'pending',
      orderStatus: 'pending',
    });

    if (existingOrder) {
      console.log('Duplicate order detected:', existingOrder._id);
      return res.status(409).json({ 
        success: false, 
        message: 'An identical pending order already exists. Please complete or cancel it first.',
        orderId: existingOrder._id 
      });
    }

    const transactionId = `${paymentMethod}-${uuidv4()}`;
    console.log('Generated transactionId:', transactionId);

    const order = new Order({
      userId,
      items,
      address,
      totalAmount,
      paymentMethod,
      transactionId,
      deliveryId,
    });
    await order.save();

    if (paymentMethod === 'chapa') {
      const amountInETB = (parseFloat(totalAmount) * 120).toFixed(2);
      const chapaPayload = {
        amount: amountInETB,
        currency: 'ETB',
        email: address.email,
        first_name: address.firstname,
        last_name: address.lastname,
        tx_ref: transactionId,
        callback_url: `${process.env.BACKEND_URL}/routes/payment/verify/${transactionId}`,
        return_url: `${process.env.FRONTEND_URL}/payment-status?transactionId=${transactionId}`,
      };

      console.log('Chapa Payload:', JSON.stringify(chapaPayload, null, 2));
      try {
        const response = await axios.post(
          `${CHAPA_API_URL}/transaction/initialize`,
          chapaPayload,
          { headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` } }
        );
        console.log('Chapa Response:', JSON.stringify(response.data, null, 2));
        await User.findByIdAndUpdate(userId, { cartdata: {} });
        return res.json({ 
          success: true, 
          paymentUrl: response.data.data.checkout_url, 
          orderId: order._id, 
          transactionId: order.transactionId 
        });
      } catch (chapaError) {
        console.error('Chapa API Error:', JSON.stringify(chapaError.response?.data || chapaError.message, null, 2));
        throw chapaError;
      }
    } else if (paymentMethod === 'paypal') {
      const create_payment_json = {
        intent: 'sale',
        payer: { payment_method: 'paypal' },
        redirect_urls: {
          return_url: `${process.env.FRONTEND_URL}/paypal-return`,
          cancel_url: `${process.env.FRONTEND_URL}/paypal-cancel`,
        },
        transactions: [
          {
            item_list: {
              items: [
                {
                  name: 'Order Total',
                  sku: order._id.toString(),
                  price: totalAmount.toString(),
                  currency: 'USD',
                  quantity: '1',
                },
              ],
            },
            amount: {
              currency: 'USD',
              total: totalAmount.toString(),
            },
            description: 'Order payment',
          },
        ],
      };

      console.log('PayPal Payload:', JSON.stringify(create_payment_json, null, 2));

      paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
        if (error) {
          console.error('PayPal Error:', JSON.stringify(error, null, 2));
          return res.status(500).json({ success: false, message: 'PayPal payment creation failed', error });
        }

        order.transactionId = paymentInfo.id;
        await order.save();

        const approvalURL = paymentInfo.links.find((link) => link.rel === 'approval_url').href;
        await User.findByIdAndUpdate(userId, { cartdata: {} });
        res.json({ 
          success: true, 
          paymentUrl: approvalURL, 
          orderId: order._id, 
          transactionId: paymentInfo.id 
        });
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid payment method' });
    }
  } catch (error) {
    console.error('Initiate Payment Error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Payment initiation failed', error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { transactionId } = req.params;
    console.log('Chapa Callback - Verifying transactionId:', transactionId);

    const order = await Order.findOne({ transactionId });
    if (!order) {
      console.error('Order not found for transactionId:', transactionId);
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    console.log('Found order:', order._id, 'Payment Method:', order.paymentMethod);

    if (order.paymentMethod === 'chapa') {
      try {
        const verification = await axios.get(
          `${CHAPA_API_URL}/transaction/verify/${transactionId}`,
          { headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` } }
        );
        console.log('Chapa Verification Response:', JSON.stringify(verification.data, null, 2));

        if (verification.data.status === 'success') {
          order.paymentStatus = 'paid';
          order.orderStatus = 'confirmed';
          await order.save();
          console.log('Order updated:', order._id, 'Status:', order.paymentStatus, order.orderStatus);
          return res.status(200).json({ success: true, message: 'Payment verified', orderId: order._id });
        } else {
          console.log('Chapa payment not successful:', verification.data.status);
          return res.status(400).json({ success: false, message: 'Payment not successful' });
        }
      } catch (verificationError) {
        console.error('Chapa Verification Error:', JSON.stringify(verificationError.response?.data || verificationError.message, null, 2));
        return res.status(500).json({ success: false, message: 'Verification failed', error: verificationError.message });
      }
    } else if (order.paymentMethod === 'paypal') {
      const { paymentId, payerId } = req.body;

      if (!paymentId || !payerId) {
        console.error('Missing paymentId or payerId');
        return res.status(400).json({ success: false, message: 'Missing paymentId or payerId' });
      }

      paypal.payment.execute(paymentId, { payer_id: payerId }, async (error, payment) => {
        if (error) {
          console.error('PayPal Execute Error:', JSON.stringify(error, null, 2));
          return res.status(500).json({ success: false, message: 'PayPal payment execution failed', error });
        }

        order.paymentStatus = 'paid';
        order.orderStatus = 'confirmed';
        order.transactionId = paymentId;
        await order.save();
        console.log('PayPal order updated:', order._id);

        res.json({ success: true, message: 'Payment confirmed', orderId: order._id });
      });
    }
  } catch (error) {
    console.error('Verify Payment Error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Payment verification failed', error: error.message });
  }
};
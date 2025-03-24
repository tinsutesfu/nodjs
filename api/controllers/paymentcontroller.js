import { createOrder, updateOrderStatus } from '../services/orderservice.js';
import { initiateChapaPayment, verifyChapaPayment } from '../services/chapaservice.js';
import { initiatePaypalPayment, capturePaypalPayment } from '../services/paypalservice.js';

// Initiate payment based on paymentMethod
export const initiatePayment = async (req, res) => {
  const { address, items, amount, deliveryId, tx_ref, paymentMethod } = req.body;
  const userId = req.user; // Assuming authentication middleware sets req.user


  console.log('Env vars:', {
    CHAPA_SECRET_KEY: process.env.CHAPA_SECRET_KEY,
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,
    BACKEND_URL: process.env.BACKEND_URL,
    FRONTEND_URL: process.env.FRONTEND_URL
  });


  try {
    // Create order with initial status
    const order = await createOrder({
      userId,
      address,
      items,
      amount,
      deliveryId,
      tx_ref,
      paymentMethod,
      status: 'pending',
      payment: false,
    });
    console.log('Selected payment method:', paymentMethod);
    let paymentUrl;
    if (paymentMethod === 'chapa') {
      paymentUrl = await initiateChapaPayment(order);
    } else if (paymentMethod === 'paypal') {
      paymentUrl = await initiatePaypalPayment(order);
    } else {
      return res.status(400).json({ error: 'Invalid payment method' });
    }

    res.json({ paymentUrl });
  } catch (error) {
    console.error(`Payment initiation error for ${paymentMethod}:`, error);
    res.status(500).json({ error: `Payment initiation failed: ${error.message}` });
  }
};

// Handle Chapa payment return
export const chapaReturnController = async (req, res) => {
  const { orderId } = req.query;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    await verifyChapaPayment(order.tx_ref);
    res.redirect(`${process.env.FRONTEND_URL}/order/${order._id}/success`);
  } catch (error) {
    console.error('Chapa verification error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/order/${orderId}/error`);
  }
};

// Handle PayPal payment capture
export const capturePaypalPaymentController = async (req, res) => {
  const { token, orderId } = req.query;

  try {
    await capturePaypalPayment(token, orderId);
    res.redirect(`${process.env.FRONTEND_URL}/order/${orderId}/success`);
  } catch (error) {
    console.error('PayPal capture error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/order/${orderId}/error`);
  }
};
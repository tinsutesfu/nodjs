import paypal from 'paypal-rest-sdk';
import dotenv from 'dotenv';

dotenv.config();

paypal.configure({
  mode: process.env.PAYPAL_MODE || 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID || 'your_client_id',
  client_secret: process.env.PAYPAL_CLIENT_SECRET || 'your_client_secret',
});

export default paypal;
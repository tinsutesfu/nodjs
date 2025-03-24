import axios from 'axios';

const initChapaPayment = async (orderId, totalAmount, userEmail) => {
  try {
    const response = await axios.post('https://api.chapa.co/v1/transaction/initialize', {
      amount: totalAmount,
      currency: 'ETB',
      email: userEmail,
      tx_ref: orderId, // Transaction reference (order ID)
      callback_url: `${process.env.BACKEND_URL}/routes/place/verify-payment/${orderId}`,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      },
    });

    return response.data.data.checkout_url;
  } catch (error) {
    console.error('Error initiating Chapa payment', error);
    throw new Error('Payment initialization failed');
  }
};

export default initChapaPayment;

import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useaxiosprivate';
import useAuth from '../hooks/authuse';


  

const PaypalReturn = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  useEffect(() => {
    const handlePaypalReturn = async () => {
      const params = new URLSearchParams(window.location.search);
      const paymentId = params.get('paymentId');
      const payerId = params.get('PayerID');
      const orderId = sessionStorage.getItem('orderId');
      const transactionId = sessionStorage.getItem('transactionId');

      if (!paymentId || !payerId || !orderId || !transactionId) {
        console.error('Missing parameters:', { paymentId, payerId, orderId, transactionId });
        alert('Invalid PayPal return parameters');
        navigate('/checkout');
        return;
      }

      try {
        const response = await axiosPrivate.post(
          `/routes/payment/verify/${transactionId}`, // Use transactionId
          { paymentId, payerId }
        );
        console.log('Verification Response:', response.data);
        if (response.data.success) {
          sessionStorage.removeItem('orderId');
          sessionStorage.removeItem('transactionId');
          navigate(`/payment-status`); // Use orderId for tracking
        } else {
          console.error('Verification failed:', response.data);
          alert('Payment verification failed');
          navigate('/orders');
        }
      } catch (error) {
        console.error('PayPal Verify Error:', error.response?.data || error.message);
        alert('Payment verification failed');
        navigate('/orders');
      }
    };

    handlePaypalReturn();
  }, [navigate]); // Add navigate to dependency array

  return <div style={{ marginTop: '100px', textAlign: 'center' }}>Processing PayPal payment...</div>;
};
  

export default PaypalReturn;
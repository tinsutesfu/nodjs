import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useaxiosprivate';
import useAuth from '../hooks/authuse';

const OrderError = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axiosPrivate.get(`routes/place/orders/${orderId}`);
        setOrder(response.data);
      } catch (err) {
        setError('Error fetching order');
      }
    };
    fetchOrder();
  }, [orderId, axiosPrivate]);

  if (error) return <div style={{margin:'200px'}}>Error: {error}</div>;
  if (!order) return <div>Loading...</div>;
  if (order.userId !== auth.id) return <div>Unauthorized access</div>;

  return (
    <div>
      <h1>Payment Failed</h1>
      <p>Your payment could not be processed. Please try again or contact support.</p>
      <p>Order ID: {order._id}</p>
      <button onClick={() => window.location.replace(<a href="#footer">
                
              </a>)}>Contact Support</button>
    </div>
  );
};

export default OrderError;
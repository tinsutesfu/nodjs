import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useaxiosprivate';
import dayjs from 'dayjs';
import useAuth from '../hooks/authuse';
import '../styles/pages/order.css';
import { v4 as uuidv4 } from 'uuid';

const PlaceOrder = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth, products } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const { cart, selectedDelivery, deliveryId,orderTotal } = location.state || {};

  const [data, setData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('chapa');
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  useEffect(() => {
    console.log('Cart:', cart);
    console.log('Selected Delivery:', selectedDelivery);
    console.log('Calculated totalAmount:', orderTotal);
  }, [cart, selectedDelivery]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const submitOrder = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true

    const items = cart.map((item) => {
      const product = products.find((p) => p._id === item.productId);
      return {
        productId: item.productId,
        name: product?.name || 'Unknown',
        quantity: item.quantity,
        price: (product?.priceCents / 100).toFixed(2),
      };
    });

    const orderData = {
      items,
      address: data,
      totalAmount:orderTotal.toFixed(2), // Include totalAmount in request body
      paymentMethod,
      deliveryId,
    };

    console.log('Order Data:', JSON.stringify(orderData, null, 2));

    try {
      const response = await axiosPrivate.post('/routes/payment/initiate', orderData);
      console.log('Initiate Response:', response.data);
      sessionStorage.setItem('orderId', response.data.orderId);
      sessionStorage.setItem('transactionId', response.data.transactionId);
      window.location.href = response.data.paymentUrl;
    } catch (error) {
      console.error('Payment Error:', error.response?.data || error.message);
      alert('Payment initiation failed');
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  
  

  return (
    <>
      <form onSubmit={submitOrder} className="place-order">
        <div className="place-order-left">
          <p className="title">Delivery Information</p>
          <input required name="firstname" onChange={onChangeHandler} value={data.firstname} type="text" placeholder="First name" />
          <input required name="lastname" onChange={onChangeHandler} value={data.lastname} type="text" placeholder="Last name" />
          <input required name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Email address" />
          <input required name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder="Street" />
          <input required name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="City" />
          <input required name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder="State" />
          <input required name="zipcode" onChange={onChangeHandler} value={data.zipcode} type="text" placeholder="Zip code" />
          <input required name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder="Country" />
          <input required name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder="Phone" />

          <div className="payment-method">
            <p className="title">Payment Method</p>
            <label>
              <div className="payment">
                <input
                type="radio"
                name="paymentMethod"
                value="chapa"
                checked={paymentMethod === 'chapa'}
                onChange={() => setPaymentMethod('chapa')}
              />
              <img
                className="payment-method-image"
                src="images/chapa.jpg"
              />
              </div>
              
            </label>
            <label>
            <div className="payment">
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={() => setPaymentMethod('paypal')}
              />
              <img
                className="payment-method-image"
                src="images/paypal.png"
              />
              </div>
            </label>
          </div>
        </div>

        <div className="place-order-right">
          <div className="title">Your Order</div>
          <div className="orders-grid">
            <div className="order-header">
              <div className="order-total">
                Total Amount: ${orderTotal.toFixed(2)}
              </div>
              <p>Delivery ID: {deliveryId}</p>
            </div>
            <div className="order-summary">
              {cart?.map((item) => (
                <div key={item.productId} className="cart-item-container">
                  <div className="delivery-date">
                    {selectedDelivery[item.productId]
                      ? `Delivery: ${dayjs()
                          .add(
                            item.deliveryOptions?.find((opt) => opt.id === selectedDelivery[item.productId])?.deliveryDays,
                            'day'
                          )
                          .format('dddd, MMMM D')}`
                      : 'No delivery selected'}
                  </div>
                  <img
                    className="product-image"
                    src={`https://nodjs-49td.onrender.com/images/${products.find((p) => p._id === item.productId)?.image}`}
                    alt={products.find((p) => p._id === item.productId)?.name}
                  />
                  <div className="cart-item-details">
                    <div className="product-name">{products.find((p) => p._id === item.productId)?.name}</div>
                    <div className="product-price">${(products.find((p) => p._id === item.productId)?.priceCents / 100).toFixed(2)}</div>
                    <div className="product-quantity">Quantity: {item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="button" type="submit" disabled={isLoading}>
            {isLoading ? (
              <div className="loading">
              <div className="spinner"></div>
              <p>Procesing to Payment</p>
              </div>
            ) : (
              'click to checkout'
            )}
          </button>
        </div>
      </form>

      
    </>
  );
};

export default PlaceOrder;

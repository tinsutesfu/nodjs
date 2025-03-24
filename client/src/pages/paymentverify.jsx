// src/pages/OrderSuccess.js
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get("userId");

  return (
    <div style={{ marginTop: '100px', textAlign: 'center' }}>
      <h2>Payment Successful!</h2>
      <p>Your order is being processed. Redirecting to tracking page...</p>
      <button style={{ margin: '20px',padding:'20px',borderRadius:'10px' }} onClick={() => navigate(`/tracking`)}>
        go to tracking
      </button>
    </div>
  );
};

export default OrderSuccess;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaypalCancel = () => {
   const  navigate=useNavigate()
    useEffect(() => {
      alert('Payment cancelled');
      navigate('/orders');
    }, []);
    return <div>Payment cancelled...</div>;
  };
  export default PaypalCancel
import { useContext, useEffect, useState } from "react";
import "../styles/pages/tracking.css";

import axios from "../api/axios";
import useAxiosPrivate from "../hooks/useaxiosprivate";
import useAuth from "../hooks/authuse";

const Tracking = () => {
  const { auth } = useAuth();
  const [data, setdata] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const [trackLoading, settrackLoading] = useState(true);
  const fetchorder = async () => {
    settrackLoading(true);
    const response = await axiosPrivate.get(
      "/routes/place/userorder",
      
      
    );
    setdata(response.data.data);
    console.log(response.data);
    settrackLoading(false);
  };

  useEffect(() => {
    
      fetchorder();
    
  }, []);
  return (
    <>
      <div className="my-orders">
        <h2>my orders</h2>
        { (trackLoading) ?
   (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
      <p>Loading order list...</p>
    </div>
  ) : 
        <div className="container">
          {data.map((order, index) => {
            return (
              <div key={index} className="myorders-order">
                <img src="images/lap.del.jpg" />
                <p>
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return item.name + "x" + item.quantity;
                    } else {
                      return item.name + "x" + item.quantity + ",";
                    }
                  })}
                </p>
                <p>{order.totalAmount.toFixed(2)}</p>
                <p>items:{order.items.length}</p>
                <p>
                  <span>&#x25cf;</span>deliveryID:{order.deliveryId}
                </p>
                
                <p>
                  <span>&#x25cf;</span>
                  {order.status}
                </p>
                <button onClick={fetchorder}>track order</button>
              </div>
            );
          })}
        </div>
        }
      </div>
    </>
  );
};

export default Tracking;
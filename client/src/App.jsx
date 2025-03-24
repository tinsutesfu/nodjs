import Register from "./component/register";
import Login from "./component/login";

import Layout from "./pages/layout";

import Missing from "./component/missing";
import Unauthorized from "./component/unauthorized";

import RequireAuth from "./component/requireauth";
import { Routes, Route } from "react-router-dom";
import Amazon from "./pages/products";
import Header from "./pages/header";

import ResetPassword from "./component/passwordrecovery";
import RequestResetPassword from "./component/resetpassword";
import Cart from "./pages/cart";
import Orders from "./pages/orders";
import Tracking from "./pages/tracking";

import PersistLogin from "./component/persistlogin";
import PaymentStatus from "./pages/paymentverify";
import useAuth from "./hooks/authuse";
import { useEffect, useState } from "react";
import OrderSuccess from "./pages/orderseccess";
import OrderError from "./pages/ordererror";
import PaypalCancel from "./pages/cancel";


const ROLES = {
  User: 2001,
  Editor: 1984,
  Admin: 5150,
};

function App() {
  const { products } = useAuth();
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const filteredResults = products.filter((product) =>
      ((product.name).toLowerCase()).includes(search.toLowerCase()));

    setSearchResults(filteredResults);
  }, [products, search]);
  return (
    <Routes>
      <Route path="/" element={<Layout search={search} setSearch={setSearch}/>}>
        {/* public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/request-reset-password"
          element={<RequestResetPassword />}
        /> 
        
        <Route path="/unauthorized" element={<Unauthorized />} />
        

        <Route index element={<Header />} />

        {/* we want to protect these routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
            
           
            
            <Route path="/amazon" element={<Amazon products={searchResults}/>} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment-status" element={<PaymentStatus />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/paypal-return" element={<OrderSuccess />} />
            <Route path="/error" element={<OrderError />} />
            <Route path="/paypal-cancel" element={<PaypalCancel />} />
            <Route path="/tracking" element={<Tracking />} />
          </Route>

          

         

          
        </Route>
        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;

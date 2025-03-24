import "../styles/pages/products.css";
import useAuth from "../hooks/authuse";
import { Productcard } from "./productcard";
import { useState, useEffect } from "react";

const Amazon = ({ products }) => {
  const [loading, setLoading] = useState(true);

  // Simulate loading delay or wait for products to mount
  useEffect(() => {
    if (products && products.length >= 0) {
      // Assuming products prop is ready when it’s defined (even if empty)
      setLoading(false);
    }
  }, [products]);

  return (
    <>
      <div className="main">
        {loading ? (
          <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : (
          <div className="products-grid">
            {products?.map((product) => (
              <Productcard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Amazon;
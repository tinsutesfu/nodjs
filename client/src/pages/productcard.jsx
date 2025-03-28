import "../styles/pages/products.css";
import axios from "../api/axios";

import {  useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rating } from "@mui/material";
import useAuth from "../hooks/authuse";
import useAxiosPrivate from "../hooks/useaxiosprivate";

export const Productcard = ({product}) => {
  const [ratingValue, setRatingValue] = useState(product.rating || 0);
  const [hasRated, setHasRated] = useState(false);
  
  

  const axiosPrivate = useAxiosPrivate();
    const { cart, setCart,auth } = useAuth();
    const navigate = useNavigate();
    const userId = auth?.id; // Retrieve userId from auth context
    let timeoutId;
  
    const displaymessage = (productId) => {
      const addedToCartElement = document.querySelector(
        `.added-to-cart[data-product-id="${productId}"]`
      );
  
      addedToCartElement.style.opacity = 1;
  
      clearTimeout(timeoutId);
  
      timeoutId = setTimeout(() => {
        addedToCartElement.style.opacity = 0;
      }, 2000);
    };
  
    useEffect(() => {
      if (!auth.id) {
        navigate("/login");
      } else {
        navigate("/amazon");
      }
    }, [auth.id]);
  
    const handleAddToCart = async (productId) => {
      try {
          // Make a request to add the product to the cart
          const response = await axiosPrivate.post("/routes/cart/add", { productId });
  
          // If product already exists in the cart, update the quantity
          const matchingItem = cart.find((item) => item.productId === productId);
          if (matchingItem) {
              setCart(
                  cart.map((item) =>
                      item.productId === productId
                          ? { ...item, quantity: item.quantity + 1 }
                          : item
                  )
              );
          } else {
              // Add new item with delivery options
              setCart([
                  ...cart,
                  {
                      productId,
                      quantity: 1,
                      deliveryOptions: response.data.deliveryOptions,
                  },
              ]);
          }
      } catch (error) {
          console.error('Error adding to cart:', error);
      }
      displaymessage(productId)
  };


    

    useEffect(() => {
        // Check if the user has already rated this product
        if (product.ratings) {
            const userRating = product.ratings.find(r => r.userId === userId);
            if (userRating) {
                setHasRated(true);
                setRatingValue(userRating.rating);
            }
        }
    }, [product.ratings, userId]);

    const handleRating = async (newValue) => {
        if (!userId) {
            alert('You must be logged in to rate a product.');
            return;
        }

        try {
            const response = await axios.put(`/routes/product/rate/${product._id}`, {
                userId,
                rating: newValue
            });

            setHasRated(true);
            setRatingValue(newValue);
            console.log(response.data.message);
        } catch (error) {
            console.error('Error adding rating:', error);
            if (error.response && error.response.status === 400) {
                alert(error.response.data.message);
            }
        }
    };
  return (
    <>
    <div className="product-container">
    <div className="product-image-container">
      <img
        className="product-image"
       src={'https://nodjs-49td.onrender.com/images/' + product.image}
        alt={product.image}
      />
    </div>

    <div className="product-name">
      <span className="product-name-text" title={product.name}>
        {product.name.length <= 25
          ? product.name
          : `${product.name.slice(0, 25)}...`}
      </span>
    </div>

    <div className="product-rating-container">
    <Rating
                name={`product-rating-${product._id}`}
                value={ratingValue}
                onChange={(event, newValue) => {
                    if (!userId) {
                        alert('You must be logged in to rate a product.');
                        return;
                    }
                    if (!hasRated) {
                        handleRating(newValue);
                    } else {
                        alert('You have already rated this product.');
                    }
                }}
            />
            <p>Rating: {product.rating.toFixed(1)} (Based on {product.numOfRatings} reviews)</p>
    </div>

    <div className="product-price">
      ${(product.priceCents / 100).toFixed(2)}
    </div>

    <div className="product-spacer"></div>

    <div className="added-to-cart" data-product-id={product._id}>
      <img src="images/icons/checkmark.png" alt="Added" />
      Added
    </div>

    <button
      className="add-to-cart-button button-primary "
      onClick={() => handleAddToCart(product._id)}
    >
      Add to Cart
    </button>
  </div></>
  )
}

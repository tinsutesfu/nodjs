import { createContext, useEffect, useState } from "react";
import axios from "../api/axios";
import useAxiosPrivate from "../hooks/useaxiosprivate";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false);
    const [cart, setCart] = useState([]);
const axiosPrivate=useAxiosPrivate();
    const [cartQuantity, setCartQuantity] = useState(0);
    const [productLoading, setproductLoading] = useState(true);
    
    const [products, setProducts] = useState([]);
    
    
    useEffect(()=>{
       const fetchproduct = async () => {
      try {
        setproductLoading(true)
        const response = await axios.get('/routes/product/list' );
        
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }finally {
        setproductLoading(false); // End loading
      }
    };
    fetchproduct()
    },[]) 
  
    
  
    
  
    const updatequantity = () => {
      useEffect(() => {
        // Update cart quantity when cart items change
        const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
        setCartQuantity(totalQuantity);
      }, [cart]);
    };
  
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
  };
  
  
    

    return (
        <AuthContext.Provider value={{  auth,
            setAuth,
            cart,
            cartQuantity,
            handleAddToCart,
            setCartQuantity,
            setCart,
    products,
            updatequantity,persist,setPersist,productLoading
             }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
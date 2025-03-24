import User from '../models/user.js';

const addtocart=async(req,res)=>{
    try {
      console.log('User ID:', req.user);
        let userdata=await User.findById(req.user);
        if (!userdata) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }
        let cartdata=userdata.cartdata ||{};
        if (!cartdata[req.body.productId]) {
            cartdata[req.body.productId]=1;
        } else {
            cartdata[req.body.productId]+=1;
        }

        const deliveryOptions = [
            {
              id: "1",
              deliveryDays: 7,
              priceCents: 0,
            },
            {
              id: "2",
              deliveryDays: 3,
              priceCents: 600,
            },
            {
              id: "3",
              deliveryDays: 1,
              priceCents: 1297,
            },
          ];
        await User.findByIdAndUpdate(req.user,{cartdata});
        res.json({ success: true, message: 'Added to cart', deliveryOptions });
    } catch (error) {
        console.log(error);
        res.json({success:false,message:'error'})
    }
}


const removecart = async (req, res) => {
  try {
      let userdata = await User.findById(req.user);
      let cartdata = userdata.cartdata;
      if (cartdata[req.body.productId] > 0) {
          cartdata[req.body.productId] -= 1; // Decrement product quantity
      }
      if (cartdata[req.body.productId] === 0) {
          delete cartdata[req.body.productId]; // Remove product if quantity is 0
      }
      await User.findByIdAndUpdate(req.user, { cartdata });
      res.json({ success: true, message: 'Removed from cart' });
  } catch (error) {
      console.log(error);
      res.json({ success: false, message: 'Error removing from cart' });
  }
};

const getcart = async (req, res) => {
  try {
      let userdata = await User.findById(req.user);
      let cartdata = userdata.cartdata || {}; // Default to empty cart if no data

      // Fetch delivery options
      const deliveryOptions = [
          { id: "1", deliveryDays: 7, priceCents: 0 },
          { id: "2", deliveryDays: 3, priceCents: 600 },
          { id: "3", deliveryDays: 1, priceCents: 1297 }
      ];

      // Format cart data
      const cartArray = Object.keys(cartdata).map((productId) => ({
          productId: productId,
          quantity: cartdata[productId],
          deliveryOptions: deliveryOptions
      }));

      res.json({ success: true, cartdata: cartArray });
       
  } catch (error) {
      console.log(error);
      res.json({ success: false, message: 'Error fetching cart data' });
  }
}

export {addtocart,removecart,getcart};
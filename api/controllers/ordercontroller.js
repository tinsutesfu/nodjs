import Order from '../models/orders.js'; // Import the order model
import User from "../models/user.js";









 const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
};



// Get order by ID
export const getOrderById = async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user; // Assuming auth middleware sets req.user

  try {
    // Find the order by ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if the authenticated user owns the order
    if (order.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    // Return order details
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Server error' });
  }
};





const listorder=async(req,res)=>{
try {
  const orders=await Order.find({});
  res.json({success:true,data:orders})
} catch (error) {
  console.error(error);
  res.json({ success: false, message: 'Error' });
}
}

const orderstatus=async(req,res)=>{
  try {
    await Order.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
    res.json({success:true,message:'status updated'})
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Error' });
  }
}




 const getOrderByTxRef = async (req, res) => {
  try {
    const { tx_ref } = req.params;

    // Validate tx_ref format
    if (!/^chapa-[a-f0-9]{8}-/.test(tx_ref)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid transaction reference' 
      });
    }

    // Find order in database
    const order = await Order.findOne({ tx_ref })
      .select('payment status items amount deliveryId')
      .lean();

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    res.json({
      success: true,
      payment: order.payment,
      status: order.status,
      order
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching order details' 
    });
  }
};

export { getUserOrders,listorder ,orderstatus,getOrderByTxRef};
import paypal from "../utils/paypal.js";
import Order from "../models/orders.js";
//import Cart from "../models/cart.js";
import User from "../models/user.js";
import Product from "../models/products.js";


const createOrder = async (req, res) => {
  try {
    const {
      items,
      address,
      orderStatus,
      paymentMethod,
      paymentStatus,
      amount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
    } = req.body;

    const userId = req.user;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required and must not be empty',
      });
    }
    if (!address || typeof address !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Address object is required',
      });
    }
    if (!amount || isNaN(amount)) {
      return res.status(400).json({
        success: false,
        message: 'Total amount is required and must be a number',
      });
    }

    // Validate items structure
    for (const item of items) {
      if (!item.name || !item.productId || !item.priceCents || !item.quantity || !item.currency) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have name, productId, price, currency, and quantity',
        });
      }
    }

    const create_payment_json = {
      intent: 'sale',
      payer: { payment_method: 'paypal' },
      redirect_urls: {
        return_url: 'http://localhost:5173/paypal-return',
        cancel_url: 'http://localhost:5173/paypal-cancel',
      },
      transactions: [
        {
          item_list: {
            items: items.map((item) => ({
              name: item.name,
              productId: item.productId,
              price: (item.priceCents/100).toString(),
              currency: 'USD',
              quantity: item.quantity.toString(),
            })),
          },
          amount: {
            currency: 'USD',
            total: totalAmount.toString(),
          },
          description: 'Order payment',
        },
      ],
    };

    console.log('PayPal Request Payload:', JSON.stringify(create_payment_json, null, 2));

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.error('PayPal API Error:', JSON.stringify(error, null, 2));
        return res.status(500).json({
          success: false,
          message: 'Error while creating PayPal payment',
          error: error.response?.message || error.message,
        });
      } else {
        const newlyCreatedOrder = new Order({
          userId,
          items,
          address,
          orderStatus,
          paymentMethod,
          paymentStatus,
          totalAmount,
          orderDate,
          orderUpdateDate,
          paymentId,
          payerId,
          tx_ref: `paypal-${Date.now()}`,
          deliveryId: `del-${Date.now()}`,
        });

        await newlyCreatedOrder.save();

        const approvalURL = paymentInfo.links.find(
          (link) => link.rel === 'approval_url'
        ).href;

        res.status(201).json({
          success: true,
          approvalURL,
          orderId: newlyCreatedOrder._id,
        });
      }
    });
  } catch (e) {
    console.error('Create Order Error:', e);
    res.status(400).json({
      success: false,
      message: 'Invalid request data',
      error: e.message,
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

   
    //const getCartId = order.cartId;
    const userId=req.user
    await User.findByIdAndUpdate(userId, { cartdata: {} });

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

export { createOrder, capturePayment, getAllOrdersByUser, getOrderDetails };
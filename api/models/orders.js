import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    // price removed
  }],
  address: {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
  },
  totalAmount: { type: Number, required: true }, // From req.body, includes tax/shipping
  paymentMethod: { type: String, required: true, enum: ['chapa', 'paypal'] },
  paymentStatus: { type: String, default: 'pending', enum: ['pending', 'paid', 'failed'] },
  orderStatus: { type: String, default: 'pending', enum: ['pending', 'confirmed', 'cancelled'] },
  transactionId: { type: String, required: true, unique: true },
  status:{type:String,default:'order processing'},
  deliveryId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

orderSchema.index({ transactionId: 1 });

export default mongoose.model('Order', orderSchema);
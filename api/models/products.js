import mongoose from 'mongoose';



const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    priceCents: { type: Number, required: true },
    image: { type: String, required: true }, // URL for the uploaded image
    rating: {
        type: Number,
        default: 0
    },
    numOfRatings: {
        type: Number,
        default: 0
    },
    ratings: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number }
    }]
});


export default mongoose.model('Product', productSchema);
import Product from '../models/products.js';
import fs from "fs";

const addProduct = async (req, res) => {
    try {
        let image_filename = `${req.file.filename}`;
        const { name, priceCents } = req.body;
        if (!req.file) return res.status(400).json({ message: "No image uploaded" });
        
        const product = new Product({
            name,
            priceCents,
         image: image_filename
        });

        await product.save();
        res.status(201).json({ message: "Product added successfully", product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Rating logic
// In productController.js
const rateProduct = async (req, res) => {
    const { userId, rating } = req.body; // Ensure rating and userId are in the request body
    const productId = req.params.productId;

    if (!userId || !rating) {
        return res.status(400).json({ message: "User ID and rating are required" });
    }

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if user has already rated the product
        const alreadyRated = product.ratings.some(rate => rate.userId.toString() === userId);
        if (alreadyRated) {
            return res.status(400).json({ message: "User has already rated this product" });
        }

        // Update the product rating
        product.ratings.push({ userId, rating });
        product.numOfRatings = product.ratings.length;
        product.rating = product.ratings.reduce((acc, rate) => acc + rate.rating, 0) / product.numOfRatings;

        await product.save();
        res.status(200).json({ message: "Rating added successfully", product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find(); // Fetch all products
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeit = async (req, res) => {
    try {
      const it = await Product.findById(req.body.id);
      fs.unlink(`uploads/${it.image}`, () => {});
      await Product.findByIdAndDelete(req.body.id);
      res.json({ success: true, message: "it removed" });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: "error" });
    }
  };
  

export{ addProduct, rateProduct,getAllProducts,removeit };

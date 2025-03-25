import express from "express";
import dotenv from "dotenv";
import path from "path";
import { connect } from "./config/db.js";

import authroute from './routes/auth.js';
import refreshroute from './routes/refresh.js';
import logoutroute from './routes/logout.js';
import userroute from './routes/users.js';
import productroute from './routes/productroute.js';
import cartroute from './routes/cartroute.js';
import cookieParser from "cookie-parser";
import cors from "cors";
import corsOptions from "./config/corsoption.js";
import credentials from "./middleware/credentials.js";
import verifyJWT from "./middleware/verifyjwt.js";

import orderrouter from "./routes/orderroute.js";
import verifyrouter from "./routes/payentroute.js"; // Check your import path here

const app = express();

dotenv.config();

// Middleware
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// API routes
app.use('/routes/product', productroute);
app.use("/images", express.static("uploads"));

app.use('/routes/auth', authroute);
app.use('/routes/refresh', refreshroute);
app.use('/routes/logout', logoutroute);

app.use("/routes/payment", verifyrouter);
app.use(verifyJWT);

app.use('/routes/users', userroute);
app.use('/routes/cart', cartroute);
app.use("/routes/place", orderrouter);

// Serve static files from React frontend
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'client/.dust'))); // Adjust the folder if necessary

// Catch-all route to serve React's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/.dust', 'index.html')); // Ensure the correct path to index.html
});

// Start the server
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
    connect();
    console.log(`Server running on port ${PORT}`);
});

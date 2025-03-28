import express from "express";
import dotenv from "dotenv";
import { connect } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// Route imports
import authroute from './routes/auth.js';
import refreshroute from './routes/refresh.js';
import logoutroute from './routes/logout.js';
import userroute from './routes/users.js';
import productroute from './routes/productroute.js';
import cartroute from './routes/cartroute.js';
import orderrouter from './routes/orderroute.js';
import verifyrouter from './routes/payentroute.js'; // Note: possible typo 'payentroute' instead of 'paymentroute'

// Middleware imports
import corsOptions from "./config/corsoption.js";
import credentials from "./middleware/credentials.js";
import verifyJWT from "./middleware/verifyjwt.js";

const app = express();

// Load environment variables
dotenv.config();
app.use("/images", express.static("uploads"));
// Middleware setup
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Static files


// Routes
app.use('/routes/auth', authroute);
app.use('/routes/refresh', refreshroute);
app.use('/routes/logout', logoutroute);
app.use('/routes/product', productroute);
app.use('/routes/payment', verifyrouter);

// Protected routes (after verifyJWT middleware)
app.use(verifyJWT);
app.use('/routes/users', userroute);
app.use('/routes/cart', cartroute);
app.use('/routes/place', orderrouter);

// Server startup
app.listen(process.env.PORT || 3500, () => {
    connect();
    console.log("Connected to backend.");
});
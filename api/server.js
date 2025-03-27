import express from "express";
import dotenv from "dotenv";
import { connect } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authroute from './routes/auth.js';
import refreshroute from './routes/refresh.js';
import logoutroute from './routes/logout.js';
import userroute from './routes/users.js';
import productroute from './routes/productroute.js';
import cartroute from './routes/cartroute.js';
import orderrouter from './routes/orderroute.js';
import verifyrouter from './routes/payentroute.js';

import corsOptions from "./config/corsoption.js";
import credentials from "./middleware/credentials.js";
import verifyJWT from "./middleware/verifyjwt.js";

const app = express();
dotenv.config();

const __dirname = path.resolve();
const clientDistPath = path.join(__dirname, "../client/dist");

// Core middleware
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Serve static files first
app.use(express.static(clientDistPath));
app.use("/images", express.static("uploads"));

// Public API Routes
app.use('/routes/auth', authroute);
app.use('/routes/refresh', refreshroute);
app.use('/routes/logout', logoutroute);
app.use('/routes/product', productroute);
app.use('/routes/payment', verifyrouter);

// Apply credentials before protected routes
app.use(credentials);
app.use(verifyJWT);
app.use('/routes/users', userroute);
app.use('/routes/cart', cartroute);
app.use('/routes/place', orderrouter);

// Catch-all for client-side routes
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

app.listen(process.env.PORT || 3500, () => {
  connect();
  console.log("Connected to backend.");
});
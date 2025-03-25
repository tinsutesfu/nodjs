import express from "express";
import dotenv from "dotenv";
import { connect } from "./config/db.js";

import authroute from './routes/auth.js'
import refreshroute from './routes/refresh.js'
import logoutroute from './routes/logout.js'
import userroute from './routes/users.js';
import productroute from './routes/productroute.js'
import cartroute from './routes/cartroute.js'
import cookieParser from "cookie-parser";
import cors from "cors";
import corsOptions from "./config/corsoption.js";
import credentials from "./middleware/credentials.js";
import verifyJWT from "./middleware/verifyjwt.js";

import orderrouter from "./routes/orderroute.js";
//import verifyrouter from "./routes/payment/paymentroute.js";
import verifyrouter from "./routes/payentroute.js";








const app = express();

dotenv.config();


app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files


//admin endpoints
app.use('/routes/product',productroute)
app.use("/images", express.static("uploads"));


app.use('/routes/auth',authroute);
app.use('/routes/refresh',refreshroute);
app.use('/routes/logout',logoutroute);


app.use("/routes/payment", verifyrouter);
app.use(verifyJWT);


app.use('/routes/users',userroute)
app.use('/routes/cart',cartroute)
app.use("/routes/place", orderrouter);




app.listen( process.env.PORT || 3500, () => {
    connect()
    console.log("Connected to backend.");
  });

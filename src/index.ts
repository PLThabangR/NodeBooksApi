import express,{ Express } from "express";
import cors from 'cors';

//importing routes
import  authRoute from "./controller/authController";
import dasboardRoute from "./controller/dashboradController";
import  cropaiRoute from "./controller/cropaiController";
import alertRoute from "./controller/alertController";
import  marketRoute from "./controller/marketController";
import plannerRoute  from "./controller/plannerController";
import   analyticsController from "./controller/analyticsController";


//importing middlewares
import { logger } from "./middleware/logger";
import bodyParser from "body-parser";
import { notFoundErrorHandler } from "./middleware/error";
import connectDB from "./config/db";

//Importing 
import dotenv from 'dotenv';

//create express app instance
const app:Express = express();

// ==========================================
// Middlewares
// ==========================================
//Dotenv
dotenv.config()
//middleware to allow json
app.use(express.json());
//middleware to parse json body 
app.use(bodyParser.json());
//middleware to log requests
app.use(logger);


// ==========================================
// Routes
// ==========================================
app.use('/api/auth',authRoute);
app.use('/api/dashborad',dasboardRoute);
app.use('/api/cropai',cropaiRoute);
app.use('/api/alert',alertRoute);
app.use('/api/market',marketRoute);
app.use('/api/planner',plannerRoute);
app.use('/api/analytics',analyticsController);

///middlewarre to handle 404
app.use(notFoundErrorHandler);
const PORT = process.env.PORT || 3000;
//start server
app.listen(PORT, () => console.log(`HarvestAI Server started on port ${PORT}`));


//Connect to DB
connectDB()
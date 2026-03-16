import exp from "express";
import cors from "cors";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";

config();

//create server-app
const app = exp();

//add cors
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

//add middlewares
app.use(exp.json());
app.use(cookieParser());

//connect apis

//connect to DB
connectDB();

//start the server
app.listen(process.env.PORT, () => {
  console.log(`App Listening to the port ${process.env.PORT}`);
});

//identifying invalid path
app.use((req, res, next) => {
  // console.log(req.url);
  res.json({ message: `${req.url} is a Invalid path` });
});

//error handling middleware

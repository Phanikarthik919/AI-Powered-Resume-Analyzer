import exp from "express";
import cors from "cors";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import userApp from "./APIs/UserAPI.js";
import { commonRoute } from "./APIs/CommonAPI.js";

config();

//create server-app
const app = exp();

//add cors
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

//add middlewares
app.use(exp.json());
app.use(cookieParser());

//connect apis
app.use("/api/user-api", userApp);
app.use("/api/common-api", commonRoute);

//connect to DB
connectDB();

//start the server
app.listen(process.env.PORT, () => {
  console.log(`App Listening to the port ${process.env.PORT}`);
});

//identifying invalid path
app.use((req, res, next) => {
  res.status(404).json({
    message: `${req.url} is an invalid path`,
  });
});

//error handling middleware
app.use((err, req, res, next) => {
  console.log("Error name:", err.name);
  console.log("Error code:", err.code);
  console.log("Full error:", err);

  // mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // mongoose cast error
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`,
    });
  }

  if (err.status) {
    return res.status(err.status).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // default server error
  res.status(500).json({
    message: "error occurred",
    error: "Server side error",
  });
});

import { connect } from "mongoose";

export const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI);

    console.log("Database connection successful");
  } catch (err) {
    console.log("Database connection failed");
    console.error(err.message);

    process.exit(1);
  }
};

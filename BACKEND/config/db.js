import { connect } from "mongoose";

export const connectDB = async () => {
  try {
    await connect(process.env.DB_URL);
    console.log("DataBase connection Successful");
  } catch (err) {
    console.log("Error occured while connecting to database");
    process.exit(1);
  }
};

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/UserSchema.js";
import { config } from "dotenv";
config();

//authenticate function
export const authenticate = async ({ email, password }) => {
  //check user with email & role
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error("Invalid email");
    err.status = 401;
    throw err;
  }
  //if user valid ,but blocked by admin

  //compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Invalid password");
    err.status = 401;
    throw err;
  }
  //check isACtive state
  // if (user?.isActive === false) {
  //   const err = new Error("Your account blocked. Plz contact Admin");
  //   err.status = 403;
  //   throw err;
  // }

  //generate token
  const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });

  const userObj = user.toObject();
  delete userObj.password;

  return { token, user: userObj };
};

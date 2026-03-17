import exp from "express";
import { authenticate } from "../services/authService.js";
import { User } from "../models/UserSchema.js";
import { hash, compare } from "bcryptjs";
import { verifyToken } from "../middlewares/verifyToken.js";

export const commonRoute = exp.Router();

//login Route (common for User,Author,Admin)
commonRoute.post("/login", async (req, res) => {
  try {
    console.log("entered login");
    //get userCred Object
    let userCred = req.body;
    //call authenticate service
    let { token, user } = await authenticate(userCred);
    //save token as httpOnlyCookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });
    //send res
    return res.status(200).json({ message: "Login Successful", payload: user });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

//logout Route (common for User,Author,Admin)
commonRoute.post("/logout", async (req, res) => {
  // Clear the cookie named 'token'
  res.clearCookie("token", {
    httpOnly: true, // Must match original  settings
    secure: false, // Must match original  settings
    sameSite: "lax", // Must match original  settings
  });
  res.status(200).json({ message: "Logged out Successfully" });
});

//Change password
commonRoute.put("/change-password", verifyToken, async (req, res) => {
  //get current password and new password
  let reqBody = req.body;
  const currPassword = reqBody.currentPassword;
  const newPassword = reqBody.newPassword;
  const confirmNewPassword = reqBody.confirmNewPassword;
  const email = req.user.email;
  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: "new pass and confirm pass not matched" });
  }
  //check the current password is correct or not
  //get the user document with the email
  let userDoc = await User.findOne({ email: email });
  if (!userDoc) {
    return res.status(401).json({ message: "Invalid email" });
  }
  let actualPassword = userDoc.password;
  const isMatch = await compare(currPassword, actualPassword);
  if (!isMatch) {
    return res.status(401).json({ message: "Current password is Invalid" });
  }
  userDoc.password = newPassword;
  userDoc.validate();
  //hash the new password
  const hashedPassword = await hash(newPassword, 10);
  //replace current password with new password
  userDoc.password = hashedPassword;
  //save it to DB
  await userDoc.save();
  //send response
  res.status(200).json({ message: "password Updated" });
});

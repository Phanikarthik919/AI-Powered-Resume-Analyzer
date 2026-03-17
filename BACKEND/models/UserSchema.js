import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "" }, // For Navbar/Profile component
  },
  { timestamps: true },
);

export const User = mongoose.model("user", userSchema);

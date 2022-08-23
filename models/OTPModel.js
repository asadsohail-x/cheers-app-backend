import mongoose from "mongoose";
const { Schema, model } = mongoose;

const OTPSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    OTP: {
      type: Number,
      required: [true, "OTP is required"],
    },
    expiresIn: {
      type: Number,
      default: 1.00,
    },
  },
  {
    timestamps: true,
  }
);

export default model("OTPs", OTPSchema);

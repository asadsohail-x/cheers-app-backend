import mongoose from "mongoose";
const { Schema, model } = mongoose;

export default model(
  "Admins",
  new Schema(
    {
      name: {
        type: String,
        required: [true, "Name is required"],
      },
      email: {
        type: String,
        required: [true, "Email is required"],
      },
      password: {
        type: String,
        required: [true, "Password is required"],
      },
    },
    { timestamps: true }
  )
);

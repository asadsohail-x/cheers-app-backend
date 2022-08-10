import mongoose from "mongoose";
const { Schema, model } = mongoose;

export default model(
  "Timespans",
  new Schema(
    {
      unit: {
        type: String,
        required: [true, "Unit is required"],
      },
      duration: {
        type: Number,
        required: [true, "Duration is required"],
      },
    },
    { timestamps: true }
  )
);

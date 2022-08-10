import mongoose from "mongoose";
const { Schema, model } = mongoose;

export default model(
  "FilterPreferences",
  new Schema(
    {
      radius: {
        type: Number,
        default: 6,
      },
      filterLimit: {
        type: Number,
        default: 10,
      },
    },
    { timestamps: true }
  )
);

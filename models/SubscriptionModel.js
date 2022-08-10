import mongoose from "mongoose";

const { Schema, Types, model } = mongoose;

export default model(
  "Subscriptions",
  new Schema(
    {
      planId: {
        type: Types.ObjectId,
        required: [true, "Plan is required"],
      },
      userId: {
        type: Types.ObjectId,
        required: [true, "User is required"],
      },
      startTime: {
        type: Date,
        required: [true, "Start time is required"],
      },
      endTime: {
        type: Date,
        required: [true, "End time is required"],
      },
    },
    { timestamps: true }
  )
);

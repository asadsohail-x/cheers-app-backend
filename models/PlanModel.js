import mongoose from "mongoose";
const { Schema, Types, model } = mongoose;

export default model(
  "Plans",
  new Schema(
    {
      timespanId: {
        type: Types.ObjectId,
        required: [true, "Timespan is required"],
      },
      cost: {
        type: Number,
        required: [true, "Cost is required"],
      },
      discount: {
        type: Number,
        required: false,
      },
      isDisabled: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  )
);

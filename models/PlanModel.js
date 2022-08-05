const mongoose = require("mongoose");

const timespanSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Types.ObjectId,
      required: [true, "Plan Timespan Id is required"],
    },
    value: {
      type: Number,
      required: [true, "Plan Timespan Value is required"],
    },
  },
  { _id: false }
);

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Plan Name is required"],
      unique: true,
    },
    price: {
      type: Number,
      required: [true, "Plan Price is required"],
    },
    discount: {
      type: Number,
      required: false,
    },
    name: {
      type: String,
      required: [true, "Profession Name is required"],
      unique: true,
    },
    timespan: {
      type: timespanSchema,
      required: [true, "Plan Timespan is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Plans = mongoose.model("Plans", planSchema);

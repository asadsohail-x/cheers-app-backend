const mongoose = require("mongoose");

const timespanTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Timespan Type Name is required"],
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = TimespanType = mongoose.model(
  "TimespanTypes",
  timespanTypeSchema
);

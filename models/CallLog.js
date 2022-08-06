const { Schema, Types, model } = require("mongoose");

module.exports = model(
  "CallLogs",
  new Schema(
    {
      callerId: {
        type: Types.ObjectId,
        required: [true, "Caller Id is required"],
      },
      receiverId: {
        type: Types.ObjectId,
        required: [true, "Receiver `Id is required"],
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

const { Schema, model } = require("mongoose");

module.exports = model(
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

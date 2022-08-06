const { Schema, Model } = require("mongoose");

module.exports = FilterPrefs = Model(
  new Schema({
    radius: {
      type: Number,
      required: [true, "Search Radius is required"],
    },
  })
);

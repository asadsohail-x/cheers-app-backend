const mongoose = require("mongoose");

const genderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Gender Name is required"],
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Genders = mongoose.model("Genders", genderSchema);

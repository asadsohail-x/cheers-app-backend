const mongoose = require("mongoose");

const professionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Profession Name is required"],
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Professions = mongoose.model("Professions", professionSchema);

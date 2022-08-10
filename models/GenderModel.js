import mongoose from "mongoose";
const { Schema, model } = mongoose;

const genderSchema = new Schema(
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

export default model("Genders", genderSchema);

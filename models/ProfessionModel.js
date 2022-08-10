import mongoose from "mongoose";
const { Schema, model } = mongoose;

const professionSchema = new Schema(
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

export default model("Professions", professionSchema);

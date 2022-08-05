const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    pfp: {
      type: String,
      required: [true, "Profile Picture is required"],
    },
    genderId: {
      type: mongoose.Types.ObjectId,
      required: [true, "Gender is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    username: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    DOB: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    location: {
      type: { type: String, default: "Point" },
      coordinates: [],
      required: false,
    },
    bio: {
      type: String,
      required: [true, "Bio is required"],
    },
    age: {
      type: String,
      required: [true, "Age is required"],
    },
    professionId: {
      type: mongoose.Types.ObjectId,
      required: false,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Users = mongoose.model("Users", userSchema);

const mongoose = require("mongoose");

const swipeSchema = new mongoose.Schema(
  {
    swiperId: {
      type: mongoose.Types.ObjectId,
      required: [true, "Swiper User Id is required"],
    },
    swipedId: {
      type: mongoose.Types.ObjectId,
      required: [true, "Swiped User Id is required"],
    },
    swipeType: {
      type: Boolean,
      required: [true, "Swipe Type is required"],
    },
  },
  { timestamps: true }
);

module.exports = Swipes = mongoose.model("Swipes", swipeSchema);

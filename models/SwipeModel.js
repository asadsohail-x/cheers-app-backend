import mongoose from "mongoose";
import paginate from "mongoose-aggregate-paginate-v2";

const { Schema, Types, model } = mongoose;
const swipeSchema = new Schema(
  {
    swiperId: {
      type: Types.ObjectId,
      required: [true, "Swiper User Id is required"],
    },
    swipedId: {
      type: Types.ObjectId,
      required: [true, "Swiped User Id is required"],
    },
    swipeType: {
      type: Boolean,
      required: [true, "Swipe Type is required"],
    },
  },
  { timestamps: true }
);

swipeSchema.plugin(paginate);

export default model("Swipes", swipeSchema);

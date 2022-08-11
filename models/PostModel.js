import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

export default model(
  "Posts",
  new Schema(
    {
      userId: {
        type: Types.ObjectId,
        required: [true, "User is required"],
      },
      media: {
        type: [{ type: String }],
        required: [true, "Post Media is required"],
      },
      description: {
        type: String,
        required: false,
      },
      isArchived: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  )
);

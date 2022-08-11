import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const mediaLimit = (c) => c > 0 && c < 9;

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
        validate: [
          mediaLimit,
          "Post Media must be more than 0 and less than 9",
        ],
        required: [true, "Post Media is required"],
      },
      description: {
        type: String,
        required: [true, "Description is required"],
      },
      isArchived: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  )
);

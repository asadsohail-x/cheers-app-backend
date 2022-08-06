const { Schema, model, Types } = require("mongoose");

module.exports = model(
  "Posts",
  new Schema(
    {
      authorId: {
        type: Types.ObjectId,
        required: [true, "Author Id is required"],
      },
      picture: {
        type: String,
        required: [true, "Picture URL is required"],
      },
      isArchived: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  )
);

const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Title must be provided!"],
      trim: true,
      maxlength: [36, "Title cannot be longer than 36 characters!"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [128, "Description cannot be longer than 128 characters!"],
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = model("Post", postSchema);

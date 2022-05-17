const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Please enter a title!"],
      mexlength: [32, "Title cannot be longer than 32 characters!"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [128, "Description cannot be longer than 128 characters!"],
    },
    image: [
      {
        type: Schema.Types.ObjectId,
        ref: "Image",
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Post", postSchema);

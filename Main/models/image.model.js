const { Schema, model } = require("mongoose");

const imageSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  path: {
    type: String,
    trim: true,
    required: true,
  },
});

module.exports = model("Image", imageSchema);

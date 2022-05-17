const { Schema, model } = require("mongoose");

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  refreshToken: String,
});

module.exports = model("Token", tokenSchema);

const { Schema, model } = require("mongoose");

const tokenSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  refreshToken: String,
});

module.exports = model("Token", tokenSchema);

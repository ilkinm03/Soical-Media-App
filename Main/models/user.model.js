const { Schema, model } = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, "Please enter your first name!"],
      maxlength: [24, "First name cannot be longer than 24 characters!"],
    },
    lastName: {
      type: String,
      trim: false,
      required: [true, "Please enter your last name!"],
      maxlength: [24, "Last name cannot be longer than 24 characters!"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Please enter an email!"],
      unique: true,
      validate: [isEmail, "Please enter a valid email!"],
    },
    password: {
      type: String,
      required: [true, "Please enter a password!"],
      minlength: [6, "Password cannot be shorter than 6 characters!"],
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(3);

  this.password = await bcrypt.hash(this.password, salt);

  next();
});

module.exports = model("User", userSchema);

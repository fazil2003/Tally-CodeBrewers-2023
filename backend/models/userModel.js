const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter an username"],
      unique: [true, "Username already exists"],
    },

    password: {
      type: String,
      required: [true, "Please enter a password"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

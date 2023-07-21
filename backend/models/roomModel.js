const mongoose = require("mongoose");

const roomSchema = mongoose.Schema(
  {
    roomID: {
      type: String,
      required: [true, "Please enter a room ID"],
      unique: [true, "Room ID already exists"],
    },

    password: {
      type: String,
      required: [true, "Please enter a password"],
    },

    creator: {
      type: String,
      required: [true, "Please enter the name of the room creator"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);

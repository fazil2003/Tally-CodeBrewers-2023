const asyncHandler = require("express-async-handler");
const Room = require("../models/roomModel");

const { easyWords, mediumWords, hardWords } = require("./resources");

const createRoom = asyncHandler(async (req, res) => {
  const { name, password } = req.body;

  if (password.length < 5) {
    res.status(400);
    throw new Error("Password length is less than 5");
  }

  const randomCharacters = "1234567890abcdefghijklmnopqrstuvwxyz";
  let roomID = "";

  for (let i = 0; i < 6; ++i) {
    roomID +=
      randomCharacters[Math.floor(Math.random() * randomCharacters.length)];
  }

  const room = await Room.create({
    roomID: roomID,
    password: password,
    creator: name,
  });

  res.status(201).json(room);
});

module.exports = { createRoom };

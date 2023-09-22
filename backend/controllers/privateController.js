const asyncHandler = require("express-async-handler");
const Room = require("../models/roomModel");

const { easyWords, mediumWords, hardWords } = require("./resources");

const createRoom = asyncHandler(async (req, res) => {
  const { password } = req.body;

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
    creator: req.user.username,
  });

  res.status(201).json(room);
});

const joinRoom = asyncHandler(async (req, res) => {
  const { roomID, password } = req.body;

  const room = await Room.findOne({
    roomID: roomID,
    password: password,
  });

  if (room) {
    res.status(200).json({ success: true, room: room });
  } else {
    res.status(401);
    throw new Error("Invalid room credentials");
  }
});

const isCreator = asyncHandler(async (req, res) => {
  const { roomID } = req.body;

  const room = await Room.findOne({
    roomID: roomID,
    creator: req.user.username,
  });

  if (room) {
    res.status(200).json({ owner: true });
  } else {
    res.status(200).json({ owner: false });
  }
});

module.exports = { createRoom, joinRoom, isCreator };

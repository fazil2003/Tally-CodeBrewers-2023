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

// const testRoom = asyncHandler(async (req, res) => {
//   console.log("123");
//   const roomID = req.params.roomID;

//   const room = await Room.findOne({
//     roomID: roomID,
//   });

//   if (room) {
//     io.on("connection", (socket) => {
//       console.log("New connection");
//       // socket.emit("message", "Welcome to the room");
//       // socket.broadcast.emit("message", "A user has joined the room");

//       socket.on("disconnect", () => {
//         io.emit("message", "A user has left the room");
//       });

//       socket.on("message", (data) => {
//         io.emit("message", JSON.stringify(data));
//       });
//     });
//   } else {
//     res.status(401);
//     throw new Error("Invalid room credentials");
//   }
// });

module.exports = { createRoom, joinRoom, isCreator };

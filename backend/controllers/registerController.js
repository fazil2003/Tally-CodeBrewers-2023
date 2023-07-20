const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

const registerNewUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const usernameCheck = await User.findOne({ username });

  if (usernameCheck) {
    res.status(400).send({ message: "Username already exist" });
    throw new Error("Username already exist");
  } else if (password.length < 8) {
    res.status(400).send({ message: "Password length is less than 8" });
    throw new Error("Password length is less than 8");
  } else {
    await User.create({ username, password });
    res.status(201).send({ message: "Success" });
  }
});

module.exports = registerNewUser;

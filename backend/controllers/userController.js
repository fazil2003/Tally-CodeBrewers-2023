const asyncHandler = require("express-async-handler");

const func = asyncHandler(async (req, res) => {
  res.status(200).json({});
});

module.exports = { func };

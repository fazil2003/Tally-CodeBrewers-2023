const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");

const { func } = require("../controllers/userController");



module.exports = router;

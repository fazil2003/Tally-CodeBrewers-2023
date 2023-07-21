const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");

const { createRoom } = require("../controllers/privateController");

router.post("/private/createroom", createRoom);

module.exports = router;

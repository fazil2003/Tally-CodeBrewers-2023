const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");

const { createRoom, joinRoom } = require("../controllers/privateController");

router.post("/createroom", createRoom, validateToken);
router.post("/joinroom", joinRoom, validateToken);

module.exports = router;

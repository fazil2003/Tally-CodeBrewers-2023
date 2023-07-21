const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");

const { createRoom, joinRoom } = require("../controllers/privateController");

router.post("/private/createroom", createRoom);
router.post("/private/joinroom", joinRoom);

module.exports = router;

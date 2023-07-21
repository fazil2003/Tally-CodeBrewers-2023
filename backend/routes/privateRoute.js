const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");

const {
  createRoom,
  joinRoom,
  testRoom,
} = require("../controllers/privateController");

router.post("/createroom", validateToken, createRoom);
router.post("/joinroom", validateToken, joinRoom);
// router.get("/room/:roomID", testRoom);

module.exports = router;

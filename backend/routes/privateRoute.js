const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");

const {
  createRoom,
  joinRoom,
  isCreator,
} = require("../controllers/privateController");

router.post("/createroom", validateToken, createRoom);
router.post("/joinroom", validateToken, joinRoom);
router.post("/ownership", validateToken, isCreator);

module.exports = router;

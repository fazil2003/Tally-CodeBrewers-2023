const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");

const {
  easyWordCount,
  mediumWordCount,
  hardWordCount,
  easyTimer,
  mediumTimer,
  hardTimer,
} = require("../controllers/practiceController");

router.get("/wordcount/easy", easyWordCount);
router.get("/wordcount/medium", mediumWordCount);
router.get("/wordcount/hard", hardWordCount);

router.get("/timer/easy", easyTimer);
router.get("/timer/medium", mediumTimer);
router.get("/timer/hard", hardTimer);

module.exports = router;

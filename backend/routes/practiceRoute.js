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

router.post("/wordcount/easy", easyWordCount);
router.post("/wordcount/medium", mediumWordCount);
router.post("/wordcount/hard", hardWordCount);

router.post("/timer/easy", easyTimer);
router.post("/timer/medium", mediumTimer);
router.post("/timer/hard", hardTimer);

module.exports = router;
